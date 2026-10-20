import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTilt } from '../../hooks/useTilt';
import './Services.css';

gsap.registerPlugin(ScrollTrigger);

/* ── Architectural line-drawing SVGs (one per service) ── */
const LINE_DRAWINGS: Record<string, React.ReactNode> = {
  '01': (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="services__line-drawing">
      {/* Villa / house elevation */}
      <path className="services__line-path" d="M20 90 L20 50 L60 25 L100 50 L100 90 Z M40 90 L40 65 L60 65 L60 90 M20 50 L100 50 M35 55 L35 62 L48 62 L48 55 M72 55 L72 62 L85 62 L85 55 M72 70 L72 77 L85 77 L85 70" strokeWidth="0.8" />
    </svg>
  ),
  '02': (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="services__line-drawing">
      {/* Commercial tower */}
      <path className="services__line-path" d="M30 100 L30 25 L90 25 L90 100 M30 35 L90 35 M30 45 L90 45 M30 55 L90 55 M30 65 L90 65 M30 75 L90 75 M30 85 L90 85 M50 25 L50 100 M70 25 L70 100 M35 20 L85 20 L85 25 L35 25 Z" strokeWidth="0.8" />
    </svg>
  ),
  '03': (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="services__line-drawing">
      {/* Interior — chair + lamp */}
      <path className="services__line-path" d="M25 85 L25 55 Q25 45 35 45 L65 45 Q75 45 75 55 L75 85 M20 55 L25 55 M75 55 L80 55 M35 85 L35 95 M65 85 L65 95 M90 25 L90 80 M85 25 L95 25 M87 80 L93 80 L93 85 L87 85 Z" strokeWidth="0.8" />
    </svg>
  ),
  '04': (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="services__line-drawing">
      {/* Crane / construction */}
      <path className="services__line-path" d="M55 100 L55 20 L95 20 M55 20 L55 15 M60 20 L60 100 M55 40 L60 40 M55 60 L60 60 M55 80 L60 80 M95 20 L95 30 M85 25 L85 55 M80 55 L90 55 M25 100 L35 100 L35 60 L25 60 Z M30 60 L30 45" strokeWidth="0.8" />
    </svg>
  ),
  '05': (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="services__line-drawing">
      {/* Historic building with extension */}
      <path className="services__line-path" d="M15 90 L15 45 L25 35 L35 25 L45 35 L55 45 L55 90 M25 90 L25 70 L45 70 L45 90 M20 55 L20 62 L30 62 L30 55 M40 55 L40 62 L50 62 L50 55 M60 90 L60 50 L100 50 L100 90 M65 55 L65 62 L75 62 L75 55 M65 70 L65 77 L75 77 L75 70 M85 55 L85 85 L100 85" strokeWidth="0.8" />
    </svg>
  ),
};

const SERVICES = [
  {
    number: '01',
    title: 'Residential Architecture',
    description: 'Private villas and family homes in stone, oak and glass.',
    image: '/images/villa-exterior.jpg',
    alt: 'Contemporary stone villa with landscaped courtyard and pool',
  },
  {
    number: '02',
    title: 'Commercial Buildings',
    description: 'Headquarters and mixed-use developments with warm, durable facades.',
    image: '/images/commercial-building.jpg',
    alt: 'Modern commercial building with travertine and glass facade',
  },
  {
    number: '03',
    title: 'Interior Design',
    description: 'Travertine, oak joinery, linen and brass — resolved room by room.',
    image: '/images/interior-design.jpg',
    alt: 'Luxury interior with travertine walls, oak furniture and brass fixtures',
  },
  {
    number: '04',
    title: 'Construction',
    description: 'Our own site teams, engineering supervision and material control.',
    image: '/images/construction-site.jpg',
    alt: 'Concrete building under construction with exposed structural elements',
  },
  {
    number: '05',
    title: 'Renovation & Reuse',
    description: 'Historic fabric restored and extended with contemporary calm.',
    image: '/images/renovation-building.jpg',
    alt: 'Historic stone building renovated with modern glass extension',
  },
];

/* ── Individual service card (handles tilt + hover state) ── */
function ServiceCard({
  service,
  isHero,
  index,
}: {
  service: (typeof SERVICES)[number];
  isHero: boolean;
  index: number;
}) {
  const tiltRef = useTilt<HTMLElement>(2.5, 5, 0.08);
  const [hovered, setHovered] = useState(false);

  return (
    <article
      ref={tiltRef}
      className={`services__card ${isHero ? 'services__card--hero' : 'services__card--standard'} ${hovered ? 'services__card--hovered' : ''}`}
      data-card-index={index}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="services__card-media">
        <img
          src={service.image}
          alt={service.alt}
          className="services__card-img"
          loading="lazy"
        />
        {/* Hover darkening overlay */}
        <div className="services__card-overlay" />
        {/* Architectural line drawing — upper-right corner */}
        {LINE_DRAWINGS[service.number]}
      </div>
      <div className="services__card-body">
        <div className="services__card-row">
          <h3 className="services__card-title">{service.title}</h3>
          <span className="services__card-num">{service.number}</span>
        </div>
        <p className="services__card-desc">{service.description}</p>
      </div>
      {/* Bronze bottom accent line */}
      <span className="services__card-bronze-line" />
    </article>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cards = sectionRef.current.querySelectorAll('.services__card');

    if (prefersReducedMotion) {
      // Ensure cards are visible even when motion is disabled
      cards.forEach((card) => {
        gsap.set(card, { opacity: 1, y: 0 });
      });
      return;
    }

    const tweens: gsap.core.Tween[] = [];

    cards.forEach((card, i) => {
      const tween = gsap.fromTo(
        card,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
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
    <section id="services" className="services" ref={sectionRef}>
      <div className="page-container">
        {/* Header */}
        <div className="services__header">
          <div className="services__header-left">
            <span className="section-label">OUR DISCIPLINES</span>
            <h2 className="section-heading">
              Five disciplines,<br />
              one standard.
            </h2>
          </div>
          <div className="services__header-center" aria-hidden="true">
            <div className="services__circle-indicator">
              <span className="services__circle-dot" />
            </div>
          </div>
          <div className="services__header-right">
            <p className="services__intro">
              Design, engineering and construction delivered by one accountable team — from building licence and brownfield remediation to interior joinery and key handover.
            </p>
          </div>
        </div>

        {/* Asymmetric 5-card grid: large left, 2x2 right */}
        <div className="services__grid">
          {SERVICES.map((service, i) => (
            <ServiceCard
              key={service.number}
              service={service}
              isHero={i === 0}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
