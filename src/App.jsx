import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Designer from './components/Designer';
import GlobalHeader from './components/GlobalHeader';
import { VinylPlayer } from './components/VinylPlayer';
import { ActionCursor } from './components/ActionCursor';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { MusicProvider } from './context/MusicContext';

function AppContent() {
  const { isDark } = useTheme();

  // Initialize smooth momentum scrolling throughout the entire website via Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
      infinite: false,
    });

    window.__lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.__lenis;
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
          <Route path="/designer" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Interactive Vinyl Music Disc Player */}
      <VinylPlayer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <MusicProvider>
          <AppContent />
        </MusicProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;