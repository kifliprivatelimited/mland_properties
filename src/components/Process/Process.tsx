import { useEffect, useRef } from 'react';
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

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const steps = sectionRef.current.querySelectorAll('.process__step');
    steps.forEach((step, i) => {
      gsap.fromTo(
        step,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: i * 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }, []);

  return (
    <section id="process" className="process" ref={sectionRef}>
      <div className="page-container">
        {/* Header matching Reference 11 */}
        <div className="process__header">
          <div className="process__header-left">
            <span className="section-label">HOW WE WORK</span>
            <h2 className="section-heading">
              Six stages,<br />
              no handovers<br />
              between strangers.
            </h2>

            {/* Architectural schematic blueprint matching Reference 11 */}
            <div className="process__blueprint-wrap" aria-hidden="true">
              <svg
                className="process__blueprint-svg"
                viewBox="0 0 340 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Isometric / axonometric floorplan grid lines */}
                <rect x="20" y="20" width="90" height="60" stroke="#A9825D" strokeWidth="0.8" opacity="0.6" />
                <rect x="40" y="35" width="50" height="35" stroke="#A9825D" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
                <line x1="110" y1="50" x2="160" y2="50" stroke="#A9825D" strokeWidth="0.8" opacity="0.5" />
                <rect x="160" y="25" width="70" height="50" stroke="#A9825D" strokeWidth="0.8" opacity="0.6" />
                <line x1="20" y1="12" x2="230" y2="12" stroke="#A9825D" strokeWidth="0.5" opacity="0.3" />
                <line x1="20" y1="8" x2="20" y2="16" stroke="#A9825D" strokeWidth="0.5" opacity="0.4" />
                <line x1="230" y1="8" x2="230" y2="16" stroke="#A9825D" strokeWidth="0.5" opacity="0.4" />
                {/* Dimension label */}
                <text x="125" y="10" fill="#A9825D" fontSize="7" fontFamily="var(--font-mono)" letterSpacing="0.1em" textAnchor="middle" opacity="0.7">
                  24 000 MM
                </text>
                <text x="20" y="94" fill="#817970" fontSize="7.5" fontFamily="var(--font-mono)" letterSpacing="0.15em" opacity="0.8">
                  01 / 06 · DISCIPLINARY STAGES · DRAWN TO THE MILLIMETRE
                </text>
              </svg>
            </div>
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

        {/* 3x2 Matrix Grid matching Reference 12 */}
        <div className="process__grid">
          {STEPS.map((step) => (
            <div key={step.number} className="process__step">
              <div className="process__step-header">
                <span className="process__step-num">{step.number}</span>
                <span className="process__step-mark" aria-hidden="true">+</span>
              </div>
              <h3 className="process__step-title">{step.title}</h3>
              <p className="process__step-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
