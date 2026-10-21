import React, { useRef } from 'react';
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
 */
export default function StudioSection() {
  const { isDark } = useTheme();
  const trackRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start end', 'end end']
  });

  // Smooth rising & expanding full-screen morph
  const scale = useTransform(scrollYProgress, [0.05, 0.45], [0.90, 1.0]);
  const y = useTransform(scrollYProgress, [0.05, 0.45], [100, 0]);
  const borderRadius = useTransform(scrollYProgress, [0.05, 0.45], [28, 0]);
  const edgeBlendOpacity = useTransform(scrollYProgress, [0.38, 0.45], [0, 1]);

  return (
    <section 
      id="studio"
      ref={trackRef}
      className={`relative w-full h-[150vh] sm:h-[160vh] select-none transition-colors duration-500 ${
        isDark ? 'bg-[#0A0A0A]' : 'bg-white'
      }`}
    >
      {/* STICKY FULLSCREEN VIEWPORT CONTAINER */}
      <div className={`sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center transition-colors duration-500 ${
        isDark ? 'bg-[#0A0A0A]' : 'bg-white'
      }`}>
        
        {/* RISING & EXPANDING STUDIO CANVAS - Unified card with image flush to edges */}
        <motion.div
          style={{
            scale,
            y,
            borderRadius,
            isolation: 'isolate',
            WebkitMaskImage: '-webkit-radial-gradient(white, black)'
          }}
          className={`relative w-full h-full overflow-hidden will-change-transform flex items-center justify-center transition-colors duration-500 ${
            isDark ? 'bg-[#0A0A0A]' : 'bg-white'
          }`}
        >
          {/* 3D SPATIAL CAMERA ENGINE & INTERACTIVE ZONES */}
          <StudioCameraEngine />

          {/* Top & Bottom Seamless Edge Blending (fades in only as canvas reaches full-screen) */}
          <motion.div 
            style={{ opacity: edgeBlendOpacity }}
            className={`absolute top-0 inset-x-0 h-28 pointer-events-none z-10 transition-colors duration-500 ${
              isDark 
                ? 'bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/25 to-transparent' 
                : 'bg-gradient-to-b from-white/80 via-white/25 to-transparent'
            }`} 
          />
          <motion.div 
            style={{ opacity: edgeBlendOpacity }}
            className={`absolute bottom-0 inset-x-0 h-32 pointer-events-none z-10 transition-colors duration-500 ${
              isDark 
                ? 'bg-gradient-to-t from-[#0A0A0A]/85 via-[#0A0A0A]/30 to-transparent' 
                : 'bg-gradient-to-t from-white/85 via-white/30 to-transparent'
            }`} 
          />
        </motion.div>
      </div>
    </section>
  );
}

