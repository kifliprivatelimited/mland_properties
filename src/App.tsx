import { useState, useEffect, useCallback } from 'react';
import Lenis from 'lenis';
import Navigation from './components/Navigation/Navigation';
import Loader from './components/Loader/Loader';
import Hero from './components/Hero/Hero';
import Studio from './components/Studio/Studio';
import Services from './components/Services/Services';
import Projects from './components/Projects/Projects';
import Process from './components/Process/Process';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import AdminPortal from './components/Admin/AdminPortal';
import LegalLayout, { type LegalRoute } from './components/Legal/LegalLayout';
import { updatePageSeo } from './utils/seo';
import './App.css';

const LEGAL_ROUTES: LegalRoute[] = [
  '/privacy-policy',
  '/terms-and-conditions',
  '/cookie-policy',
  '/disclaimer',
];

function App() {
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('');

  const isAdminRoute = currentPath.startsWith('/admin');
  const isLegalRoute = LEGAL_ROUTES.includes(currentPath as LegalRoute);

  const navigateTo = useCallback((path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update canonical SEO for public home page
  useEffect(() => {
    if (!isAdminRoute && !isLegalRoute) {
      updatePageSeo({
        title: 'MLAND Properties — Architecture, Construction & Interior Design',
        description:
          'MLAND Properties — Contemporary architecture, precision construction, and refined interiors delivered by a single integrated team in Istanbul.',
        canonicalPath: '/',
        robots: 'index, follow',
      });
    }
  }, [isAdminRoute, isLegalRoute]);

  const handleLoaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Initialize Lenis smooth scroll on public site only
  useEffect(() => {
    if (isAdminRoute || isLegalRoute) return;

    const prefersReducedMotion = typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [isAdminRoute, isLegalRoute]);

  useEffect(() => {
    if (isAdminRoute || isLegalRoute) return;

    const sections = ['studio', 'services', 'projects', 'process', 'contact'];
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.3, rootMargin: '-90px 0px 0px 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [isLoading, isAdminRoute, isLegalRoute]);

  // 1. Admin Portal
  if (isAdminRoute) {
    return <AdminPortal onNavigateHome={() => navigateTo('/')} />;
  }

  // 2. Legal & Compliance Pages
  if (isLegalRoute) {
    return (
      <LegalLayout
        currentRoute={currentPath as LegalRoute}
        onNavigate={navigateTo}
      />
    );
  }

  // 3. Public Architecture Website
  return (
    <div className="app">
      {isLoading && <Loader onComplete={handleLoaderComplete} />}
      <Navigation activeSection={activeSection} visible={!isLoading} />
      <main>
        <Hero />
        <Studio />
        <Services />
        <Projects />
        <Process />
        <Contact />
      </main>
      <Footer
        onNavigate={navigateTo}
        onNavigateAdmin={() => navigateTo('/admin')}
      />
    </div>
  );
}

export default App;
