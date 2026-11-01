import { supabase } from './supabase';

export interface AdminUser {
  id: string;
  email: string;
}

export interface AdminSession {
  token: string;
  user: AdminUser;
}

const STORAGE_KEY = 'mland_admin_session';

export function getStoredSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession(session: AdminSession) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export async function loginAdmin(email: string, password: string): Promise<AdminSession> {
  // 1. Direct client-side Supabase authentication (Production & standard)
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      throw new Error(error.message || 'Invalid email or password.');
    }

    if (!data.session || !data.user) {
      throw new Error('Authentication succeeded but no active session was returned.');
    }

    const session: AdminSession = {
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email || email,
      },
    };
    saveSession(session);
    return session;
  }

  // 2. Local dev server API fallback (used only if Supabase client is uninitialized)
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    });

    const isJson = res.headers.get('content-type')?.includes('application/json');
    if (res.ok && isJson) {
      const data = await res.json();
      if (data.success && data.session) {
        const session: AdminSession = {
          token: data.session.access_token,
          user: {
            id: data.session.user.id,
            email: data.session.user.email,
          },
        };
        saveSession(session);
        return session;
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } else if (isJson) {
      const data = await res.json();
      throw new Error(data?.error || 'Invalid credentials.');
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.message !== 'Failed to fetch') {
      throw err;
    }
  }

  throw new Error('Authentication service unavailable. Please check your credentials.');
}

export async function verifyCurrentSession(): Promise<AdminUser | null> {
  const session = getStoredSession();
  if (!session?.token) return null;

  // 1. Direct Supabase session verification
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.getUser(session.token);
      if (!error && data?.user) {
        return {
          id: data.user.id,
          email: data.user.email || session.user.email,
        };
      }
    } catch {
      // Token invalid or expired
    }
  }

  // 2. Dev server API fallback
  try {
    const res = await fetch('/api/admin/session', {
      headers: { Authorization: `Bearer ${session.token}` },
    });
    const isJson = res.headers.get('content-type')?.includes('application/json');
    if (res.ok && isJson) {
      const data = await res.json();
      if (data.authenticated && data.user) {
        return data.user;
      }
    }
  } catch {
    // API failed
  }

  clearSession();
  return null;
}

export async function logoutAdmin(): Promise<void> {
  clearSession();

  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }

  window.dispatchEvent(new Event('mland_admin_auth_changed'));
}
