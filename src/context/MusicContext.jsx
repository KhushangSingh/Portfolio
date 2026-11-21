import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Helper to detect if user has scrolled past the hero section
  const checkIsPastHero = () => {
    if (typeof window === 'undefined') return false;

    const heroEl = document.getElementById('hero-page');
    if (heroEl) {
      const rect = heroEl.getBoundingClientRect();
      return rect.bottom <= 120;
    }

    return window.scrollY > 300;
  };

  // Track scroll position relative to the hero section
  const [isPastHero, setIsPastHero] = useState(() => checkIsPastHero());

  // Start as closed/tucked so it can smoothly slide out on mount
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  // Track when player has completely finished its exit animation and is fully removed/hidden
  const [isPlayerFullyHidden, setIsPlayerFullyHidden] = useState(() => checkIsPastHero());

  // Registered controls from the physical turntable
  const playerControlsRef = useRef({
    play: () => {},
    pause: () => {},
    toggle: () => {},
  });

  const registerPlayerControls = (controls) => {
    playerControlsRef.current = controls;
  };

  const handleHeaderPlayClick = () => {
    // Toggle playback on the physical turntable
    if (playerControlsRef.current?.toggle) {
      playerControlsRef.current.toggle();
    }
  };

  // Scroll listener to detect when user scrolls past or returns to the hero section (RAF throttled)
  useEffect(() => {
    let ticking = false;
    const checkPast = () => {
      const past = checkIsPastHero();
      setIsPastHero(past);
      if (!past) {
        setIsPlayerFullyHidden(false);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(checkPast);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    checkPast();

    // Re-verify after initial paint and browser scroll restoration
    const t1 = setTimeout(checkPast, 40);
    const t2 = setTimeout(checkPast, 150);
    const t3 = setTimeout(checkPast, 350);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <MusicContext.Provider value={{
      isPlaying,
      setIsPlaying,
      isPlayerOpen,
      setIsPlayerOpen,
      isPastHero,
      setIsPastHero,
      isPlayerFullyHidden,
      setIsPlayerFullyHidden,
      handleHeaderPlayClick,
      registerPlayerControls
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    return {
      isPlaying: false,
      setIsPlaying: () => {},
      isPlayerOpen: false,
      setIsPlayerOpen: () => {},
      isPastHero: false,
      setIsPastHero: () => {},
      isPlayerFullyHidden: false,
      setIsPlayerFullyHidden: () => {},
      handleHeaderPlayClick: () => {},
      registerPlayerControls: () => {}
    };
  }
  return context;
};

