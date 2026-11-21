import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimationControls, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useMusic } from '../context/MusicContext';
import { designData } from '../constants/data';

// --- BUILT-IN CHILL LO-FI AUDIO ENGINE (Fallback if streaming is blocked) ---
class VinylAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.noiseNode = null;
    this.noiseGain = null;
    this.isPlaying = false;
  }

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  playNeedleDrop() {
    if (!this.ctx) this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.1);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  startVinylCrackle() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.985 ? 0.35 : 0.02);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 1.2;

    this.noiseGain = this.ctx.createGain();
    this.noiseGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.noiseGain);
    this.noiseGain.connect(this.masterGain);

    noise.start();
    this.noiseNode = noise;
  }

  start() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this.playNeedleDrop();
    this.startVinylCrackle();
  }

  stop() {
    this.isPlaying = false;
    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      } catch {}
      this.noiseNode = null;
    }
  }
}

const audioEngine = new VinylAudioEngine();

// --- TONAL ROTATION ANGLES FOR HORIZONTAL TONEARM STICK ---
// Fixed hinge is anchored at (HINGE_X = 126, HINGE_Y = 22) near the top-right cut-off boundary.
// Tonearm pivots STRICTLY and EXCLUSIVELY around this fixed hinge point.
// 0° = Stopped Mode: strictly horizontal above disc rim in upper cradle
// -56° = Playing Mode: rotated downwards on left so stylus and needle mount directly on the vinyl sound grooves
const ANGLE_PARKED = 0;
const ANGLE_PLAYING = -45;
const THRESHOLD_VINYL = 25; // Downward degrees threshold to trigger play
const HINGE_X = 126;
const HINGE_Y = 22;

// Sizing & animation offsets: exactly ~30px of the vinyl card's left edge peeks out when tucked
const getTuckedOffset = () => (typeof window !== 'undefined' && window.innerWidth < 640 ? 166 : 188);
const HIDDEN_OFFSET = 260;

// Slower, smooth and luxurious mechanical drawer glide for both push and pull motions
const DRAWER_TRANSITION = {
  type: 'spring',
  stiffness: 95,
  damping: 20,
  mass: 1.05
};

export const VinylPlayer = () => {
  const { isDark } = useTheme();
  const { 
    isPlaying, 
    setIsPlaying, 
    isPlayerOpen, 
    setIsPlayerOpen, 
    registerPlayerControls 
  } = useMusic();
  const [isDragging, setIsDragging] = useState(false);
  const [tonearmAngle, setTonearmAngle] = useState(ANGLE_PARKED);
  const [isTabHovered, setIsTabHovered] = useState(false);

  // Framer Motion spring physics for realistic mechanical tonearm damping
  const angleMotion = useMotionValue(ANGLE_PARKED);
  const smoothAngle = useSpring(angleMotion, { stiffness: 220, damping: 24, mass: 0.8 });
  const tonearmRef = useRef(null);

  // Synchronize smoothAngle directly to SVG transform attribute centered strictly at fixed hinge (HINGE_X, HINGE_Y)
  useEffect(() => {
    return smoothAngle.on('change', (latest) => {
      if (tonearmRef.current) {
        tonearmRef.current.setAttribute('transform', `rotate(${latest} ${HINGE_X} ${HINGE_Y})`);
      }
    });
  }, [smoothAngle]);

  const controls = useAnimationControls();
  const isOpenRef = useRef(isPlayerOpen);
  isOpenRef.current = isPlayerOpen;
  const wasScrolledDownRef = useRef(false);

  // Drawer left bar hold-and-drag refs & state
  const isDraggingBarRef = useRef(false);
  const barDragMovedRef = useRef(false);
  const barStartPointerRef = useRef({ x: 0, y: 0 });
  const barStartDrawerXRef = useRef(0);
  const barLastXRef = useRef(0);
  const barLastTimeRef = useRef(Date.now());
  const barVelocityRef = useRef(0);
  const justDraggedBarRef = useRef(false);
  const currentDrawerXRef = useRef(0);
  const [isBarDragging, setIsBarDragging] = useState(false);

  // Subtle mechanical latch click synthesis
  const playDrawerLatchSound = useCallback((isOpen) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isOpen ? 640 : 440, t);
      osc.frequency.exponentialRampToValueAtTime(isOpen ? 340 : 220, t + 0.045);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    } catch {}
  }, []);

  const customAudioRef = useRef(null);
  const customMusicUrl = designData?.favoriteMusic?.audioUrl || "/audio/bad_bunny_dtmf.mp3";
  const pivotPointRef = useRef(null);
  const currentAngleRef = useRef(ANGLE_PARKED);
  const isDraggingRef = useRef(false);
  const dragMovedRef = useRef(false);
  const startPointerRef = useRef({ x: 0, y: 0 });

  // Handle Playback strictly linked to needle on vinyl
  const startPlayback = useCallback(() => {
    currentAngleRef.current = ANGLE_PLAYING;
    angleMotion.set(ANGLE_PLAYING);
    setTonearmAngle(ANGLE_PLAYING);
    setIsPlaying(true);

    if (customAudioRef.current) {
      customAudioRef.current.playbackRate = 1.0;
      customAudioRef.current.volume = 0.85;
      const playPromise = customAudioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Audio play blocked by browser policy:", err);
          audioEngine.start();
        });
      }
    } else {
      audioEngine.start();
    }
  }, [setIsPlaying, angleMotion]);

  const stopPlayback = useCallback(() => {
    currentAngleRef.current = ANGLE_PARKED;
    angleMotion.set(ANGLE_PARKED);
    setTonearmAngle(ANGLE_PARKED);
    setIsPlaying(false);

    if (customAudioRef.current) {
      customAudioRef.current.pause();
    }
    audioEngine.stop();
  }, [setIsPlaying, angleMotion]);

  // Register playback controls with MusicContext for top header "Play Music" button
  useEffect(() => {
    registerPlayerControls({
      play: startPlayback,
      pause: stopPlayback,
      toggle: () => {
        if (isPlaying) {
          stopPlayback();
        } else {
          startPlayback();
        }
      }
    });
  }, [isPlaying, startPlayback, stopPlayback, registerPlayerControls]);

  // On mount inside hero section: start tucked, then smoothly slide open (gentle, relaxed pace)
  useEffect(() => {
    controls.set({ x: getTuckedOffset(), opacity: 1 });
    setIsPlayerOpen(false);
    currentDrawerXRef.current = getTuckedOffset();

    // Smoothly slide out from the right side after initial mount
    const timer = setTimeout(() => {
      setIsPlayerOpen(true);
      currentDrawerXRef.current = 0;
      controls.start({
        x: 0,
        opacity: 1,
        transition: DRAWER_TRANSITION
      });
    }, 450);

    return () => clearTimeout(timer);
  }, [controls, setIsPlayerOpen]);

  // 1. When pulled out and hero is scrolled down: automatically pull back in (tuck into right edge)
  // 2. When scrolled back up to top Hero section from below: automatically pull player out again
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Scrolling down from hero: tuck into right edge
      if (scrollY > 35) {
        wasScrolledDownRef.current = true;
        if (isOpenRef.current) {
          setIsPlayerOpen(false);
          currentDrawerXRef.current = getTuckedOffset();
          playDrawerLatchSound(false);
          controls.start({
            x: getTuckedOffset(),
            opacity: 1,
            transition: DRAWER_TRANSITION
          });
        }
      } 
      // Scrolling back up to top Hero section from below: pull out automatically
      else if (scrollY <= 20 && wasScrolledDownRef.current) {
        wasScrolledDownRef.current = false;
        if (!isOpenRef.current) {
          setIsPlayerOpen(true);
          currentDrawerXRef.current = 0;
          playDrawerLatchSound(true);
          controls.start({
            x: 0,
            opacity: 1,
            transition: DRAWER_TRANSITION
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controls, playDrawerLatchSound, setIsPlayerOpen]);

  // Tab toggle handler (luxurious, slower spring motion)
  const handleToggleTab = useCallback(() => {
    if (isDraggingBarRef.current) return;
    const nextOpen = !isOpenRef.current;
    setIsPlayerOpen(nextOpen);
    const targetX = nextOpen ? 0 : getTuckedOffset();
    currentDrawerXRef.current = targetX;
    playDrawerLatchSound(nextOpen);
    controls.start({
      x: targetX,
      opacity: 1,
      transition: DRAWER_TRANSITION
    });
  }, [playDrawerLatchSound, controls, setIsPlayerOpen]);

  // Hold & drag handler for the left visible edge bar (Primary interaction, with tap/click fallback)
  const handleBarPointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    isDraggingBarRef.current = true;
    setIsBarDragging(true);
    barDragMovedRef.current = false;
    barStartPointerRef.current = { x: e.clientX, y: e.clientY };
    const tucked = getTuckedOffset();
    barStartDrawerXRef.current = isOpenRef.current ? 0 : tucked;
    currentDrawerXRef.current = barStartDrawerXRef.current;
    barLastXRef.current = e.clientX;
    barLastTimeRef.current = Date.now();
    barVelocityRef.current = 0;

    const onPointerMove = (moveEv) => {
      if (!isDraggingBarRef.current) return;

      const now = Date.now();
      const dt = Math.max(1, now - barLastTimeRef.current);
      barVelocityRef.current = (moveEv.clientX - barLastXRef.current) / dt;
      barLastXRef.current = moveEv.clientX;
      barLastTimeRef.current = now;

      const deltaX = moveEv.clientX - barStartPointerRef.current.x;
      const deltaY = moveEv.clientY - barStartPointerRef.current.y;

      if (Math.hypot(deltaX, deltaY) > 3) {
        barDragMovedRef.current = true;
      }

      // Calculate raw target position:
      // Dragging left (negative deltaX) pulls player open towards 0
      // Dragging right (positive deltaX) pushes player closed towards tucked
      const rawX = barStartDrawerXRef.current + deltaX;

      // Rigidly clamp to 0 on the left so user cannot drag further left than the right screen edge
      const clampedX = Math.max(0, Math.min(tucked, rawX));

      currentDrawerXRef.current = clampedX;
      controls.set({ x: clampedX });
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      isDraggingBarRef.current = false;
      setIsBarDragging(false);

      if (!barDragMovedRef.current) {
        // Pure click/tap: toggle open/close
        handleToggleTab();
        return;
      }

      // Prevent any trailing synthetic click from toggling
      justDraggedBarRef.current = true;
      setTimeout(() => {
        justDraggedBarRef.current = false;
      }, 100);

      const tucked = getTuckedOffset();
      const mid = tucked / 2;
      const vx = barVelocityRef.current;

      // Determine snap target based on velocity or position threshold
      let shouldOpen;
      if (vx < -0.28) {
        shouldOpen = true; // Flung leftwards to open
      } else if (vx > 0.28) {
        shouldOpen = false; // Flung rightwards to tuck
      } else {
        shouldOpen = currentDrawerXRef.current < mid;
      }

      setIsPlayerOpen(shouldOpen);
      const targetX = shouldOpen ? 0 : tucked;
      currentDrawerXRef.current = targetX;
      playDrawerLatchSound(shouldOpen);

      controls.start({
        x: targetX,
        opacity: 1,
        transition: DRAWER_TRANSITION
      });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  // --- WINDOW-BASED DRAG & DROP FOR HORIZONTAL TONEARM (HINGE ON RIGHT, STYLUS ON LEFT) ---
  const handlePointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    isDraggingRef.current = true;
    setIsDragging(true);
    dragMovedRef.current = false;
    startPointerRef.current = { x: e.clientX, y: e.clientY };

    const onPointerMove = (moveEv) => {
      if (!isDraggingRef.current) return;

      const dist = Math.hypot(
        moveEv.clientX - startPointerRef.current.x,
        moveEv.clientY - startPointerRef.current.y
      );
      if (dist > 3) {
        dragMovedRef.current = true;
      }

      if (!pivotPointRef.current) return;
      const rect = pivotPointRef.current.getBoundingClientRect();
      const hingeX = rect.left + rect.width / 2;
      const hingeY = rect.top + rect.height / 2;
      // Pointer vector relative to fixed hinge (hinge is at right, so leftwards is -dx)
      const dx = moveEv.clientX - hingeX;
      const dy = moveEv.clientY - hingeY;

      // Angle down from horizontal: dx < 0 to the left, dy > 0 downwards
      const angleRad = Math.atan2(dy, Math.max(10, -dx));
      const downAngleDeg = angleRad * (180 / Math.PI);

      // Clamp between 0° (horizontal rest in cradle) and 62° (inner sound grooves)
      const clampedDown = Math.max(0, Math.min(62, downAngleDeg));
      
      const svgAngle = -clampedDown;
      currentAngleRef.current = svgAngle;
      angleMotion.set(svgAngle);
      if (typeof smoothAngle.jump === 'function') {
        smoothAngle.jump(svgAngle);
      }
      setTonearmAngle(svgAngle);

      // Live physical audio feedback
      if (clampedDown < THRESHOLD_VINYL && isPlaying) {
        if (customAudioRef.current) customAudioRef.current.pause();
        audioEngine.stop();
      }
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      isDraggingRef.current = false;
      setIsDragging(false);

      // If user tapped without dragging, toggle between parked (0°) and playing (-44°)
      if (!dragMovedRef.current) {
        if (currentAngleRef.current <= -THRESHOLD_VINYL) {
          stopPlayback();
        } else {
          startPlayback();
        }
        return;
      }

      // If released over the vinyl disc grooves (downAngle >= THRESHOLD_VINYL)
      if (currentAngleRef.current <= -THRESHOLD_VINYL) {
        startPlayback();
      } else {
        stopPlayback();
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  return (
    <>
      {/* Official Bad Bunny DTMF Master Audio Element */}
      <audio 
        ref={customAudioRef} 
        loop 
        preload="auto" 
        playsInline
      >
        <source src={customMusicUrl} type="audio/mpeg" />
        <source src={customMusicUrl} type="audio/mp4" />
        {designData?.favoriteMusic?.cdnUrl && (
          <source src={designData.favoriteMusic.cdnUrl} type="audio/mpeg" />
        )}
      </audio>

      {/* Main Turntable Slide-in Dock on Right Border (Physically positioned inside Hero Section) */}
      <motion.div
        animate={controls}
        initial={{ 
          x: getTuckedOffset(), 
          opacity: 1 
        }}
        data-no-cursor="true"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 select-none flex items-center pointer-events-auto"
      >
        {/* Simple & Elegant Tooltip on Left Edge Hover (styled identically to Appearance Rope hover box) */}
        <AnimatePresence>
          {isTabHovered && !isBarDragging && (
            <motion.div
              initial={{ opacity: 0, x: 8, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 6, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mr-3 pointer-events-none select-none hidden sm:flex items-center"
            >
              <div 
                className={`relative px-3 py-1.5 rounded-lg shadow-xl border backdrop-blur-md flex items-center font-sans font-bold text-xs tracking-tight select-none transition-colors duration-300 ${
                  isDark 
                    ? 'bg-[#0a0a0a]/95 text-[#ff5e1a] border-[#ff5e1a]/40 shadow-black/80' 
                    : 'bg-white/95 text-[#ff5e1a] border-[#ff5e1a]/30 shadow-black/10'
                }`}
              >
                {/* Triangular Outward Pointed Beak pointing towards the pull tab on the right */}
                <div 
                  className={`absolute -right-[5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 border-r border-t transition-colors duration-300 ${
                    isDark 
                      ? 'bg-[#0a0a0a] border-[#ff5e1a]/40' 
                      : 'bg-white border-[#ff5e1a]/30'
                  }`} 
                />

                <span className="relative z-10 leading-none">
                  {isPlayerOpen ? 'Drag to Tuck' : 'Drag to Open'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 
          TURNTABLE BASE:
          Directly placed orange base on hero section (zero white outer frame/box).
          Left side thin edge (approx 30px) peeks out from the right screen edge when tucked,
          serving as the sleek tactile pull tab with zero separate button boxes.
        */}
        <div 
          className="w-[195px] sm:w-[220px] h-[310px] sm:h-[345px] rounded-l-[28px] border-l border-t border-b border-[#ff5e1a]/30 bg-[#ff5e1a] relative overflow-hidden transition-all duration-500 shadow-[-12px_28px_32px_-8px_rgba(0,0,0,0.38)]"
        >
          {/* Center Tactile Pull & Drag Handle: Seamlessly integrated on the orange base in vertical center */}
          <div
            onPointerDown={handleBarPointerDown}
            onClick={() => {
              if (!justDraggedBarRef.current) {
                handleToggleTab();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggleTab();
              }
            }}
            onMouseEnter={() => setIsTabHovered(true)}
            onMouseLeave={() => setIsTabHovered(false)}
            onFocus={() => setIsTabHovered(true)}
            onBlur={() => setIsTabHovered(false)}
            tabIndex={0}
            role="button"
            aria-label={isPlayerOpen ? 'Hold and drag or click to tuck vinyl player' : 'Hold and drag or click to open vinyl player'}
            data-no-cursor="true"
            className={`group absolute left-0 top-1/2 -translate-y-1/2 w-8 sm:w-9 py-3.5 z-30 flex flex-col items-center justify-center select-none touch-none transition-transform outline-none ${
              isBarDragging ? 'cursor-grabbing scale-95' : 'cursor-grab hover:scale-105'
            }`}
          >
            {/* Minimal vertical label: strictly PULL or PUSH with no other text */}
            <span className="text-[7.5px] font-mono font-black tracking-[0.25em] text-white/90 uppercase [writing-mode:vertical-rl] rotate-180 mb-2.5 transition-colors pointer-events-none select-none">
              {isPlayerOpen ? 'PUSH' : 'PULL'}
            </span>

            {/* Tactile off-white pull rectangle */}
            <div className="w-1.5 h-6 rounded-full bg-[#f4f4ee] shadow-[0_1px_3px_rgba(0,0,0,0.4)] transition-all pointer-events-none group-hover:bg-white group-hover:shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
          </div>

          {/* THE SVG TURNTABLE: Fills container 100% edge-to-edge */}
          <svg
            viewBox="0 0 130 208"
            preserveAspectRatio="none"
            className="w-full h-full overflow-hidden select-none block"
            style={{ shapeRendering: 'geometricPrecision' }}
          >
            <defs>
              <clipPath id="vp-deck-clip">
                <rect x="0" y="0" width="130" height="208" />
              </clipPath>

              {/* Website Themed Consistent Orange Base Plinth Lighting (Consistent in both Light & Dark modes) */}
              <linearGradient id="vp-plinth-orange" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff7a3d" />
                <stop offset="25%" stopColor="#ff5e1a" />
                <stop offset="85%" stopColor="#ea4e0c" />
                <stop offset="100%" stopColor="#c73c02" />
              </linearGradient>

              {/* Polished Chrome Metallic Reflections */}
              <linearGradient id="vp-chrome-reflect" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1a1a1a" />
                <stop offset="22%" stopColor="#7a7a7a" />
                <stop offset="38%" stopColor="#ffffff" />
                <stop offset="52%" stopColor="#9a9a9a" />
                <stop offset="70%" stopColor="#2c2c2c" />
                <stop offset="86%" stopColor="#f0f0f0" />
                <stop offset="100%" stopColor="#141414" />
              </linearGradient>

              {/* Unified Tonearm Wand Cylindrical Sheen */}
              <linearGradient id="vp-wand-metal" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0d0d0d" />
                <stop offset="28%" stopColor="#484848" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="75%" stopColor="#606060" />
                <stop offset="100%" stopColor="#141414" />
              </linearGradient>

              {/* Headshell Reflective Glint */}
              <linearGradient id="vp-headshell-glint" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#151515" />
                <stop offset="40%" stopColor="#505050" />
                <stop offset="60%" stopColor="#ffffff" />
                <stop offset="80%" stopColor="#303030" />
                <stop offset="100%" stopColor="#0d0d0d" />
              </linearGradient>

              {/* Anisotropic Vinyl Light Reflection Fan */}
              <linearGradient id="vp-vinyl-sheen-a" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="42%" stopColor="rgba(255,255,255,0.02)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.22)" />
                <stop offset="58%" stopColor="rgba(255,255,255,0.02)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>

              <linearGradient id="vp-vinyl-sheen-b" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="42%" stopColor="rgba(255,255,255,0.02)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.18)" />
                <stop offset="58%" stopColor="rgba(255,255,255,0.02)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>

            <g clipPath="url(#vp-deck-clip)">
              {/* 1. ORANGE BOARD BASE: Fills deck completely edge-to-edge (directly placed on hero) */}
              <rect x="0" y="0" width="130" height="208" fill="url(#vp-plinth-orange)" />
              {/* Lower seam */}
              <line x1="0" y1="192" x2="130" y2="192" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" />
              <line x1="0" y1="193.5" x2="130" y2="193.5" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />

              {/* 2. HALF-HIDDEN PLATTER & VINYL DISC (Center anchored right at right edge: cx=130, cy=118) */}
              {/* Recessed Platter Well */}
              <circle cx="130" cy="118" r="92" fill="#080808" stroke="rgba(0,0,0,0.6)" strokeWidth="3" />
              {/* Machined Chrome Rim */}
              <circle cx="130" cy="118" r="89" fill="none" stroke="url(#vp-chrome-reflect)" strokeWidth="3.5" />
              <circle cx="130" cy="118" r="87" fill="#141414" />

              {/* ROTATING RECORD BODY: ONLY LEFT HALF VISIBLE, RIGHT HALF HIDDEN OFF-SCREEN */}
              <motion.g
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'linear' }}
                style={{ transformOrigin: '130px 118px' }}
                data-no-cursor="true"
                className="cursor-pointer"
                onClick={() => {
                  if (isPlaying) stopPlayback();
                  else startPlayback();
                }}
              >
                {/* Black Vinyl Disc Body */}
                <circle cx="130" cy="118" r="85" fill="#0a0a0a" stroke="#1c1c1c" strokeWidth="1" />

                {/* Concentric Sound Micro-Grooves (Outer rim 80 to inner 38) */}
                <circle cx="130" cy="118" r="80" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
                <circle cx="130" cy="118" r="74" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" />
                <circle cx="130" cy="118" r="68" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                <circle cx="130" cy="118" r="62" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.7" />
                <circle cx="130" cy="118" r="56" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.9" />
                <circle cx="130" cy="118" r="50" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                <circle cx="130" cy="118" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
                <circle cx="130" cy="118" r="38" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

                {/* Smooth Run-out Groove */}
                <circle cx="130" cy="118" r="36" fill="none" stroke="#121212" strokeWidth="2.5" />
                <path d="M 130 82 A 36 36 0 0 1 162 104" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" />

                {/* Shiny Anisotropic Light Reflections (Spin with the grooves) */}
                <circle cx="130" cy="118" r="83" fill="url(#vp-vinyl-sheen-a)" pointerEvents="none" />
                <circle cx="130" cy="118" r="83" fill="url(#vp-vinyl-sheen-b)" pointerEvents="none" />
              </motion.g>

              {/* 
                STATIONARY ENLARGED CENTER ORANGE LABEL:
                Enlarged from r=25 to r=35 to comfortably fit song & musician names.
                Positioned OUTSIDE motion.g so the typography stays completely FIXED, clear and visible!
              */}
              <g id="stationary-center-label">
                {/* Center Label: Website Themed Orange Base (Enlarged to r=35) */}
                <circle cx="130" cy="118" r="35" fill="url(#vp-plinth-orange)" stroke="rgba(0,0,0,0.6)" strokeWidth="1.4" />
                
                {/* Concentric Decorative Rings */}
                <circle cx="130" cy="118" r="31.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.6" />
                <circle cx="130" cy="118" r="28.5" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
                <circle cx="130" cy="118" r="13.5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />

                {/* Center Label Typography (Fixed, Visible, High-Contrast in Website Signature Font 'Bricolage Grotesque' - NEVER ROTATES) */}
                <text 
                  x="112" 
                  y="98" 
                  textAnchor="middle" 
                  fill="rgba(255,255,255,0.85)" 
                  fontSize="2.2" 
                  fontFamily="'Bricolage Grotesque', sans-serif" 
                  fontWeight="700" 
                  letterSpacing="0.9"
                >
                  HIGH FIDELITY
                </text>

                <text 
                  x="112" 
                  y="106" 
                  textAnchor="middle" 
                  fill="#ffffff" 
                  fontSize="4.8" 
                  fontFamily="'Bricolage Grotesque', sans-serif" 
                  fontWeight="800" 
                  letterSpacing="0.7"
                >
                  BAD BUNNY
                </text>

                <text 
                  x="112" 
                  y="116" 
                  textAnchor="middle" 
                  fill="#ffffff" 
                  fontSize="7.2" 
                  fontFamily="'Bricolage Grotesque', sans-serif" 
                  fontWeight="800" 
                  letterSpacing="0.4"
                >
                  DTMF
                </text>

                {/* Vintage Vinyl Center Divider Line */}
                <line x1="102" y1="119.5" x2="122" y2="119.5" stroke="rgba(255,255,255,0.35)" strokeWidth="0.4" />

                <text 
                  x="112" 
                  y="124" 
                  textAnchor="middle" 
                  fill="rgba(255,245,230,0.95)" 
                  fontSize="2.4" 
                  fontFamily="'Bricolage Grotesque', sans-serif" 
                  fontWeight="700" 
                  letterSpacing="0.5"
                >
                  33 ⅓ RPM • STEREO
                </text>

                <text 
                  x="112" 
                  y="130.5" 
                  textAnchor="middle" 
                  fill="rgba(255,255,255,0.7)" 
                  fontSize="2.0" 
                  fontFamily="'Bricolage Grotesque', sans-serif" 
                  fontWeight="700" 
                  letterSpacing="0.6"
                >
                  SIDE A • LP-2026
                </text>

                {/* Spindle Pin */}
                <circle cx="130" cy="118" r="4.2" fill="#0d0d0d" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
                <circle cx="130" cy="118" r="2.4" fill="url(#vp-chrome-reflect)" />
                <circle cx="129.2" cy="117.2" r="0.7" fill="#ffffff" />
              </g>

              {/* 3. FIXED HINGE BASE: Anchored at (cx=126, cy=22) near top-right cut-off boundary */}
              <g id="fixed-hinge-anchor">
                <circle cx={HINGE_X} cy={HINGE_Y} r="14" fill="#141414" stroke="#282828" strokeWidth="1" />
                <circle cx={HINGE_X} cy={HINGE_Y} r="9.5" fill="url(#vp-chrome-reflect)" />
                <circle cx={HINGE_X} cy={HINGE_Y} r="4.5" fill="#1a1a1a" />
                {/* Fixed Hinge Screen Coordinate Reference Point for getBoundingClientRect() */}
                <circle ref={pivotPointRef} cx={HINGE_X} cy={HINGE_Y} r="3" fill="#ff5e1a" opacity="0.001" pointerEvents="none" />
              </g>

              {/* 4. UPPER REST CRADLE (On the left where the extended stylus rests horizontally when stopped) */}
              <g id="upper-rest-cradle" transform="translate(12, 14)">
                <rect x="0" y="0" width="8" height="15" rx="2" fill="#181818" stroke="#3d3d3d" strokeWidth="0.8" />
                <path d="M 0 3 L 8 3 L 6.5 8 L 1.5 8 Z" fill="#2d2d2d" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                <circle cx="4" cy="5.5" r="1" fill="#ff5e1a" opacity="0.6" />
              </g>

              {/* 
                5. UNIFIED TONEARM: Pivots STRICTLY and EXCLUSIVELY around the fixed hinge at (126, 22).
                The hinge point is 100% stationary and never moves.
                Only the middle and left side front part move up and down with dragging!
              */}
              <g
                ref={tonearmRef}
                transform={`rotate(${ANGLE_PARKED} ${HINGE_X} ${HINGE_Y})`}
                onPointerDown={handlePointerDown}
                data-no-cursor="true"
                className="cursor-grab active:cursor-grabbing select-none"
                style={{ touchAction: 'none' }}
              >
                {/* Expanded Pointer Hitbox around the stick for effortless grabbing & clicking */}
                <rect x="12" y="6" width="118" height="38" fill="rgba(0,0,0,0.001)" pointerEvents="all" />

                {/* Hinge Center Pivot Cap at (126, 22) */}
                <circle cx={HINGE_X} cy={HINGE_Y} r="3.8" fill="#ff5e1a" stroke="url(#vp-chrome-reflect)" strokeWidth="0.8" />

                {/* Continuous Extended Metallic Tonearm Wand: Runs from right hinge (126, 22) to left headshell (36, 22) */}
                <rect 
                  x="36" 
                  y="20.4" 
                  width="90" 
                  height="3.2" 
                  rx="1.6" 
                  fill="url(#vp-wand-metal)" 
                  stroke="rgba(0,0,0,0.8)" 
                  strokeWidth="0.5" 
                />

                {/* Front Headshell: FUSED to wand on the LEFT */}
                <path 
                  d="M 36 20.4 L 20 20.4 L 14 26 L 36 26 Z" 
                  fill="#121212" 
                  stroke="#2a2a2a" 
                  strokeWidth="1" 
                />

                {/* Silver Specular Badge on Headshell */}
                <rect 
                  x="22" 
                  y="21.4" 
                  width="10" 
                  height="3.2" 
                  rx="0.5" 
                  fill="url(#vp-headshell-glint)" 
                  stroke="rgba(255,255,255,0.4)" 
                  strokeWidth="0.5" 
                />

                {/* Finger-Lift Cue Lever */}
                <path 
                  d="M 24 20.4 C 24 13 28 11 32 11" 
                  fill="none" 
                  stroke="url(#vp-chrome-reflect)" 
                  strokeWidth="1.6" 
                  strokeLinecap="round" 
                />

                {/* Iconic Orange Stylus Guard */}
                <path d="M 18 24 L 26 24 L 24 28 L 16 28 Z" fill="#ff5e1a" stroke="#d94508" strokeWidth="0.6" />

                {/* Fine Silver Needle Point (Mounts firmly onto Vinyl Grooves in Play Mode) */}
                <line x1="20" y1="28" x2="20" y2="31.5" stroke="#f0f0f0" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="20" cy="31.5" r="0.8" fill={isPlaying ? "#ff5e1a" : "#ffffff"} />
              </g>
            </g>
          </svg>
        </div>
      </motion.div>
    </>
  );
};

export default VinylPlayer;
