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
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('');

  const handleLoaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Initialize Lenis smooth scroll with 0.9s duration
  useEffect(() => {
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
  }, []);

  useEffect(() => {
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
  }, [isLoading]);

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
      <Footer />
    </div>
  );
}

export default App;
