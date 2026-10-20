import { useEffect, useRef, useState } from 'react';
import './Loader.css';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Wait for fonts to load, then animate out
    const minDisplayTime = 2000;
    const maxWaitTime = 5000;
    const start = Date.now();

    const proceed = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, minDisplayTime - elapsed);
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(onComplete, 1000);
      }, remaining);
    };

    // Wait for document fonts, with fallback timeout
    if (document.fonts && document.fonts.ready) {
      Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, maxWaitTime))
      ]).then(proceed);
    } else {
      setTimeout(proceed, minDisplayTime);
    }
  }, [onComplete]);

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      ref={loaderRef}
      className={`loader ${isExiting ? 'loader--exiting' : ''} ${prefersReducedMotion ? 'loader--no-motion' : ''}`}
      role="status"
      aria-label="Loading MLAND Properties"
    >
      <div className="loader__content">
        <h1 className="loader__title">
          <span className="loader__letter-group">MLAND</span>
          {' '}
          <span className="loader__letter-group">PROPERTIES</span>
        </h1>
        <div className="loader__spinner" aria-hidden="true">
          <svg viewBox="0 0 36 36" className="loader__spinner-svg">
            <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="25 75" className="loader__spinner-arc" />
          </svg>
        </div>
        <p className="loader__subtitle">
          <span>DESIGN</span>
          <span className="loader__dot">·</span>
          <span>ARCHITECTURE</span>
          <span className="loader__dot">·</span>
          <span>CONSTRUCTION</span>
        </p>
      </div>
    </div>
  );
}
