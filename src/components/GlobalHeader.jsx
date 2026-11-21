import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useMusic } from '../context/MusicContext';
import { designData } from '../constants/data';
import { LampPullRope } from './LampPullRope';

const GlobalHeader = () => {
  const { isDark, isBulbBroken } = useTheme();
  const { isPlaying, isPastHero, isPlayerFullyHidden, handleHeaderPlayClick } = useMusic();
  const [textIndex, setTextIndex] = useState(0);
  const [isStudioZoneOpen, setIsStudioZoneOpen] = useState(false);
  const [isMonitorOpen, setIsMonitorOpen] = useState(false);

  // Listen for studio zone and monitor view open/close events
  useEffect(() => {
    const handleOpen = () => setIsStudioZoneOpen(true);
    const handleClose = () => setIsStudioZoneOpen(false);
    const handleMonitorOpen = () => setIsMonitorOpen(true);
    const handleMonitorClose = () => setIsMonitorOpen(false);

    window.addEventListener('studio-zone-open', handleOpen);
    window.addEventListener('studio-zone-close', handleClose);
    window.addEventListener('monitor-view-open', handleMonitorOpen);
    window.addEventListener('monitor-view-close', handleMonitorClose);
    return () => {
      window.removeEventListener('studio-zone-open', handleOpen);
      window.removeEventListener('studio-zone-close', handleClose);
      window.removeEventListener('monitor-view-open', handleMonitorOpen);
      window.removeEventListener('monitor-view-close', handleMonitorClose);
    };
  }, []);

  // Explosion animation states
  const [isExploding, setIsExploding] = useState(false);
  const [particles, setParticles] = useState({ shards: [], sparks: [] });
  const prevBrokenRef = useRef(false);

  // Trigger high-impact glass shattering explosion when the bulb blows out
  useEffect(() => {
    if (isBulbBroken && !prevBrokenRef.current) {
      triggerExplosion();
    }
    prevBrokenRef.current = isBulbBroken;
  }, [isBulbBroken]);

  const triggerExplosion = () => {
    setIsExploding(true);

    const clipPaths = [
      'polygon(50% 0%, 100% 100%, 0% 70%)',
      'polygon(20% 0%, 100% 20%, 75% 100%, 0% 85%)',
      'polygon(0% 0%, 90% 35%, 65% 100%, 10% 75%)',
      'polygon(35% 0%, 100% 65%, 15% 100%)',
      'polygon(50% 0%, 100% 40%, 60% 100%, 0% 60%)',
      'polygon(15% 10%, 85% 0%, 100% 90%, 0% 100%)',
      'polygon(40% 0%, 95% 45%, 55% 100%, 5% 55%)',
      'polygon(0% 20%, 80% 0%, 100% 80%, 20% 100%)'
    ];

    const shardsList = [];

    // 1. HERO BROKEN GLASS CHIPS (Pieces that snapped and fell off top-left and bottom-right)
    shardsList.push({
      id: `hero-top-left-${Date.now()}`,
      startX: -60,
      startY: -12,
      targetX: -130 + (Math.random() - 0.5) * 35, // Flings up-leftward
      targetY: 180 + Math.random() * 60, // Drops down with gravity
      spin: -320 - Math.random() * 80,
      size: 19,
      clipPath: 'polygon(0% 45%, 15% 10%, 100% 0%, 70% 65%, 20% 100%)',
      duration: 1.8,
      delay: 0.01,
      isHeroChunk: true
    });

    shardsList.push({
      id: `hero-bottom-right-${Date.now()}`,
      startX: 65,
      startY: 12,
      targetX: 135 + (Math.random() - 0.5) * 35, // Flings down-rightward
      targetY: 250 + Math.random() * 70, // Heavy downward fall
      spin: 300 + Math.random() * 80,
      size: 21,
      clipPath: 'polygon(0% 0%, 85% 15%, 100% 60%, 75% 100%, 0% 80%, 20% 45%)',
      duration: 1.9,
      delay: 0.02,
      isHeroChunk: true
    });

    // 2. DOWNWARD-FALLING HEAVY SHARDS (Falling deep downward across the page)
    const downShardsCount = 10;
    for (let i = 0; i < downShardsCount; i++) {
      const downAngle = (Math.PI / 4) + (Math.PI / 2) * (i / downShardsCount) + (Math.random() - 0.5) * 0.25;
      const dist = 160 + Math.random() * 190;
      const targetX = Math.cos(downAngle) * dist * 0.75 + (i % 2 === 0 ? 35 : -25);
      const targetY = Math.sin(downAngle) * dist + 75; // Heavy gravitational drop
      shardsList.push({
        id: `down-shard-${i}-${Date.now()}`,
        startX: (Math.random() - 0.5) * 40 + 20,
        startY: (Math.random() - 0.5) * 10,
        targetX,
        targetY,
        spin: (Math.random() - 0.5) * 550,
        size: 11 + Math.random() * 9,
        clipPath: clipPaths[i % clipPaths.length],
        duration: 1.55 + Math.random() * 0.45,
        delay: Math.random() * 0.06
      });
    }

    // 3. LONG-DISTANCE RADIAL SHARDS (Exploding in different directions)
    const radialCount = 18;
    for (let i = 0; i < radialCount; i++) {
      const angle = (Math.PI * 2 * i) / radialCount + (Math.random() - 0.5) * 0.35;
      const speed = 130 + Math.random() * 200; // Wide reach up to 330px
      const targetX = Math.cos(angle) * speed;
      const targetY = Math.sin(angle) * speed + 60; // Natural gravitational curve
      shardsList.push({
        id: `radial-shard-${i}-${Date.now()}`,
        startX: 0,
        startY: 0,
        targetX,
        targetY,
        spin: (Math.random() - 0.5) * 600,
        size: 8 + Math.random() * 10,
        clipPath: clipPaths[(i + 3) % clipPaths.length],
        duration: 1.4 + Math.random() * 0.5,
        delay: Math.random() * 0.04
      });
    }

    // 4. MICRO CRYSTAL GLINTS (Fast sharp needles in varied directions)
    const microCount = 8;
    for (let i = 0; i < microCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 140;
      shardsList.push({
        id: `micro-shard-${i}-${Date.now()}`,
        startX: 0,
        startY: 0,
        targetX: Math.cos(angle) * speed,
        targetY: Math.sin(angle) * speed + 40,
        spin: (Math.random() - 0.5) * 900,
        size: 4 + Math.random() * 4,
        clipPath: clipPaths[i % clipPaths.length],
        duration: 1.15 + Math.random() * 0.4,
        delay: Math.random() * 0.03
      });
    }

    // High-voltage electrical burnout sparks
    const sparkColors = ['#ffffff', '#fff37a', '#ffbe3b', '#ff5e1a'];
    const newSparks = Array.from({ length: 24 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 40 + Math.random() * 115;
      return {
        id: `spark-${i}-${Date.now()}`,
        targetX: Math.cos(angle) * dist,
        targetY: Math.sin(angle) * dist,
        color: sparkColors[i % sparkColors.length],
        size: 2.5 + Math.random() * 3.5,
        duration: 0.35 + Math.random() * 0.3
      };
    });

    setParticles({ shards: shardsList, sparks: newSparks });

    setTimeout(() => {
      setIsExploding(false);
      setParticles({ shards: [], sparks: [] });
    }, 2300);
  };

  const songName = designData?.favoriteMusic?.title || 'DTMF';

  // Alternate text between "Now Playing" and the song title while music is playing
  useEffect(() => {
    if (!isPlaying) {
      setTextIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setTextIndex((prev) => (prev === 0 ? 1 : 0));
    }, 3200);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Dark Mode Style (when bulb is off: 100% solid opaque obsidian pill so underlying content never bleeds through)
  const darkGlassStyle = 'bg-[#0a0a0d] border-white/15 hover:border-white/25 text-white shadow-xl';

  // Light Mode Glowing Bulb Style (warm radiant orange illumination, incandescent bulb glow, crystal clear typography)
  const bulbGlowStyle = 'bg-gradient-to-b from-[#fffaf7] via-[#fff4ec] to-[#ffe9dc] border-[#ff5e1a]/80 shadow-[0_0_20px_rgba(255,94,26,0.55),0_0_38px_rgba(255,94,26,0.32),0_0_65px_rgba(255,94,26,0.18),inset_0_0_14px_rgba(255,120,59,0.3)] text-neutral-950 hover:brightness-105';

  const logoStyle = isDark ? darkGlassStyle : bulbGlowStyle;

  // Music Button Style: 100% solid opaque pill in both themes with deep contrast so scrolling text never mixes
  const musicGlassStyle = isDark 
    ? 'bg-[#0a0a0d] border-white/15 hover:border-white/25 text-white shadow-xl'
    : 'bg-[#FAF9F5] border-black/12 hover:border-black/20 text-neutral-900 shadow-md';

  const glassBase = "backdrop-blur-xl border rounded-full transition-all duration-300 pointer-events-auto relative";

  // Current label for the music button
  const currentText = !isPlaying 
    ? 'Play Music' 
    : textIndex === 0 
      ? 'Now Playing' 
      : songName;

  const isSongName = isPlaying && textIndex !== 0;
  // Individually calibrated widths so "Play Music" and "Now Playing" are 100% visible with zero truncation,
  // while keeping the gap to the right-side disc icon snug and minimal:
  const textSlotWidth = isPlaying ? 'w-[86px] sm:w-[100px]' : 'w-[78px] sm:w-[92px]';

  return (
    <header className={`fixed top-0 left-0 w-full z-[10000] px-6 py-6 md:px-12 flex justify-between items-center pointer-events-none font-sans transition-all duration-300 ${
      isMonitorOpen ? 'opacity-0 pointer-events-none -translate-y-8' : 'opacity-100'
    }`}>
      {/* 1. TOP LEFT: LOGO WITH ATTACHED LAMP PULL ROPE */}
      <motion.div 
        initial={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative inline-flex flex-col items-start pointer-events-auto"
      >
        {/* Warm ambient orange light bloom when glowing like a bulb in light mode (extinguished when broken) */}
        {!isDark && !isBulbBroken && (
          <div 
            className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#ff5e1a]/35 via-[#ff783b]/40 to-[#ff4d00]/35 blur-md pointer-events-none -z-10 animate-pulse"
            style={{ animationDuration: '3.5s' }}
          />
        )}

        <motion.button 
          id="khushang-bulb-button"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('close-studio-zone'));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          data-cursor="TOP"
          animate={isExploding ? {
            x: [-8, 9, -7, 6, -3, 2, 0],
            y: [-4, 5, -3, 3, -1, 0],
            scale: [1.06, 0.95, 1.03, 0.98, 1]
          } : { x: 0, y: 0, scale: 1 }}
          transition={{ duration: 0.42, ease: "easeInOut" }}
          style={isBulbBroken ? {
            // Jagged fracture cuts: top-left corner break + bottom-right corner break (solid size, depth, width)
            clipPath: 'polygon(0% 45%, 3% 36%, 10% 28%, 7% 18%, 13% 10%, 16% 0%, 93% 0%, 98% 12%, 100% 30%, 100% 48%, 96% 56%, 88% 68%, 92% 76%, 83% 86%, 78% 100%, 10% 100%, 3% 90%, 0% 70%)'
          } : undefined}
          className={`${glassBase} ${
            isBulbBroken 
              ? 'bg-[#0a0a0d] border-neutral-700 text-neutral-400 shadow-xl px-5' 
              : `${logoStyle} px-5`
          } py-2.5 flex items-center gap-1.5 uppercase font-bold tracking-tighter leading-none select-none cursor-pointer hover:scale-105 active:scale-95 overflow-hidden`}
        >
          {/* Cracked broken glass fractures on top-left and bottom-right corners */}
          {isBulbBroken && (
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
              <svg 
                className="absolute inset-0 w-full h-full" 
                viewBox="0 0 100 100" 
                preserveAspectRatio="none"
              >
                {/* 1. TOP-LEFT FRACTURE CUT */}
                {/* Crisp white razor fracture edge highlight */}
                <path 
                  d="M 0 45 L 3 36 L 10 28 L 7 18 L 13 10 L 16 0" 
                  fill="none" 
                  stroke="rgba(255, 255, 255, 0.85)" 
                  strokeWidth="1.6" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                {/* Secondary glass fracture shadow for etched physical depth */}
                <path 
                  d="M 1 46 L 4 37 L 11 29 L 8 19 L 14 11 L 17 1" 
                  fill="none" 
                  stroke="rgba(0, 0, 0, 0.7)" 
                  strokeWidth="1.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                {/* Delicate internal stress cracks radiating inward near KHUSHANG */}
                <path 
                  d="M 10 28 L 19 33 L 26 31 M 7 18 L 15 22 L 22 17" 
                  fill="none" 
                  stroke="rgba(255, 255, 255, 0.55)" 
                  strokeWidth="0.9" 
                  strokeLinecap="round" 
                />

                {/* 2. BOTTOM-RIGHT FRACTURE CUT */}
                {/* Crisp white razor fracture edge highlight */}
                <path 
                  d="M 100 48 L 96 56 L 88 68 L 92 76 L 83 86 L 78 100" 
                  fill="none" 
                  stroke="rgba(255, 255, 255, 0.85)" 
                  strokeWidth="1.6" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                {/* Secondary glass fracture shadow for etched physical depth */}
                <path 
                  d="M 99 47 L 95 55 L 87 67 L 91 75 L 82 85 L 77 99" 
                  fill="none" 
                  stroke="rgba(0, 0, 0, 0.7)" 
                  strokeWidth="1.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                {/* Delicate internal stress cracks radiating inward near SINGH */}
                <path 
                  d="M 88 68 L 79 62 L 72 65 M 83 86 L 74 81 L 67 84" 
                  fill="none" 
                  stroke="rgba(255, 255, 255, 0.55)" 
                  strokeWidth="0.9" 
                  strokeLinecap="round" 
                />
              </svg>
            </div>
          )}

          <span className={`text-lg md:text-xl relative z-20 ${
            isBulbBroken 
              ? 'text-neutral-500' 
              : (isDark ? 'text-white' : 'text-neutral-950 font-black')
          }`}>
            KHUSHANG
          </span>
          <span className={`text-lg md:text-xl relative z-20 ${
            isBulbBroken 
              ? 'text-neutral-600' 
              : (isDark ? 'text-gray-400' : 'text-neutral-700 font-extrabold')
          }`}>
            SINGH
          </span>
        </motion.button>

        {/* EXPLOSION & GLASS SHATTER PARTICLES LAYER */}
        {isExploding && (
          <div className="absolute inset-0 pointer-events-none z-40 overflow-visible flex items-center justify-center">
            {/* 1. Flash of electrical burnout */}
            <motion.div
              initial={{ scale: 0.6, opacity: 1 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute w-28 h-16 rounded-full bg-gradient-to-r from-orange-200 via-white to-[#ff5e1a]/80 blur-sm pointer-events-none"
            />

            {/* 2. Shockwave expanding blast ring */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0.95 }}
              animate={{ scale: 2.4, opacity: 0 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-24 h-12 rounded-full border-2 border-[#ff5e1a]/90 shadow-[0_0_15px_rgba(255,94,26,0.8)] pointer-events-none"
            />

            {/* 3. High-velocity electrical sparks */}
            {particles.sparks.map((spark) => (
              <motion.div
                key={spark.id}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{
                  x: spark.targetX,
                  y: spark.targetY,
                  scale: 0,
                  opacity: 0
                }}
                transition={{
                  duration: spark.duration,
                  ease: [0.16, 1, 0.3, 1]
                }}
                style={{
                  backgroundColor: spark.color,
                  width: `${spark.size}px`,
                  height: `${spark.size}px`,
                  boxShadow: `0 0 6px ${spark.color}`
                }}
                className="absolute rounded-full pointer-events-none"
              />
            ))}

            {/* 4. Realistic sharp flying glass shards */}
            {particles.shards.map((shard) => (
              <motion.div
                key={shard.id}
                initial={{
                  x: shard.startX || 0,
                  y: shard.startY || 0,
                  rotate: 0,
                  opacity: 1,
                  scale: 1
                }}
                animate={{
                  x: shard.targetX,
                  y: shard.targetY,
                  rotate: shard.spin,
                  opacity: [1, 1, 0.85, 0],
                  scale: shard.isHeroChunk ? [1, 1.05, 0.95] : [1, 1.05, 0.4]
                }}
                transition={{
                  duration: shard.duration,
                  delay: shard.delay,
                  times: [0, 0.55, 0.85, 1],
                  ease: [0.22, 1, 0.36, 1]
                }}
                style={{
                  width: `${shard.size}px`,
                  height: `${shard.size * 1.3}px`,
                  clipPath: shard.clipPath
                }}
                className={`absolute bg-gradient-to-br from-white/95 via-orange-100/70 to-white/40 border border-white/80 shadow-[0_0_8px_rgba(255,255,255,0.8),0_0_16px_rgba(255,94,26,0.35)] backdrop-blur-sm pointer-events-none ${
                  shard.isHeroChunk ? 'z-50' : ''
                }`}
              />
            ))}
          </div>
        )}

        {/* Lamp Pull Rope attached directly to bottom-left side of the name box */}
        <div className="absolute left-7 top-full -mt-[1px]">
          <LampPullRope />
        </div>
      </motion.div>

      {/* 2. TOP RIGHT: PLAY MUSIC BUTTON (Revealed when past hero or in studio zone) */}
      <div className="pointer-events-auto min-h-[44px] flex items-center">
        <AnimatePresence mode="wait">
          {(isPastHero || isStudioZoneOpen) && (
            <motion.div
              key="header-play-music-button"
              initial={{ opacity: 0, scale: 0.95, x: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95, x: 20, filter: 'blur(8px)' }}
              transition={{
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <motion.button
                onClick={handleHeaderPlayClick}
                data-cursor={isPlaying ? "PAUSE" : "PLAY"}
                className={`${glassBase} ${musicGlassStyle} px-3.5 py-2 sm:px-4 sm:py-2.5 flex items-center gap-1.5 select-none cursor-pointer hover:scale-105 active:scale-95 group shadow-sm overflow-hidden`}
                aria-label={isPlaying ? 'Pause music' : 'Play music'}
              >
                {/*
                  Dynamic width text slot:
                  - When stopped: fitted to fully show "Play Music" completely with zero truncation
                  - When playing: fitted to fully show "Now Playing" completely
                  - When cycling to long song name: trims with smooth right fade without jittering button width
                */}
                <div 
                  className={`relative ${textSlotWidth} h-[18px] sm:h-[20px] flex items-center shrink-0 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isSongName 
                      ? '[mask-image:linear-gradient(to_right,black_76%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,black_76%,transparent_100%)]' 
                      : ''
                  }`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={currentText}
                      initial={{ opacity: 0, filter: 'blur(6px)', y: 4 }}
                      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                      exit={{ opacity: 0, filter: 'blur(6px)', y: -4 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className={`text-xs sm:text-sm font-bold tracking-tight uppercase whitespace-nowrap block w-full text-left ${
                        isSongName ? 'truncate' : ''
                      }`}
                    >
                      {currentText}
                    </motion.span>
                  </AnimatePresence>
                </div>

              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default GlobalHeader;
