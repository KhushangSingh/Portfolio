import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

import StudioCameraEngine from './studio/StudioCameraEngine';

/**
 * StudioSection Component
 * Scroll-driven cinematic visual transition above Footer:
 * - As the user scrolls into the section, the studio canvas smoothly rises from below
 *   and expands from an inset card into a clean, complete full-screen cover.
 * - Hosts the Spatial 3D Camera Engine with 6 interactive physical zones
 *   (Monitor OS, Bookshelf, Vinyl Turntable, Art Wall, Bay Window, Thinking Nook).
 * - When any zoom-in zone is active, container locks to full viewport (fixed inset-0)
 *   eliminating any white gap below or top clipping.
 */
export default function StudioSection() {
  const { isDark } = useTheme();
  const trackRef = useRef(null);
  const [isZoneOpen, setIsZoneOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsZoneOpen(true);
    const handleClose = () => setIsZoneOpen(false);

    window.addEventListener('studio-zone-open', handleOpen);
    window.addEventListener('monitor-view-open', handleOpen);
    window.addEventListener('studio-zone-close', handleClose);
    window.addEventListener('monitor-view-close', handleClose);

    return () => {
      window.removeEventListener('studio-zone-open', handleOpen);
      window.removeEventListener('monitor-view-open', handleOpen);
      window.removeEventListener('studio-zone-close', handleClose);
      window.removeEventListener('monitor-view-close', handleClose);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start end', 'end end']
  });

  // Smooth rising & expanding full-screen morph (calibrated for 240vh runway)
  const scale = useTransform(scrollYProgress, [0.05, 0.40], [0.90, 1.0]);
  const y = useTransform(scrollYProgress, [0.05, 0.40], [100, 0]);
  const borderRadius = useTransform(scrollYProgress, [0.05, 0.40], [28, 0]);

  return (
    <section 
      id="studio"
      ref={trackRef}
      className={`relative w-full h-[220vh] sm:h-[240vh] select-none transition-colors duration-500 ${
        isDark ? 'bg-[#0A0A0A]' : 'bg-white'
      }`}
    >
      {/* STICKY / FIXED FULLSCREEN VIEWPORT CONTAINER */}
      <div className={`${
        isZoneOpen 
          ? 'fixed inset-0 z-40 w-screen h-screen' 
          : 'sticky top-0 h-screen w-full'
      } overflow-hidden flex items-center justify-center transition-colors duration-500 ${
        isDark ? 'bg-[#0A0A0A]' : 'bg-white'
      }`}>
        
        {/* RISING & EXPANDING STUDIO CANVAS - Unified card with image flush to edges */}
        <motion.div
          style={{
            scale: isZoneOpen ? 1 : scale,
            y: isZoneOpen ? 0 : y,
            borderRadius: isZoneOpen ? 0 : borderRadius,
            isolation: 'isolate',
            WebkitMaskImage: isZoneOpen ? 'none' : '-webkit-radial-gradient(white, black)'
          }}
          className={`relative w-full h-full overflow-hidden will-change-transform flex items-center justify-center transition-colors duration-500 ${
            isDark ? 'bg-[#0A0A0A]' : 'bg-white'
          }`}
        >
          {/* 3D SPATIAL CAMERA ENGINE & INTERACTIVE ZONES */}
          <StudioCameraEngine onZoneStateChange={setIsZoneOpen} />
        </motion.div>
      </div>
    </section>
  );
}

