import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

export function mountPortfolio(container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
