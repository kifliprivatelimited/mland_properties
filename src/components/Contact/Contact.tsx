import { useState, useCallback, type FormEvent } from 'react';
import './Contact.css';

interface FormData {
  name: string;
  email: string;
  location: string;
  scope: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  location?: string;
  scope?: string;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    location: '',
    scope: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name.';
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.location.trim()) newErrors.location = 'Please enter the project location.';
    if (!formData.scope.trim()) newErrors.scope = 'Please tell us about the project.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            project_location: formData.location.trim(),
            scope: formData.scope.trim(),
            submitted_at: new Date().toISOString(),
          }),
        });
        if (!response.ok) throw new Error('Submission failed');
        setStatus('success');
        setFormData({ name: '', email: '', location: '', scope: '' });
      } catch {
        setStatus('error');
      }
    } else {
      // No Supabase configured — simulate for frontend demo
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.warn('Supabase not configured. Form data logged locally:', formData);
      setStatus('success');
      setFormData({ name: '', email: '', location: '', scope: '' });
    }
  }, [formData, validate]);

  return (
    <section id="contact" className="contact">
      <div className="page-container">
        <div className="contact__grid">
          {/* Left — Info */}
          <div className="contact__info">
            <span className="section-label">START A PROJECT</span>
            <h2 className="section-heading">
              Tell us about<br />
              the site.
            </h2>
            <p className="contact__desc">
              Every commission begins with a conversation and a walk. Share a few details
              and a principal from the studio will reply within two working days.
            </p>

            <div className="contact__details">
              <div className="contact__detail-block">
                <span className="contact__detail-name">MLAND PROPERTIES</span>
                <span className="contact__detail-sub">Architecture & Construction</span>
              </div>

              <div className="contact__detail-block">
                <span className="contact__detail-val">Karaköy Yard 14, Istanbul</span>
              </div>

              <div className="contact__detail-block">
                <a href="mailto:kifliprivatelimited@gmail.com" className="contact__detail-link">
                  kifliprivatelimited@gmail.com
                </a>
              </div>

              <div className="contact__detail-block">
                <a href="tel:+918590999415" className="contact__detail-link">
                  +91 8590999415
                </a>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="contact__form-panel">
            {status === 'success' ? (
              <div className="contact__success">
                <div className="contact__success-mark">✓</div>
                <h3 className="contact__success-title">Message received.</h3>
                <p className="contact__success-text">
                  A principal from the studio will reply within two working days.
                </p>
                <button
                  className="contact__again-btn"
                  onClick={() => setStatus('idle')}
                  type="button"
                >
                  SEND ANOTHER
                </button>
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit} noValidate>
                <div className="contact__field">
                  <label htmlFor="contact-name" className="contact__label">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    className={`contact__input ${errors.name ? 'contact__input--error' : ''}`}
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                  {errors.name && <span className="contact__error" role="alert">{errors.name}</span>}
                </div>

                <div className="contact__field">
                  <label htmlFor="contact-email" className="contact__label">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    className={`contact__input ${errors.email ? 'contact__input--error' : ''}`}
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                  {errors.email && <span className="contact__error" role="alert">{errors.email}</span>}
                </div>

                <div className="contact__field">
                  <label htmlFor="contact-location" className="contact__label">Location of the project</label>
                  <input
                    id="contact-location"
                    type="text"
                    className={`contact__input ${errors.location ? 'contact__input--error' : ''}`}
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="City, region or address"
                  />
                  {errors.location && <span className="contact__error" role="alert">{errors.location}</span>}
                </div>

                <div className="contact__field">
                  <label htmlFor="contact-scope" className="contact__label">Scope & ambitions</label>
                  <textarea
                    id="contact-scope"
                    className={`contact__textarea ${errors.scope ? 'contact__input--error' : ''}`}
                    value={formData.scope}
                    onChange={(e) => handleChange('scope', e.target.value)}
                    placeholder="Brief description of the project, scale and aspirations"
                    rows={5}
                  />
                  {errors.scope && <span className="contact__error" role="alert">{errors.scope}</span>}
                </div>

                {status === 'error' && (
                  <div className="contact__form-error" role="alert">
                    Something went wrong. Please try again or email us directly.
                  </div>
                )}

                <button
                  type="submit"
                  className="contact__submit"
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? (
                    <span className="contact__submit-loading">SENDING…</span>
                  ) : (
                    'SEND ENQUIRY'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
