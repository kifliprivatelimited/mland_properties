import { useState, useEffect } from 'react';
import { updatePageSeo } from '../../utils/seo';
import { ShieldCheck, Sliders, CheckCircle } from 'lucide-react';
import StorageInspectorModal from './StorageInspectorModal';

export default function CookiePolicy() {
  const [inspectorOpen, setInspectorOpen] = useState(false);

  useEffect(() => {
    updatePageSeo({
      title: 'Cookie Policy | MLAND Properties',
      description:
        'Cookie Policy for MLAND Properties. Transparent disclosure regarding cookies, local storage, and technical web identifiers used on our architecture studio website.',
      canonicalPath: '/cookie-policy',
      robots: 'index, follow',
    });
  }, []);

  return (
    <article className="legal-article">
      <header className="legal-article__header">
        <span className="section-label">CLIENT DISCLOSURE & STORAGE TRANSPARENCY</span>
        <h1 className="legal-article__title">Cookie Policy</h1>
        <div className="legal-article__meta">
          <span>Effective Date: 1 November 2026</span>
          <span className="legal-article__meta-sep">•</span>
          <span>Last Updated: 1 November 2026</span>
          <span className="legal-article__meta-sep">•</span>
          <span>Status: Zero Non-Essential Tracking Active</span>
        </div>
      </header>

      <div className="legal-article__disclaimer-box">
        <strong>Privacy Commitment:</strong> MLAND Properties values the digital peace and privacy of our visitors. Our public website does not employ invasive advertising pixels, third-party marketing beacons, or cross-site tracking cookies. You may inspect or clear any browser storage data using the controls below.
      </div>

      {/* Interactive Tool Banner */}
      <div className="legal-callout-card">
        <div className="legal-callout-card__left">
          <ShieldCheck size={28} className="legal-callout-card__icon" />
          <div>
            <h3 className="legal-callout-card__title">On-Demand Browser Storage Inspector</h3>
            <p className="legal-callout-card__desc">
              Inspect all client-side storage keys and cookies presently held by your browser for the MLAND Properties domain.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn--primary"
          onClick={() => setInspectorOpen(true)}
        >
          <Sliders size={14} />
          Inspect Browser Storage
        </button>
      </div>

      <section id="section-1" className="legal-section">
        <h2>1. What Are Cookies and Local Storage?</h2>
        <p>
          Cookies are small text files placed on your computer or mobile device by websites that you visit. They are widely used to make websites function efficiently, retain login sessions, and prevent cyber security breaches.
        </p>
        <p>
          In modern web architectures, <strong>Local Storage</strong> (HTML5 localStorage) serves a similar purpose, allowing client web applications to safely store necessary session tokens or visual preference states locally on your device without transmitting them across unnecessary advertising networks.
        </p>
      </section>

      <section id="section-2" className="legal-section">
        <h2>2. Our Transparent Stance on Cookies</h2>
        <p>
          Unlike conventional commercial websites that embed third-party tracking scripts, MLAND Properties operates an architectural portfolio and enquiry platform. Our public website strictly adheres to data minimization:
        </p>
        <ul>
          <li><strong>No Advertising Cookies:</strong> We do not run Google Ads remarketing pixels, Meta Pixel (Facebook), LinkedIn Insight Tags, or TikTok pixels.</li>
          <li><strong>No Behavioral Profiling:</strong> We do not profile your web navigation habits or sell visitor audience segments.</li>
          <li><strong>No Misleading Consent Banners:</strong> Because our public site does not utilize non-essential tracking cookies, we deliberately do not interrupt your architectural reading experience with distracting, deceptive cookie banners.</li>
        </ul>
      </section>

      <section id="section-3" className="legal-section">
        <h2>3. Categories of Storage Employed</h2>
        <p>
          The only client storage technologies utilized across our digital infrastructure fall into strictly defined operational categories:
        </p>

        <div className="legal-table-wrap">
          <table className="legal-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>CATEGORY</th>
                <th style={{ width: '28%' }}>KEY / IDENTIFIER</th>
                <th>PURPOSE & EXPIRATION</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="admin-badge admin-badge--read">ESSENTIAL</span>
                </td>
                <td>
                  <code>mland_admin_session</code>
                  <br />
                  <small style={{ color: 'var(--color-text-secondary)' }}>(Local Storage)</small>
                </td>
                <td>
                  <strong>Studio Management Authentication:</strong> Strictly used by authenticated studio administrators when logging into the private management backend. It securely stores an encrypted JWT access token to authenticate database operations. <em>Not placed on public visitors&apos; devices unless an admin logs in.</em>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="admin-badge admin-badge--read">FUNCTIONAL</span>
                </td>
                <td>
                  <code>Session State</code>
                  <br />
                  <small style={{ color: 'var(--color-text-secondary)' }}>(In-Memory)</small>
                </td>
                <td>
                  <strong>Architectural 3D Scene & Loader State:</strong> In-memory React state used temporarily while browsing to coordinate smooth Three.js model transitions and Lenis smooth scrolling. Cleared automatically when closing the browser tab.
                </td>
              </tr>
              <tr>
                <td>
                  <span className="admin-badge admin-badge--archived">EXTERNAL CDN</span>
                </td>
                <td>
                  <code>Google Fonts CDN</code>
                  <br />
                  <small style={{ color: 'var(--color-text-secondary)' }}>(HTTP Cache)</small>
                </td>
                <td>
                  <strong>Typography Caching:</strong> Standard browser caching of Inter and JetBrains Mono font files to accelerate page load speed. Google does not place tracking cookies for font file delivery.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="section-4" className="legal-section">
        <h2>4. Third-Party Services</h2>
        <p>
          Our application interacts with the following technical infrastructure providers:
        </p>
        <ul>
          <li>
            <strong>Supabase Inc.:</strong> Used for our contact enquiry database and admin authentication backend. Operates via secure REST API calls over TLS with Row-Level Security.
          </li>
          <li>
            <strong>Google Fonts:</strong> Serves architectural editorial typography. No user authentication or tracking cookies are required or transmitted.
          </li>
        </ul>
      </section>

      <section id="section-5" className="legal-section">
        <h2>5. How to Manage and Disable Cookies in Your Browser</h2>
        <p>
          You have full authority to restrict, block, or delete cookies and local storage through your browser settings. As our public website does not rely on tracking cookies, disabling cookies will not affect your ability to view our architectural portfolio, models, and contact information.
        </p>
        <p>
          Instructions for managing cookies in widely used web browsers:
        </p>
        <ul>
          <li><strong>Google Chrome:</strong> Settings &rarr; Privacy and security &rarr; Third-party cookies.</li>
          <li><strong>Apple Safari:</strong> Settings &rarr; Safari &rarr; Privacy & Security &rarr; Block All Cookies.</li>
          <li><strong>Mozilla Firefox:</strong> Settings &rarr; Privacy & Security &rarr; Enhanced Tracking Protection.</li>
          <li><strong>Microsoft Edge:</strong> Settings &rarr; Cookies and site permissions &rarr; Manage and delete cookies and site data.</li>
        </ul>
      </section>

      <section id="section-6" className="legal-section">
        <h2>6. Policy Updates & Questions</h2>
        <p>
          If in the future our studio implements non-essential analytics or performance tracking, this policy will be revised proactively, and an appropriate, compliant opt-in consent mechanism will be introduced in adherence to Indian data regulations.
        </p>
        <div className="legal-contact-box">
          <p><strong>MLAND Properties / Kifli Private Limited</strong></p>
          <p>Muttom, Aluva, Ernakulam District, Kerala — PIN 683106, India</p>
          <p>Email: <a href="mailto:kifliprivatelimited@gmail.com?subject=Cookie%20Policy%20Inquiry%20-%20MLAND%20Properties">kifliprivatelimited@gmail.com</a></p>
          <p>Phone: <a href="tel:+918590999415">+91 8590999415</a></p>
        </div>
      </section>

      {/* Inspector Modal */}
      <StorageInspectorModal
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
      />
    </article>
  );
}

