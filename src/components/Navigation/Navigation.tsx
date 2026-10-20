import { useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import './Navigation.css';

interface NavigationProps {
  activeSection: string;
  visible: boolean;
}

const NAV_LINKS = [
  { id: 'studio', label: 'STUDIO' },
  { id: 'services', label: 'SERVICES' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'process', label: 'PROCESS' },
  { id: 'contact', label: 'CONTACT' },
];

export default function Navigation({ activeSection, visible }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkBg, setIsDarkBg] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      // Detect if we're in the dark hero section
      const heroEl = document.getElementById('hero-section');
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        setIsDarkBg(rect.bottom > 90);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileOpen(false);
  }, []);

  const scrollToContact = useCallback(() => {
    scrollTo('contact');
  }, [scrollTo]);

  if (!visible) return null;

  return (
    <header
      className={`nav ${isScrolled ? 'nav--scrolled' : ''} ${isDarkBg ? 'nav--dark' : 'nav--light'}`}
      role="banner"
    >
      <div className="nav__inner">
        <a href="#" className="nav__logo" aria-label="MLAND Properties home">
          MLAND PROPERTIES
        </a>

        <nav className="nav__links" role="navigation" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              className={`nav__link ${activeSection === link.id ? 'nav__link--active' : ''}`}
              onClick={() => scrollTo(link.id)}
              type="button"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button
          className="nav__cta"
          onClick={scrollToContact}
          type="button"
        >
          START A PROJECT
        </button>

        <button
          className="nav__mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          type="button"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`nav__mobile-menu ${mobileOpen ? 'nav__mobile-menu--open' : ''}`}>
        <nav role="navigation" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              className={`nav__mobile-link ${activeSection === link.id ? 'nav__mobile-link--active' : ''}`}
              onClick={() => scrollTo(link.id)}
              type="button"
            >
              {link.label}
            </button>
          ))}
          <button
            className="nav__mobile-cta"
            onClick={scrollToContact}
            type="button"
          >
            START A PROJECT
          </button>
        </nav>
      </div>
    </header>
  );
}
