import { useEffect } from 'react';
import { Mail, MapPin, Calendar, Clock, X, ExternalLink, Trash2, CheckCircle2 } from 'lucide-react';
import type { Enquiry, EnquiryStatus } from '../../types/admin';

interface AdminDetailModalProps {
  enquiry: Enquiry | null;
  onClose: () => void;
  onStatusChange: (id: number | string, status: EnquiryStatus) => void;
  onDelete: (id: number | string) => void;
}

export default function AdminDetailModal({
  enquiry,
  onClose,
  onStatusChange,
  onDelete,
}: AdminDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!enquiry) return null;

  const dateObj = new Date(enquiry.submitted_at);
  const formattedDate = dateObj.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const mailtoSubject = encodeURIComponent(
    `Regarding your project enquiry — MLAND Properties [${enquiry.project_location}]`
  );
  const mailtoBody = encodeURIComponent(
    `Dear ${enquiry.name},\n\nThank you for reaching out to MLAND Properties regarding your project in ${enquiry.project_location}.\n\nA principal from our studio has reviewed your initial brief:\n\n"${enquiry.scope}"\n\nWe would welcome the opportunity to discuss your ambitions in further detail. Would you be available for an introductory call or studio meeting this coming week?\n\nWarm regards,\n\nMLAND Properties\nArchitecture & Construction\nMuttom, Aluva, Ernakulam\n+91 8590999415`
  );
  const mailtoLink = `mailto:${enquiry.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

  const statuses: { label: string; value: EnquiryStatus; color: string }[] = [
    { label: 'New', value: 'new', color: 'var(--color-bronze)' },
    { label: 'Read', value: 'read', color: 'var(--color-charcoal)' },
    { label: 'Replied', value: 'replied', color: 'var(--color-success)' },
    { label: 'Archived', value: 'archived', color: 'var(--color-text-secondary)' },
  ];

  return (
    <div className="admin-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="admin-modal__header">
          <div>
            <span className="section-label" style={{ marginBottom: 4 }}>PROJECT BRIEF ENQUIRY</span>
            <h3 className="admin-modal__title">{enquiry.name}</h3>
          </div>
          <button className="admin-modal__close" onClick={onClose} aria-label="Close detail modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="admin-modal__body">
          {/* Metadata Grid */}
          <div className="admin-modal__meta-grid">
            <div className="admin-modal__meta-item">
              <span className="admin-modal__meta-label">
                <Mail size={13} /> SENDER EMAIL
              </span>
              <a href={`mailto:${enquiry.email}`} className="admin-modal__meta-val admin-modal__meta-link">
                {enquiry.email}
              </a>
            </div>

            <div className="admin-modal__meta-item">
              <span className="admin-modal__meta-label">
                <MapPin size={13} /> LOCATION
              </span>
              <span className="admin-modal__meta-val">{enquiry.project_location}</span>
            </div>

            <div className="admin-modal__meta-item">
              <span className="admin-modal__meta-label">
                <Calendar size={13} /> DATE RECEIVED
              </span>
              <span className="admin-modal__meta-val">
                {formattedDate} at {formattedTime}
              </span>
            </div>

            <div className="admin-modal__meta-item">
              <span className="admin-modal__meta-label">
                <Clock size={13} /> STATUS
              </span>
              <div className="admin-modal__status-switcher">
                {statuses.map((st) => (
                  <button
                    key={st.value}
                    type="button"
                    className={`admin-modal__status-btn ${
                      enquiry.status === st.value ? 'admin-modal__status-btn--active' : ''
                    }`}
                    onClick={() => onStatusChange(enquiry.id, st.value)}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scope and Ambitions Brief Reading View */}
          <div className="admin-modal__brief-section">
            <div className="admin-modal__brief-header">
              <span className="section-label" style={{ marginBottom: 0 }}>SCOPE & AMBITIONS</span>
              <span className="admin-modal__char-count">{enquiry.scope.length} characters</span>
            </div>
            <div className="admin-modal__brief-content">
              {enquiry.scope.split('\n').map((paragraph: string, idx: number) => (
                paragraph.trim() ? <p key={idx}>{paragraph}</p> : <br key={idx} />
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer / Quick Actions */}
        <div className="admin-modal__footer">
          <div className="admin-modal__footer-left">
            <button
              type="button"
              className="admin-btn admin-btn--danger"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) {
                  onDelete(enquiry.id);
                  onClose();
                }
              }}
            >
              <Trash2 size={14} />
              Delete Enquiry
            </button>
          </div>

          <div className="admin-modal__footer-right">
            {enquiry.status === 'new' && (
              <button
                type="button"
                className="admin-btn admin-btn--secondary"
                onClick={() => onStatusChange(enquiry.id, 'read')}
              >
                <CheckCircle2 size={14} />
                Mark as Read
              </button>
            )}

            <a
              href={mailtoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn--primary"
              onClick={() => {
                if (enquiry.status === 'new' || enquiry.status === 'read') {
                  onStatusChange(enquiry.id, 'replied');
                }
              }}
            >
              <ExternalLink size={14} />
              Reply via Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
