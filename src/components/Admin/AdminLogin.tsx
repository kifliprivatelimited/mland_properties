import { useState, type FormEvent } from 'react';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';
import { loginAdmin, type AdminSession } from '../../utils/adminAuth';

interface AdminLoginProps {
  onLoginSuccess: (session: AdminSession) => void;
  onNavigateHome: () => void;
}

export default function AdminLogin({ onLoginSuccess, onNavigateHome }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const session = await loginAdmin(email.trim(), password);
      onLoginSuccess(session);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials. Please verify and try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        {/* Top return link */}
        <button
          type="button"
          className="admin-login__back"
          onClick={onNavigateHome}
        >
          <ArrowLeft size={14} />
          <span>BACK TO MLAND PROPERTIES</span>
        </button>

        <div className="admin-login__card">
          <div className="admin-login__brand">
            <span className="section-label">STUDIO ACCESS</span>
            <h1 className="admin-login__title">MLAND PROPERTIES</h1>
            <p className="admin-login__subtitle">
              Private portal for managing commissions, walk requests, and client enquiries.
            </p>
          </div>

          {error && (
            <div className="admin-login__alert" role="alert">
              <span>{error}</span>
            </div>
          )}

          <form className="admin-login__form" onSubmit={handleSubmit} noValidate>
            <div className="admin-field">
              <label htmlFor="admin-email" className="admin-label">
                STUDIO EMAIL
              </label>
              <div className="admin-input-wrap">
                <Mail size={16} className="admin-input-icon" />
                <input
                  id="admin-email"
                  type="email"
                  className="admin-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="studio@mlandproperties.com"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="admin-field">
              <label htmlFor="admin-password" className="admin-label">
                SECURITY PASSWORD
              </label>
              <div className="admin-input-wrap">
                <Lock size={16} className="admin-input-icon" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  className="admin-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your studio password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="admin-input-action"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="admin-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="admin-submit-loading">AUTHENTICATING…</span>
              ) : (
                'ENTER MANAGEMENT PORTAL'
              )}
            </button>
          </form>

          {/* Secure access notice */}
          <div className="admin-login__footer-info">
            <ShieldCheck size={14} className="admin-login__shield" />
            <span>Encrypted Studio Session • Row-Level Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

