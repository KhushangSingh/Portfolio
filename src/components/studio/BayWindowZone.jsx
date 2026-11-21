import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLoading } from '../../context/LoadingContext';

export default function BayWindowZone({ onCloseZone }) {
  const { isDark } = useTheme();
  const { startLoading, stopLoading } = useLoading();
  
  // Motion Video State
  const [isPlayingMotion, setIsPlayingMotion] = useState(false);
  const [dayVideoReady, setDayVideoReady] = useState(false);
  const [nightVideoReady, setNightVideoReady] = useState(false);
  const dayVideoRef = useRef(null);
  const nightVideoRef = useRef(null);

  // Mouse offset for subtle hover parallax on STILL IMAGES ONLY
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // 2D Interactive Curtains State & Physics
  const [isClosingWithCurtains, setIsClosingWithCurtains] = useState(false);
  const [dragOffsetLeft, setDragOffsetLeft] = useState(0);
  const [dragOffsetRight, setDragOffsetRight] = useState(0);
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const [isLeftHovered, setIsLeftHovered] = useState(false);
  const [isRightHovered, setIsRightHovered] = useState(false);
  const [hasShownInitialCue, setHasShownInitialCue] = useState(true);

  // Automatically dismiss initial floating cue after 3.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasShownInitialCue(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Notify GlobalHeader that studio window zone is active
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('studio-zone-open'));
    return () => {
      stopLoading('bay-motion');
      window.dispatchEvent(new CustomEvent('studio-zone-close'));
    };
  }, [stopLoading]);

  // Soft fabric curtain closing sound synthesis
  const playCurtainSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const t = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.45;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.18));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, t);
      filter.frequency.exponentialRampToValueAtTime(140, t + 0.4);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(t);
    } catch {}
  }, []);

  // Tactile sound for button toggle actions
  const playToggleSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(350, t + 0.05);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.06);
    } catch {}
  }, []);

  // Handle Play/Pause Motion Video
  const handleToggleMotion = () => {
    playToggleSound();
    const nextState = !isPlayingMotion;
    setIsPlayingMotion(nextState);

    if (nextState) {
      const isReady = isDark ? nightVideoReady : dayVideoReady;
      if (!isReady) {
        startLoading('bay-motion', 500, 'Buffering 4K Motion');
      }
      if (dayVideoRef.current) dayVideoRef.current.play().catch(() => {});
      if (nightVideoRef.current) nightVideoRef.current.play().catch(() => {});
    } else {
      stopLoading('bay-motion');
      if (dayVideoRef.current) dayVideoRef.current.pause();
      if (nightVideoRef.current) nightVideoRef.current.pause();
    }
  };

  // Pull curtain action to close window view and return to studio
  const handlePullCurtains = useCallback(() => {
    if (isClosingWithCurtains) return;
    setIsClosingWithCurtains(true);
    playCurtainSound();
    setTimeout(() => {
      onCloseZone?.();
    }, 520);
  }, [isClosingWithCurtains, playCurtainSound, onCloseZone]);

  // Physics-driven left curtain drag handler
  const handleLeftPointerDown = (e) => {
    if (isClosingWithCurtains) return;
    e.preventDefault();
    const startX = e.clientX;
    let currentDeltaX = 0;
    setIsDraggingLeft(true);

    const onPointerMove = (moveEv) => {
      const deltaX = moveEv.clientX - startX;
      currentDeltaX = Math.max(0, Math.min(window.innerWidth * 0.52, deltaX));
      setDragOffsetLeft(currentDeltaX);
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      setIsDraggingLeft(false);

      if (currentDeltaX > 75) {
        handlePullCurtains();
      } else {
        setDragOffsetLeft(0);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  // Physics-driven right curtain drag handler
  const handleRightPointerDown = (e) => {
    if (isClosingWithCurtains) return;
    e.preventDefault();
    const startX = e.clientX;
    let currentDeltaX = 0;
    setIsDraggingRight(true);

    const onPointerMove = (moveEv) => {
      const deltaX = startX - moveEv.clientX;
      currentDeltaX = Math.max(0, Math.min(window.innerWidth * 0.52, deltaX));
      setDragOffsetRight(currentDeltaX);
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      setIsDraggingRight(false);

      if (currentDeltaX > 75) {
        handlePullCurtains();
      } else {
        setDragOffsetRight(0);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  // Synchronize video playback when theme changes while motion is active
  useEffect(() => {
    if (isPlayingMotion) {
      if (!isDark && dayVideoRef.current) {
        dayVideoRef.current.play().catch(() => {});
      } else if (isDark && nightVideoRef.current) {
        nightVideoRef.current.play().catch(() => {});
      }
    }
  }, [isDark, isPlayingMotion]);

  // Keyboard Escape listener & close event listener to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handlePullCurtains();
      }
    };
    const handleCloseEvent = () => {
      onCloseZone?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('close-studio-zone', handleCloseEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('close-studio-zone', handleCloseEvent);
    };
  }, [onCloseZone]);

  // Handle mouse move for subtle parallax on still photos only
  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setMouseOffset({ x, y });
  };

  const fullScreenContent = (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 w-screen h-screen z-[9990] overflow-hidden select-none bg-black flex flex-col justify-end"
    >
      {/* ==============================================================
          FULL-SCREEN HIGH-RESOLUTION PANORAMIC SCENERY (EDGE-TO-EDGE)
          - Still images: Retain smooth subtle mouse hover motion
          - Day & Night videos: ZERO hover motion, completely static
          ============================================================== */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {/* 1. BASE STILL PHOTOGRAPHS WITH SUBTLE HOVER PARALLAX MOTION */}
        
        {/* Daylight Still Panorama */}
        <motion.img 
          src="/images/bay_window_day.png" 
          alt="San Francisco Bay Daylight Panoramic View"
          animate={{
            x: mouseOffset.x * -16,
            y: mouseOffset.y * -12,
            scale: 1.04
          }}
          transition={{ type: 'spring', stiffness: 90, damping: 24 }}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
            isDark 
              ? 'opacity-0 filter brightness-75 pointer-events-none' 
              : 'opacity-100 filter brightness-100'
          }`}
          loading="eager"
        />

        {/* Neon Night Still Panorama */}
        <motion.img 
          src="/images/bay_window_night.png" 
          alt="San Francisco Bay Neon Night Panoramic View"
          animate={{
            x: mouseOffset.x * -16,
            y: mouseOffset.y * -12,
            scale: 1.04
          }}
          transition={{ type: 'spring', stiffness: 90, damping: 24 }}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
            isDark 
              ? 'opacity-100 filter brightness-100' 
              : 'opacity-0 filter brightness-75 pointer-events-none'
          }`}
          loading="eager"
        />

        {/* 2. DYNAMIC LIVE MOTION VIDEOS - STRICTLY ZERO HOVER MOTION */}
        
        {/* Daylight Motion Video */}
        <video
          ref={dayVideoRef}
          src="/videos/bay_window_day.mp4"
          preload="auto"
          playsInline
          muted
          loop
          onCanPlayThrough={() => {
            setDayVideoReady(true);
            stopLoading('bay-motion');
          }}
          onLoadedData={() => {
            setDayVideoReady(true);
            stopLoading('bay-motion');
          }}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
            isPlayingMotion && !isDark ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Neon Night Motion Video */}
        <video
          ref={nightVideoRef}
          src="/videos/bay_window_night.mp4"
          preload="auto"
          playsInline
          muted
          loop
          onCanPlayThrough={() => {
            setNightVideoReady(true);
            stopLoading('bay-motion');
          }}
          onLoadedData={() => {
            setNightVideoReady(true);
            stopLoading('bay-motion');
          }}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
            isPlayingMotion && isDark ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Ambient atmospheric depth haze */}
        <div 
          className={`absolute inset-0 transition-opacity duration-1000 mix-blend-soft-light ${
            isDark 
              ? 'opacity-25 bg-gradient-to-t from-[#0284c7]/20 via-transparent to-[#1e1b4b]/30' 
              : 'opacity-20 bg-gradient-to-t from-[#ffedd5]/25 via-transparent to-[#bae6fd]/15'
          }`}
        />
      </div>

      {/* ==============================================================
          2D ARCHITECTURAL CURTAIN ROD (SPANNING THE TOP)
          ============================================================== */}
      <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-neutral-800 via-neutral-900 to-black border-b border-white/20 shadow-xl z-40 pointer-events-none flex items-center justify-between px-2">
        <div className="w-5 h-5 -ml-1 rounded-full bg-gradient-to-br from-amber-600 via-amber-400 to-amber-700 shadow-md border border-black" />
        <div className="w-5 h-5 -mr-1 rounded-full bg-gradient-to-br from-amber-600 via-amber-400 to-amber-700 shadow-md border border-black" />
      </div>

      {/* ==============================================================
          2D ARCHITECTURAL CURTAINS (LEFT & RIGHT) - RICH ORANGE SHADES MIXTURE & REAL PHYSICS
          Pulling from either side draws the curtains closed and returns to the studio
          ============================================================== */}
      
      {/* 1. LEFT CURTAIN */}
      <motion.div
        animate={{
          width: isClosingWithCurtains 
            ? '50.5vw' 
            : isDraggingLeft 
              ? `calc(clamp(72px, 11vw, 150px) + ${dragOffsetLeft}px)` 
              : 'clamp(72px, 11vw, 150px)',
          skewX: isDraggingLeft ? Math.min(5, dragOffsetLeft * 0.04) : 0,
        }}
        transition={{
          duration: isClosingWithCurtains ? 0.52 : isDraggingLeft ? 0 : 0.38,
          ease: isClosingWithCurtains ? [0.16, 1, 0.3, 1] : undefined,
          type: isClosingWithCurtains ? 'tween' : 'spring',
          stiffness: 240,
          damping: 22
        }}
        onPointerDown={handleLeftPointerDown}
        onClick={(e) => {
          if (dragOffsetLeft < 10) handlePullCurtains();
        }}
        onMouseEnter={() => setIsLeftHovered(true)}
        onMouseLeave={() => setIsLeftHovered(false)}
        className="absolute left-0 top-0 bottom-0 z-30 pointer-events-auto select-none shadow-[16px_0_45px_rgba(0,0,0,0.85)] flex cursor-ew-resize will-change-[width,transform]"
        style={{ transformOrigin: 'top left' }}
        title="Drag or click curtain to close window"
      >
        {/* Left Curtain Fabric: Mixture of Rich Orange Shades with 3D Fluting */}
        <div 
          className="relative w-full h-full border-r-2 border-black/50 overflow-hidden shadow-inner"
          style={{
            background: `
              linear-gradient(180deg, rgba(254, 215, 170, 0.32) 0%, rgba(255, 94, 26, 0.15) 20%, transparent 60%, rgba(67, 20, 7, 0.7) 100%),
              repeating-linear-gradient(
                90deg,
                #7c2d12 0px,
                #9a3412 8px,
                #c2410c 16px,
                #ea580c 24px,
                #ff5e1a 32px,
                #fed7aa 40px,
                #ff5e1a 48px,
                #ea580c 56px,
                #c2410c 64px,
                #9a3412 72px,
                #7c2d12 80px
              )
            `
          }}
        >
          {/* Top Brass Curtain Rings */}
          <div className="absolute top-1.5 inset-x-0 h-4 flex justify-around pointer-events-none opacity-90 px-1">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-3 h-4 rounded-full border-2 border-amber-300 bg-gradient-to-br from-amber-200 via-amber-500 to-amber-700 shadow-sm" />
            ))}
          </div>

          {/* Deep Vertical Flute Shadows for Real Fabric Depth */}
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/70 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/50 to-transparent pointer-events-none" />

          {/* Weighted Bottom Hem Fold */}
          <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-black/75 to-transparent border-t border-black/30 pointer-events-none" />
        </div>
      </motion.div>

      {/* 2. RIGHT CURTAIN */}
      <motion.div
        animate={{
          width: isClosingWithCurtains 
            ? '50.5vw' 
            : isDraggingRight 
              ? `calc(clamp(72px, 11vw, 150px) + ${dragOffsetRight}px)` 
              : 'clamp(72px, 11vw, 150px)',
          skewX: isDraggingRight ? -Math.min(5, dragOffsetRight * 0.04) : 0,
        }}
        transition={{
          duration: isClosingWithCurtains ? 0.52 : isDraggingRight ? 0 : 0.38,
          ease: isClosingWithCurtains ? [0.16, 1, 0.3, 1] : undefined,
          type: isClosingWithCurtains ? 'tween' : 'spring',
          stiffness: 240,
          damping: 22
        }}
        onPointerDown={handleRightPointerDown}
        onClick={(e) => {
          if (dragOffsetRight < 10) handlePullCurtains();
        }}
        onMouseEnter={() => setIsRightHovered(true)}
        onMouseLeave={() => setIsRightHovered(false)}
        className="absolute right-0 top-0 bottom-0 z-30 pointer-events-auto select-none shadow-[-16px_0_45px_rgba(0,0,0,0.85)] flex justify-end cursor-ew-resize will-change-[width,transform]"
        style={{ transformOrigin: 'top right' }}
        title="Drag or click curtain to close window"
      >
        {/* Right Curtain Fabric: Mixture of Rich Orange Shades with 3D Fluting */}
        <div 
          className="relative w-full h-full border-l-2 border-black/50 overflow-hidden shadow-inner"
          style={{
            background: `
              linear-gradient(180deg, rgba(254, 215, 170, 0.32) 0%, rgba(255, 94, 26, 0.15) 20%, transparent 60%, rgba(67, 20, 7, 0.7) 100%),
              repeating-linear-gradient(
                90deg,
                #7c2d12 0px,
                #9a3412 8px,
                #c2410c 16px,
                #ea580c 24px,
                #ff5e1a 32px,
                #fed7aa 40px,
                #ff5e1a 48px,
                #ea580c 56px,
                #c2410c 64px,
                #9a3412 72px,
                #7c2d12 80px
              )
            `
          }}
        >
          {/* Top Brass Curtain Rings */}
          <div className="absolute top-1.5 inset-x-0 h-4 flex justify-around pointer-events-none opacity-90 px-1">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-3 h-4 rounded-full border-2 border-amber-300 bg-gradient-to-br from-amber-200 via-amber-500 to-amber-700 shadow-sm" />
            ))}
          </div>

          {/* Deep Vertical Flute Shadows for Real Fabric Depth */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/50 to-transparent pointer-events-none" />

          {/* Weighted Bottom Hem Fold */}
          <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-black/75 to-transparent border-t border-black/30 pointer-events-none" />
        </div>
      </motion.div>

      {/* ==============================================================
          FLOATING ACTION CUE: "Pull curtains to exit"
          Theme-aware, zero-slop floating cue without separate pull buttons
          ============================================================== */}
      <AnimatePresence>
        {(isLeftHovered || isRightHovered || isDraggingLeft || isDraggingRight || hasShownInitialCue) && !isClosingWithCurtains && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-8 sm:top-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none flex items-center"
          >
            <div 
              className={`relative px-4 py-2 rounded-xl shadow-2xl border backdrop-blur-md flex items-center gap-2 font-sans font-bold text-xs tracking-tight select-none transition-colors duration-300 ${
                isDark 
                  ? 'bg-[#0a0a0a]/95 text-[#ff5e1a] border-[#ff5e1a]/40 shadow-black/90' 
                  : 'bg-white/95 text-[#ff5e1a] border-[#ff5e1a]/30 shadow-black/15'
              }`}
            >
              <span className="relative z-10 leading-none">Pull curtains to exit</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==============================================================
          BOTTOM FLOATING CONTROLS
          Clean Play Live Motion toggle & Studio return button
          ============================================================== */}
      <div className="relative w-full z-40 pb-6 sm:pb-8 flex justify-center pointer-events-none">
        <div className="pointer-events-auto px-4 py-2 rounded-full bg-black/75 backdrop-blur-2xl border border-white/20 shadow-[0_15px_45px_rgba(0,0,0,0.9)] flex items-center gap-3 text-white text-xs font-mono">
          
          {/* PLAY / PAUSE LIVE MOTION BUTTON */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleToggleMotion}
            className={`px-3.5 sm:px-4 py-2 rounded-full font-mono text-xs font-bold border transition-all flex items-center gap-2 shadow-xl cursor-pointer ${
              isPlayingMotion
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                : 'bg-[#ff5e1a] hover:bg-[#e0480a] text-white border-transparent shadow-[0_0_25px_rgba(255,94,26,0.5)]'
            }`}
            title={isPlayingMotion ? 'Pause live motion' : 'Play dynamic live motion'}
          >
            {isPlayingMotion ? (
              <>
                <span>Pause Motion</span>
              </>
            ) : (
              <>
                <span>Play Live Motion</span>
              </>
            )}
          </motion.button>

          <span className="opacity-25">|</span>

          {/* RETURN TO STUDIO BUTTON */}
          <button
            onClick={handlePullCurtains}
            className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 font-mono text-xs font-medium border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer group"
            title="Close curtains and return to Studio (ESC)"
          >
            <span>Studio</span>
            <span className="text-[9px] px-1 py-0.5 rounded bg-white/10 text-gray-300 font-mono">ESC</span>
          </button>

        </div>
      </div>
    </motion.div>
  );

  return typeof document !== 'undefined'
    ? createPortal(fullScreenContent, document.body)
    : fullScreenContent;
}
