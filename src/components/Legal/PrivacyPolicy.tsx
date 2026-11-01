import { useEffect } from 'react';
import { updatePageSeo, ROUTES_SEO } from '../../utils/seo';

export default function PrivacyPolicy() {
  useEffect(() => {
    updatePageSeo(ROUTES_SEO['/privacy-policy']);
  }, []);

  return (
    <article className="legal-article">
      <header className="legal-article__header">
        <span className="section-label">STATUTORY COMPLIANCE & DATA PROTECTION</span>
        <h1 className="legal-article__title">Privacy Policy</h1>
        <div className="legal-article__meta">
          <span>Effective Date: 1 November 2026</span>
          <span className="legal-article__meta-sep">•</span>
          <span>Last Updated: 1 November 2026</span>
          <span className="legal-article__meta-sep">•</span>
          <span>Jurisdiction: Ernakulam, Kerala, India</span>
        </div>
      </header>

      <div className="legal-article__disclaimer-box">
        <strong>Legal Review Notice:</strong> This document articulates the actual data handling and technical practices of MLAND Properties. It has been prepared in alignment with Indian law, including the Digital Personal Data Protection Act, 2023 (DPDP Act, 2023) and the Information Technology Act, 2000. It is an implementation draft subject to periodic statutory review by our designated Indian legal counsel.
      </div>

      <section id="section-1" className="legal-section">
        <h2>1. Introduction & Company Information</h2>
        <p>
          Welcome to <strong>MLAND Properties</strong> (&ldquo;Studio&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). We operate an architectural design, structural engineering, precision construction, and luxury interior design practice based in Muttom, Aluva, Ernakulam, Kerala, India.
        </p>
        <p>
          We are committed to maintaining the highest standard of discretion, transparency, and personal data protection. This Privacy Policy outlines our transparent data handling practices regarding information collected through our official website (the &ldquo;Site&rdquo;), our contact and site-walk request forms, and associated communications.
        </p>
        <div className="legal-info-card">
          <h4>Data Fiduciary / Studio Identity</h4>
          <ul>
            <li><strong>Studio Trade Name:</strong> MLAND Properties</li>
            <li><strong>Corporate Affiliation / Entity:</strong> Kifli Private Limited (registered under the Companies Act in India)</li>
            <li><strong>Studio Address:</strong> Muttom, Aluva, Ernakulam District, Kerala, India — PIN 683106</li>
            <li><strong>Official Contact Email:</strong> <a href="mailto:kifliprivatelimited@gmail.com">kifliprivatelimited@gmail.com</a></li>
            <li><strong>Studio Phone:</strong> <a href="tel:+918590999415">+91 8590999415</a></li>
          </ul>
        </div>
      </section>

      <section id="section-2" className="legal-section">
        <h2>2. Scope & Applicable Indian Legislation</h2>
        <p>
          This policy is formulated in compliance with applicable Indian data protection frameworks, including:
        </p>
        <ul>
          <li>The <strong>Digital Personal Data Protection Act, 2023 (DPDP Act, 2023)</strong>, along with its operative rules and transition provisions as notified by the Government of India.</li>
          <li>The <strong>Information Technology Act, 2000 (IT Act, 2000)</strong>, and the <em>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (SPDI Rules)</em>.</li>
          <li>Relevant electronic records and consumer protection regulations under the <strong>Consumer Protection Act, 2019</strong>.</li>
        </ul>
      </section>

      <section id="section-3" className="legal-section">
        <h2>3. Personal Information We Collect</h2>
        <p>
          We collect only the information reasonably necessary to evaluate prospective commissions, respond to inquiries, and schedule preliminary site walkthroughs. We do not engage in automated scraping, behavioral tracking, or clandestine data harvesting.
        </p>
        <h3>A. Information You Submit Directly</h3>
        <p>
          When you complete our online enquiry form, request a project consultation, or communicate with our studio via email or telephone, we collect:
        </p>
        <ul>
          <li><strong>Full Name:</strong> To address you personally and identify the project patron.</li>
          <li><strong>Email Address:</strong> To communicate studio replies, project briefs, and design documentation.</li>
          <li><strong>Location of the Project:</strong> City, region, or site address required to assess feasibility, local zoning, and geographical scope.</li>
          <li><strong>Scope & Ambitions Brief:</strong> Text description of the proposed development, scale, spatial requirements, and aesthetic goals.</li>
          <li><strong>Date and Timestamp:</strong> Technical record of when your inquiry was transmitted.</li>
        </ul>

        <h3>B. Technical and Transmission Data</h3>
        <p>
          When you browse the public website, standard web server communication protocols temporarily transmit non-identifying technical headers (such as IP address, browser type, device viewport dimensions, and HTTP referral headers). These logs are utilized strictly for network diagnostic reliability and system defense.
        </p>
      </section>

      <section id="section-4" className="legal-section">
        <h2>4. Purpose of Data Collection</h2>
        <p>
          The personal data collected is processed exclusively for legitimate business and professional objectives, specifically:
        </p>
        <ul>
          <li>Reviewing client briefs and determining architectural project suitability.</li>
          <li>Scheduling preliminary site visits and walks across Kerala and surrounding regions.</li>
          <li>Drafting tailored architectural fee proposals, project timelines, and technical schedules.</li>
          <li>Direct client correspondence with a studio principal regarding your commission.</li>
          <li>Maintaining statutory studio records, taxation documentation, and regulatory compliance.</li>
        </ul>
        <p>
          We <strong>never</strong> use your contact details for unsolicited marketing, third-party sales campaigns, or automated advertising blasts.
        </p>
      </section>

      <section id="section-5" className="legal-section">
        <h2>5. Storage, Processing & Security Safeguards</h2>
        <p>
          MLAND Properties takes data security seriously and implements technical and organizational safeguards appropriate for an architectural studio:
        </p>
        <ul>
          <li>
            <strong>Database Storage:</strong> Inquiries are persisted in an enterprise-grade cloud database infrastructure hosted by Supabase Inc. (utilizing encrypted PostgreSQL data storage).
          </li>
          <li>
            <strong>Row-Level Security (RLS):</strong> The database enforces Row-Level Security policies ensuring that anonymous website visitors cannot inspect, read, or tamper with client inquiries.
          </li>
          <li>
            <strong>Authenticated Admin Access:</strong> Client brief data is accessible only by authorized studio management via multi-factor authenticated sessions.
          </li>
          <li>
            <strong>Transport Encryption:</strong> All website traffic and API submissions are encrypted in transit using industry-standard Transport Layer Security (TLS 1.2 / TLS 1.3 over HTTPS).
          </li>
          <li>
            <strong>Internal Access Restrictions:</strong> Only studio principals directly involved in project evaluation and client relationship management have operational access to submitted briefs.
          </li>
        </ul>
      </section>

      <section id="section-6" className="legal-section">
        <h2>6. Third-Party Integrations & Infrastructure</h2>
        <p>
          Our technical stack employs limited third-party services necessary for site operation:
        </p>
        <ul>
          <li>
            <strong>Supabase Inc.:</strong> Cloud database and authentication infrastructure. Data is processed under strict confidentiality and infrastructure security standards.
          </li>
          <li>
            <strong>Google Fonts:</strong> Web typography (Inter and JetBrains Mono fonts) loaded to ensure architectural editorial rendering. No client-identifying cookies are stored through this font CDN.
          </li>
          <li>
            <strong>Web Hosting & CDN:</strong> The website application is served via high-performance cloud content delivery networks with edge SSL termination.
          </li>
        </ul>
        <p>
          We do <strong>not</strong> integrate Google Analytics, Meta Pixel, Hotjar, marketing cookies, or third-party behavioral trackers into our public pages.
        </p>
      </section>

      <section id="section-7" className="legal-section">
        <h2>7. Data Sharing & Disclosure</h2>
        <p>
          We do not sell, rent, trade, or commercially license your personal data to any third party under any circumstances. Information is disclosed only under the following strictly limited situations:
        </p>
        <ul>
          <li><strong>Professional Sub-consultants:</strong> Upon formal engagement, relevant project details (e.g. site location, soil survey requirements) may be shared with licensed structural engineers or surveyors with your explicit consent.</li>
          <li><strong>Legal & Regulatory Mandates:</strong> Where disclosure is strictly required by Indian law, a valid court summons, or regulatory authorities exercising lawful jurisdiction.</li>
          <li><strong>Protection of Rights:</strong> To defend studio intellectual property, enforce formal agreements, or prevent digital fraud.</li>
        </ul>
      </section>

      <section id="section-8" className="legal-section">
        <h2>8. Data Retention</h2>
        <p>
          Client inquiries and communication records are retained for as long as necessary to fulfill the inquiry evaluation, conduct ongoing architectural negotiations, and preserve studio archival records of prospective and commissioned works.
        </p>
        <p>
          If an enquiry does not materialize into a formal commission, you may request the deletion of your contact records at any time by contacting our Privacy Officer as outlined below.
        </p>
      </section>

      <section id="section-9" className="legal-section">
        <h2>9. Your Rights Under Indian Law (DPDP Act, 2023)</h2>
        <p>
          As a Data Principal under the Digital Personal Data Protection Act, 2023, you are entitled to exercise specific rights regarding your personal data processed by our studio:
        </p>
        <ul>
          <li><strong>Right to Access:</strong> You may request a summary of the personal data held about you by our studio.</li>
          <li><strong>Right to Correction & Updating:</strong> You may request correction or completion of inaccurate or outdated contact information.</li>
          <li><strong>Right to Erasure:</strong> You may request the deletion of your personal data where its retention is no longer necessary for the original inquiry purpose or statutory record-keeping.</li>
          <li><strong>Right to Grievance Redressal:</strong> You have the right to readily accessible grievance resolution directly with our designated officer.</li>
        </ul>
      </section>

      <section id="section-10" className="legal-section">
        <h2>10. Grievance Redressal & Contact Information</h2>
        <p>
          In accordance with the Information Technology Act, 2000, and the Digital Personal Data Protection Act, 2023, the details of our designated Grievance Officer are provided below:
        </p>
        <div className="legal-contact-box">
          <p><strong>Grievance & Data Privacy Officer</strong></p>
          <p>MLAND Properties / Kifli Private Limited</p>
          <p>Muttom, Aluva, Ernakulam District, Kerala — PIN 683106, India</p>
          <p>Email: <a href="mailto:kifliprivatelimited@gmail.com?subject=Privacy%20Grievance%20-%20MLAND%20Properties">kifliprivatelimited@gmail.com</a></p>
          <p>Phone: <a href="tel:+918590999415">+91 8590999415</a></p>
          <p className="legal-contact-box__sub">Response Time: We endeavor to address and resolve all legitimate privacy requests and grievances within 30 calendar days of receipt.</p>
        </div>
      </section>

      <section id="section-11" className="legal-section">
        <h2>11. Policy Modifications</h2>
        <p>
          We reserve the right to revise this Privacy Policy periodically to reflect updates in our architectural operations, technological infrastructure, or statutory notifications by the Indian Government. Any modifications will be posted to this URL with an updated &ldquo;Last Updated&rdquo; date. Continued interaction with our studio following such updates constitutes acknowledgment of the revised terms.
        </p>
      </section>
    </article>
  );
}

