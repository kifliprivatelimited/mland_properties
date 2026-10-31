import { createClient } from '@supabase/supabase-js';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Helper to load env variables
function getEnv(key, fallback = '') {
  if (process.env[key]) return process.env[key];
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const [k, ...v] = trimmed.split('=');
        if (k.trim() === key) {
          return v.join('=').trim().replace(/^['"](.*)['"]$/, '$1');
        }
      }
    }
  } catch {
    // ignore
  }
  return fallback;
}

const supabaseUrl = getEnv('VITE_SUPABASE_URL', 'https://aadwipwtuhiusaobxfpz.supabase.co');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY', 'sb_publishable_x2JhUZU7wtVZ45TAUCdsGw_NIOG_OeJ');
const supabaseSecretKey = getEnv('SUPABASE_SECRET_KEY', '');

// Admin client using service/secret key for privileged operations
const adminClient = supabaseUrl && supabaseSecretKey
  ? createClient(supabaseUrl, supabaseSecretKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

// Public client for auth verification
const authClient = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const META_REGEX = /\n\n<!--metadata:(.*?)-->$/s;

export function parseEnquiryScope(rawScope) {
  if (!rawScope) return { cleanScope: '', status: 'new' };
  const match = rawScope.match(META_REGEX);
  if (match) {
    try {
      const meta = JSON.parse(match[1]);
      const validStatuses = ['new', 'read', 'replied', 'archived'];
      const status = validStatuses.includes(meta.status) ? meta.status : 'new';
      return {
        cleanScope: rawScope.replace(META_REGEX, '').trim(),
        status,
        notes: meta.notes,
      };
    } catch {
      // parse error, fallback
    }
  }
  return { cleanScope: rawScope.trim(), status: 'new' };
}

export function formatEnquiryScope(cleanScope, status, notes) {
  const meta = { status, notes, updated_at: new Date().toISOString() };
  return `${cleanScope.trim()}\n\n<!--metadata:${JSON.stringify(meta)}-->`;
}

// In-memory fallback and backup storage file
const backupFilePath = path.resolve(process.cwd(), 'data', 'enquiries_backup.json');

function ensureBackupDir() {
  try {
    const dir = path.dirname(backupFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  } catch {
    // ignore
  }
}

function loadLocalBackup() {
  try {
    ensureBackupDir();
    if (fs.existsSync(backupFilePath)) {
      return JSON.parse(fs.readFileSync(backupFilePath, 'utf8'));
    }
  } catch {
    // ignore
  }
  return [];
}

function saveLocalBackup(enquiries) {
  try {
    ensureBackupDir();
    fs.writeFileSync(backupFilePath, JSON.stringify(enquiries, null, 2), 'utf8');
  } catch {
    // ignore
  }
}

// Body parsing helper
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

// Token cache for fast verification (1 minute TTL)
const tokenCache = new Map();

// Verify admin user by JWT token
export async function verifyAdmin(req, queryToken) {
  let token = queryToken;
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) return null;

  const now = Date.now();
  const cached = tokenCache.get(token);
  if (cached && cached.expiresAt > now) {
    return cached.user;
  }

  if (adminClient) {
    try {
      const { data, error } = await adminClient.auth.getUser(token);
      if (!error && data?.user) {
        const user = { id: data.user.id, email: data.user.email || '' };
        tokenCache.set(token, { user, expiresAt: now + 60000 });
        return user;
      }
    } catch {
      // verification error
    }
  }

  return null;
}

// Main API request handler
export async function handleAdminApi(req, res) {
  const url = req.url || '';
  if (!url.startsWith('/api/')) return false;

  // Immediately buffer body before any async operations
  const bodyPromise = ['POST', 'PATCH', 'PUT'].includes(req.method)
    ? parseBody(req)
    : Promise.resolve({});

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return true;
  }

  const parsedUrl = new URL(url, 'http://localhost');
  const pathname = parsedUrl.pathname;

  // 1. PUBLIC: POST /api/enquiries (Contact Form Submission)
  if (pathname === '/api/enquiries' && req.method === 'POST') {
    const body = await bodyPromise;
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const location = typeof body.location === 'string' ? body.location.trim() : '';
    const scope = typeof body.scope === 'string' ? body.scope.trim() : '';

    // Server-side validation
    const errors = {};
    if (!name || name.length < 2) errors.name = 'Please provide your full name (at least 2 characters).';
    if (name.length > 200) errors.name = 'Name must be under 200 characters.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) errors.email = 'Please provide a valid email address.';
    if (email.length > 200) errors.email = 'Email must be under 200 characters.';

    if (!location || location.length < 2) errors.location = 'Please provide the project location.';
    if (location.length > 300) errors.location = 'Location must be under 300 characters.';

    if (!scope || scope.length < 5) errors.scope = 'Please describe the project scope (at least 5 characters).';
    if (scope.length > 5000) errors.scope = 'Description must be under 5000 characters.';

    if (Object.keys(errors).length > 0) {
      sendJson(res, 400, { success: false, errors });
      return true;
    }

    const submittedAt = new Date().toISOString();
    const formattedScope = formatEnquiryScope(scope, 'new');

    let savedId = Date.now();
    let savedToSupabase = false;

    if (adminClient) {
      try {
        const { data, error } = await adminClient
          .from('contact_messages')
          .insert({
            name,
            email,
            project_location: location,
            scope: formattedScope,
            submitted_at: submittedAt,
          })
          .select();

        if (error) {
          console.error('[API] Supabase insert error:', error);
        } else if (data && data[0]) {
          savedId = data[0].id;
          savedToSupabase = true;
        }
      } catch (err) {
        console.error('[API] Supabase connection error:', err);
      }
    }

    // Always maintain local backup sync
    const newEnquiry = {
      id: savedId,
      name,
      email,
      project_location: location,
      scope,
      status: 'new',
      submitted_at: submittedAt,
      created_at: submittedAt,
    };

    const backup = loadLocalBackup();
    backup.unshift(newEnquiry);
    saveLocalBackup(backup);

    sendJson(res, 201, {
      success: true,
      id: savedId,
      message: 'Message received. A principal from the studio will reply within two working days.',
      persisted_to_db: savedToSupabase,
    });
    return true;
  }

  // 2. ADMIN AUTH: POST /api/admin/login
  if (pathname === '/api/admin/login' && req.method === 'POST') {
    const body = await bodyPromise;
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      sendJson(res, 400, { success: false, error: 'Email and password are required.' });
      return true;
    }

    if (!authClient) {
      sendJson(res, 500, { success: false, error: 'Authentication service not initialized.' });
      return true;
    }

    try {
      const { data, error } = await authClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.session) {
        sendJson(res, 401, { success: false, error: error?.message || 'Invalid email or password.' });
        return true;
      }

      sendJson(res, 200, {
        success: true,
        session: {
          access_token: data.session.access_token,
          user: {
            id: data.user.id,
            email: data.user.email,
          },
        },
      });
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed.';
      sendJson(res, 500, { success: false, error: msg });
      return true;
    }
  }

  // 3. ADMIN AUTH: GET /api/admin/session (Verify current session)
  if (pathname === '/api/admin/session' && req.method === 'GET') {
    const admin = await verifyAdmin(req);
    if (!admin) {
      sendJson(res, 401, { authenticated: false, error: 'Invalid or expired session.' });
      return true;
    }
    sendJson(res, 200, { authenticated: true, user: admin });
    return true;
  }

  // ── Protected Admin Endpoints ──
  const admin = await verifyAdmin(req);
  if (!admin) {
    sendJson(res, 401, { success: false, error: 'Unauthorized: Admin authentication required.' });
    return true;
  }

  // 5. ADMIN: GET /api/admin/enquiries (List all enquiries)
  if (pathname === '/api/admin/enquiries' && req.method === 'GET') {
    let enquiries = [];

    if (adminClient) {
      try {
        const { data, error } = await adminClient
          .from('contact_messages')
          .select('*')
          .order('submitted_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          enquiries = data.map((row) => {
            const { cleanScope, status, notes } = parseEnquiryScope(row.scope || '');
            return {
              id: row.id,
              name: row.name || 'Anonymous',
              email: row.email || '',
              project_location: row.project_location || '',
              scope: cleanScope,
              status,
              submitted_at: row.submitted_at || row.created_at || new Date().toISOString(),
              created_at: row.created_at,
              notes,
            };
          });
        } else if (error) {
          console.error('[API] Error reading contact_messages:', error);
        }
      } catch (err) {
        console.error('[API] Failed to fetch enquiries from Supabase:', err);
      }
    }

    // Merge with local backup if Supabase returned empty or was unavailable
    if (enquiries.length === 0) {
      enquiries = loadLocalBackup();
    } else {
      // Sync backup with fresh database data
      saveLocalBackup(enquiries);
    }

    const counts = {
      total: enquiries.length,
      new: enquiries.filter((e) => e.status === 'new').length,
      read: enquiries.filter((e) => e.status === 'read').length,
      replied: enquiries.filter((e) => e.status === 'replied').length,
      archived: enquiries.filter((e) => e.status === 'archived').length,
    };

    sendJson(res, 200, {
      success: true,
      enquiries,
      counts,
    });
    return true;
  }

  // 6. ADMIN: PATCH /api/admin/enquiries/:id/status (Update status)
  const statusMatch = pathname.match(/^\/api\/admin\/enquiries\/([^/]+)\/status$/);
  if (statusMatch && req.method === 'PATCH') {
    const id = statusMatch[1];
    const body = await bodyPromise;
    const newStatus = body.status;
    const validStatuses = ['new', 'read', 'replied', 'archived'];

    if (!validStatuses.includes(newStatus)) {
      sendJson(res, 400, { success: false, error: 'Invalid status value.' });
      return true;
    }

    // Update in Supabase
    if (adminClient) {
      try {
        const { data: existingRows } = await adminClient
          .from('contact_messages')
          .select('scope')
          .eq('id', id);

        if (existingRows && existingRows[0]) {
          const { cleanScope, notes } = parseEnquiryScope(existingRows[0].scope || '');
          const updatedFormattedScope = formatEnquiryScope(cleanScope, newStatus, notes);

          await adminClient
            .from('contact_messages')
            .update({ scope: updatedFormattedScope })
            .eq('id', id);
        }
      } catch (err) {
        console.error('[API] Failed to update status in Supabase:', err);
      }
    }

    // Update local backup
    const backup = loadLocalBackup();
    const item = backup.find((e) => String(e.id) === String(id));
    if (item) {
      item.status = newStatus;
      saveLocalBackup(backup);
    }

    sendJson(res, 200, { success: true, id, status: newStatus });
    return true;
  }

  // 7. ADMIN: DELETE /api/admin/enquiries/:id (Archive or remove enquiry)
  const deleteMatch = pathname.match(/^\/api\/admin\/enquiries\/([^/]+)$/);
  if (deleteMatch && req.method === 'DELETE') {
    const id = deleteMatch[1];

    if (adminClient) {
      try {
        await adminClient.from('contact_messages').delete().eq('id', id);
      } catch (err) {
        console.error('[API] Failed to delete enquiry in Supabase:', err);
      }
    }

    const backup = loadLocalBackup().filter((e) => String(e.id) !== String(id));
    saveLocalBackup(backup);

    sendJson(res, 200, { success: true, id });
    return true;
  }

  // Not found
  sendJson(res, 404, { success: false, error: 'API endpoint not found.' });
  return true;
}

