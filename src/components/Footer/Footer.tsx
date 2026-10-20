import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="page-container">
        <div className="footer__separator" />
        <div className="footer__content">
          <div className="footer__left">
            <span className="footer__brand">MLAND PROPERTIES</span>
          </div>
          <div className="footer__right">
            <span className="footer__copyright">
              © 2026 — ARCHITECTURE, CONSTRUCTION & INTERIOR DESIGN
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
