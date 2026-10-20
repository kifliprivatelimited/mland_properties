import './TechnicalElevation.css';

interface TechnicalElevationProps {
  opacity: number;
}

export default function TechnicalElevation({ opacity }: TechnicalElevationProps) {
  if (opacity <= 0.001) return null;

  return (
    <div
      className="tech-elevation"
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        className="tech-elevation__svg"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="archGrid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="rgba(247, 243, 237, 0.035)"
              strokeWidth="0.8"
            />
            <circle cx="80" cy="80" r="1" fill="rgba(169, 130, 93, 0.2)" />
          </pattern>
        </defs>

        {/* Architectural drafting background grid */}
        <rect width="1600" height="1000" fill="url(#archGrid)" />

        {/* Outer drafting border */}
        <rect
          x="60"
          y="50"
          width="1480"
          height="900"
          className="tech-line tech-line--border"
        />
        <rect
          x="75"
          y="65"
          width="1450"
          height="870"
          className="tech-line tech-line--thinner"
        />

        {/* Structural coordinate axes */}
        {/* Vertical grid lines */}
        <line x1="320" y1="50" x2="320" y2="920" className="tech-line tech-line--grid" />
        <line x1="560" y1="50" x2="560" y2="920" className="tech-line tech-line--grid" />
        <line x1="800" y1="50" x2="800" y2="920" className="tech-line tech-line--accent" />
        <line x1="1040" y1="50" x2="1040" y2="920" className="tech-line tech-line--grid" />
        <line x1="1280" y1="50" x2="1280" y2="920" className="tech-line tech-line--grid" />

        {/* Horizontal datum lines */}
        <line x1="60" y1="240" x2="1510" y2="240" className="tech-line tech-line--grid" />
        <line x1="60" y1="480" x2="1510" y2="480" className="tech-line tech-line--grid" />
        <line x1="60" y1="720" x2="1510" y2="720" className="tech-line tech-line--accent" />

        {/* Axis bubbles & labels */}
        {/* Top vertical axes */}
        {[
          { x: 320, label: 'A' },
          { x: 560, label: 'B' },
          { x: 800, label: 'C' },
          { x: 1040, label: 'D' },
          { x: 1280, label: 'E' },
        ].map((axis) => (
          <g key={`axis-v-${axis.label}`}>
            <circle cx={axis.x} cy="32" r="12" className="tech-line tech-line--accent" fill="#211F1D" />
            <text x={axis.x} y="36" className="tech-axis-text" textAnchor="middle">
              {axis.label}
            </text>
          </g>
        ))}

        {/* Left horizontal datum markers */}
        {[
          { y: 240, label: '+11.200 (ROOF PARAPET)' },
          { y: 480, label: '+5.600 (FIRST FLOOR)' },
          { y: 720, label: '+0.000 (FINISHED GROUND)' },
        ].map((datum, i) => (
          <g key={`datum-${i}`}>
            <polygon
              points={`42,${datum.y} 58,${datum.y - 6} 58,${datum.y + 6}`}
              fill="#A9825D"
            />
            <text x="68" y={datum.y - 8} className="tech-datum-text">
              {datum.label}
            </text>
          </g>
        ))}

        {/* Axonometric projection alignment guides */}
        <line x1="800" y1="180" x2="1240" y2="440" className="tech-line tech-line--diagonal" />
        <line x1="800" y1="180" x2="360" y2="440" className="tech-line tech-line--diagonal" />
        <line x1="800" y1="680" x2="1240" y2="440" className="tech-line tech-line--diagonal" />
        <line x1="800" y1="680" x2="360" y2="440" className="tech-line tech-line--diagonal" />

        {/* Center alignment crosshair & concentric arcs */}
        <circle cx="800" cy="460" r="180" className="tech-line tech-line--arc" />
        <circle cx="800" cy="460" r="260" className="tech-line tech-line--arc-outer" />
        <line x1="770" y1="460" x2="830" y2="460" className="tech-line tech-line--accent" />
        <line x1="800" y1="430" x2="800" y2="490" className="tech-line tech-line--accent" />

        {/* Dimension Lines */}
        {/* Width dimension: 24.000m */}
        <line x1="420" y1="840" x2="1180" y2="840" className="tech-dim" />
        <line x1="410" y1="832" x2="430" y2="848" className="tech-dim-tick" />
        <line x1="1170" y1="832" x2="1190" y2="848" className="tech-dim-tick" />
        <line x1="420" y1="780" x2="420" y2="860" className="tech-line tech-line--thinner" />
        <line x1="1180" y1="780" x2="1180" y2="860" className="tech-line tech-line--thinner" />
        <text x="800" y="832" className="tech-dim-label" textAnchor="middle">
          OVERALL BREADTH · 24 000 mm
        </text>

        {/* Vertical dimension: 11.200m */}
        <line x1="1380" y1="240" x2="1380" y2="720" className="tech-dim" />
        <line x1="1372" y1="232" x2="1388" y2="248" className="tech-dim-tick" />
        <line x1="1372" y1="712" x2="1388" y2="728" className="tech-dim-tick" />
        <line x1="1320" y1="240" x2="1420" y2="240" className="tech-line tech-line--thinner" />
        <line x1="1320" y1="720" x2="1420" y2="720" className="tech-line tech-line--thinner" />
        <text
          x="1405"
          y="485"
          className="tech-dim-label"
          textAnchor="middle"
          transform="rotate(90, 1405, 485)"
        >
          TOTAL HEIGHT · 11 200 mm
        </text>

        {/* Architectural Callouts */}
        {/* Callout 01: Roof slab */}
        <g className="tech-callout">
          <circle cx="680" cy="210" r="3" fill="#A9825D" />
          <polyline points="680,210 610,180 430,180" className="tech-leader" />
          <text x="420" y="174" className="tech-callout-code">01 / ROOF</text>
          <text x="420" y="190" className="tech-callout-desc">
            POST-TENSIONED RC SLAB · D=220mm WITH OAK SOFFIT
          </text>
        </g>

        {/* Callout 02: Louver Fins */}
        <g className="tech-callout">
          <circle cx="940" cy="330" r="3" fill="#A9825D" />
          <polyline points="940,330 1020,310 1220,310" className="tech-leader" />
          <text x="1230" y="304" className="tech-callout-code">02 / ENVELOPE</text>
          <text x="1230" y="320" className="tech-callout-desc">
            BRUSHED BRONZE SOLAR LOUVER SYSTEM · 60x120mm
          </text>
        </g>

        {/* Callout 03: Glazing */}
        <g className="tech-callout">
          <circle cx="640" cy="510" r="3" fill="#A9825D" />
          <polyline points="640,510 540,530 360,530" className="tech-leader" />
          <text x="350" y="524" className="tech-callout-code">03 / GLAZING</text>
          <text x="350" y="540" className="tech-callout-desc">
            LOW-E ACOUSTIC DOUBLE GLAZED UNITS (U=1.1 W/m²K)
          </text>
        </g>

        {/* Callout 04: Columns */}
        <g className="tech-callout">
          <circle cx="960" cy="560" r="3" fill="#A9825D" />
          <polyline points="960,560 1040,580 1240,580" className="tech-leader" />
          <text x="1250" y="574" className="tech-callout-code">04 / STRUCTURE</text>
          <text x="1250" y="590" className="tech-callout-desc">
            CAST-IN-SITU REINFORCED CONCRETE COLUMNS 350x350
          </text>
        </g>

        {/* Callout 05: Foundation Plinth */}
        <g className="tech-callout">
          <circle cx="740" cy="740" r="3" fill="#A9825D" />
          <polyline points="740,740 680,780 500,780" className="tech-leader" />
          <text x="490" y="774" className="tech-callout-code">05 / PODIUM</text>
          <text x="490" y="790" className="tech-callout-desc">
            HONED NATURAL TRAVERTINE PLINTH & WATER REFLECTOR
          </text>
        </g>

        {/* Title block at bottom right */}
        <g transform="translate(1040, 770)">
          <rect
            x="0"
            y="0"
            width="440"
            height="115"
            fill="rgba(33, 31, 29, 0.88)"
            stroke="rgba(169, 130, 93, 0.45)"
            strokeWidth="0.9"
          />
          <line x1="0" y1="38" x2="440" y2="38" stroke="rgba(169, 130, 93, 0.25)" strokeWidth="0.8" />
          <line x1="220" y1="38" x2="220" y2="115" stroke="rgba(169, 130, 93, 0.25)" strokeWidth="0.8" />
          <line x1="0" y1="76" x2="220" y2="76" stroke="rgba(169, 130, 93, 0.25)" strokeWidth="0.8" />

          {/* Title block text */}
          <text x="16" y="24" className="tech-tb-main">MLAND PROPERTIES</text>
          <text x="424" y="24" className="tech-tb-sub" textAnchor="end">STUDIO ARCHIVE</text>

          <text x="16" y="55" className="tech-tb-label">DRAWING</text>
          <text x="16" y="68" className="tech-tb-val">EXPLODED AXONOMETRIC</text>

          <text x="16" y="93" className="tech-tb-label">PROJECT REF</text>
          <text x="16" y="106" className="tech-tb-val">MP-2024 / RESIDENCE</text>

          <text x="236" y="55" className="tech-tb-label">SCALE & PROJECTION</text>
          <text x="236" y="68" className="tech-tb-val">1:100 @ A1 · ISOMETRIC</text>

          <text x="236" y="93" className="tech-tb-label">DISCIPLINE</text>
          <text x="236" y="106" className="tech-tb-val">INTEGRATED ARCH & STRUCT</text>
        </g>

        {/* North Arrow icon at top right */}
        <g transform="translate(1480, 105)">
          <circle cx="0" cy="0" r="18" fill="none" stroke="rgba(247, 243, 237, 0.3)" strokeWidth="0.8" />
          <polygon points="0,-14 4,-2 0,0 -4,-2" fill="#A9825D" />
          <polygon points="0,0 4,2 0,14 -4,2" fill="none" stroke="rgba(247, 243, 237, 0.4)" strokeWidth="0.6" />
          <text x="0" y="-18" className="tech-north-text" textAnchor="middle">N</text>
        </g>
      </svg>
    </div>
  );
}
