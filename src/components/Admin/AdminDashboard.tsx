import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw,
  Mail,
  MapPin,
  ExternalLink,
  CheckCircle,
  Archive,
  ArchiveRestore,
  Trash2,
  LogOut,
  ChevronRight,
  Eye,
} from 'lucide-react';
import type { AdminUser, AdminSession } from '../../utils/adminAuth';
import type { Enquiry, EnquiryStatus } from '../../types/admin';
import AdminDetailModal from './AdminDetailModal';

interface AdminDashboardProps {
  user: AdminUser;
  session: AdminSession;
  onSignOut: () => void;
  onNavigateHome: () => void;
}

export default function AdminDashboard({
  user,
  session,
  onSignOut,
  onNavigateHome,
}: AdminDashboardProps) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  // Fetch enquiries from API
  const fetchEnquiries = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch('/api/admin/enquiries', {
        headers: { Authorization: `Bearer ${session.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.enquiries) {
          setEnquiries(data.enquiries);
        }
      } else if (res.status === 401) {
        onSignOut();
      }
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [session.token, onSignOut]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // Change enquiry status
  const handleStatusChange = async (id: number | string, newStatus: EnquiryStatus) => {
    // Optimistic local update
    setEnquiries((prev) =>
      prev.map((e) => (String(e.id) === String(id) ? { ...e, status: newStatus } : e))
    );
    if (selectedEnquiry && String(selectedEnquiry.id) === String(id)) {
      setSelectedEnquiry((prev: Enquiry | null) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      await fetch(`/api/admin/enquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error('Failed to update status on server:', err);
      // Refresh on failure
      fetchEnquiries();
    }
  };

  // Delete enquiry
  const handleDelete = async (id: number | string) => {
    setEnquiries((prev) => prev.filter((e) => String(e.id) !== String(id)));
    if (selectedEnquiry && String(selectedEnquiry.id) === String(id)) {
      setSelectedEnquiry(null);
    }

    try {
      await fetch(`/api/admin/enquiries/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });
    } catch (err) {
      console.error('Failed to delete on server:', err);
      fetchEnquiries();
    }
  };

  // Filter & sort calculations
  const counts = useMemo(() => {
    return {
      all: enquiries.length,
      new: enquiries.filter((e) => e.status === 'new').length,
      read: enquiries.filter((e) => e.status === 'read').length,
      replied: enquiries.filter((e) => e.status === 'replied').length,
      archived: enquiries.filter((e) => e.status === 'archived').length,
    };
  }, [enquiries]);

  const filteredEnquiries = useMemo(() => {
    return enquiries
      .filter((e) => {
        if (statusFilter !== 'all' && e.status !== statusFilter) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = e.name.toLowerCase().includes(q);
          const matchEmail = e.email.toLowerCase().includes(q);
          const matchLoc = e.project_location.toLowerCase().includes(q);
          const matchScope = e.scope.toLowerCase().includes(q);
          return matchName || matchEmail || matchLoc || matchScope;
        }
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.submitted_at).getTime();
        const timeB = new Date(b.submitted_at).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [enquiries, statusFilter, searchQuery, sortOrder]);

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    const dateStr = d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
    const timeStr = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    if (diffHours < 24 && d.getDate() === now.getDate()) {
      return `Today, ${timeStr}`;
    } else if (diffHours < 48 && d.getDate() === now.getDate() - 1) {
      return `Yesterday, ${timeStr}`;
    }
    return `${dateStr}, ${timeStr}`;
  };

  const getStatusBadgeClass = (status: EnquiryStatus) => {
    switch (status) {
      case 'new':
        return 'admin-badge admin-badge--new';
      case 'read':
        return 'admin-badge admin-badge--read';
      case 'replied':
        return 'admin-badge admin-badge--replied';
      case 'archived':
        return 'admin-badge admin-badge--archived';
      default:
        return 'admin-badge';
    }
  };

  const buildMailto = (enquiry: Enquiry) => {
    const subject = encodeURIComponent(
      `Regarding your project enquiry — MLAND Properties [${enquiry.project_location}]`
    );
    const body = encodeURIComponent(
      `Dear ${enquiry.name},\n\nThank you for reaching out to MLAND Properties regarding your project in ${enquiry.project_location}.\n\nA principal from our studio has reviewed your initial brief:\n\n"${enquiry.scope}"\n\nWe would welcome the opportunity to discuss your ambitions in further detail. Would you be available for an introductory call or studio meeting this coming week?\n\nWarm regards,\n\nMLAND Properties\nArchitecture & Construction\nMuttom, Aluva, Ernakulam\n+91 8590999415`
    );
    return `mailto:${enquiry.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="admin-page">
      {/* Admin Top Navigation */}
      <header className="admin-nav">
        <div className="admin-nav__inner">
          <div className="admin-nav__brand">
            <span className="admin-nav__logo">MLAND PROPERTIES</span>
            <span className="admin-nav__divider">/</span>
            <span className="admin-nav__title">STUDIO ENQUIRIES</span>
            <span className="admin-nav__portal-tag">PORTAL</span>
          </div>

          <div className="admin-nav__actions">
            <button
              type="button"
              className="admin-nav__link"
              onClick={onNavigateHome}
              title="Return to public architectural website"
            >
              <span>PUBLIC SITE</span>
              <ExternalLink size={12} />
            </button>

            <div className="admin-nav__user">
              <span className="admin-nav__user-email">{user.email}</span>
            </div>

            <button
              type="button"
              className="admin-nav__logout"
              onClick={onSignOut}
              title="Sign out of admin session"
            >
              <LogOut size={14} />
              <span>SIGN OUT</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="admin-main">
        {/* Header Title & Counters */}
        <div className="admin-header">
          <div className="admin-header__text">
            <span className="section-label">MANAGEMENT PORTAL</span>
            <h1 className="admin-header__title">Studio Briefs & Enquiries</h1>
            <p className="admin-header__subtitle">
              Review architectural site walk requests, preliminary briefs, and incoming client commissions.
            </p>
          </div>

          <div className="admin-header__kpis">
            <div className="admin-kpi admin-kpi--new">
              <span className="admin-kpi__label">UNANSWERED</span>
              <div className="admin-kpi__val-wrap">
                <span className="admin-kpi__val">{counts.new}</span>
                {counts.new > 0 && <span className="admin-kpi__tag">ACTION NEEDED</span>}
              </div>
            </div>

            <div className="admin-kpi">
              <span className="admin-kpi__label">TOTAL RECEIVED</span>
              <span className="admin-kpi__val">{counts.all}</span>
            </div>

            <div className="admin-kpi">
              <span className="admin-kpi__label">REPLIED</span>
              <span className="admin-kpi__val">{counts.replied}</span>
            </div>
          </div>
        </div>

        {/* Toolbar: Search, Filters & Sorting */}
        <div className="admin-toolbar">
          <div className="admin-toolbar__tabs">
            {[
              { id: 'all', label: 'All', count: counts.all, highlight: false },
              { id: 'new', label: 'New', count: counts.new, highlight: counts.new > 0 },
              { id: 'read', label: 'In Review', count: counts.read, highlight: false },
              { id: 'replied', label: 'Replied', count: counts.replied, highlight: false },
              { id: 'archived', label: 'Archived', count: counts.archived, highlight: false },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`admin-tab ${statusFilter === tab.id ? 'admin-tab--active' : ''}`}
                onClick={() => setStatusFilter(tab.id)}
              >
                <span>{tab.label}</span>
                <span className={`admin-tab__badge ${tab.highlight ? 'admin-tab__badge--highlight' : ''}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="admin-toolbar__controls">
            {/* Search */}
            <div className="admin-search-wrap">
              <Search size={14} className="admin-search-icon" />
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search by name, email, or location…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="admin-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {/* Sort Toggle */}
            <button
              type="button"
              className="admin-control-btn"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              title={`Sorting by ${sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}`}
            >
              <ArrowUpDown size={14} />
              <span className="admin-control-text">
                {sortOrder === 'desc' ? 'NEWEST' : 'OLDEST'}
              </span>
            </button>

            {/* Refresh */}
            <button
              type="button"
              className={`admin-control-btn ${refreshing ? 'admin-control-btn--loading' : ''}`}
              onClick={() => fetchEnquiries(true)}
              title="Refresh list"
              disabled={refreshing}
            >
              <RefreshCw size={14} className={refreshing ? 'admin-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Content Table / Cards */}
        {loading ? (
          <div className="admin-state-box">
            <RefreshCw size={24} className="admin-spin" style={{ color: 'var(--color-bronze)' }} />
            <p className="admin-state-text">Loading studio enquiries…</p>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="admin-state-box">
            <Filter size={24} style={{ color: 'var(--color-bronze)' }} />
            <h3 className="admin-state-title">No enquiries found</h3>
            <p className="admin-state-text">
              {searchQuery || statusFilter !== 'all'
                ? 'No enquiries match your current search or filter criteria.'
                : 'No contact submissions have been received yet.'}
            </p>
            {(searchQuery || statusFilter !== 'all') && (
              <button
                type="button"
                className="admin-btn admin-btn--secondary"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="admin-list-container">
            {/* Desktop Table View */}
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '130px' }}>STATUS</th>
                    <th style={{ width: '220px' }}>SENDER</th>
                    <th style={{ width: '180px' }}>LOCATION</th>
                    <th>BRIEF PREVIEW</th>
                    <th style={{ width: '160px' }}>RECEIVED</th>
                    <th style={{ width: '140px', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEnquiries.map((enquiry) => (
                    <tr
                      key={enquiry.id}
                      className={`admin-row ${enquiry.status === 'new' ? 'admin-row--new' : ''}`}
                      onClick={() => setSelectedEnquiry(enquiry)}
                    >
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="admin-status-dropdown-wrap">
                          <select
                            className={getStatusBadgeClass(enquiry.status)}
                            value={enquiry.status}
                            onChange={(e) =>
                              handleStatusChange(enquiry.id, e.target.value as EnquiryStatus)
                            }
                            aria-label="Change status"
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </td>

                      <td>
                        <div className="admin-cell-sender">
                          <span className="admin-sender-name">{enquiry.name}</span>
                          <span className="admin-sender-email">{enquiry.email}</span>
                        </div>
                      </td>

                      <td>
                        <div className="admin-cell-loc">
                          <MapPin size={12} className="admin-loc-icon" />
                          <span>{enquiry.project_location}</span>
                        </div>
                      </td>

                      <td>
                        <div className="admin-cell-brief">
                          <p className="admin-brief-preview">{enquiry.scope}</p>
                        </div>
                      </td>

                      <td>
                        <span className="admin-cell-date" title={enquiry.submitted_at}>
                          {formatDate(enquiry.submitted_at)}
                        </span>
                      </td>

                      <td onClick={(e) => e.stopPropagation()} style={{ textAlign: 'right' }}>
                        <div className="admin-row-actions">
                          {/* Quick Reply via Mailto */}
                          <a
                            href={buildMailto(enquiry)}
                            className="admin-action-btn"
                            title="Reply via email"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              if (enquiry.status === 'new' || enquiry.status === 'read') {
                                handleStatusChange(enquiry.id, 'replied');
                              }
                            }}
                          >
                            <Mail size={13} />
                          </a>

                          {/* Quick Mark Read */}
                          {enquiry.status === 'new' && (
                            <button
                              type="button"
                              className="admin-action-btn"
                              title="Mark as Read"
                              onClick={() => handleStatusChange(enquiry.id, 'read')}
                            >
                              <CheckCircle size={13} />
                            </button>
                          )}

                          {/* Quick Archive/Restore */}
                          {enquiry.status === 'archived' ? (
                            <button
                              type="button"
                              className="admin-action-btn"
                              title="Restore to Read"
                              onClick={() => handleStatusChange(enquiry.id, 'read')}
                            >
                              <ArchiveRestore size={13} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="admin-action-btn"
                              title="Archive Enquiry"
                              onClick={() => handleStatusChange(enquiry.id, 'archived')}
                            >
                              <Archive size={13} />
                            </button>
                          )}

                          {/* Open Detail */}
                          <button
                            type="button"
                            className="admin-action-btn admin-action-btn--primary"
                            title="View Full Brief"
                            onClick={() => setSelectedEnquiry(enquiry)}
                          >
                            <Eye size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Stack View (under 768px) */}
            <div className="admin-cards-wrap">
              {filteredEnquiries.map((enquiry) => (
                <div
                  key={enquiry.id}
                  className={`admin-card ${enquiry.status === 'new' ? 'admin-card--new' : ''}`}
                  onClick={() => setSelectedEnquiry(enquiry)}
                >
                  <div className="admin-card__top">
                    <span className={getStatusBadgeClass(enquiry.status)}>
                      {enquiry.status.toUpperCase()}
                    </span>
                    <span className="admin-card__date">{formatDate(enquiry.submitted_at)}</span>
                  </div>

                  <div className="admin-card__sender">
                    <h4 className="admin-card__name">{enquiry.name}</h4>
                    <span className="admin-card__email">{enquiry.email}</span>
                  </div>

                  <div className="admin-card__loc">
                    <MapPin size={12} />
                    <span>{enquiry.project_location}</span>
                  </div>

                  <p className="admin-card__preview">{enquiry.scope}</p>

                  <div className="admin-card__bottom" onClick={(e) => e.stopPropagation()}>
                    <div className="admin-card__status-select">
                      <select
                        value={enquiry.status}
                        onChange={(e) =>
                          handleStatusChange(enquiry.id, e.target.value as EnquiryStatus)
                        }
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div className="admin-card__actions">
                      <a
                        href={buildMailto(enquiry)}
                        className="admin-btn admin-btn--secondary admin-btn--sm"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          if (enquiry.status === 'new' || enquiry.status === 'read') {
                            handleStatusChange(enquiry.id, 'replied');
                          }
                        }}
                      >
                        <Mail size={12} />
                        Reply
                      </a>

                      <button
                        type="button"
                        className="admin-btn admin-btn--primary admin-btn--sm"
                        onClick={() => setSelectedEnquiry(enquiry)}
                      >
                        View Brief
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Reading Detail Modal */}
      <AdminDetailModal
        enquiry={selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </div>
  );
}
