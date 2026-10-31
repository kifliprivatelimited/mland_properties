import { useState, useEffect } from 'react';
import {
  getStoredSession,
  verifyCurrentSession,
  logoutAdmin,
  type AdminUser,
  type AdminSession,
} from '../../utils/adminAuth';
import { updatePageSeo } from '../../utils/seo';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import './Admin.css';

interface AdminPortalProps {
  onNavigateHome: () => void;
}

export default function AdminPortal({ onNavigateHome }: AdminPortalProps) {
  const [session, setSession] = useState<AdminSession | null>(getStoredSession());
  const [user, setUser] = useState<AdminUser | null>(session?.user || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updatePageSeo({
      title: 'Studio Management Portal | MLAND Properties',
      description: 'MLAND Properties internal administrative management console.',
      canonicalPath: '/admin',
      robots: 'noindex, nofollow',
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const stored = getStoredSession();
      if (!stored?.token) {
        if (isMounted) {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const verifiedUser = await verifyCurrentSession();
        if (isMounted) {
          if (verifiedUser) {
            setUser(verifiedUser);
            setSession({ token: stored.token, user: verifiedUser });
          } else {
            setSession(null);
            setUser(null);
          }
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    checkAuth();

    const handleAuthChange = () => {
      const current = getStoredSession();
      setSession(current);
      setUser(current?.user || null);
    };

    window.addEventListener('mland_admin_auth_changed', handleAuthChange);
    return () => {
      isMounted = false;
      window.removeEventListener('mland_admin_auth_changed', handleAuthChange);
    };
  }, []);

  const handleLoginSuccess = (newSession: AdminSession) => {
    setSession(newSession);
    setUser(newSession.user);
  };

  const handleSignOut = async () => {
    await logoutAdmin();
    setSession(null);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-spinner" />
        <span className="admin-loading-text">AUTHENTICATING STUDIO SESSION…</span>
      </div>
    );
  }

  if (!session || !user) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} onNavigateHome={onNavigateHome} />;
  }

  return (
    <AdminDashboard
      user={user}
      session={session}
      onSignOut={handleSignOut}
      onNavigateHome={onNavigateHome}
    />
  );
}

