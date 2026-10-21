import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Play, Pause, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function BayWindowZone({ onCloseZone }) {
  const { isDark } = useTheme();
  
  // Motion Video State
  const [isPlayingMotion, setIsPlayingMotion] = useState(false);
  const [dayVideoReady, setDayVideoReady] = useState(false);
  const [nightVideoReady, setNightVideoReady] = useState(false);
  const dayVideoRef = useRef(null);
  const nightVideoRef = useRef(null);

  // Notify GlobalHeader that studio window zone is active
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('studio-zone-open'));
    return () => {
      window.dispatchEvent(new CustomEvent('studio-zone-close'));
    };
  }, []);

  // Tactile sound for toggle actions
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
      if (dayVideoRef.current) dayVideoRef.current.play().catch(() => {});
      if (nightVideoRef.current) nightVideoRef.current.play().catch(() => {});
    } else {
      if (dayVideoRef.current) dayVideoRef.current.pause();
      if (nightVideoRef.current) nightVideoRef.current.pause();
    }
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
        onCloseZone?.();
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

  const fullScreenContent = (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed inset-0 w-screen h-screen z-[9990] overflow-hidden select-none bg-black flex flex-col justify-end"
    >
      {/* ==============================================================
          FULL-SCREEN HIGH-RESOLUTION PANORAMIC SCENERY (EDGE-TO-EDGE)
          Zero hover motion/parallax, completely static, crisp and clean!
          ============================================================== */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {/* 1. BASE STILL PHOTOGRAPHS */}
        
        {/* Daylight Still Panorama */}
        <img 
          src="/images/bay_window_day.png" 
          alt="San Francisco Bay Daylight Panoramic View"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-in-out ${
            isDark 
              ? 'opacity-0 scale-102 filter brightness-75' 
              : 'opacity-100 scale-100 filter brightness-100'
          }`}
          loading="eager"
        />

        {/* Neon Night Still Panorama */}
        <img 
          src="/images/bay_window_night.png" 
          alt="San Francisco Bay Neon Night Panoramic View"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-in-out ${
            isDark 
              ? 'opacity-100 scale-100 filter brightness-100' 
              : 'opacity-0 scale-102 filter brightness-75'
          }`}
          loading="eager"
        />

        {/* 2. DYNAMIC LIVE MOTION VIDEOS */}
        
        {/* Daylight Motion Video */}
        <video
          ref={dayVideoRef}
          src="/videos/bay_window_day.mp4"
          preload="auto"
          playsInline
          muted
          loop
          onCanPlayThrough={() => setDayVideoReady(true)}
          onLoadedData={() => setDayVideoReady(true)}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
            isPlayingMotion && !isDark ? 'opacity-100' : 'opacity-0'
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
          onCanPlayThrough={() => setNightVideoReady(true)}
          onLoadedData={() => setNightVideoReady(true)}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
            isPlayingMotion && isDark ? 'opacity-100' : 'opacity-0'
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
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span>Pause Motion</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Play Live Motion</span>
              </>
            )}
          </motion.button>

          <span className="opacity-25">|</span>

          {/* RETURN TO STUDIO BUTTON */}
          <button
            onClick={onCloseZone}
            className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 font-mono text-xs font-medium border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer group"
            title="Return to Studio (ESC)"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#ff5e1a] group-hover:-translate-x-0.5 transition-transform" />
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
