import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTilt } from '../../hooks/useTilt';
import './Studio.css';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { number: '08', label: 'Studios & Ateliers' },
  { number: '31', label: 'Years of Practice' },
  { number: '1.4M', label: 'Square Metres Delivered' },
  { number: '98%', label: 'On-Time Handover' },
];

/* ── Studio image card (premium editorial feature) ── */
function StudioImageCard() {
  const cardRef = useTilt<HTMLDivElement>(2.5, 4, 0.07);
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const accentRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    const accent = accentRef.current;
    if (!wrap || !img || !accent) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tweens: gsap.core.Tween[] = [];

    if (prefersReduced) {
      // Reduced motion: simple fade, no clip-path or parallax
      gsap.set(wrap, { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' });
      gsap.set(img, { scale: 1, yPercent: 0 });
      // Show accent line immediately
      accent.style.strokeDashoffset = '0';
      return;
    }

    /* ── Clip-path reveal entrance ── */
    const revealTween = gsap.fromTo(
      wrap,
      {
        opacity: 0,
        clipPath: 'inset(12% 12% 12% 12%)',
      },
      {
        opacity: 1,
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: wrap,
          start: 'top 88%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
    tweens.push(revealTween);

    /* ── Inner parallax: image drifts + breathes ── */
    const parallaxTween = gsap.fromTo(
      img,
      { yPercent: -4, scale: 1.10 },
      {
        yPercent: 4,
        scale: 1.18,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      }
    );
    tweens.push(parallaxTween);

    /* ── Architectural accent line stroke animation ── */
    const pathLength = accent.getTotalLength();
    accent.style.strokeDasharray = `${pathLength}`;
    accent.style.strokeDashoffset = `${pathLength}`;

    const strokeTween = gsap.to(accent, {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: wrap,
        start: 'top 88%',
        toggleActions: 'play none none none',
        once: true,
      },
    });
    tweens.push(strokeTween);

    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="studio__image-col studio__animate">
      {/* Tilt wrapper — perspective applied by useTilt */}
      <div ref={cardRef} className="studio__card-tilt">
        {/* Clip-path + opacity wrapper */}
        <div ref={wrapRef} className="studio__image-wrap">
          <img
            ref={imgRef}
            src="/images/studio-interior.jpg"
            alt="MLAND Properties architecture studio — sunlit workspace with oak drafting tables, architectural models, material samples, and an indoor tree"
            className="studio__image"
            loading="lazy"
          />

          {/* Glass caption panel — elevated translateZ for depth during tilt */}
          <div className="studio__image-caption">
            <span className="studio__caption-label">THE STUDIO</span>
            <p className="studio__caption-text">
              Architects, engineers and site teams working under one roof in Istanbul.
            </p>
          </div>
        </div>

        {/* Architectural accent — right-angle line at bottom-right corner */}
        <svg
          className="studio__accent-svg"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            ref={accentRef}
            d="M0 0 L0 58 L58 58"
            className="studio__accent-path"
          />
        </svg>
      </div>
    </div>
  );
}

export default function Studio() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const elements = sectionRef.current.querySelectorAll('.studio__animate:not(.studio__image-col)');
    const tweens: gsap.core.Tween[] = [];

    elements.forEach((el) => {
      const tween = gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
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
    <section id="studio" className="studio" ref={sectionRef}>
      <div className="page-container">
        {/* Two-column layout */}
        <div className="studio__grid">
          {/* Left — Premium image card */}
          <StudioImageCard />

          {/* Right — Content */}
          <div className="studio__content-col">
            <div className="studio__animate">
              <span className="section-label">OUR PRACTICE</span>
              <h2 className="section-heading">
                A single team<br />
                from first sketch<br />
                to final key.
              </h2>
            </div>
            <div className="studio__body studio__animate">
              <p>
                MLAND Properties is an integrated architecture, interior design and construction practice.
                Every project is led by a single team of architects, engineers and site managers who
                work together from concept through to completion.
              </p>
              <p>
                We believe the best buildings emerge when design and construction share a table. Our
                approach eliminates the gaps between disciplines, giving clients one point of
                accountability and a building that matches its drawings — in material, detail and craft.
              </p>
              <p>
                The studio works with natural stone, hardwood, glass and bronze. We favour materials
                that improve with age, daylight that moves through rooms, and plans that respond to
                the specific conditions of each site.
              </p>
            </div>
            <div className="studio__animate">
              <a href="#process" className="studio__link">
                <span>HOW WE WORK</span>
                <span className="studio__link-arrow">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Statistics — standalone bar between Studio and Services */}
        <div className="studio__stats studio__animate">
          {STATS.map((stat, i) => (
            <div key={i} className="studio__stat">
              <span className="studio__stat-number">{stat.number}</span>
              <span className="studio__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
