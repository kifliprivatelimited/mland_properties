import './BrandReveal.css';

interface BrandRevealProps {
  opacity: number;
  scale: number;
}

export default function BrandReveal({ opacity, scale }: BrandRevealProps) {
  if (opacity <= 0.001) return null;

  return (
    <div
      className="brand-reveal"
      style={{
        opacity,
        transform: `translate(-50%, -50%) scale(${scale})`,
      }}
      aria-hidden="true"
    >
      <div className="brand-reveal__inner">
        <span className="brand-reveal__meta">STUDIO MONOGRAPH · 2024</span>
        <h2 className="brand-reveal__title">
          <span className="brand-reveal__word">MLAND</span>{' '}
          <span className="brand-reveal__word">PROPERTIES</span>
        </h2>
        <div className="brand-reveal__divider">
          <span className="brand-reveal__line" />
          <span className="brand-reveal__dot">◆</span>
          <span className="brand-reveal__line" />
        </div>
        <p className="brand-reveal__tagline">
          INTEGRATED ARCHITECTURE · INTERIOR DESIGN · CONSTRUCTION
        </p>
      </div>
    </div>
  );
}
