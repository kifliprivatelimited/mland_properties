import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Process.css';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: '01',
    title: 'Listening',
    description: 'Site visit, brief, budget and programme set together.',
  },
  {
    number: '02',
    title: 'Concept',
    description: 'Massing, light studies and material palette developed in hand models.',
  },
  {
    number: '03',
    title: 'Design',
    description: 'Drawings, engineering and finish-level detailing resolved.',
  },
  {
    number: '04',
    title: 'Permits',
    description: 'Authority approvals and tender documentation.',
  },
  {
    number: '05',
    title: 'Construction',
    description: 'Site teams, weekly reporting and material control.',
  },
  {
    number: '06',
    title: 'Handover',
    description: 'Commissioning, snagging and a documented building.',
  },
];

/* Six sequential paths for the line-drawn building SVG (120x100 viewBox) */
const BUILDING_PATHS = [
  {
    name: 'ground-line',
    d: 'M8 88 L112 88',
  },
  {
    name: 'foundation',
    d: 'M24 88 L24 94 L36 94 L36 88 M54 88 L54 94 L66 94 L66 88 M84 88 L84 94 L96 94 L96 88',
  },
  {
    name: 'structure',
    d: 'M30 88 L30 28 M60 88 L60 28 M90 88 L90 28 M26 88 L94 88',
  },
  {
    name: 'concrete-slabs',
    d: 'M22 66 L98 66 M22 63 L98 63 M20 44 L100 44 M20 41 L100 41',
  },
  {
    name: 'facade-openings',
    d: 'M36 88 L36 68 L54 68 L54 88 M68 84 L88 84 L88 70 L68 70 Z M78 70 L78 84 M34 59 L56 59 L56 47 L34 47 Z M45 47 L45 59 M64 59 L92 59 L92 47 L64 47 Z M73 47 L73 59 M82 47 L82 59',
  },
  {
    name: 'roof',
    d: 'M14 28 L106 28 M18 28 L18 22 L102 22 L102 28 M35 22 L35 15 L85 15 L85 22 M45 15 L45 22 M55 15 L55 22 M65 15 L65 22 M75 15 L75 22',
  },
];

/* Single stroke path component mapped to section scroll progress */
function DrawingPath({
  d,
  index,
  scrollYProgress,
  reduced,
}: {
  d: string;
  index: number;
  scrollYProgress: MotionValue<number>;
  reduced: boolean;
}) {
  const startProgress = 0.08 + index * 0.13;
  const endProgress = startProgress + 0.16;
  const opacityStart = Math.max(0, startProgress - 0.04);

  const pathLength = useTransform(
    scrollYProgress,
    [startProgress, endProgress],
    [0, 1]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, opacityStart, startProgress],
    [0.15, 0.15, 1]
  );

  return (
    <motion.path
      d={d}
      stroke="var(--color-bronze)"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      style={{
        pathLength: reduced ? 1 : pathLength,
        opacity: reduced ? 1 : opacity,
      }}
    />
  );
}

/* Hairline progress rail spanning full width with bronze fill line */
function ProgressRail({
  scrollYProgress,
  reduced,
}: {
  scrollYProgress: MotionValue<number>;
  reduced: boolean;
}) {
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="process__progress-rail" aria-hidden="true">
      <motion.div
        className="process__progress-line"
        style={{
          scaleX: reduced ? 1 : scaleX,
          transformOrigin: 'left center',
        }}
      />
    </div>
  );
}

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const [prefersReduced, setPrefersReduced] = useState(false);

  // Monitor reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Scroll mapping for section progress from 'start 85%' to 'end 55%'
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 85%', 'end 55%'],
  });

  // Stage cards entrance animation: fades in & rises 24px (once, ~-8% margin, 0.08s stagger per col)
  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const steps = sectionRef.current.querySelectorAll('.process__step');
    if (prefersReducedMotion) {
      steps.forEach((step) => {
        gsap.set(step, { opacity: 1, y: 0 });
      });
      return;
    }

    const tweens: gsap.core.Tween[] = [];

    steps.forEach((step, i) => {
      // Staggered left-to-right within each row (0.08s per column)
      const colIndex = i % 3;
      const tween = gsap.fromTo(
        step,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          delay: colIndex * 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 92%', // ~-8% margin from viewport bottom
            once: true,
          },
        }
      );
      tweens.push(tween);
    });

    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section id="process" className="process" ref={sectionRef}>
      <div className="page-container">
        {/* Header */}
        <div className="process__header">
          <div className="process__header-left">
            <span className="section-label">HOW WE WORK</span>
            <h2 className="section-heading">
              Six stages,<br />
              no handovers<br />
              between strangers.
            </h2>
          </div>

          <div className="process__header-center" aria-hidden="true">
            <div className="process__circle-indicator">
              <span className="process__circle-dot" />
            </div>
          </div>

          <div className="process__header-right">
            <p className="process__intro">
              The studio delivers every aspect from the first conversation on site through to handover — no brokering, no subcontracting of core responsibilities.
            </p>
          </div>
        </div>

        {/* Scroll-driven construction drawing & full-width progress rail */}
        <div className="process__construction" aria-hidden="true">
          <div className="process__construction-top">
            <div className="process__construction-info">
              <span className="process__construction-label">CONSTRUCTION DRAWING SEQUENCE</span>
              <span className="process__construction-sub">01 FOUNDATION → 06 HANDOVER</span>
            </div>
            <div className="process__construction-drawing">
              <svg
                viewBox="0 0 120 100"
                className="process__building-svg"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {BUILDING_PATHS.map((p, i) => (
                  <DrawingPath
                    key={p.name}
                    d={p.d}
                    index={i}
                    scrollYProgress={scrollYProgress}
                    reduced={prefersReduced}
                  />
                ))}
              </svg>
            </div>
            <div className="process__construction-meta">
              <span className="process__construction-scale">SCALE 1 : 100</span>
              <span className="process__construction-dim">120 × 100 MM ARCHITECTURAL SEQUENCE</span>
            </div>
          </div>

          {/* Progress rail beneath the drawing label spanning full width */}
          <ProgressRail scrollYProgress={scrollYProgress} reduced={prefersReduced} />
        </div>

        {/* 3x2 Matrix Grid */}
        <div className="process__grid">
          {STEPS.map((step) => (
            <div key={step.number} className="process__step">
              <div className="process__step-header">
                <span className="process__step-num">{step.number}</span>
                <span className="process__step-mark" aria-hidden="true">+</span>
              </div>
              <h3 className="process__step-title">{step.title}</h3>
              <p className="process__step-desc">{step.description}</p>
              {/* Short bronze rule at bottom extending on hover */}
              <span className="process__step-rule" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
