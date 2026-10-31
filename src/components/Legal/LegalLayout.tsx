import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Shield, FileCheck, AlertCircle, ChevronRight } from 'lucide-react';
import PrivacyPolicy from './PrivacyPolicy';
import TermsConditions from './TermsConditions';
import CookiePolicy from './CookiePolicy';
import Disclaimer from './Disclaimer';
import './Legal.css';

export type LegalRoute = '/privacy-policy' | '/terms-and-conditions' | '/cookie-policy' | '/disclaimer';

interface LegalLayoutProps {
  currentRoute: LegalRoute;
  onNavigate: (route: string) => void;
}

const LEGAL_DOCS: {
  route: LegalRoute;
  title: string;
  shortTitle: string;
  icon: typeof FileText;
  description: string;
}[] = [
  {
    route: '/privacy-policy',
    title: 'Privacy Policy',
    shortTitle: 'Privacy',
    icon: Shield,
    description: 'Data protection practices under DPDP Act 2023 and IT Act 2000.',
  },
  {
    route: '/terms-and-conditions',
    title: 'Terms & Conditions',
    shortTitle: 'Terms',
    icon: FileText,
    description: 'Rules governing site usage, architectural copyright, and preliminary enquiries.',
  },
  {
    route: '/cookie-policy',
    title: 'Cookie Policy',
    shortTitle: 'Cookies',
    icon: FileCheck,
    description: 'Storage transparency: zero third-party marketing tracking cookies.',
  },
  {
    route: '/disclaimer',
    title: 'Professional Disclaimer',
    shortTitle: 'Disclaimer',
    icon: AlertCircle,
    description: 'Notice on conceptual 3D renders, preliminary estimates, and municipal sanctions.',
  },
];

export default function LegalLayout({ currentRoute, onNavigate }: LegalLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>('section-1');

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentRoute]);

  // Track active section for table of contents
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll<HTMLElement>('.legal-section');
      let current = '';
      sections.forEach((sec) => {
        const top = sec.getBoundingClientRect().top;
        if (top <= 160) {
          current = sec.id;
        }
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentRoute]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = 110;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  // Dynamic Table of Contents items per route
  const getTocItems = () => {
    switch (currentRoute) {
      case '/privacy-policy':
        return [
          { id: 'section-1', title: '1. Introduction & Studio Identity' },
          { id: 'section-2', title: '2. Scope & Indian Legislation' },
          { id: 'section-3', title: '3. Personal Information Collected' },
          { id: 'section-4', title: '4. Purpose of Collection' },
          { id: 'section-5', title: '5. Storage, RLS & Security' },
          { id: 'section-6', title: '6. Third-Party Integrations' },
          { id: 'section-7', title: '7. Data Sharing & Disclosure' },
          { id: 'section-8', title: '8. Data Retention' },
          { id: 'section-9', title: '9. Rights Under DPDP Act 2023' },
          { id: 'section-10', title: '10. Grievance Redressal Officer' },
          { id: 'section-11', title: '11. Policy Modifications' },
        ];
      case '/terms-and-conditions':
        return [
          { id: 'section-1', title: '1. Acceptance of Terms' },
          { id: 'section-2', title: '2. About the Studio Practice' },
          { id: 'section-3', title: '3. Use of the Website' },
          { id: 'section-4', title: '4. Intellectual Property & Copyright' },
          { id: 'section-5', title: '5. Enquiries & Non-Binding Communications' },
          { id: 'section-6', title: '6. Indicative Estimates & Quotations' },
          { id: 'section-7', title: '7. Statutory Approvals & Feasibility' },
          { id: 'section-8', title: '8. Limitation of Liability' },
          { id: 'section-9', title: '9. Governing Law & Jurisdiction' },
          { id: 'section-10', title: '10. Contact Information' },
        ];
      case '/cookie-policy':
        return [
          { id: 'section-1', title: '1. What Are Cookies & Storage?' },
          { id: 'section-2', title: '2. Our Stance on Privacy' },
          { id: 'section-3', title: '3. Categories of Storage Employed' },
          { id: 'section-4', title: '4. Third-Party Services' },
          { id: 'section-5', title: '5. Managing Browser Cookies' },
          { id: 'section-6', title: '6. Policy Updates & Questions' },
        ];
      case '/disclaimer':
        return [
          { id: 'section-1', title: '1. General Informational Nature' },
          { id: 'section-2', title: '2. Conceptual Drawings & 3D Models' },
          { id: 'section-3', title: '3. Portfolio Photography Variations' },
          { id: 'section-4', title: '4. Preliminary Cost Bands & Estimates' },
          { id: 'section-5', title: '5. Statutory Approvals & Sanctions' },
          { id: 'section-6', title: '6. Professional Consultation Needed' },
          { id: 'section-7', title: '7. Limitation of Legal Liability' },
          { id: 'section-8', title: '8. Technical Clarifications' },
        ];
      default:
        return [];
    }
  };

  const otherDocs = LEGAL_DOCS.filter((d) => d.route !== currentRoute);

  return (
    <div className="legal-page">
      {/* Top Architectural Navigation Bar */}
      <header className="legal-nav" role="banner">
        <div className="legal-nav__inner">
          <div className="legal-nav__left">
            <button
              type="button"
              className="legal-nav__back-btn"
              onClick={() => onNavigate('/')}
            >
              <ArrowLeft size={14} />
              <span>STUDIO HOMEPAGE</span>
            </button>
            <span className="legal-nav__divider">/</span>
            <span className="legal-nav__brand">MLAND PROPERTIES</span>
          </div>

          {/* Quick Route Pills */}
          <nav className="legal-nav__tabs" aria-label="Legal document tabs">
            {LEGAL_DOCS.map((doc) => (
              <button
                key={doc.route}
                type="button"
                className={`legal-nav__tab ${currentRoute === doc.route ? 'legal-nav__tab--active' : ''}`}
                onClick={() => onNavigate(doc.route)}
              >
                {doc.shortTitle}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="legal-main">
        <div className="legal-layout-grid">
          {/* Left: Sticky Table of Contents */}
          <aside className="legal-sidebar" aria-label="Document Table of Contents">
            <div className="legal-toc">
              <span className="section-label" style={{ marginBottom: 12 }}>TABLE OF CONTENTS</span>
              <nav className="legal-toc__list">
                {getTocItems().map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`legal-toc__link ${activeSection === item.id ? 'legal-toc__link--active' : ''}`}
                    onClick={() => scrollToSection(item.id)}
                  >
                    <span>{item.title}</span>
                  </button>
                ))}
              </nav>

              <div className="legal-toc__quick-docs">
                <span className="section-label" style={{ marginBottom: 10 }}>LEGAL COMPLIANCE</span>
                <div className="legal-toc__quick-list">
                  {LEGAL_DOCS.map((doc) => (
                    <button
                      key={doc.route}
                      type="button"
                      className={`legal-toc__quick-btn ${currentRoute === doc.route ? 'legal-toc__quick-btn--active' : ''}`}
                      onClick={() => onNavigate(doc.route)}
                    >
                      <doc.icon size={12} />
                      <span>{doc.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right: Active Legal Document Article */}
          <div className="legal-content-col">
            {currentRoute === '/privacy-policy' && <PrivacyPolicy />}
            {currentRoute === '/terms-and-conditions' && <TermsConditions />}
            {currentRoute === '/cookie-policy' && <CookiePolicy />}
            {currentRoute === '/disclaimer' && <Disclaimer />}

            {/* Related Legal Documents Cross-linking Card Grid */}
            <section className="legal-related-section" aria-label="Related Legal Documents">
              <span className="section-label">RELATED COMPLIANCE DOCUMENTATION</span>
              <h3 className="legal-related-title">Explore Related Legal Standards</h3>
              <div className="legal-related-grid">
                {otherDocs.map((doc) => (
                  <button
                    key={doc.route}
                    type="button"
                    className="legal-related-card"
                    onClick={() => onNavigate(doc.route)}
                  >
                    <div className="legal-related-card__top">
                      <doc.icon size={18} className="legal-related-card__icon" />
                      <ChevronRight size={14} className="legal-related-card__arrow" />
                    </div>
                    <h4 className="legal-related-card__heading">{doc.title}</h4>
                    <p className="legal-related-card__desc">{doc.description}</p>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="legal-footer">
        <div className="page-container">
          <div className="legal-footer__content">
            <div className="legal-footer__left">
              <span className="legal-footer__brand">MLAND PROPERTIES</span>
              <span className="legal-footer__sub">Muttom, Aluva, Ernakulam, Kerala — PIN 683106</span>
            </div>
            <div className="legal-footer__right">
              <span className="legal-footer__copy">
                © 2026 MLAND Properties / Kifli Private Limited. All Rights Reserved.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

