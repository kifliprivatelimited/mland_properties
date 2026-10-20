import { useRef, useEffect, useState, useCallback, Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import TechnicalElevation from './TechnicalElevation/TechnicalElevation';
import BrandReveal from './BrandReveal/BrandReveal';
import './Hero.css';

// Lazy-load Three.js scene behind client-only boundary
const HeroScene = lazy(() => import('./HeroScene'));

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const buildingRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  // Spring physics variables: stiffness 190, damping 30, mass 0.28
  const springPos = useRef(0);
  const springVel = useRef(0);

  // Overlay states for 2D UI elements
  const [elevationOpacity, setElevationOpacity] = useState(0);
  const [brandOpacity, setBrandOpacity] = useState(0);
  const [brandScale, setBrandScale] = useState(0.96);
  const [transitionOpacity, setTransitionOpacity] = useState(0);
  const [indicatorOpacity, setIndicatorOpacity] = useState(1);
  const [activeStage, setActiveStage] = useState('01 APPROACH');
  const [webGLFailed, setWebGLFailed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Check client-side and WebGL support
  useEffect(() => {
    setIsClient(true);
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) setWebGLFailed(true);
    } catch {
      setWebGLFailed(true);
    }
  }, []);

  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Track pointer for subtle architectural camera depth
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handlePointerMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerRef.current = { x, y };
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('mousemove', handlePointerMove);
  }, [prefersReducedMotion]);

  // Spring-smoothed scroll progress loop
  useEffect(() => {
    if (webGLFailed || prefersReducedMotion) return;

    let animId: number;
    let lastTime = performance.now();

    // Spring constants: stiffness 190, damping 30, mass 0.28
    const k = 190;
    const c = 30;
    const m = 0.28;

    const updateLoop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const container = containerRef.current;
      let targetProgress = 0;

      if (container) {
        const rect = container.getBoundingClientRect();
        const totalScrollable = container.offsetHeight - window.innerHeight;
        if (totalScrollable > 0) {
          const scrolled = -rect.top;
          targetProgress = Math.max(0, Math.min(1, scrolled / totalScrollable));
        }
      }

      // Spring physics simulation
      const displacement = springPos.current - targetProgress;
      const springForce = -k * displacement - c * springVel.current;
      const acceleration = springForce / m;

      springVel.current += acceleration * dt;
      springPos.current += springVel.current * dt;

      if (Math.abs(springPos.current - targetProgress) < 0.0001 && Math.abs(springVel.current) < 0.0001) {
        springPos.current = targetProgress;
        springVel.current = 0;
      }

      const p = Math.max(0, Math.min(1, springPos.current));
      progressRef.current = p;

      // Update 2D overlays based on smoothed progress p:
      // 1. Blueprint opacity (peaks during 0.65 - 0.79)
      let elevOp = 0;
      if (p >= 0.63 && p <= 0.71) {
        elevOp = (p - 0.63) / 0.08;
      } else if (p > 0.71 && p <= 0.77) {
        elevOp = 1;
      } else if (p > 0.77 && p <= 0.83) {
        elevOp = 1 - (p - 0.77) / 0.06;
      }
      setElevationOpacity(elevOp);

      // 2. Brand Reveal opacity and scale (peaks during 0.82 - 0.91)
      let bOp = 0;
      let bScale = 0.96;
      if (p >= 0.80 && p <= 0.85) {
        const t = (p - 0.80) / 0.05;
        bOp = t;
        bScale = 0.96 + 0.04 * t;
      } else if (p > 0.85 && p <= 0.89) {
        bOp = 1;
        bScale = 1.0;
      } else if (p > 0.89 && p <= 0.93) {
        const t = (p - 0.89) / 0.04;
        bOp = 1 - t;
        bScale = 1.0 + 0.01 * t;
      }
      setBrandOpacity(bOp);
      setBrandScale(bScale);

      // 3. Gentle Ivory dissolve into existing homepage (0.93 - 1.00)
      let transOp = 0;
      if (p >= 0.92) {
        transOp = Math.min(1, (p - 0.92) / 0.075);
      }
      setTransitionOpacity(transOp);

      // 4. Scroll indicator fades out quickly once user begins scrolling
      setIndicatorOpacity(p < 0.05 ? 1 - p / 0.05 : 0);

      // 5. Stage tracking label
      if (p < 0.32) {
        setActiveStage('01 APPROACH');
      } else if (p < 0.48) {
        setActiveStage('02 INTERIOR');
      } else if (p < 0.65) {
        setActiveStage('03 STRUCTURE');
      } else if (p < 0.80) {
        setActiveStage('04 BLUEPRINT');
      } else if (p < 0.92) {
        setActiveStage('05 REVEAL');
      } else {
        setActiveStage('06 STUDIO');
      }

      animId = requestAnimationFrame(updateLoop);
    };

    animId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animId);
  }, [webGLFailed, prefersReducedMotion]);

  return (
    <section
      id="hero-section"
      className={`hero ${prefersReducedMotion ? 'hero--reduced-motion' : ''}`}
      ref={containerRef}
      aria-label="MLAND Properties Architectural Presentation"
    >
      <div className="hero__sticky">
        {!webGLFailed && isClient && !prefersReducedMotion ? (
          <>
            <Canvas
              camera={{
                position: [6.8, 3.2, 8.5],
                fov: 42,
                near: 0.1,
                far: 100,
              }}
              shadows
              dpr={[1, 1.5]}
              gl={{
                antialias: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.15,
                powerPreference: 'high-performance',
              }}
              style={{ background: '#211F1D' }}
            >
              <Suspense fallback={null}>
                <HeroScene
                  buildingRef={buildingRef}
                  progressRef={progressRef}
                  pointerRef={pointerRef}
                />
              </Suspense>
            </Canvas>

            {/* Technical Blueprint drafting overlay */}
            <TechnicalElevation opacity={elevationOpacity} />

            {/* Brand Reveal overlay */}
            <BrandReveal opacity={brandOpacity} scale={brandScale} />

            {/* Gentle Ivory dissolve overlay into the homepage */}
            <div
              className="hero__transition-overlay"
              style={{ opacity: transitionOpacity }}
              aria-hidden="true"
            />

            {/* Sequence Stage HUD */}
            <div className="hero__hud" aria-hidden="true">
              <span className="hero__hud-track">{activeStage}</span>
            </div>

            {/* Initial Scroll indicator */}
            <div
              className="hero__scroll-indicator"
              style={{ opacity: indicatorOpacity }}
              aria-hidden="true"
            >
              <span className="hero__scroll-text">SCROLL TO ADVANCE</span>
              <div className="hero__scroll-line" />
            </div>
          </>
        ) : (
          /* WebGL or Reduced Motion Fallback */
          <div className="hero__fallback">
            <div className="hero__fallback-image" />
            <div className="hero__fallback-scrim" />
            <div className="hero__fallback-content">
              <span className="hero__fallback-subtitle">
                DESIGN · ARCHITECTURE · CONSTRUCTION
              </span>
              <h1 className="hero__fallback-title">MLAND PROPERTIES</h1>
              <p className="hero__fallback-desc">
                Contemporary architecture, precision construction, and refined interiors — delivered
                by a single integrated team.
              </p>
              <a href="#studio" className="hero__fallback-cta">
                ENTER PRACTICE →
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
