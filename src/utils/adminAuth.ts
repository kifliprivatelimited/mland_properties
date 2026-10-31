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
  // First try the backend API
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok && data.success && data.session) {
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
  } catch (err: unknown) {
    if (err instanceof Error && err.message !== 'Failed to fetch') {
      throw err;
    }
  }

  // Fallback to direct client-side Supabase if server API was unavailable
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      throw new Error(error?.message || 'Invalid email or password.');
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

  throw new Error('Authentication service unavailable.');
}

export async function verifyCurrentSession(): Promise<AdminUser | null> {
  const session = getStoredSession();
  if (!session?.token) return null;

  try {
    const res = await fetch('/api/admin/session', {
      headers: { Authorization: `Bearer ${session.token}` },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.authenticated && data.user) {
        return data.user;
      }
    }
  } catch {
    // API failed, fallback to checking Supabase client
  }

  if (supabase) {
    try {
      const { data } = await supabase.auth.getUser(session.token);
      if (data?.user) {
        return { id: data.user.id, email: data.user.email || '' };
      }
    } catch {
      // invalid token
    }
  }

  clearSession();
  return null;
}

export async function logoutAdmin(): Promise<void> {
  const session = getStoredSession();
  clearSession();

  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }

  // Also notify listeners
  window.dispatchEvent(new Event('mland_admin_auth_changed'));
}

