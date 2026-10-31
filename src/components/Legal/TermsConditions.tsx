import { useEffect } from 'react';
import { updatePageSeo } from '../../utils/seo';

export default function TermsConditions() {
  useEffect(() => {
    updatePageSeo({
      title: 'Terms & Conditions | MLAND Properties',
      description:
        'Terms & Conditions governing the use of the MLAND Properties website and preliminary architectural, construction, and interior design communications.',
      canonicalPath: '/terms-and-conditions',
      robots: 'index, follow',
    });
  }, []);

  return (
    <article className="legal-article">
      <header className="legal-article__header">
        <span className="section-label">LEGAL CONTRACT & STUDIO PROTOCOL</span>
        <h1 className="legal-article__title">Terms & Conditions</h1>
        <div className="legal-article__meta">
          <span>Effective Date: 1 November 2026</span>
          <span className="legal-article__meta-sep">•</span>
          <span>Last Updated: 1 November 2026</span>
          <span className="legal-article__meta-sep">•</span>
          <span>Jurisdiction: Ernakulam, Kerala, India</span>
        </div>
      </header>

      <div className="legal-article__disclaimer-box">
        <strong>Statutory Notice:</strong> These Terms & Conditions govern your access to and use of the MLAND Properties digital presence. Formal architectural commissions, construction contracts, and turnkey development agreements require an independent, mutually signed written contract and are not established merely through website navigation or initial enquiry submission.
      </div>

      <section id="section-1" className="legal-section">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or browsing the website of <strong>MLAND Properties</strong> (accessible at this domain, hereinafter referred to as the &ldquo;Site&rdquo;), you acknowledge that you have read, understood, and agreed to be bound by these Terms & Conditions (&ldquo;Terms&rdquo;) and our companion <a href="/privacy-policy">Privacy Policy</a>.
        </p>
        <p>
          If you do not agree with any portion of these Terms, you must discontinue your use of this Site immediately. These Terms constitute an electronic record in terms of the Information Technology Act, 2000, and the rules framed thereunder.
        </p>
      </section>

      <section id="section-2" className="legal-section">
        <h2>2. About the Studio & Core Practice</h2>
        <p>
          MLAND Properties is an architectural and construction practice operating from Muttom, Aluva, Ernakulam, Kerala (affiliated with and operated under Kifli Private Limited). Our multidisciplinary studio offers:
        </p>
        <ul>
          <li><strong>Architectural Masterplanning & Concept Design:</strong> Custom spatial layouts, contextual masterplans, residential villas, and commercial spaces.</li>
          <li><strong>Structural & Technical Engineering:</strong> Engineering documentation, technical elevations, and structural detailing.</li>
          <li><strong>Construction & Site Execution:</strong> Turnkey civil construction, materials curation, and on-site project management.</li>
          <li><strong>Interior Architecture:</strong> Bespoke interior finishes, joinery detailing, and tactile materials integration.</li>
          <li><strong>Site Walkthroughs & Assessments:</strong> Preliminary topography walks and feasibility reviews for prospective patrons.</li>
        </ul>
      </section>

      <section id="section-3" className="legal-section">
        <h2>3. Use of the Website</h2>
        <p>
          You agree to utilize this Site solely for legitimate informational purposes, exploring studio capabilities, and submitting authentic project enquiries. You agree not to:
        </p>
        <ul>
          <li>Use the Site in any manner that impairs, overburdens, or compromises the availability or integrity of studio web servers.</li>
          <li>Deploy automated scrapers, web spiders, bots, or data extraction scripts to scrape studio portfolio imagery, elevations, or text without express written consent.</li>
          <li>Introduce malicious code, viruses, or disruptive scripts designed to circumvent authentication barriers or Row-Level Security protections.</li>
          <li>Submit false, fraudulent, or defamatory communications through the contact and walk request interfaces.</li>
          <li>Misrepresent your identity, affiliation, or authority to commission works on a given land parcel or property site.</li>
        </ul>
      </section>

      <section id="section-4" className="legal-section">
        <h2>4. Intellectual Property & Portfolio Copyright</h2>
        <p>
          All intellectual property rights in and to this Site and its contents—including but not limited to architectural drawings, 3D interactive models, computer-generated visual elevations, construction sketches, technical diagrams, photography, video assets, brand typography, and editorial text—are the exclusive property of MLAND Properties / Kifli Private Limited or are published under valid license.
        </p>
        <ul>
          <li><strong>Architectural Works:</strong> Original designs, floor plans, facade drawings, and spatial concepts are protected under the <em>Indian Copyright Act, 1957</em>.</li>
          <li><strong>Restricted Use:</strong> You are granted a limited, non-exclusive, non-transferable, revocable license to view Site content on your personal device. You may not copy, reproduce, republish, distribute, broadcast, or adapt any architectural design or technical drawing without prior written authorization from a studio principal.</li>
          <li><strong>Photographic Credits:</strong> Project photographs document completed or in-progress projects. Actual site topography, lighting conditions, and materials weathering will naturally vary based on environmental and structural contexts.</li>
        </ul>
      </section>

      <section id="section-5" className="legal-section">
        <h2>5. Enquiries, Site Walks & Non-Binding Communications</h2>
        <p>
          Every potential architectural commission begins with a walk and a conversation. However, you explicitly acknowledge and agree that:
        </p>
        <ul>
          <li><strong>No Client Relationship Created:</strong> Transmitting an enquiry through the &ldquo;Start a Project&rdquo; form or corresponding via email does not constitute a retainer agreement or formal architect-client relationship.</li>
          <li><strong>Preliminary Nature:</strong> Any verbal discussions, email replies, preliminary sketches, or site visit feedback are purely advisory and exploratory until a formal Architectural & Construction Agreement is duly executed.</li>
          <li><strong>Studio Discretion:</strong> MLAND Properties reserves the absolute discretion to accept or decline any commission based on studio bandwidth, design alignment, site viability, or commercial feasibility.</li>
        </ul>
      </section>

      <section id="section-6" className="legal-section">
        <h2>6. Indicative Estimates & Quotations</h2>
        <p>
          Any financial figures, preliminary cost bands, construction timelines, or milestone projections mentioned casually or displayed as illustrative guides are strictly indicative.
        </p>
        <ul>
          <li><strong>Binding Pricing:</strong> Definitive construction pricing, bills of quantities (BOQ), material specifications, labor schedules, and escalation clauses are governed strictly by formal, stamped contractual agreements.</li>
          <li><strong>External Market Fluctuations:</strong> Construction material costs (steel, cement, timber, stone, imported glass) and regulatory statutory fees (Panchayat/Municipality building permit fees, KSEB power connection fees) are subject to external market changes and statutory revisions.</li>
        </ul>
      </section>

      <section id="section-7" className="legal-section">
        <h2>7. Statutory Approvals & Site Feasibility</h2>
        <p>
          All real estate development and architectural execution in India is governed by local municipal bylaws (such as the Kerala Municipality Building Rules / Kerala Panchayat Building Rules, Coastal Regulation Zone notifications, and environmental clearances).
        </p>
        <p>
          The feasibility of any project referenced on this Site is contingent upon verified site land titles, soil testing, statutory set-back compliance, and formal sanctions from authorized government bodies.
        </p>
      </section>

      <section id="section-8" className="legal-section">
        <h2>8. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by applicable Indian law (including the Indian Contract Act, 1872, and the Consumer Protection Act, 2019):
        </p>
        <ul>
          <li>This Site and its contents are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, either express or implied.</li>
          <li>MLAND Properties shall not be liable for any indirect, incidental, punitive, consequential, or special damages arising out of your reliance upon any conceptual illustration, digital model, or text published on this Site.</li>
          <li>We do not guarantee uninterrupted, error-free, or virus-free operation of the website, though reasonable security safeguards are consistently enforced.</li>
          <li>Nothing in these Terms shall limit or exclude any liability that cannot be excluded or limited under mandatory Indian statutory provisions.</li>
        </ul>
      </section>

      <section id="section-9" className="legal-section">
        <h2>9. Governing Law & Dispute Resolution</h2>
        <p>
          These Terms shall be governed by, interpreted, and construed in accordance with the substantive laws of the Republic of India.
        </p>
        <p>
          Any legal action, suit, or dispute arising out of or relating to these Terms, website access, or preliminary studio communications shall be subject to the exclusive jurisdiction of the competent courts located in <strong>Ernakulam / Kochi, Kerala, India</strong>.
        </p>
      </section>

      <section id="section-10" className="legal-section">
        <h2>10. Contact Information</h2>
        <p>
          If you have any questions, clarifications, or formal inquiries regarding these Terms & Conditions, please contact our studio:
        </p>
        <div className="legal-contact-box">
          <p><strong>MLAND Properties / Kifli Private Limited</strong></p>
          <p>Muttom, Aluva, Ernakulam District, Kerala — PIN 683106, India</p>
          <p>Email: <a href="mailto:kifliprivatelimited@gmail.com?subject=Terms%20Clarification%20-%20MLAND%20Properties">kifliprivatelimited@gmail.com</a></p>
          <p>Studio Telephone: <a href="tel:+918590999415">+91 8590999415</a></p>
          <p className="legal-contact-box__sub">Working Hours: Monday &ndash; Saturday, 09:30 AM &ndash; 06:00 PM IST</p>
        </div>
      </section>
    </article>
  );
}

