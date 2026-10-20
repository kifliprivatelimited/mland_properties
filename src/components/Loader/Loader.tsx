import { useEffect, useRef, useState } from 'react';
import './Loader.css';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [stage, setStage] = useState<'enter' | 'hold' | 'dissolve' | 'done'>('enter');
  const hasFinished = useRef(false);

  const finish = () => {
    if (hasFinished.current) return;
    hasFinished.current = true;
    setStage('done');
    onComplete();
  };

  useEffect(() => {
    const prefersReducedMotion = typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    if (prefersReducedMotion) {
      const fastTimer = setTimeout(finish, 500);
      return () => clearTimeout(fastTimer);
    }

    // Sequence timing:
    // 0ms - 800ms: reveal (scale 98% -> 100%, opacity 0 -> 1)
    // 800ms - 2000ms: hold fully visible (~1.2s hold)
    // 2000ms - 2800ms: dissolve overlay gently into building scene underneath
    // Total duration: 2.8s
    const holdTimer = setTimeout(() => {
      setStage('hold');
    }, 800);

    const dissolveTimer = setTimeout(() => {
      setStage('dissolve');
    }, 2000);

    const endTimer = setTimeout(() => {
      finish();
    }, 2800);

    // Safety fallback timeout so visitors can never become stuck
    const fallbackTimer = setTimeout(() => {
      finish();
    }, 3600);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(dissolveTimer);
      clearTimeout(endTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  if (stage === 'done') return null;

  return (
    <aside
      className={`intro-overlay intro-overlay--${stage}`}
      role="status"
      aria-live="polite"
      aria-label="MLAND Properties architectural presentation loading"
    >
      <div className="intro-overlay__center">
        <h1 className="intro-overlay__brand">
          <span className="intro-overlay__word">MLAND</span>{' '}
          <span className="intro-overlay__word">PROPERTIES</span>
        </h1>
        <p className="intro-overlay__tagline">
          ARCHITECTURE · CONSTRUCTION · INTERIORS
        </p>
      </div>
    </aside>
  );
}
