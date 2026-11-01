import { useEffect } from 'react';
import { updatePageSeo, ROUTES_SEO } from '../../utils/seo';
import './NotFound.css';

interface NotFoundProps {
  onNavigateHome: () => void;
}

export default function NotFound({ onNavigateHome }: NotFoundProps) {
  useEffect(() => {
    updatePageSeo(ROUTES_SEO['/404']);
  }, []);

  return (
    <div className="not-found">
      <div className="not-found__container">
        <span className="section-label">STATUS 404 · SYSTEM EXCEPTION</span>
        <h1 className="not-found__title">Document Not Located</h1>
        <p className="not-found__desc">
          The architectural plan, project monograph, or route you requested cannot be found.
          It may have been relocated or updated in our studio index.
        </p>
        <div className="not-found__actions">
          <button
            type="button"
            className="not-found__btn"
            onClick={onNavigateHome}
          >
            RETURN TO STUDIO HOMEPAGE →
          </button>
        </div>
      </div>
    </div>
  );
}

