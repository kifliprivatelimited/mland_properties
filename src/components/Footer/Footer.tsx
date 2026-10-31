import './Footer.css';

interface FooterProps {
  onNavigate?: (path: string) => void;
  onNavigateAdmin?: () => void;
}

const LEGAL_LINKS = [
  { path: '/privacy-policy', label: 'Privacy Policy' },
  { path: '/terms-and-conditions', label: 'Terms & Conditions' },
  { path: '/cookie-policy', label: 'Cookie Policy' },
  { path: '/disclaimer', label: 'Disclaimer' },
];

export default function Footer({ onNavigate, onNavigateAdmin }: FooterProps) {
  const handleLinkClick = (path: string) => (e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  const handleAdminClick = (e: React.MouseEvent) => {
    if (onNavigateAdmin) {
      e.preventDefault();
      onNavigateAdmin();
    } else if (onNavigate) {
      e.preventDefault();
      onNavigate('/admin');
    }
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="page-container">
        <div className="footer__separator" />

        {/* Top Studio Meta Block */}
        <div className="footer__top">
          <div className="footer__brand-block">
            <span className="footer__brand">MLAND PROPERTIES</span>
            <span className="footer__location">
              Muttom, Aluva, Ernakulam, Kerala — PIN 683106
            </span>
          </div>

          <div className="footer__contact-block">
            <a href="mailto:kifliprivatelimited@gmail.com" className="footer__contact-link">
              kifliprivatelimited@gmail.com
            </a>
            <span className="footer__dot">•</span>
            <a href="tel:+918590999415" className="footer__contact-link">
              +91 8590999415
            </a>
          </div>
        </div>

        {/* Legal & Compliance Link Navigation */}
        <div className="footer__legal-nav">
          <span className="footer__legal-label">LEGAL & COMPLIANCE:</span>
          <nav className="footer__legal-links" aria-label="Legal and compliance links">
            {LEGAL_LINKS.map((link, idx) => (
              <span key={link.path} className="footer__legal-item">
                <a
                  href={link.path}
                  className="footer__legal-link"
                  onClick={handleLinkClick(link.path)}
                >
                  {link.label}
                </a>
                {idx < LEGAL_LINKS.length - 1 && <span className="footer__dot">•</span>}
              </span>
            ))}
            <span className="footer__dot">•</span>
            <a
              href="/admin"
              className="footer__admin-link"
              onClick={handleAdminClick}
              title="Studio Management Portal"
            >
              STUDIO PORTAL
            </a>
          </nav>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="footer__bottom">
          <span className="footer__copyright">
            © 2026 MLAND PROPERTIES / KIFLI PRIVATE LIMITED. ALL RIGHTS RESERVED.
          </span>
          <span className="footer__subnote">
            ARCHITECTURAL DRAWINGS & ELEVATIONS ARE STATUTORILY PROTECTED UNDER INDIAN COPYRIGHT LAW.
          </span>
        </div>
      </div>
    </footer>
  );
}
