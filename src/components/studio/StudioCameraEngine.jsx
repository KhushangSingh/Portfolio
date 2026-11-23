import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { playSoundEffect } from '../../utils/soundEffects';
import MonitorOS from './MonitorOS';
import BookshelfZone from './BookshelfZone';
import VinylZone from './VinylZone';
import ArtWallZone from './ArtWallZone';
import BayWindowZone from './BayWindowZone';
import ThinkingCouchZone from './ThinkingCouchZone';

// 6 Interactive Physical Zones with Deep 3D Spatial Trajectories
const ZONES = [
  {
    id: 'monitor',
    title: 'Battlestation Monitor',
    subtitle: 'Ultrawide Desktop OS (Day vs Night)',
    x: '84%',
    y: '48%',
    originX: '84%',
    originY: '48%',
    scale: 4.8,
    rotateX: 12,
    rotateY: -18,
    rotateZ: -3,
    component: MonitorOS,
    width: '18%',
    height: '24%'
  },
  {
    id: 'bookshelf',
    title: 'Floating Bookshelf',
    subtitle: 'Pull-out Design & Philosophy Library',
    x: '82%',
    y: '20%',
    originX: '82%',
    originY: '20%',
    scale: 4.6,
    rotateX: -14,
    rotateY: -16,
    rotateZ: 2,
    component: BookshelfZone,
    width: '24%',
    height: '14%'
  },
  {
    id: 'vinyl',
    title: 'Vinyl Deck & Crate',
    subtitle: 'Turntable & Lo-Fi Record Library',
    x: '17%',
    y: '58%',
    originX: '17%',
    originY: '58%',
    scale: 4.9,
    rotateX: 18,
    rotateY: 20,
    rotateZ: 3,
    component: VinylZone,
    width: '20%',
    height: '22%'
  },
  {
    id: 'artwall',
    title: 'Artwork Pin-Board',
    subtitle: 'Authentic Sketchbook & Design Prints',
    x: '22%',
    y: '32%',
    originX: '22%',
    originY: '32%',
    scale: 4.5,
    rotateX: 6,
    rotateY: 18,
    rotateZ: -2,
    component: ArtWallZone,
    width: '22%',
    height: '20%'
  },
  {
    id: 'window',
    title: 'San Francisco Bay Window',
    subtitle: 'Sunlit Bridge & Night Neon Skyline',
    x: '52%',
    y: '34%',
    originX: '52%',
    originY: '34%',
    scale: 4.2,
    rotateX: 8,
    rotateY: -4,
    rotateZ: 1,
    component: BayWindowZone,
    width: '28%',
    height: '28%'
  },
  {
    id: 'couch',
    title: 'Thinking Nook',
    subtitle: 'Steaming Coffee & Ideation Moleskine',
    x: '45%',
    y: '65%',
    originX: '45%',
    originY: '65%',
    scale: 4.6,
    rotateX: 16,
    rotateY: -6,
    rotateZ: -2,
    component: ThinkingCouchZone,
    width: '22%',
    height: '22%'
  }
];

export default function StudioCameraEngine({ onZoneStateChange }) {
  const { isDark } = useTheme();
  const [activeZoneId, setActiveZoneId] = useState(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [hoveredZoneId, setHoveredZoneId] = useState(null);
  const containerRef = useRef(null);
  const diveTimeoutRef = useRef(null);

  // Cinematic rack-focus ease-in and ease-out blur envelope controls
  const blurControls = useAnimationControls();
  const bloomControls = useAnimationControls();
  const isFirstMountRef = useRef(true);

  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }

    // Velvety ease-in (0 -> 40%) and ease-out (40% -> 100%) Gaussian blur envelope
    blurControls.start({
      filter: ['blur(0px)', 'blur(7px)', 'blur(0px)'],
      transition: {
        duration: 0.82,
        times: [0, 0.40, 1],
        ease: ['easeInOut', 'easeOut']
      }
    });

    bloomControls.start({
      opacity: [0, 0.35, 0],
      transition: {
        duration: 0.82,
        times: [0, 0.40, 1],
        ease: ['easeInOut', 'easeOut']
      }
    });
  }, [isDark, blurControls, bloomControls]);

  const activeZone = ZONES.find((z) => z.id === activeZoneId) || null;
  const ActiveComponent = activeZone?.component;

  // Zone dive trigger: dramatic camera zoom-in and 3D rotation first, then reveals closer look
  const handleZoneClick = (zoneId) => {
    if (activeZoneId) return;
    playSoundEffect('open');

    // Pin scroll position directly to studio section so there is 0 top cut-off and 0 white space below
    const studioEl = document.getElementById('studio');
    if (studioEl) {
      const rect = studioEl.getBoundingClientRect();
      const targetScroll = Math.round(window.scrollY + rect.top);
      if (Math.abs(rect.top) > 1) {
        if (window.__lenis) {
          window.__lenis.scrollTo(targetScroll, { immediate: true });
        } else {
          window.scrollTo({ top: targetScroll });
        }
      }
    }

    setActiveZoneId(zoneId);
    if (onZoneStateChange) onZoneStateChange(true);
    setIsOverlayVisible(false);

    if (zoneId === 'monitor') {
      window.dispatchEvent(new CustomEvent('monitor-view-open'));
    } else {
      window.dispatchEvent(new CustomEvent('studio-zone-open'));
    }

    // Let the 3D camera swooping zoom & rotation play out before displaying closer look
    if (diveTimeoutRef.current) clearTimeout(diveTimeoutRef.current);
    diveTimeoutRef.current = setTimeout(() => {
      setIsOverlayVisible(true);
    }, 750);
  };

  const handleStepBack = () => {
    window.dispatchEvent(new CustomEvent('monitor-view-close'));
    window.dispatchEvent(new CustomEvent('studio-zone-close'));
    if (diveTimeoutRef.current) clearTimeout(diveTimeoutRef.current);
    // Smoothly dissolve the closer look overlay first
    setIsOverlayVisible(false);

    // After overlay fades out, glide the camera smoothly back to overview position
    setTimeout(() => {
      setActiveZoneId(null);
      if (onZoneStateChange) onZoneStateChange(false);
    }, 280);
  };

  // Escape key handler to smoothly step back
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeZoneId) {
        handleStepBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeZoneId]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (diveTimeoutRef.current) clearTimeout(diveTimeoutRef.current);
      if (onZoneStateChange) onZoneStateChange(false);
    };
  }, []);

  // Scroll lock: When any internal popup/zone is open, block all studio section & page scrolling
  useEffect(() => {
    if (!activeZoneId) return;

    if (window.__lenis) {
      window.__lenis.stop();
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Intercept wheel events
    const handleWheel = (e) => {
      let el = e.target;
      while (el && el !== document.body && el !== document.documentElement) {
        const style = window.getComputedStyle(el);
        const overflowY = style.overflowY;
        if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
          const atTop = el.scrollTop <= 0 && e.deltaY < 0;
          const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight && e.deltaY > 0;
          if (!atTop && !atBottom) {
            return; // Allow internal element scroll
          }
        }
        el = el.parentElement;
      }
      e.preventDefault();
    };

    // Intercept touchmove events on mobile/trackpads
    const handleTouchMove = (e) => {
      let el = e.target;
      while (el && el !== document.body && el !== document.documentElement) {
        const style = window.getComputedStyle(el);
        const overflowY = style.overflowY;
        if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
          return; // Allow internal element touch scroll
        }
        el = el.parentElement;
      }
      e.preventDefault();
    };

    // Intercept keyboard scroll keys
    const handleScrollKeys = (e) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
        const tagName = e.target.tagName?.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea') return;
        let el = e.target;
        while (el && el !== document.body && el !== document.documentElement) {
          const style = window.getComputedStyle(el);
          if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
            return;
          }
          el = el.parentElement;
        }
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleScrollKeys);

    return () => {
      if (window.__lenis) {
        window.__lenis.start();
      }
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleScrollKeys);
    };
  }, [activeZoneId]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none flex items-center justify-center transition-colors duration-500 ${
        isDark ? 'bg-[#0A0A0A]' : 'bg-white'
      }`}
      style={{ perspective: 1050 }}
    >
      
      {/* ==============================================================
          3D SPATIAL CAMERA STAGE
          Deep cinematic 3D swoop, spatial rotation and high-scale zoom
          ============================================================== */}
      <motion.div
        animate={{
          scale: activeZone ? activeZone.scale : 1,
          rotateX: activeZone ? activeZone.rotateX : 0,
          rotateY: activeZone ? activeZone.rotateY : 0,
          rotateZ: activeZone ? (activeZone.rotateZ || 0) : 0,
          transformOrigin: activeZone ? `${activeZone.originX} ${activeZone.originY}` : '50% 50%',
        }}
        transition={{
          type: 'spring',
          damping: 24,
          stiffness: 85,
          mass: 1.05
        }}
        className="relative w-full h-full will-change-transform flex items-center justify-center overflow-hidden"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* DUAL-THEME BASE STUDIO ILLUSTRATIONS WITH EASE-IN-OUT RACK-FOCUS DISSOLVE */}
        <motion.div 
          animate={blurControls}
          initial={{ filter: 'blur(0px)' }}
          className="absolute inset-0 w-full h-full pointer-events-none will-change-[filter]"
        >
          {/* Sunlit Daylight Studio */}
          <motion.img
            src="/images/sunlit_studio.png"
            alt="Khushang's Creative Bedroom Studio - Sunlit Daylight"
            animate={{
              opacity: isDark ? 0 : 1,
              scale: isDark ? 1.012 : 1
            }}
            transition={{
              duration: 0.82,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="absolute inset-0 w-full h-full object-cover object-center will-change-[opacity,transform]"
            loading="eager"
          />

          {/* Neon Night Studio */}
          <motion.img
            src="/images/city_night_studio.png"
            alt="Khushang's Creative Bedroom Studio - Neon Night City"
            animate={{
              opacity: isDark ? 1 : 0,
              scale: isDark ? 1 : 1.012
            }}
            transition={{
              duration: 0.82,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="absolute inset-0 w-full h-full object-cover object-center will-change-[opacity,transform]"
            loading="eager"
          />

          {/* Soft Twilight Veil */}
          <motion.div 
            animate={{
              opacity: isDark ? 0.25 : 0.20
            }}
            transition={{
              duration: 0.82,
              ease: [0.4, 0, 0.2, 1]
            }}
            className={`absolute inset-0 pointer-events-none mix-blend-soft-light ${
              isDark 
                ? 'bg-gradient-to-tr from-[#0f172a] via-[#1e1b4b] to-[#0284c7]' 
                : 'bg-gradient-to-tr from-[#fed7aa] via-[#fde68a] to-[#fef08a]'
            }`}
          />

          {/* Twilight Atmospheric Bloom Pulse during crossfade */}
          <motion.div 
            animate={bloomControls}
            initial={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none bg-black/35"
          />
        </motion.div>

        {/* ==============================================================
            PHYSICAL ZONE HOTSPOTS (OVERVIEW MODE)
            Interactive tactile zones mapped on the illustration
            ============================================================== */}
        {!activeZone && (
          <div className="absolute inset-0 z-20 pointer-events-auto">
            {ZONES.map((zone) => {
              const isHovered = hoveredZoneId === zone.id;
              return (
                <div
                  key={zone.id}
                  onClick={() => handleZoneClick(zone.id)}
                  onMouseEnter={() => setHoveredZoneId(zone.id)}
                  onMouseLeave={() => setHoveredZoneId(null)}
                  style={{
                    left: zone.x,
                    top: zone.y,
                    width: zone.width,
                    height: zone.height,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute cursor-pointer flex items-center justify-center group"
                >
                  {/* Subtle target reticle bounding box on hover */}
                  <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 ${
                    isHovered 
                      ? 'border-[#ff5e1a] bg-[#ff5e1a]/10 shadow-[0_0_25px_rgba(255,94,26,0.4)] scale-105' 
                      : 'border-transparent bg-transparent'
                  }`}>
                    {/* Corner Reticle Brackets */}
                    {isHovered && (
                      <>
                        <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-white pointer-events-none" />
                        <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-white pointer-events-none" />
                        <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-white pointer-events-none" />
                        <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-white pointer-events-none" />
                      </>
                    )}
                  </div>

                  {/* Zone label */}
                  <div className={`relative z-10 px-2.5 py-1.5 rounded-lg border shadow-2xl transition-all duration-300 flex items-center justify-center ${
                    isHovered
                      ? 'bg-[#ff5e1a] text-white border-white scale-125 shadow-[#ff5e1a]/80'
                      : 'bg-black/75 text-[#ff5e1a] border-[#ff5e1a]/50 hover:bg-[#ff5e1a] hover:text-white'
                  }`}>
                    <span className="font-mono text-[10px] font-bold">{zone.title}</span>
                  </div>

                  {/* Clean Single-Line Hover Cue */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute -bottom-10 pointer-events-none whitespace-nowrap z-30"
                      >
                        <div className="px-3 py-1 rounded-lg bg-black/90 text-white font-mono text-[10px] font-bold border border-[#ff5e1a]/60 shadow-xl flex items-center gap-1.5">
                          <span className="text-[#ff5e1a]">CLICK TO DIVE:</span>
                          <span>{zone.title}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

      </motion.div>

      {/* ==============================================================
          ACTIVE ZONE INTERACTIVE WORKSPACE OVERLAY
          Dissolves in seamlessly AFTER the 3D camera completes its deep dive
          ============================================================== */}
      <AnimatePresence>
        {activeZone && isOverlayVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => {
              if (e.target === e.currentTarget) handleStepBack();
            }}
            className={`absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer ${
              activeZone.id === 'window' || activeZone.id === 'monitor' ? 'p-0' : 'p-4'
            }`}
          >
            {/* Minimalist Top-Right Close Button (for modal popup zones; window zone and monitor zone provide their own integrated controls) */}
            {activeZone.id !== 'window' && activeZone.id !== 'monitor' && (
              <button
                onClick={handleStepBack}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2.5 rounded-full bg-black/85 hover:bg-[#ff5e1a] text-white/80 hover:text-white border border-white/20 hover:border-transparent transition-all shadow-2xl cursor-pointer group"
                aria-label="Close"
                title="Close (ESC)"
              >
                <span className="px-1 text-xs font-semibold">Close</span>
              </button>
            )}

            <div 
              onClick={(e) => e.stopPropagation()} 
              className="relative w-full h-full flex items-center justify-center cursor-default pointer-events-auto"
            >
              {ActiveComponent && (
                <ActiveComponent onCloseZone={handleStepBack} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
