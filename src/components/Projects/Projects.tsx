import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTilt } from '../../hooks/useTilt';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    title: 'Villa Travertine',
    type: 'Residence & Landscape',
    location: 'Marbella, Spain',
    year: '2023',
    image: '/images/villa-travertine-sunset.jpg',
    alt: 'Villa Travertine — contemporary stone residence with infinity pool overlooking the Mediterranean sea at sunset',
    layout: 'wide',
  },
  {
    title: 'Hôtel Lumen',
    type: 'Hospitality',
    location: 'Istanbul, Türkiye',
    year: '2024',
    image: '/images/hotel-lumen-lobby.jpg',
    alt: 'Hôtel Lumen — soaring double-height grand lobby with bookmatched Italian marble and ribbed oak panels',
    layout: 'tall',
  },
  {
    title: 'Villa Fiorentina',
    type: 'Private Residence',
    location: 'Florence, Italy',
    year: '2023',
    image: '/images/villa-exterior.jpg',
    alt: 'Villa Fiorentina — modern stone residence with courtyard pool and mature olive trees',
    layout: 'tall',
  },
  {
    title: 'Atrium Works',
    type: 'Headquarters',
    location: 'Istanbul, Türkiye',
    year: '2022',
    image: '/images/commercial-building.jpg',
    alt: 'Atrium Works — commercial headquarters with warm stone and bronze facade',
    layout: 'wide',
  },
  {
    title: 'Marble House',
    type: 'Interior Architecture',
    location: 'Doha, Qatar',
    year: '2022',
    image: '/images/interior-design.jpg',
    alt: 'Marble House — luxury interior with travertine columns, oak joinery and bronze fixtures',
    layout: 'tall',
  },
  {
    title: 'Pavilion Oak',
    type: 'Guest Pavilion',
    location: 'Provence, France',
    year: '2021',
    image: '/images/renovation-building.jpg',
    alt: 'Pavilion Oak — historic stone guest pavilion restored with contemporary glazed extension',
    layout: 'wide',
  },
];

/* ── Single project card with tilt + parallax ── */
function ProjectCard({ project }: { project: (typeof PROJECTS)[number] }) {
  const tiltRef = useTilt<HTMLElement>(3, 6, 0.08);
  const imgRef = useRef<HTMLImageElement>(null);
  const [hovered, setHovered] = useState(false);

  /* Scroll-based vertical parallax on the image */
  useEffect(() => {
    if (!imgRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReduced || isTouch) return;

    const tween = gsap.fromTo(
      imgRef.current,
      { yPercent: -4 },
      {
        yPercent: 4,
        ease: 'none',
        scrollTrigger: {
          trigger: imgRef.current.closest('.projects__item-media'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      }
    );

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <article
      ref={tiltRef}
      className={`projects__item projects__item--${project.layout} ${hovered ? 'projects__item--hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="projects__item-media">
        <img
          ref={imgRef}
          src={project.image}
          alt={project.alt}
          className="projects__item-img"
          loading="lazy"
        />

        {/* Bottom overlay — category + year */}
        <div className="projects__item-bottom-overlay">
          <span className="projects__item-category">{project.type}</span>
          <span className="projects__item-year">{project.year}</span>
        </div>
      </div>
      <div className="projects__item-info">
        <h3 className="projects__item-title">{project.title}</h3>
        <div className="projects__item-meta">
          <span>{project.type}</span>
          <span className="projects__dot">·</span>
          <span>{project.location}</span>
          <span className="projects__dot">·</span>
          <span>{project.year}</span>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const items = sectionRef.current.querySelectorAll('.projects__item');

    if (prefersReducedMotion) {
      items.forEach((item) => {
        gsap.set(item, { opacity: 1, y: 0 });
      });
      return;
    }

    const tweens: gsap.core.Tween[] = [];

    items.forEach((item, i) => {
      // Stagger within each row: items at even positions first, then odds
      const row = item.closest('.projects__row');
      const siblings = row ? Array.from(row.querySelectorAll('.projects__item')) : [item];
      const indexInRow = siblings.indexOf(item);

      const tween = gsap.fromTo(
        item,
        { opacity: 0, y: 38 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: indexInRow * 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
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
    <section id="projects" className="projects" ref={sectionRef}>
      <div className="page-container">
        {/* Header matching Reference 05/08 */}
        <div className="projects__header">
          <div className="projects__header-left">
            <span className="section-label">SELECTED WORK</span>
            <h2 className="section-heading">
              Projects, quietly<br />
              delivered.
            </h2>
          </div>

          <div className="projects__header-center" aria-hidden="true">
            <div className="projects__circle-indicator">
              <span className="projects__circle-dot" />
            </div>
          </div>

          <div className="projects__header-right">
            <span className="projects__meta">
              2021 — 2024 · SIX OF TWO HUNDRED AND EIGHTEEN
            </span>
          </div>
        </div>

        {/* Editorial gallery: 3 balanced rows (wide+tall, tall+wide, tall+wide) */}
        <div className="projects__gallery">
          {/* Row 1: Villa Travertine (wide) + Hôtel Lumen (tall) */}
          <div className="projects__row projects__row--a">
            <ProjectCard project={PROJECTS[0]} />
            <ProjectCard project={PROJECTS[1]} />
          </div>

          {/* Row 2: Villa Fiorentina (tall) + Atrium Works (wide) */}
          <div className="projects__row projects__row--b">
            <ProjectCard project={PROJECTS[2]} />
            <ProjectCard project={PROJECTS[3]} />
          </div>

          {/* Row 3: Marble House (tall) + Pavilion Oak (wide) */}
          <div className="projects__row projects__row--b">
            <ProjectCard project={PROJECTS[4]} />
            <ProjectCard project={PROJECTS[5]} />
          </div>
        </div>
      </div>
    </section>
  );
}
