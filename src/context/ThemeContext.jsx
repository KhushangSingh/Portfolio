import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio-theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    return 'dark';
  });

  const themeRef = useRef(theme);
  const activeTransitionRef = useRef(null);

  // Broken bulb / blown fuse state (10s cooldown)
  const [isBulbBroken, setIsBulbBroken] = useState(false);
  const [bulbRepairCountdown, setBulbRepairCountdown] = useState(0);
  const isBulbBrokenRef = useRef(false);
  const brokenUntilRef = useRef(0);
  const repairIntervalRef = useRef(null);

  // Check whether the bulb is actively broken right now based on timestamp
  const isCurrentlyBroken = () => {
    if (Date.now() < brokenUntilRef.current) {
      return true;
    }
    if (isBulbBrokenRef.current) {
      isBulbBrokenRef.current = false;
      setIsBulbBroken(false);
      setBulbRepairCountdown(0);
    }
    return false;
  };

  useEffect(() => {
    isBulbBrokenRef.current = isBulbBroken;
  }, [isBulbBroken]);

  const breakBulb = () => {
    const brokenUntil = Date.now() + 10000;
    brokenUntilRef.current = brokenUntil;
    isBulbBrokenRef.current = true;
    setIsBulbBroken(true);
    setBulbRepairCountdown(10);

    // Cancel any active transitions immediately
    if (activeTransitionRef.current) {
      try { activeTransitionRef.current.skipTransition(); } catch (e) {}
      activeTransitionRef.current = null;
    }

    // Instantly force to dark mode (the light has blown out!)
    // Keep it dark theme if the bulb breaks, no matter whether it was light or dark before
    themeRef.current = 'dark';
    setTheme('dark');
    const root = document.documentElement;
    root.classList.remove('is-theme-transitioning');
    root.classList.remove('light');
    root.classList.add('dark');
    try {
      localStorage.setItem('portfolio-theme', 'dark');
    } catch (e) {}

    // Start 10-second repair countdown
    if (repairIntervalRef.current) clearInterval(repairIntervalRef.current);
    repairIntervalRef.current = setInterval(() => {
      const remainingMs = brokenUntilRef.current - Date.now();
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
      setBulbRepairCountdown(remainingSec);
      if (remainingSec <= 0) {
        clearInterval(repairIntervalRef.current);
        repairIntervalRef.current = null;
        isBulbBrokenRef.current = false;
        setIsBulbBroken(false);
        setBulbRepairCountdown(0);
      }
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (repairIntervalRef.current) clearInterval(repairIntervalRef.current);
    };
  }, []);

  // Synchronize <html> root class & localStorage whenever theme or broken state changes
  useEffect(() => {
    const root = document.documentElement;
    const broken = isCurrentlyBroken();

    // IF BULB IS BROKEN, ENFORCE DARK THEME ALWAYS
    if (broken) {
      if (theme !== 'dark') {
        setTheme('dark');
      }
      themeRef.current = 'dark';
      root.classList.remove('is-theme-transitioning');
      root.classList.remove('light');
      root.classList.add('dark');
      try {
        localStorage.setItem('portfolio-theme', 'dark');
      } catch (e) {}
      return;
    }

    // Normal operation: cleanly apply theme ('light' or 'dark')
    themeRef.current = theme;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch (e) {}
  }, [theme, isBulbBroken]);

  const toggleTheme = (bulbPos = null) => {
    // Block theme toggling ONLY while the bulb is broken/repairing
    if (isCurrentlyBroken()) {
      return;
    }

    // Determine the next theme
    const currentTheme = themeRef.current;
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    themeRef.current = nextTheme;

    // Immediately cancel / skip any running transition
    if (activeTransitionRef.current) {
      try {
        activeTransitionRef.current.skipTransition();
      } catch (e) {}
      activeTransitionRef.current = null;
    }

    // Calculate position of the top-left bulb button for circular ripple effect
    let x = 115;
    let y = 46;
    if (bulbPos && typeof bulbPos.x === 'number') {
      x = bulbPos.x;
      y = bulbPos.y;
    } else if (typeof document !== 'undefined') {
      const bulbEl = document.getElementById('khushang-bulb-button') || document.querySelector('header button');
      if (bulbEl) {
        const r = bulbEl.getBoundingClientRect();
        x = r.left + r.width / 2;
        y = r.top + r.height / 2;
      }
    }

    const maxDist = typeof window !== 'undefined'
      ? Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
      : 2500;

    // Set CSS properties for CSS keyframes
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--bulb-x', `${Math.round(x)}px`);
      document.documentElement.style.setProperty('--bulb-y', `${Math.round(y)}px`);
      document.documentElement.style.setProperty('--bulb-radius', `${Math.ceil(maxDist * 1.08)}px`);
    }

    // Circular light wave transition expanding from top-left bulb to bottom-right corner in 1.4s
    if (typeof document !== 'undefined' && document.startViewTransition) {
      document.documentElement.classList.add('is-theme-transitioning');
      
      const transition = document.startViewTransition(() => {
        // If the bulb broke right before/during this callback, abort to dark!
        if (isCurrentlyBroken()) {
          setTheme('dark');
          const root = document.documentElement;
          root.classList.remove('is-theme-transitioning');
          root.classList.remove('light');
          root.classList.add('dark');
          return;
        }
        setTheme(nextTheme);
        const root = document.documentElement;
        if (nextTheme === 'dark') {
          root.classList.add('dark');
          root.classList.remove('light');
        } else {
          root.classList.remove('dark');
          root.classList.add('light');
        }
      });
      activeTransitionRef.current = transition;

      transition.finished.finally(() => {
        if (activeTransitionRef.current === transition) activeTransitionRef.current = null;
        document.documentElement.classList.remove('is-theme-transitioning');
        if (isCurrentlyBroken()) {
          document.documentElement.classList.remove('light');
          document.documentElement.classList.add('dark');
        }
      });
    } else {
      if (isCurrentlyBroken()) {
        setTheme('dark');
      } else {
        setTheme(nextTheme);
        const root = document.documentElement;
        if (nextTheme === 'dark') {
          root.classList.add('dark');
          root.classList.remove('light');
        } else {
          root.classList.remove('dark');
          root.classList.add('light');
        }
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      isDark: theme === 'dark', 
      toggleTheme,
      isBulbBroken,
      bulbRepairCountdown,
      breakBulb
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return { 
      theme: 'dark', 
      isDark: true, 
      toggleTheme: () => {},
      isBulbBroken: false,
      bulbRepairCountdown: 0,
      breakBulb: () => {}
    };
  }
  return context;
};

