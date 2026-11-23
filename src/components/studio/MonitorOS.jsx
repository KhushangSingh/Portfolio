import React, { useState, useEffect, useRef } from 'react';
import BrandMark from '../BrandMark';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { playSoundEffect } from '../../utils/soundEffects';

export default function MonitorOS({ onCloseZone }) {
  const { isDark, toggleTheme } = useTheme();
  const [time, setTime] = useState('9:41 AM');
  const [dateStr, setDateStr] = useState('Tue Nov 23');
  const [isPoweringOff, setIsPoweringOff] = useState(false);

  // Window Stacking and Focus State
  const [windowOrder, setWindowOrder] = useState(['maps', 'safari', 'messages']);
  const [activeApp, setActiveApp] = useState('messages');
  const [openWindows, setOpenWindows] = useState({
    maps: true,
    safari: true,
    messages: true,
    vscode: false,
    spotify: false,
    figma: false,
  });
  const [minimizedWindows, setMinimizedWindows] = useState({
    maps: false,
    safari: false,
    messages: false,
    vscode: false,
    spotify: false,
    figma: false,
  });
  const [maximizedWindows, setMaximizedWindows] = useState({});

  // Control Center & System Flyouts
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isAppleMenuOpen, setIsAppleMenuOpen] = useState(false);
  const [isAboutMacOpen, setIsAboutMacOpen] = useState(false);

  // System Controls
  const [displayBrightness, setDisplayBrightness] = useState(100);
  const [soundVolume, setSoundVolume] = useState(82);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [airdropEnabled, setAirdropEnabled] = useState(true);
  const [focusModeEnabled, setFocusModeEnabled] = useState(false);

  // Messages App State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'recruiter',
      text: 'Hey Khushang, took a deep look through your portfolio and OtakuCircle case study.',
      time: '9:38 AM'
    },
    {
      id: 2,
      sender: 'recruiter',
      text: 'The spatial camera dive and bespoke spring physics feel remarkably tactile.',
      time: '9:39 AM'
    },
    {
      id: 3,
      sender: 'khushang',
      text: 'Thank you! Focused heavily on physical affordance and zero generic AI defaults.',
      time: '9:40 AM'
    },
    {
      id: 4,
      sender: 'recruiter',
      text: 'Love the attention to craft. Would you be open to chatting about product design and engineering roles?',
      time: '9:41 AM'
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const messagesEndRef = useRef(null);

  // Safari State
  const [safariUrl, setSafariUrl] = useState('khushang.design');
  const [safariActiveTab, setSafariActiveTab] = useState('favorites');

  // VS Code State
  const [codeFile, setCodeFile] = useState('Hero.jsx');

  // Spotify / Audio State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Broadcast monitor view lifecycle to parent layout
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('monitor-view-open'));
    return () => {
      window.dispatchEvent(new CustomEvent('monitor-view-close'));
    };
  }, []);

  // Update clock every 10 seconds
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
      const dayName = now.toLocaleDateString([], { weekday: 'short' });
      const monthName = now.toLocaleDateString([], { month: 'short' });
      const dayNum = now.getDate();
      setDateStr(`${dayName} ${monthName} ${dayNum}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // Scroll chat messages into view
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Power Off Handler
  const handlePowerOff = () => {
    playSoundEffect('close');
    setIsPoweringOff(true);
    window.dispatchEvent(new CustomEvent('monitor-view-close'));
    setTimeout(() => {
      if (onCloseZone) onCloseZone();
    }, 280);
  };

  // Keyboard shortcut: Escape powers off
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isAboutMacOpen) {
          setIsAboutMacOpen(false);
          return;
        }
        if (isControlCenterOpen) {
          setIsControlCenterOpen(false);
          return;
        }
        if (isAppleMenuOpen) {
          setIsAppleMenuOpen(false);
          return;
        }
        handlePowerOff();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAboutMacOpen, isControlCenterOpen, isAppleMenuOpen]);

  // Window Focus & Bring to Front
  const bringToFront = (id) => {
    setWindowOrder(prev => [...prev.filter(item => item !== id), id]);
    setActiveApp(id);
    if (minimizedWindows[id]) {
      setMinimizedWindows(prev => ({ ...prev, [id]: false }));
    }
    if (!openWindows[id]) {
      setOpenWindows(prev => ({ ...prev, [id]: true }));
    }
  };

  // Window Controls
  const handleCloseWindow = (id, e) => {
    e?.stopPropagation();
    playSoundEffect('close');
    setOpenWindows(prev => ({ ...prev, [id]: false }));
    const remaining = windowOrder.filter(item => item !== id && openWindows[item] && !minimizedWindows[item]);
    if (remaining.length > 0) {
      setActiveApp(remaining[remaining.length - 1]);
    } else {
      setActiveApp('finder');
    }
  };

  const handleMinimizeWindow = (id, e) => {
    e?.stopPropagation();
    playSoundEffect('select');
    setMinimizedWindows(prev => ({ ...prev, [id]: true }));
    const remaining = windowOrder.filter(item => item !== id && openWindows[item] && !minimizedWindows[item]);
    if (remaining.length > 0) {
      setActiveApp(remaining[remaining.length - 1]);
    } else {
      setActiveApp('finder');
    }
  };

  const handleMaximizeWindow = (id, e) => {
    e?.stopPropagation();
    playSoundEffect('open');
    setMaximizedWindows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Dock App Click Handler
  const handleDockClick = (id) => {
    playSoundEffect('open');
    if (!openWindows[id]) {
      setOpenWindows(prev => ({ ...prev, [id]: true }));
      setMinimizedWindows(prev => ({ ...prev, [id]: false }));
      bringToFront(id);
    } else if (minimizedWindows[id]) {
      setMinimizedWindows(prev => ({ ...prev, [id]: false }));
      bringToFront(id);
    } else if (activeApp === id) {
      setMinimizedWindows(prev => ({ ...prev, [id]: true }));
      const remaining = windowOrder.filter(item => item !== id && openWindows[item] && !minimizedWindows[item]);
      setActiveApp(remaining.length > 0 ? remaining[remaining.length - 1] : 'finder');
    } else {
      bringToFront(id);
    }
  };

  // Send iMessage Handler
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    playSoundEffect('confirm');

    const newMsg = {
      id: Date.now(),
      sender: 'khushang',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');

    // Simulated reciprocal response
    setTimeout(() => {
      let reply = "Sounds exciting! Let's connect on LinkedIn: linkedin.com/in/khushang-sharma";
      const lower = userText.toLowerCase();
      if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
        reply = "Hey! Great to connect with you. Which of Khushang's projects caught your eye first?";
      } else if (lower.includes('work') || lower.includes('hire') || lower.includes('role') || lower.includes('job')) {
        reply = "Khushang is open to senior product design and frontend engineering roles. Feel free to reach out directly via khushang.sharma@gmail.com";
      } else if (lower.includes('otakucircle') || lower.includes('anime') || lower.includes('manga')) {
        reply = "OtakuCircle has reached over 120,000 active readers with real-time vector reader mechanics and zero frame lag.";
      }
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'recruiter',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
        }
      ]);
      playSoundEffect('select');
    }, 700);
  };

  // Dock items definition
  const dockApps = [
    { id: 'finder', name: 'Finder', iconType: 'finder' },
    { id: 'safari', name: 'Safari', iconType: 'safari' },
    { id: 'messages', name: 'Messages', iconType: 'messages', badge: 1 },
    { id: 'maps', name: 'Maps', iconType: 'maps' },
    { id: 'figma', name: 'Figma', brand: 'figma' },
    { id: 'vscode', name: 'VS Code', brand: 'vscode' },
    { id: 'spotify', name: 'Spotify', brand: 'spotify' },
    { id: 'settings', name: 'System Settings', iconType: 'settings' },
    { id: 'trash', name: 'Trash', iconType: 'trash' },
  ];

  const appDisplayName = {
    finder: 'Finder',
    safari: 'Safari',
    messages: 'Messages',
    maps: 'Maps',
    figma: 'Figma',
    vscode: 'Code',
    spotify: 'Spotify',
    settings: 'Settings',
  }[activeApp] || 'Studio';

  return (
    <div 
      className="relative w-full h-full flex flex-col overflow-hidden select-none font-sans"
      style={{
        filter: `brightness(${displayBrightness}%)`
      }}
      onClick={() => {
        if (isAppleMenuOpen) setIsAppleMenuOpen(false);
        if (isControlCenterOpen) setIsControlCenterOpen(false);
      }}
    >
      {/* ==============================================================
          AUTHENTIC MACOS BIG SUR LAYERED DUNE WALLPAPER (VECTOR SVG)
          ============================================================== */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        {isDark ? (
          // Night Mode Wallpaper: Midnight Aurora & Indigo Slopes
          <svg className="w-full h-full object-cover" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" fill="none">
            <defs>
              <linearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#04060c" />
                <stop offset="40%" stopColor="#0c1122" />
                <stop offset="100%" stopColor="#171330" />
              </linearGradient>
              <linearGradient id="nightRidge1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#090d16" />
              </linearGradient>
              <linearGradient id="nightRidge2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2e1065" />
                <stop offset="50%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#080c14" />
              </linearGradient>
              <linearGradient id="nightRimOrange" x1="0%" y1="0%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#ff5e1a" />
                <stop offset="60%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#121319" />
              </linearGradient>
            </defs>
            <rect width="1920" height="1080" fill="url(#nightSky)" />
            {/* Distant Ridge */}
            <path d="M-100 480 Q 420 360 880 430 T 1940 380 L 1940 1100 L -100 1100 Z" fill="url(#nightRidge1)" opacity="0.8" />
            {/* Mid Mountain Sweep */}
            <path d="M-100 620 Q 360 480 840 560 T 1940 490 L 1940 1100 L -100 1100 Z" fill="url(#nightRidge2)" />
            {/* Glowing Orange Twilight Rim */}
            <path d="M-50 780 Q 480 580 1020 680 T 2020 620" stroke="url(#nightRimOrange)" strokeWidth="6" opacity="0.85" />
            {/* Foreground Obsidian Dune */}
            <path d="M-50 780 Q 480 580 1020 680 T 2020 620 L 2020 1100 L -50 1100 Z" fill="#090b10" />
          </svg>
        ) : (
          // Daylight Mode Wallpaper: Iconic Big Sur Golden Amber & Coral Waves
          <svg className="w-full h-full object-cover" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" fill="none">
            <defs>
              <linearGradient id="daySky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="35%" stopColor="#7dd3fc" />
                <stop offset="70%" stopColor="#fed7aa" />
                <stop offset="100%" stopColor="#fef08a" />
              </linearGradient>
              <linearGradient id="dayBlueRidge" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="dayCoralDune" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="50%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>
              <linearGradient id="dayAmberDune" x1="0%" y1="0%" x2="100%" y2="80%">
                <stop offset="0%" stopColor="#ff7a3d" />
                <stop offset="45%" stopColor="#ff5e1a" />
                <stop offset="100%" stopColor="#c2410c" />
              </linearGradient>
              <linearGradient id="dayGoldenFront" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="60%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <rect width="1920" height="1080" fill="url(#daySky)" />
            {/* Distant Cyan Ridge */}
            <path d="M-100 440 Q 400 320 920 400 T 1980 340 L 1980 1100 L -100 1100 Z" fill="url(#dayBlueRidge)" opacity="0.75" />
            {/* Coral Crimson Mid Ridge */}
            <path d="M-100 580 Q 380 440 880 540 T 1980 460 L 1980 1100 L -100 1100 Z" fill="url(#dayCoralDune)" opacity="0.9" />
            {/* Vibrant Plinth Amber Wave */}
            <path d="M-80 720 Q 460 520 1020 630 T 2020 560 L 2020 1100 L -80 1100 Z" fill="url(#dayAmberDune)" />
            {/* Golden Honey Dune */}
            <path d="M-50 860 Q 520 680 1100 790 T 2020 710 L 2020 1100 L -50 1100 Z" fill="url(#dayGoldenFront)" />
          </svg>
        )}
      </div>

      {/* ==============================================================
          TOP TRANSLUCENT MACOS MENU BAR
          ============================================================== */}
      <header className={`w-full h-7 sm:h-7.5 px-3 sm:px-4.5 flex items-center justify-between text-[11px] sm:text-[12px] font-sans backdrop-blur-2xl border-b z-50 shrink-0 select-none ${
        isDark 
          ? 'bg-black/40 border-white/10 text-white/90' 
          : 'bg-white/60 border-black/10 text-neutral-900'
      }`}>
        {/* Left Side: Apple Logo + Active App Name + System Menus */}
        <div className="flex items-center gap-3 sm:gap-4.5">
          {/* Apple Logo Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAppleMenuOpen(!isAppleMenuOpen);
                setIsControlCenterOpen(false);
              }}
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-pointer outline-none flex items-center"
              aria-label="Apple Menu"
            >
              <svg viewBox="0 0 170 170" className="w-3.5 h-3.5 fill-current">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.74-11.64-14.1-6.19-9.8-10.89-20.73-14.1-32.8-3.21-12.06-4.82-23.49-4.82-34.28 0-16.14 4.17-29.43 12.52-39.87 8.35-10.43 18.7-15.75 31.05-15.96 4.79 0 10.15 1.25 16.08 3.76 5.93 2.51 9.77 3.86 11.52 4.06 1.76-.2 5.7-1.55 11.83-4.06 6.13-2.51 11.41-3.71 15.86-3.6 13.91.54 24.87 5.75 32.87 15.64-12.4 7.51-18.49 17.84-18.28 31 0 11.32 4.39 21.1 13.17 29.35 4.13 3.91 8.87 6.8 14.22 8.68-2.61 7.73-5.76 15.24-9.47 22.52zM119.22 33.15c0-7.39 2.67-14.41 8.01-21.06 5.34-6.65 11.96-10.74 19.86-12.28.32 1.41.48 2.61.48 3.6 0 7.49-2.8 14.57-8.41 21.23-5.61 6.66-12.39 10.66-20.34 12-0.21-1.09-.32-2.26-.32-3.49z" />
              </svg>
            </button>

            {/* Apple Menu Flyout */}
            <AnimatePresence>
              {isAppleMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.12 }}
                  className={`absolute left-0 top-7 w-52 rounded-xl py-1.5 shadow-2xl border backdrop-blur-2xl z-50 text-[11px] ${
                    isDark ? 'bg-neutral-900/95 border-white/15 text-white' : 'bg-white/95 border-black/15 text-neutral-900'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      setIsAboutMacOpen(true);
                      setIsAppleMenuOpen(false);
                    }}
                    className="w-full px-3.5 py-1 text-left hover:bg-[#ff5e1a] hover:text-white transition-colors cursor-pointer"
                  >
                    About This Mac
                  </button>
                  <div className="h-px bg-black/10 dark:bg-white/10 my-1 mx-2" />
                  <button
                    onClick={() => {
                      setIsControlCenterOpen(true);
                      setIsAppleMenuOpen(false);
                    }}
                    className="w-full px-3.5 py-1 text-left hover:bg-[#ff5e1a] hover:text-white transition-colors cursor-pointer"
                  >
                    System Settings...
                  </button>
                  <button
                    onClick={() => {
                      toggleTheme();
                      setIsAppleMenuOpen(false);
                    }}
                    className="w-full px-3.5 py-1 text-left hover:bg-[#ff5e1a] hover:text-white transition-colors cursor-pointer"
                  >
                    Switch to {isDark ? 'Daylight' : 'Night'} Mode
                  </button>
                  <div className="h-px bg-black/10 dark:bg-white/10 my-1 mx-2" />
                  <button
                    onClick={handlePowerOff}
                    className="w-full px-3.5 py-1 text-left text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer font-medium"
                  >
                    Shut Down Monitor
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Active Application Name */}
          <span className="font-bold tracking-tight">{appDisplayName}</span>

          {/* System Menus */}
          <nav className="hidden md:flex items-center gap-3.5 opacity-80">
            <span className="hover:opacity-100 cursor-pointer">File</span>
            <span className="hover:opacity-100 cursor-pointer">Edit</span>
            <span className="hover:opacity-100 cursor-pointer">View</span>
            <span className="hover:opacity-100 cursor-pointer">Window</span>
            <span className="hover:opacity-100 cursor-pointer">Help</span>
          </nav>
        </div>

        {/* Right Side: Battery, Wi-Fi, Spotlight, Control Center, Time, Power Off */}
        <div className="flex items-center gap-3 sm:gap-3.5">
          {/* Battery */}
          <div className="hidden sm:flex items-center gap-1.5 opacity-85">
            <span className="text-[10px]">100%</span>
            <svg viewBox="0 0 24 12" className="w-4 h-2.5 fill-current">
              <rect x="0.5" y="0.5" width="20" height="11" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1" />
              <rect x="2" y="2" width="17" height="8" rx="1.5" />
              <path d="M22 4 C23 4 23 8 22 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>

          {/* Wi-Fi Icon */}
          <div className="flex items-center opacity-85" title={wifiEnabled ? 'Wi-Fi: Connected' : 'Wi-Fi: Off'}>
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
              <path d="M12 18a2 2 0 100 4 2 2 0 000-4zm-4.95-2.95a7 7 0 019.9 0l-1.41 1.41a5 5 0 00-7.08 0L7.05 15.05zm-2.83-2.83a11 11 0 0115.56 0l-1.42 1.42a9 9 0 00-12.72 0L4.22 12.22z" />
            </svg>
          </div>

          {/* Control Center Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsControlCenterOpen(!isControlCenterOpen);
              setIsAppleMenuOpen(false);
            }}
            className={`p-1 rounded transition-colors cursor-pointer outline-none ${
              isControlCenterOpen ? 'bg-black/15 dark:bg-white/20' : 'hover:bg-black/10 dark:hover:bg-white/10'
            }`}
            title="Control Center"
            aria-label="Control Center"
          >
            {/* Authentic macOS Control Center Sliders Icon */}
            <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 fill-current">
              <rect x="2" y="4" width="16" height="4" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="7" cy="6" r="2.5" fill="currentColor" />
              <rect x="2" y="12" width="16" height="4" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="13" cy="14" r="2.5" fill="currentColor" />
            </svg>
          </button>

          {/* Live Date and Time */}
          <div className="flex items-center gap-1.5 font-medium tracking-tight">
            <span className="hidden sm:inline">{dateStr}</span>
            <span>{time}</span>
          </div>

          {/* Sleek macOS Sleep / Power Off Button */}
          <button
            onClick={handlePowerOff}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/15 hover:bg-red-500 text-red-500 hover:text-white transition-all text-[10px] font-semibold cursor-pointer border border-red-500/30 hover:border-transparent active:scale-95"
            title="Sleep monitor and return to studio"
          >
            <span>Power Off</span>
          </button>
        </div>
      </header>

      {/* ==============================================================
          CONTROL CENTER FLYOUT (TOP-RIGHT PANEL)
          ============================================================== */}
      <AnimatePresence>
        {isControlCenterOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className={`absolute top-9 right-3 w-80 rounded-2xl p-3 shadow-2xl border backdrop-blur-2xl z-50 flex flex-col gap-2.5 text-xs select-none ${
              isDark 
                ? 'bg-neutral-900/90 border-white/15 text-white shadow-black/80' 
                : 'bg-white/90 border-black/15 text-neutral-900 shadow-neutral-900/20'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Row: Connectivity Card + Quick Settings */}
            <div className="grid grid-cols-2 gap-2">
              {/* Left Connectivity Pill Card */}
              <div className={`p-2.5 rounded-xl border flex flex-col gap-2 ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
              }`}>
                {/* Wi-Fi Toggle */}
                <button
                  onClick={() => setWifiEnabled(!wifiEnabled)}
                  className="flex items-center gap-2 text-left cursor-pointer group"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                    wifiEnabled ? 'bg-[#ff5e1a] text-white' : 'bg-neutral-500/30 text-neutral-400'
                  }`}>
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                      <path d="M12 18a2 2 0 100 4 2 2 0 000-4zm-4.95-2.95a7 7 0 019.9 0l-1.41 1.41a5 5 0 00-7.08 0L7.05 15.05z" />
                    </svg>
                  </div>
                  <div className="truncate">
                    <div className="font-semibold text-[11px]">Wi-Fi</div>
                    <div className="text-[9px] opacity-60 truncate">{wifiEnabled ? 'Studio_5G' : 'Off'}</div>
                  </div>
                </button>

                {/* Bluetooth Toggle */}
                <button
                  onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
                  className="flex items-center gap-2 text-left cursor-pointer group"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                    bluetoothEnabled ? 'bg-[#ff5e1a] text-white' : 'bg-neutral-500/30 text-neutral-400'
                  }`}>
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                      <path d="M14.5 7.5L10 3v7.5L6.5 8 5 9.5 9.5 14 5 18.5 6.5 20l3.5-2.5V25l4.5-4.5-3.5-3.5 3.5-3.5zM12 6.5l1.5 1.5L12 9.5V6.5zm0 11.5l1.5-1.5L12 15v3z" />
                    </svg>
                  </div>
                  <div className="truncate">
                    <div className="font-semibold text-[11px]">Bluetooth</div>
                    <div className="text-[9px] opacity-60 truncate">{bluetoothEnabled ? 'Connected' : 'Off'}</div>
                  </div>
                </button>
              </div>

              {/* Right Stack: Focus + Theme Toggle */}
              <div className="flex flex-col gap-2">
                {/* Focus / DND */}
                <button
                  onClick={() => setFocusModeEnabled(!focusModeEnabled)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 transition-colors cursor-pointer ${
                    focusModeEnabled 
                      ? 'bg-[#ff5e1a] text-white border-transparent' 
                      : isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                  }`}
                >
                  <div className="font-bold text-[11px]">Focus Mode</div>
                </button>

                {/* Day / Night Theme Switch */}
                <button
                  onClick={toggleTheme}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                    isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/5 border-black/10 hover:bg-black/10'
                  }`}
                >
                  <span className="font-semibold text-[11px]">{isDark ? 'Night Rig' : 'Daylight'}</span>
                  <span className="text-[10px] text-[#ff5e1a] font-bold">Toggle</span>
                </button>
              </div>
            </div>

            {/* Display Brightness Slider */}
            <div className={`p-2.5 rounded-xl border flex flex-col gap-1.5 ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
            }`}>
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-semibold">Display Brightness</span>
                <span className="opacity-60">{displayBrightness}%</span>
              </div>
              <input
                type="range"
                min="65"
                max="115"
                value={displayBrightness}
                onChange={(e) => setDisplayBrightness(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-neutral-300 dark:bg-neutral-700 accent-[#ff5e1a]"
              />
            </div>

            {/* Sound Volume Slider */}
            <div className={`p-2.5 rounded-xl border flex flex-col gap-1.5 ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
            }`}>
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-semibold">Sound Output</span>
                <span className="opacity-60">{soundVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={soundVolume}
                onChange={(e) => setSoundVolume(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-neutral-300 dark:bg-neutral-700 accent-[#ff5e1a]"
              />
            </div>

            {/* Now Playing Widget */}
            <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
            }`}>
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff5e1a] to-black flex items-center justify-center text-white shrink-0 shadow-md">
                  <BrandMark brand="spotify" className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="font-bold text-[11px] truncate">Tokyo Twilight Chill Beats</div>
                  <div className="text-[10px] opacity-60 truncate">Khushang Sharma</div>
                </div>
              </div>
              <button
                onClick={() => {
                  playSoundEffect('select');
                  setIsPlayingAudio(!isPlayingAudio);
                }}
                className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0 font-bold text-xs"
              >
                {isPlayingAudio ? 'Pause' : 'Play'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==============================================================
          ABOUT THIS MAC MODAL
          ============================================================== */}
      <AnimatePresence>
        {isAboutMacOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsAboutMacOpen(false)}
          >
            <div
              className={`w-96 rounded-2xl p-5 border shadow-2xl backdrop-blur-2xl flex flex-col items-center text-center ${
                isDark ? 'bg-neutral-900/95 border-white/20 text-white' : 'bg-white/95 border-black/20 text-neutral-900'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-2xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shadow-lg mb-3">
                <svg viewBox="0 0 170 170" className="w-10 h-10 fill-current">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.74-11.64-14.1-6.19-9.8-10.89-20.73-14.1-32.8-3.21-12.06-4.82-23.49-4.82-34.28 0-16.14 4.17-29.43 12.52-39.87 8.35-10.43 18.7-15.75 31.05-15.96 4.79 0 10.15 1.25 16.08 3.76 5.93 2.51 9.77 3.86 11.52 4.06 1.76-.2 5.7-1.55 11.83-4.06 6.13-2.51 11.41-3.71 15.86-3.6 13.91.54 24.87 5.75 32.87 15.64-12.4 7.51-18.49 17.84-18.28 31 0 11.32 4.39 21.1 13.17 29.35 4.13 3.91 8.87 6.8 14.22 8.68-2.61 7.73-5.76 15.24-9.47 22.52zM119.22 33.15c0-7.39 2.67-14.41 8.01-21.06 5.34-6.65 11.96-10.74 19.86-12.28.32 1.41.48 2.61.48 3.6 0 7.49-2.8 14.57-8.41 21.23-5.61 6.66-12.39 10.66-20.34 12-0.21-1.09-.32-2.26-.32-3.49z" />
                </svg>
              </div>
              <h2 className="text-base font-bold">MacBook Pro 16-inch</h2>
              <div className="text-xs opacity-60 mb-3">Studio Edition · 2026</div>
              <div className="w-full text-left text-xs space-y-1.5 py-2.5 border-y border-black/10 dark:border-white/10 mb-4">
                <div className="flex justify-between">
                  <span className="opacity-60">Chip</span>
                  <span className="font-medium">Apple M3 Max</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Memory</span>
                  <span className="font-medium">64 GB Unified Memory</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">macOS</span>
                  <span className="font-medium">Big Sur 14.2.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Host</span>
                  <span className="font-medium text-[#ff5e1a]">Khushang Sharma</span>
                </div>
              </div>
              <button
                onClick={() => setIsAboutMacOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-[#ff5e1a] text-white font-semibold text-xs hover:brightness-110 cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==============================================================
          CONCURRENT MULTI-WINDOW WORKSPACE
          Three simultaneous windows open just like the reference photo:
          - Maps Window (Upper Left)
          - Safari Browser (Center / Upper Right)
          - Messages iMessage (Foreground Left, Overlapping)
          ============================================================== */}
      <main className="relative flex-1 w-full overflow-hidden p-2 sm:p-4">

        {/* ------------------------------------------------------------
            WINDOW 1: APPLE MAPS (UPPER LEFT)
            ------------------------------------------------------------ */}
        {openWindows.maps && !minimizedWindows.maps && (
          <motion.div
            drag
            dragMomentum={false}
            onMouseDown={() => bringToFront('maps')}
            style={{
              zIndex: 10 + windowOrder.indexOf('maps'),
            }}
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className={`absolute transition-shadow duration-200 rounded-xl border shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col ${
              maximizedWindows.maps 
                ? 'inset-2 sm:inset-4 w-auto h-auto' 
                : 'left-2 sm:left-6 md:left-10 top-2 sm:top-5 w-[94%] sm:w-[460px] md:w-[500px] h-[340px] sm:h-[390px]'
            } ${
              isDark 
                ? 'bg-neutral-900/95 border-white/15 text-white shadow-black/70' 
                : 'bg-white/95 border-black/15 text-neutral-900 shadow-neutral-900/20'
            }`}
          >
            {/* Maps Window Chrome */}
            <div className={`h-8 sm:h-9 px-3 flex items-center justify-between border-b shrink-0 cursor-move ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
            }`}>
              {/* Traffic Lights */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => handleCloseWindow('maps', e)}
                  className="w-3 h-3 rounded-full bg-[#FF5F56] hover:brightness-125 transition-all cursor-pointer"
                  title="Close"
                  aria-label="Close Maps"
                />
                <button
                  onClick={(e) => handleMinimizeWindow('maps', e)}
                  className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:brightness-125 transition-all cursor-pointer"
                  title="Minimize"
                  aria-label="Minimize Maps"
                />
                <button
                  onClick={(e) => handleMaximizeWindow('maps', e)}
                  className="w-3 h-3 rounded-full bg-[#27C93F] hover:brightness-125 transition-all cursor-pointer"
                  title="Maximize"
                  aria-label="Maximize Maps"
                />
              </div>

              {/* Maps Search Box */}
              <div className={`flex items-center gap-2 px-3 py-1 rounded-md text-[11px] w-64 max-w-[60%] border ${
                isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-black/10 text-neutral-800'
              }`}>
                <span className="opacity-50">Search:</span>
                <span className="truncate font-medium">Vellore, Tamil Nadu · Working Globally</span>
              </div>

              <div className="text-[10px] opacity-60 font-medium">Maps</div>
            </div>

            {/* Maps Window Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Sidebar */}
              <div className={`w-32 sm:w-36 border-r p-2.5 flex flex-col gap-3 text-[11px] shrink-0 ${
                isDark ? 'bg-black/20 border-white/10' : 'bg-neutral-50 border-black/10'
              }`}>
                <div>
                  <div className="text-[10px] uppercase font-bold opacity-50 mb-1">Favorites</div>
                  <div className="space-y-0.5">
                    <div className="px-2 py-1 rounded-md bg-[#ff5e1a] text-white font-medium">Studio Lab</div>
                    <div className="px-2 py-1 rounded-md opacity-75 hover:opacity-100 cursor-pointer">VIT Campus</div>
                    <div className="px-2 py-1 rounded-md opacity-75 hover:opacity-100 cursor-pointer">Bangalore Hub</div>
                    <div className="px-2 py-1 rounded-md opacity-75 hover:opacity-100 cursor-pointer">Tokyo Vault</div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold opacity-50 mb-1">Guides</div>
                  <div className="space-y-0.5">
                    <div className="px-2 py-1 rounded-md opacity-75 hover:opacity-100 cursor-pointer">Artisan Coffee</div>
                    <div className="px-2 py-1 rounded-md opacity-75 hover:opacity-100 cursor-pointer">Late Night Work</div>
                  </div>
                </div>
              </div>

              {/* Map Canvas */}
              <div className="relative flex-1 bg-emerald-950/20 dark:bg-emerald-950/40 overflow-hidden flex items-center justify-center p-4">
                {/* Vector Map Roads and Terrain */}
                <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" viewBox="0 0 400 300" preserveAspectRatio="none">
                  <path d="M-20 60 Q 120 80 200 40 T 420 80" stroke="#ff5e1a" strokeWidth="4" fill="none" opacity="0.6" />
                  <path d="M60 -20 Q 80 150 140 320" stroke="#94a3b8" strokeWidth="3" fill="none" opacity="0.5" />
                  <path d="M220 -20 Q 200 120 280 320" stroke="#94a3b8" strokeWidth="2" fill="none" opacity="0.4" />
                  <path d="M-20 200 Q 160 180 420 220" stroke="#94a3b8" strokeWidth="3" fill="none" opacity="0.4" />
                  {/* Lake / Water Body */}
                  <path d="M 280 40 Q 340 50 370 110 T 310 160 T 260 90 Z" fill="#38bdf8" opacity="0.3" />
                  {/* Campus Greenery Zone */}
                  <rect x="110" y="90" width="130" height="90" rx="12" fill="#22c55e" opacity="0.25" />
                </svg>

                {/* Apple Maps Location Pin Callout */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`px-3 py-2 rounded-xl border shadow-xl backdrop-blur-md text-center max-w-[220px] ${
                    isDark ? 'bg-black/90 border-white/20 text-white' : 'bg-white/95 border-black/15 text-neutral-900'
                  }`}>
                    <div className="text-[10px] font-bold text-[#ff5e1a] uppercase tracking-wider">Khushang Sharma</div>
                    <div className="font-bold text-xs">VIT Vellore Campus</div>
                    <div className="text-[10px] opacity-70">Tamil Nadu, India · Designing Globally</div>
                  </div>
                  {/* Red Pin Stem */}
                  <div className="w-0.5 h-4 bg-red-500 shadow-md" />
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-lg ring-4 ring-red-500/30" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ------------------------------------------------------------
            WINDOW 2: SAFARI BROWSER (CENTER / UPPER RIGHT)
            ------------------------------------------------------------ */}
        {openWindows.safari && !minimizedWindows.safari && (
          <motion.div
            drag
            dragMomentum={false}
            onMouseDown={() => bringToFront('safari')}
            style={{
              zIndex: 10 + windowOrder.indexOf('safari'),
            }}
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className={`absolute transition-shadow duration-200 rounded-xl border shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col ${
              maximizedWindows.safari 
                ? 'inset-2 sm:inset-4 w-auto h-auto' 
                : 'left-4 sm:left-24 md:left-48 lg:left-72 top-4 sm:top-7 w-[94%] sm:w-[580px] md:w-[650px] lg:w-[720px] h-[370px] sm:h-[440px]'
            } ${
              isDark 
                ? 'bg-neutral-900/95 border-white/15 text-white shadow-black/80' 
                : 'bg-white/95 border-black/15 text-neutral-900 shadow-neutral-900/25'
            }`}
          >
            {/* Safari Window Chrome */}
            <div className={`h-9 sm:h-10 px-3 flex items-center justify-between border-b shrink-0 cursor-move gap-3 ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
            }`}>
              {/* Traffic Lights */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => handleCloseWindow('safari', e)}
                  className="w-3 h-3 rounded-full bg-[#FF5F56] hover:brightness-125 transition-all cursor-pointer"
                  title="Close"
                  aria-label="Close Safari"
                />
                <button
                  onClick={(e) => handleMinimizeWindow('safari', e)}
                  className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:brightness-125 transition-all cursor-pointer"
                  title="Minimize"
                  aria-label="Minimize Safari"
                />
                <button
                  onClick={(e) => handleMaximizeWindow('safari', e)}
                  className="w-3 h-3 rounded-full bg-[#27C93F] hover:brightness-125 transition-all cursor-pointer"
                  title="Maximize"
                  aria-label="Maximize Safari"
                />
              </div>

              {/* Navigation Arrows */}
              <div className="hidden sm:flex items-center gap-1 opacity-70">
                <button className="px-1.5 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-xs">‹</button>
                <button className="px-1.5 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-xs">›</button>
              </div>

              {/* Address / Search Bar */}
              <div className={`flex-1 max-w-sm flex items-center justify-center gap-2 px-3 py-1 rounded-lg text-xs border ${
                isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-black/10 text-neutral-800'
              }`}>
                <span className="text-[10px] opacity-40">🔒</span>
                <span className="font-semibold text-[11px] truncate">{safariUrl}</span>
              </div>

              {/* Safari Right Action Tools */}
              <div className="flex items-center gap-2 opacity-70 text-xs">
                <span title="Share" className="cursor-pointer">Share</span>
                <span title="New Tab" className="cursor-pointer font-bold">+</span>
              </div>
            </div>

            {/* Safari Window Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
              {/* Favorites Title */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold tracking-tight text-neutral-800 dark:text-neutral-100">Favorites</h3>
                <div className="text-[10px] opacity-50">Quick access to tools and work</div>
              </div>

              {/* Grid of Favorites Tiles (Matching Reference Image) */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-3">
                {[
                  { name: 'Apple', brand: 'apple' },
                  { name: 'Figma', brand: 'figma' },
                  { name: 'GitHub', brand: 'git' },
                  { name: 'LinkedIn', iconText: 'in', color: '#0A66C2' },
                  { name: 'OtakuCircle', brand: 'otakucircle' },
                  { name: 'Spotify', brand: 'spotify' },
                  { name: 'VS Code', brand: 'vscode' },
                  { name: 'Google', iconText: 'G', color: '#EA4335' },
                ].map((fav) => (
                  <button
                    key={fav.name}
                    onClick={() => {
                      playSoundEffect('select');
                      if (fav.brand === 'figma' || fav.brand === 'vscode' || fav.brand === 'spotify') {
                        handleDockClick(fav.brand);
                      }
                    }}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-md border border-black/10 dark:border-white/10 bg-white/10 dark:bg-black/30 group-hover:scale-105 transition-transform">
                      {fav.brand === 'apple' ? (
                        <svg viewBox="0 0 170 170" className="w-5 h-5 fill-current">
                          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.74-11.64-14.1-6.19-9.8-10.89-20.73-14.1-32.8-3.21-12.06-4.82-23.49-4.82-34.28 0-16.14 4.17-29.43 12.52-39.87 8.35-10.43 18.7-15.75 31.05-15.96 4.79 0 10.15 1.25 16.08 3.76 5.93 2.51 9.77 3.86 11.52 4.06 1.76-.2 5.7-1.55 11.83-4.06 6.13-2.51 11.41-3.71 15.86-3.6 13.91.54 24.87 5.75 32.87 15.64-12.4 7.51-18.49 17.84-18.28 31 0 11.32 4.39 21.1 13.17 29.35 4.13 3.91 8.87 6.8 14.22 8.68-2.61 7.73-5.76 15.24-9.47 22.52zM119.22 33.15c0-7.39 2.67-14.41 8.01-21.06 5.34-6.65 11.96-10.74 19.86-12.28.32 1.41.48 2.61.48 3.6 0 7.49-2.8 14.57-8.41 21.23-5.61 6.66-12.39 10.66-20.34 12-0.21-1.09-.32-2.26-.32-3.49z" />
                        </svg>
                      ) : fav.brand ? (
                        <BrandMark brand={fav.brand} className="w-6 h-6 object-contain" />
                      ) : (
                        <span className="font-bold text-sm text-white px-2 py-0.5 rounded" style={{ backgroundColor: fav.color }}>
                          {fav.iconText}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium truncate max-w-[60px] opacity-80">{fav.name}</span>
                  </button>
                ))}
              </div>

              {/* Frequently Visited / Flagship Work Stories */}
              <div className="mt-1">
                <div className="text-[11px] font-bold uppercase tracking-wider opacity-60 mb-2">Featured Stories</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Card 1: OtakuCircle */}
                  <div className={`p-3 rounded-xl border flex gap-3 items-center ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                  }`}>
                    <div className="w-16 h-16 rounded-lg bg-[#ff5e1a] flex items-center justify-center shrink-0 shadow-md">
                      <BrandMark brand="otakucircle" className="w-10 h-10 object-contain" />
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-xs truncate">OtakuCircle Manga Vault</div>
                      <div className="text-[10px] opacity-60 mt-0.5">120k+ Readers Worldwide</div>
                      <div className="text-[10px] text-[#ff5e1a] font-semibold mt-1">Zero Latency Vector Reader</div>
                    </div>
                  </div>

                  {/* Card 2: Velosa Studio */}
                  <div className={`p-3 rounded-xl border flex gap-3 items-center ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                  }`}>
                    <div className="w-16 h-16 rounded-lg bg-neutral-900 border border-white/20 flex items-center justify-center shrink-0 shadow-md">
                      <BrandMark brand="figma" className="w-8 h-8 object-contain" />
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-xs truncate">Velosa Studio Design Tokens</div>
                      <div className="text-[10px] opacity-60 mt-0.5">High-Contrast Master System</div>
                      <div className="text-[10px] text-emerald-500 font-semibold mt-1">Tactile Physics &amp; Damping</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ------------------------------------------------------------
            WINDOW 3: IMESSAGE (MESSAGES) - FOREGROUND LEFT OVERLAPPING
            ------------------------------------------------------------ */}
        {openWindows.messages && !minimizedWindows.messages && (
          <motion.div
            drag
            dragMomentum={false}
            onMouseDown={() => bringToFront('messages')}
            style={{
              zIndex: 10 + windowOrder.indexOf('messages'),
            }}
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className={`absolute transition-shadow duration-200 rounded-xl border shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col ${
              maximizedWindows.messages 
                ? 'inset-2 sm:inset-4 w-auto h-auto' 
                : 'left-3 sm:left-12 md:left-20 lg:left-32 top-16 sm:top-24 md:top-32 w-[94%] sm:w-[500px] md:w-[540px] h-[360px] sm:h-[420px]'
            } ${
              isDark 
                ? 'bg-neutral-900/95 border-white/15 text-white shadow-black/85' 
                : 'bg-white/95 border-black/15 text-neutral-900 shadow-neutral-900/30'
            }`}
          >
            {/* Messages Window Chrome */}
            <div className={`h-8 sm:h-9 px-3 flex items-center justify-between border-b shrink-0 cursor-move ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
            }`}>
              {/* Traffic Lights */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => handleCloseWindow('messages', e)}
                  className="w-3 h-3 rounded-full bg-[#FF5F56] hover:brightness-125 transition-all cursor-pointer"
                  title="Close"
                  aria-label="Close Messages"
                />
                <button
                  onClick={(e) => handleMinimizeWindow('messages', e)}
                  className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:brightness-125 transition-all cursor-pointer"
                  title="Minimize"
                  aria-label="Minimize Messages"
                />
                <button
                  onClick={(e) => handleMaximizeWindow('messages', e)}
                  className="w-3 h-3 rounded-full bg-[#27C93F] hover:brightness-125 transition-all cursor-pointer"
                  title="Maximize"
                  aria-label="Maximize Messages"
                />
              </div>

              {/* Recipient Title */}
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <span className="opacity-60">To:</span>
                <span>Design Recruiter / Hiring Lead</span>
              </div>

              <div className="text-[10px] opacity-60 font-medium">Messages</div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Column: Pinned Avatars & Contacts */}
              <div className={`w-28 sm:w-36 border-r p-2 flex flex-col gap-2 shrink-0 ${
                isDark ? 'bg-black/20 border-white/10' : 'bg-neutral-50 border-black/10'
              }`}>
                {/* Search */}
                <div className={`px-2 py-1 rounded-md text-[10px] border ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/10'
                }`}>
                  Search
                </div>

                {/* Avatar Circles List */}
                <div className="space-y-1 mt-1">
                  <div className="p-1.5 rounded-lg bg-[#ff5e1a] text-white flex items-center gap-2 cursor-pointer shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px]">
                      DR
                    </div>
                    <div className="truncate text-[10px] font-bold">Recruiter</div>
                  </div>

                  <div className="p-1.5 rounded-lg opacity-70 hover:opacity-100 flex items-center gap-2 cursor-pointer transition-opacity">
                    <div className="w-6 h-6 rounded-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center font-bold text-[10px]">
                      AL
                    </div>
                    <div className="truncate text-[10px]">Alex (Dev)</div>
                  </div>

                  <div className="p-1.5 rounded-lg opacity-70 hover:opacity-100 flex items-center gap-2 cursor-pointer transition-opacity">
                    <div className="w-6 h-6 rounded-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center font-bold text-[10px]">
                      MY
                    </div>
                    <div className="truncate text-[10px]">Maya (PM)</div>
                  </div>

                  <div className="p-1.5 rounded-lg opacity-70 hover:opacity-100 flex items-center gap-2 cursor-pointer transition-opacity">
                    <div className="w-6 h-6 rounded-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center font-bold text-[10px]">
                      OC
                    </div>
                    <div className="truncate text-[10px]">OtakuCircle</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Chat Conversation Thread */}
              <div className="flex-1 flex flex-col justify-between p-3 overflow-hidden">
                {/* Scrollable Bubbles */}
                <div ref={messagesEndRef} className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'khushang' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] px-3 py-1.5 rounded-2xl text-[11px] leading-relaxed shadow-xs ${
                          msg.sender === 'khushang'
                            ? 'bg-[#007AFF] text-white rounded-br-xs'
                            : isDark
                            ? 'bg-neutral-800 text-neutral-100 rounded-bl-xs border border-white/10'
                            : 'bg-neutral-200 text-neutral-900 rounded-bl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] opacity-40 mt-0.5 px-1">{msg.time}</span>
                    </div>
                  ))}
                </div>

                {/* iMessage Input Box */}
                <form onSubmit={handleSendMessage} className="flex items-center gap-1.5 pt-2 border-t border-black/10 dark:border-white/10">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="iMessage..."
                    className={`flex-1 px-3 py-1.5 rounded-full text-xs border focus:outline-none focus:border-[#007AFF] ${
                      isDark ? 'bg-black/40 border-white/15 text-white' : 'bg-neutral-100 border-black/15 text-neutral-900'
                    }`}
                  />
                  <button
                    type="submit"
                    className="w-7 h-7 rounded-full bg-[#007AFF] hover:brightness-110 text-white flex items-center justify-center cursor-pointer font-bold text-xs shadow-xs"
                    title="Send"
                  >
                    ↑
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}

        {/* ------------------------------------------------------------
            OPTIONAL WINDOW 4: VS CODE (REACT ENGINE)
            ------------------------------------------------------------ */}
        {openWindows.vscode && !minimizedWindows.vscode && (
          <motion.div
            drag
            dragMomentum={false}
            onMouseDown={() => bringToFront('vscode')}
            style={{
              zIndex: 10 + windowOrder.indexOf('vscode'),
            }}
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className={`absolute transition-shadow duration-200 rounded-xl border shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col ${
              maximizedWindows.vscode 
                ? 'inset-2 sm:inset-4 w-auto h-auto' 
                : 'left-8 sm:left-32 top-8 sm:top-14 w-[92%] sm:w-[580px] h-[360px] sm:h-[410px]'
            } bg-[#181824]/95 border-white/15 text-white shadow-black/85`}
          >
            {/* Chrome */}
            <div className="h-8 px-3 flex items-center justify-between border-b border-white/10 bg-white/5 cursor-move">
              <div className="flex items-center gap-1.5">
                <button onClick={(e) => handleCloseWindow('vscode', e)} className="w-3 h-3 rounded-full bg-[#FF5F56] cursor-pointer" />
                <button onClick={(e) => handleMinimizeWindow('vscode', e)} className="w-3 h-3 rounded-full bg-[#FFBD2E] cursor-pointer" />
                <button onClick={(e) => handleMaximizeWindow('vscode', e)} className="w-3 h-3 rounded-full bg-[#27C93F] cursor-pointer" />
              </div>
              <div className="text-xs font-mono opacity-60">Visual Studio Code · Khushang Sharma</div>
              <div className="w-12 text-right text-[10px] text-emerald-400">React</div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 px-2 pt-1 border-b border-white/10 bg-black/30 text-[10.5px] font-mono">
              {['Hero.jsx', 'VinylPlayer.jsx', 'DesignTokens.js'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCodeFile(tab)}
                  className={`px-3 py-1 rounded-t cursor-pointer ${
                    codeFile === tab ? 'bg-[#181824] text-[#ff5e1a] font-bold border-t-2 border-[#ff5e1a]' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Code Body */}
            <div className="flex-1 p-3 bg-[#0d0f17] font-mono text-[11px] leading-relaxed overflow-x-auto text-emerald-400">
              <pre className="text-white/90">
                <span className="text-purple-400">export default function</span> <span className="text-yellow-300">StudioWorld</span>() &#123;<br />
                &nbsp;&nbsp;<span className="text-blue-400">const</span> [activeZone, setActiveZone] = <span className="text-yellow-300">useState</span>(<span className="text-orange-400">null</span>);<br />
                &nbsp;&nbsp;<span className="text-gray-500">// Real 3D camera dive coordinate transforms</span><br />
                &nbsp;&nbsp;<span className="text-purple-400">const</span> cameraTarget = activeZone ? activeZone.coords : &#123; scale: <span className="text-orange-400">1</span> &#125;;<br />
                &nbsp;&nbsp;<span className="text-purple-400">return</span> (<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-red-400">motion.div</span> <span className="text-blue-300">animate</span>=&#123;cameraTarget&#125; <span className="text-blue-300">transition</span>=&#123;springDamped&#125;&gt;<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-yellow-300">BattlestationMonitor</span> /&gt;<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-red-400">motion.div</span>&gt;<br />
                &nbsp;&nbsp;);<br />
                &#125;
              </pre>
            </div>
          </motion.div>
        )}

        {/* ------------------------------------------------------------
            OPTIONAL WINDOW 5: SPOTIFY (LO-FI MUSIC PLAYER)
            ------------------------------------------------------------ */}
        {openWindows.spotify && !minimizedWindows.spotify && (
          <motion.div
            drag
            dragMomentum={false}
            onMouseDown={() => bringToFront('spotify')}
            style={{
              zIndex: 10 + windowOrder.indexOf('spotify'),
            }}
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className={`absolute transition-shadow duration-200 rounded-xl border shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col ${
              maximizedWindows.spotify 
                ? 'inset-2 sm:inset-4 w-auto h-auto' 
                : 'left-6 sm:left-40 top-12 sm:top-20 w-[90%] sm:w-[460px] h-[340px] sm:h-[380px]'
            } bg-black/95 border-white/15 text-white shadow-black/90`}
          >
            <div className="h-8 px-3 flex items-center justify-between border-b border-white/10 bg-white/5 cursor-move">
              <div className="flex items-center gap-1.5">
                <button onClick={(e) => handleCloseWindow('spotify', e)} className="w-3 h-3 rounded-full bg-[#FF5F56] cursor-pointer" />
                <button onClick={(e) => handleMinimizeWindow('spotify', e)} className="w-3 h-3 rounded-full bg-[#FFBD2E] cursor-pointer" />
                <button onClick={(e) => handleMaximizeWindow('spotify', e)} className="w-3 h-3 rounded-full bg-[#27C93F] cursor-pointer" />
              </div>
              <div className="text-xs font-semibold text-[#1DB954]">Spotify Premium</div>
              <div className="w-12 text-right text-[10px] opacity-60">Lossless</div>
            </div>

            <div className="flex-1 p-5 flex flex-col justify-between">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#1DB954] to-black flex items-center justify-center text-white shadow-xl">
                  <BrandMark brand="spotify" className="w-12 h-12" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#1DB954] tracking-wider">Flow State Audio</div>
                  <h3 className="text-base font-bold text-white mt-0.5">Tokyo Twilight Chill Beats</h3>
                  <div className="text-xs text-neutral-400">Japanese city pop and indie R&amp;B</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                  <span>02:14</span>
                  <div className="h-1.5 flex-1 mx-3 rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full w-[65%] bg-[#1DB954] rounded-full" />
                  </div>
                  <span>03:45</span>
                </div>

                <div className="flex items-center justify-center gap-4 pt-1">
                  <button
                    onClick={() => {
                      playSoundEffect('select');
                      setIsPlayingAudio(!isPlayingAudio);
                    }}
                    className="px-5 py-2 rounded-full bg-[#1DB954] text-black font-bold text-xs hover:scale-105 transition-transform cursor-pointer"
                  >
                    {isPlayingAudio ? 'Pause' : 'Play Track'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </main>

      {/* ==============================================================
          FLOATING TRANSLUCENT MACOS DOCK
          ============================================================== */}
      <footer className="w-full flex items-center justify-center pb-2 sm:pb-3.5 z-40 shrink-0 select-none">
        <div className={`px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl flex items-center gap-1.5 sm:gap-2.5 backdrop-blur-2xl border shadow-2xl transition-all ${
          isDark 
            ? 'bg-black/60 border-white/20 shadow-black' 
            : 'bg-white/70 border-black/15 shadow-black/15'
        }`}>
          {dockApps.map((app) => {
            const isOpen = openWindows[app.id] && !minimizedWindows[app.id];
            const isFront = activeApp === app.id && isOpen;

            return (
              <motion.button
                key={app.id}
                whileHover={{ scale: 1.25, y: -6 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDockClick(app.id)}
                className="relative group p-1 sm:p-1.5 rounded-xl flex flex-col items-center outline-none cursor-pointer"
                title={app.name}
                aria-label={app.name}
              >
                {/* App Squircle Icon */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-md transition-all overflow-hidden bg-white/10 dark:bg-black/30 border border-black/10 dark:border-white/10">
                  {/* Finder Icon */}
                  {app.iconType === 'finder' && (
                    <div className="w-full h-full bg-gradient-to-b from-[#2E86DE] to-[#54A0FF] flex items-center justify-center text-white">
                      <svg viewBox="0 0 100 100" className="w-6 h-6 fill-white">
                        <path d="M20 20 h60 a10 10 0 0 1 10 10 v40 a10 10 0 0 1 -10 10 h-60 a10 10 0 0 1 -10 -10 v-40 a10 10 0 0 1 10 -10 z" fill="#2E86DE" />
                        <path d="M35 45 Q 50 65 65 45" stroke="#FFFFFF" strokeWidth="6" fill="none" strokeLinecap="round" />
                        <circle cx="36" cy="38" r="4" fill="#FFFFFF" />
                        <circle cx="64" cy="38" r="4" fill="#FFFFFF" />
                        <path d="M50 20 L50 48" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}

                  {/* Safari Icon */}
                  {app.iconType === 'safari' && (
                    <div className="w-full h-full bg-gradient-to-b from-[#00D2D3] to-[#01a3a4] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center relative">
                        <div className="w-0.5 h-full bg-red-500 rotate-45 transform origin-center shadow-xs" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white absolute" />
                      </div>
                    </div>
                  )}

                  {/* Messages Icon */}
                  {app.iconType === 'messages' && (
                    <div className="w-full h-full bg-gradient-to-b from-[#10B981] to-[#059669] flex items-center justify-center text-white">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                      </svg>
                    </div>
                  )}

                  {/* Maps Icon */}
                  {app.iconType === 'maps' && (
                    <div className="w-full h-full bg-gradient-to-br from-[#F59E0B] to-[#EF4444] flex items-center justify-center text-white">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                    </div>
                  )}

                  {/* Brand Apps */}
                  {app.brand && (
                    <div className="w-full h-full p-1.5 flex items-center justify-center bg-white/90 dark:bg-black/60">
                      <BrandMark brand={app.brand} className="w-5 h-5 object-contain" />
                    </div>
                  )}

                  {/* Settings Icon */}
                  {app.iconType === 'settings' && (
                    <div className="w-full h-full bg-gradient-to-b from-neutral-400 to-neutral-600 flex items-center justify-center text-white">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                      </svg>
                    </div>
                  )}

                  {/* Trash Icon */}
                  {app.iconType === 'trash' && (
                    <div className="w-full h-full bg-gradient-to-b from-neutral-300 to-neutral-400 flex items-center justify-center text-neutral-800">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Red Unread Notification Badge */}
                {app.badge && (
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-500 text-white font-bold text-[8.5px] flex items-center justify-center shadow-xs">
                    {app.badge}
                  </span>
                )}

                {/* Active Indicator Dot Beneath App */}
                <span className={`w-1 h-1 rounded-full mt-0.5 transition-all ${
                  isFront ? 'bg-[#ff5e1a] scale-125' : isOpen ? 'bg-neutral-800 dark:bg-white' : 'opacity-0'
                }`} />

                {/* Hover Tooltip Label */}
                <div className={`absolute -top-7 px-2 py-0.5 rounded-md text-[9px] font-sans font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md ${
                  isDark ? 'bg-neutral-900 text-white border border-white/20' : 'bg-white text-neutral-900 border border-black/15'
                }`}>
                  {app.name}
                </div>
              </motion.button>
            );
          })}

          <div className="w-px h-6 bg-black/15 dark:bg-white/15 mx-1" />

          {/* Dedicated Power Off in Dock */}
          <motion.button
            whileHover={{ scale: 1.25, y: -6 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePowerOff}
            className="relative group p-1 sm:p-1.5 rounded-xl flex flex-col items-center outline-none cursor-pointer text-red-500"
            title="Shut down monitor"
            aria-label="Shut down monitor"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-red-500/15 group-hover:bg-red-500 text-red-500 group-hover:text-white transition-all shadow-md">
              <span className="text-[10px] font-bold">Off</span>
            </div>
            <span className="w-1 h-1 rounded-full mt-0.5 opacity-0" />
            <div className={`absolute -top-7 px-2 py-0.5 rounded-md text-[9px] font-sans font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md ${
              isDark ? 'bg-neutral-900 text-red-400 border border-white/20' : 'bg-white text-red-600 border border-black/15'
            }`}>
              Power Off
            </div>
          </motion.button>
        </div>
      </footer>

      {/* ==============================================================
          POWER OFF SCANLINE COLLAPSE ANIMATION
          ============================================================== */}
      <AnimatePresence>
        {isPoweringOff && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center pointer-events-auto"
          >
            <motion.div
              initial={{ scaleX: 1, scaleY: 1, opacity: 1 }}
              animate={{ scaleX: [1, 1.4, 0.05, 0], scaleY: [1, 0.04, 0.04, 0], opacity: [1, 1, 0.8, 0] }}
              transition={{ duration: 0.26, ease: 'easeInOut' }}
              className="w-full h-1 bg-white shadow-[0_0_30px_white]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
