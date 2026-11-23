import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Designer from './components/Designer';
import PortfolioSummary from './components/PortfolioSummary';
import GlobalHeader from './components/GlobalHeader';
import { ActionCursor } from './components/ActionCursor';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { MusicProvider } from './context/MusicContext';
import { LoadingProvider } from './context/LoadingContext';
import RubiksLoader from './components/RubiksLoader';
import { OTAKU_CIRCLE_CASE_STUDY } from './constants/otakuCircle';
import { logPageView } from './utils/visitorTracker';
import { Analytics } from '@vercel/analytics/react';

const OtakuCircleCaseStudy = lazy(() => import('./components/otakucircle/OtakuCircleCaseStudy'));
const Dashboard = lazy(() => import('./components/Dashboard'));

function AppContent() {
  const { isDark } = useTheme();
  const location = useLocation();

  // Log anonymous visitor pageview on route change
  useEffect(() => {
    logPageView(location.pathname);
  }, [location.pathname]);

  // Initialize smooth momentum scrolling throughout the entire website via Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.85, // Crisp & agile: neither sluggish nor heavy, glides effortlessly
      easing: (t) => 1 - Math.pow(1 - t, 3), // Smooth cubic ease-out: immediate acceleration, continuous liquid momentum, zero sudden breaks
      wheelMultiplier: 1.15, // Effortless glide: natural finger travel without requiring excessive scroll effort
      touchMultiplier: 1.0,
      smoothWheel: true,
      syncTouch: false, // Preserves 120Hz native hardware acceleration on touch devices
      autoRaf: true, // Lenis internal high-precision timestamp delta RAF loop
    });

    window.__lenis = lenis;

    return () => {
      delete window.__lenis;
      lenis.destroy();
    };
  }, []);

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 font-sans selection:bg-[#ff4d00] selection:text-white cursor-crosshair ${
      isDark ? 'bg-[#050505] text-white' : 'bg-[#F8F8F5] text-[#121212]'
    }`}>
      {/* Bespoke Social Platform Logo Cursor */}
      <ActionCursor />

      {/* Global Header with Lamp Pull Rope & Music Status */}
      <GlobalHeader />

      {/* Main Experience with Clean Routing */}
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Designer />} />
          <Route path="/summary" element={<PortfolioSummary />} />
          <Route path="/hq" element={(
            <Suspense fallback={<p className="sr-only" role="status">Opening studio HQ</p>}>
              <Dashboard />
            </Suspense>
          )} />
          <Route path="/headquarters" element={<Navigate to="/hq" replace />} />
          <Route path="/dashboard" element={<Navigate to="/hq" replace />} />
          <Route path="/analytics" element={<Navigate to="/hq" replace />} />
          <Route path="/inbox" element={<Navigate to="/hq" replace />} />
          <Route path="/contact" element={<Navigate to="/#contact" replace />} />
          <Route path={OTAKU_CIRCLE_CASE_STUDY} element={(
            <Suspense fallback={<p className="sr-only" role="status">Opening the OtakuCircle case study</p>}>
              <OtakuCircleCaseStudy />
            </Suspense>
          )} />
          <Route path="/overview" element={<Navigate to="/summary" replace />} />
          <Route path="/designer" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LoadingProvider>
          <MusicProvider>
            <RubiksLoader />
            <AppContent />
            <Analytics />
          </MusicProvider>
        </LoadingProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
