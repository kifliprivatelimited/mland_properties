import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import './styles/global.css';
import App from './App';

const container = document.getElementById('root')!;

if (container && container.hasChildNodes()) {
  hydrateRoot(
    container,
    <StrictMode>
      <App />
      <Analytics />
    </StrictMode>
  );
} else if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
      <Analytics />
    </StrictMode>
  );
}
