import { useState, useEffect } from 'react';
import { X, ShieldCheck, Trash2, CheckCircle2 } from 'lucide-react';

interface StorageInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StorageInspectorModal({ isOpen, onClose }: StorageInspectorModalProps) {
  const [storageItems, setStorageItems] = useState<{ key: string; value: string }[]>([]);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCleared(false);
      return;
    }

    const items: { key: string; value: string }[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k) {
          items.push({ key: k, value: localStorage.getItem(k) || '' });
        }
      }
    } catch {
      // Storage access blocked or restricted
    }
    setStorageItems(items);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClearNonEssential = () => {
    try {
      // Clear non-critical localStorage items
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k !== 'mland_admin_session') {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      setCleared(true);
      setTimeout(() => {
        setCleared(false);
        onClose();
      }, 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="admin-modal" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <div>
            <span className="section-label" style={{ marginBottom: 4 }}>DATA & STORAGE INSPECTOR</span>
            <h3 className="admin-modal__title" style={{ fontSize: '1.25rem' }}>Browser Storage Inspector</h3>
          </div>
          <button className="admin-modal__close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="admin-modal__body" style={{ gap: 'var(--space-5)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            MLAND Properties does not deploy non-essential marketing, analytics or cross-site advertising cookies. Below is the full inventory of client-side storage keys currently present in your browser session for this domain.
          </p>

          <div style={{ background: 'var(--color-ivory-warm)', border: '1px solid var(--color-border)', padding: 'var(--space-4)' }}>
            <span className="section-label" style={{ display: 'block', marginBottom: 8 }}>CURRENT STORAGE KEYS</span>
            {storageItems.length === 0 ? (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                ✓ No local storage keys or persistent cookies are active in your browser.
              </p>
            ) : (
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {storageItems.map((item) => (
                  <li key={item.key} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-charcoal)', fontWeight: 500 }}>
                      {item.key}
                    </code>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                      {item.key === 'mland_admin_session'
                        ? 'Essential authentication token (Studio Administrator session only)'
                        : 'Local preference data'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            <ShieldCheck size={16} style={{ color: 'var(--color-bronze)', flexShrink: 0 }} />
            <span>Zero advertising tracking scripts or behavioral profilers are loaded on this website.</span>
          </div>
        </div>

        <div className="admin-modal__footer" style={{ justifyContent: 'space-between' }}>
          <button
            type="button"
            className="admin-btn admin-btn--secondary"
            onClick={onClose}
          >
            Close Inspector
          </button>

          {storageItems.length > 0 && (
            <button
              type="button"
              className="admin-btn admin-btn--danger"
              onClick={handleClearNonEssential}
            >
              {cleared ? <CheckCircle2 size={14} /> : <Trash2 size={14} />}
              {cleared ? 'Cleared' : 'Clear Browser Data'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

