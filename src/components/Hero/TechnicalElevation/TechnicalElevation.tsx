import './TechnicalElevation.css';

interface TechnicalElevationProps {
  opacity: number;
}

export default function TechnicalElevation({ opacity }: TechnicalElevationProps) {
  if (opacity <= 0) return null;

  return (
    <div
      className="tech-elevation"
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        className="tech-elevation__svg"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Concentric circles */}
        <circle cx="600" cy="380" r="220" className="tech-line" />
        <circle cx="600" cy="380" r="280" className="tech-line tech-line--thin" />
        <circle cx="600" cy="380" r="340" className="tech-line tech-line--thinner" />

        {/* Outer rectangle boundary */}
        <rect x="250" y="100" width="700" height="560" className="tech-line" rx="0" />
        <rect x="280" y="130" width="640" height="500" className="tech-line tech-line--thin" />

        {/* Vertical construction guides */}
        <line x1="350" y1="60" x2="350" y2="740" className="tech-line tech-line--thinner" />
        <line x1="500" y1="60" x2="500" y2="740" className="tech-line tech-line--thinner" />
        <line x1="600" y1="40" x2="600" y2="760" className="tech-line tech-line--thin" />
        <line x1="700" y1="60" x2="700" y2="740" className="tech-line tech-line--thinner" />
        <line x1="850" y1="60" x2="850" y2="740" className="tech-line tech-line--thinner" />

        {/* Horizontal guides */}
        <line x1="200" y1="200" x2="1000" y2="200" className="tech-line tech-line--thinner" />
        <line x1="200" y1="380" x2="1000" y2="380" className="tech-line tech-line--thin" />
        <line x1="200" y1="560" x2="1000" y2="560" className="tech-line tech-line--thinner" />

        {/* Building outline - elevation */}
        <path
          d="M 380 180 L 380 580 L 820 580 L 820 180 L 380 180 Z"
          className="tech-line tech-line--accent"
        />
        {/* Roof outline */}
        <path
          d="M 360 180 L 840 180 L 840 160 L 360 160 Z"
          className="tech-line tech-line--accent"
        />
        {/* Floor lines */}
        <line x1="380" y1="310" x2="820" y2="310" className="tech-line tech-line--accent" />
        <line x1="380" y1="440" x2="820" y2="440" className="tech-line tech-line--accent" />

        {/* Foundation */}
        <path
          d="M 340 580 L 340 610 L 860 610 L 860 580"
          className="tech-line tech-line--accent"
          fill="none"
        />

        {/* Window divisions */}
        {[420, 500, 580, 660, 740, 780].map((x) => (
          <line
            key={`win-${x}`}
            x1={x} y1="190" x2={x} y2="570"
            className="tech-line tech-line--fine"
          />
        ))}

        {/* Dimension lines */}
        {/* Width dimension */}
        <line x1="380" y1="640" x2="820" y2="640" className="tech-dim" />
        <line x1="380" y1="630" x2="380" y2="650" className="tech-dim" />
        <line x1="820" y1="630" x2="820" y2="650" className="tech-dim" />
        <text x="600" y="660" className="tech-text" textAnchor="middle">24.000</text>

        {/* Height dimension */}
        <line x1="880" y1="160" x2="880" y2="610" className="tech-dim" />
        <line x1="870" y1="160" x2="890" y2="160" className="tech-dim" />
        <line x1="870" y1="610" x2="890" y2="610" className="tech-dim" />
        <text x="900" y="390" className="tech-text" textAnchor="start" transform="rotate(90, 900, 390)">15.200</text>

        {/* Annotations */}
        <text x="260" y="88" className="tech-annotation">ELEVATION / NORTH</text>
        <text x="260" y="700" className="tech-annotation">MLANDPROPERTIES</text>
        <text x="260" y="718" className="tech-annotation">DRAWN TO THE MILLIMETRE</text>
        <text x="870" y="88" className="tech-annotation" textAnchor="end">1:200</text>

        {/* Cross-hair at center */}
        <line x1="590" y1="370" x2="610" y2="370" className="tech-line tech-line--accent" />
        <line x1="600" y1="360" x2="600" y2="400" className="tech-line tech-line--accent" />
      </svg>

      {/* Oversized wordmark */}
      <div className="tech-elevation__wordmark">
        <span>MLAND</span> <span>PROPERTIES</span>
      </div>

      {/* Horizontal rule */}
      <div className="tech-elevation__rule" />
    </div>
  );
}
