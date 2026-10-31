import { useEffect } from 'react';
import { updatePageSeo } from '../../utils/seo';

export default function Disclaimer() {
  useEffect(() => {
    updatePageSeo({
      title: 'Disclaimer | MLAND Properties',
      description:
        'Professional legal and architectural disclaimer for MLAND Properties. Clarifications on conceptual drawings, preliminary estimates, site walkthroughs, and statutory approvals in India.',
      canonicalPath: '/disclaimer',
      robots: 'index, follow',
    });
  }, []);

  return (
    <article className="legal-article">
      <header className="legal-article__header">
        <span className="section-label">PROFESSIONAL PRACTICE & ARCHITECTURAL NOTICE</span>
        <h1 className="legal-article__title">Professional Disclaimer</h1>
        <div className="legal-article__meta">
          <span>Effective Date: 1 November 2026</span>
          <span className="legal-article__meta-sep">•</span>
          <span>Last Updated: 1 November 2026</span>
          <span className="legal-article__meta-sep">•</span>
          <span>Applicable Law: Republic of India</span>
        </div>
      </header>

      <div className="legal-article__disclaimer-box">
        <strong>Important Advisory:</strong> The architectural renderings, 3D digital elevations, and descriptive narratives on this website represent the aesthetic philosophy, design language, and past portfolio of MLAND Properties. They do not constitute certified engineering blueprints or binding structural specifications until formalized in an executed client agreement.
      </div>

      <section id="section-1" className="legal-section">
        <h2>1. General Informational Nature</h2>
        <p>
          The information, visual representations, text, and illustrations presented on this website are published solely for general informational, educational, and creative presentation purposes.
        </p>
        <p>
          While <strong>MLAND Properties</strong> (affiliated with Kifli Private Limited) exercises diligence to maintain the accuracy and quality of published materials, we do not warrant that all descriptions, case studies, or timeline estimates are continuously exhaustive, complete, or updated to reflect ongoing regulatory amendments in real estate legislation.
        </p>
      </section>

      <section id="section-2" className="legal-section">
        <h2>2. Conceptual Nature of Drawings, Models & 3D Elevations</h2>
        <p>
          The architectural materials displayed on this website—including interactive Three.js 3D building models, technical elevation drawings, axonometric projections, floor plans, and digital renderings:
        </p>
        <ul>
          <li><strong>Conceptual Representations:</strong> Are artistic and conceptual interpretations intended to demonstrate design sensibility, spatial rhythm, and materials vocabulary.</li>
          <li><strong>Not Construction Working Drawings:</strong> Must not be used for actual site excavation, structural foundation casting, rebar fabrication, or civil construction without site-specific soil testing, certified structural engineering calculations, and stamped architectural working drawings.</li>
          <li><strong>Dimensions & Scales:</strong> Dimension tags, scale indicators, and area calculations on digital renderings are indicative approximations and are subject to physical site measurements and survey benchmarks.</li>
        </ul>
      </section>

      <section id="section-3" className="legal-section">
        <h2>3. Portfolio Photography & Artistic Variations</h2>
        <p>
          Photographs, walkthrough videos, and documentation of completed residences, villas, and commercial commissions represent actual historical projects. Prospective patrons should note that:
        </p>
        <ul>
          <li><strong>Site Specificity:</strong> Every parcel of land possesses unique solar orientation, slope contours, rainfall dynamics, soil bearing capacity, and neighborhood constraints that dictate customized architectural solutions.</li>
          <li><strong>Material Weathering:</strong> Natural stone, architectural concrete, lime plaster, travertine, and teakwood naturally develop unique patinas over time, influenced by Kerala&apos;s tropical monsoon climate and local exposure.</li>
          <li><strong>Styling & Decor:</strong> Loose furniture, curated artwork, landscaping maturity, and decorative luminaires depicted in portfolio photography may be personal selections of previous patrons and are not standard inclusions unless expressly contracted.</li>
        </ul>
      </section>

      <section id="section-4" className="legal-section">
        <h2>4. Preliminary Cost Bands & Estimates</h2>
        <p>
          Any construction cost bands, square-footage rate indicators, or schedule milestones shared during preliminary walk conversations or referenced on this Site:
        </p>
        <ul>
          <li>Are non-binding ballpark estimates designed solely to gauge project feasibility and scope.</li>
          <li>Do not constitute a firm, fixed-price quotation or binding Bill of Quantities (BOQ).</li>
          <li>Are subject to fluctuations in raw material commodity indices (such as TMT steel, cement, structural glass, and imported fittings), labor availability, and sub-surface geotechnical findings.</li>
          <li>Definitive project costs are exclusively established through detailed, mutually executed construction contracts with agreed-upon milestone schedules.</li>
        </ul>
      </section>

      <section id="section-5" className="legal-section">
        <h2>5. Statutory Approvals & Municipal Sanctions</h2>
        <p>
          No real estate development or building construction depicted or discussed on this website can commence without obtaining requisite statutory sanctions and clearances from local governing authorities.
        </p>
        <ul>
          <li><strong>Statutory Permits:</strong> Compliance with the Kerala Municipality Building Rules (KMBR) / Kerala Panchayat Building Rules (KPBR), Town Planning Schemes, Fire & Safety NOCs, and environmental regulations is mandatory for all projects.</li>
          <li><strong>Client Responsibility:</strong> Unless turnkey statutory liaison services are specifically incorporated into a formal written engagement, the acquisition of clean land titles, possession certificates, and municipal clearances remains the legal responsibility of the property owner.</li>
        </ul>
      </section>

      <section id="section-6" className="legal-section">
        <h2>6. Requirement for Professional Consultation</h2>
        <p>
          Nothing contained on this website constitutes professional legal, financial, architectural, or structural engineering advice.
        </p>
        <p>
          Before undertaking land acquisition, demolition, excavation, or capital expenditure, you must consult directly with our studio principals or your own licensed structural engineers and legal advisors for site-specific evaluations.
        </p>
      </section>

      <section id="section-7" className="legal-section">
        <h2>7. Limitation of Legal Liability</h2>
        <p>
          To the maximum extent permissible under applicable Indian law:
        </p>
        <ul>
          <li>MLAND Properties, its directors, principals, architects, and technical staff shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to, reliance upon, or use of any material, render, or narrative published on this Site.</li>
          <li>This disclaimer does not attempt to exclude or restrict liability for fraud, willful misconduct, gross negligence, or any other liability that cannot be lawfully excluded under the laws of the Republic of India.</li>
        </ul>
      </section>

      <section id="section-8" className="legal-section">
        <h2>8. Contact for Technical Clarifications</h2>
        <p>
          If you have questions regarding the technical elevations, site feasibility inquiries, or portfolio projects featured on this website, please contact our studio:
        </p>
        <div className="legal-contact-box">
          <p><strong>MLAND Properties / Kifli Private Limited</strong></p>
          <p>Muttom, Aluva, Ernakulam District, Kerala — PIN 683106, India</p>
          <p>Email: <a href="mailto:kifliprivatelimited@gmail.com?subject=Technical%20Disclaimer%20Inquiry">kifliprivatelimited@gmail.com</a></p>
          <p>Phone: <a href="tel:+918590999415">+91 8590999415</a></p>
        </div>
      </section>
    </article>
  );
}

