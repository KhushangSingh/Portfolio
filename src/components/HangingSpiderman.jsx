import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * HangingSpiderman Component
 * A photorealistic, high-craft Spider-Man hanging upside down on a web line.
 *
 * Entrance Animation:
 * - Starts tucked behind the right-side anchor circle.
 * - Smoothly slides down on an extending tensile web line, descending to overlap the form card below.
 * - Settles with a gentle, realistic silk-spring rebound.
 *
 * Micro-interactions:
 * - Natural ambient pendulum sway once settled.
 * - Dynamic reactive pendulum swing on user click or hover.
 */
export default function HangingSpiderman({ isDark, shouldDescend = false }) {
  const [isSwinging, setIsSwinging] = useState(false);

  const triggerSway = () => {
    setIsSwinging(true);
    setTimeout(() => setIsSwinging(false), 2400);
  };

  return (
    <div 
      className="absolute left-1/2 -translate-x-1/2 top-[82%] z-30 pointer-events-auto select-none"
      style={{ 
        width: '140px',
        // Generous clipping box ensuring Spider-Man emerges cleanly from behind the circle and extends down over the form
        clipPath: 'inset(0px -140px -520px -140px)'
      }}
      onMouseEnter={triggerSway}
      onClick={triggerSway}
    >
      {/* 1. WEB ANCHOR NODE (Sticks to the circle rim right before Spider-Man descends) */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={shouldDescend ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.28, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20"
      >
        <svg 
          viewBox="0 0 60 28" 
          className="w-12 h-6 -mt-1 mx-auto drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)] pointer-events-none"
          fill="none"
        >
          {/* Radial Web Strands Clinging to the Orange Surface */}
          <path d="M 30 18 L 8 4 M 30 18 L 18 2 M 30 18 L 30 0 M 30 18 L 42 2 M 30 18 L 52 4" stroke="rgba(255,255,255,0.85)" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M 12 7 Q 20 12 30 13 Q 40 12 48 7" stroke="rgba(255,255,255,0.7)" strokeWidth="0.85" fill="none" />
          <path d="M 18 13 Q 24 16 30 17 Q 36 16 42 13" stroke="rgba(255,255,255,0.8)" strokeWidth="0.85" fill="none" />
          {/* Central Web Node */}
          <ellipse cx="30" cy="18" rx="2.2" ry="1.8" fill="white" />
        </svg>
      </motion.div>

      {/* 2. RAPPELLING DESCENT WRAPPER: Slides smoothly down from behind the anchor circle */}
      <motion.div
        initial={{ y: -220, opacity: 0 }}
        animate={shouldDescend ? { y: 0, opacity: 1 } : { y: -220, opacity: 0 }}
        transition={{
          type: 'spring',
          stiffness: 55,
          damping: 13,
          mass: 0.95,
          delay: 0.12
        }}
        className="relative w-full flex flex-col items-center will-change-transform"
      >
        {/* Tensile silk web line extending downwards from the anchor to overlap the form card */}
        <motion.div 
          initial={{ scaleY: 0.15 }}
          animate={shouldDescend ? { scaleY: 1 } : { scaleY: 0.15 }}
          transition={{
            type: 'spring',
            stiffness: 55,
            damping: 13,
            mass: 0.95,
            delay: 0.12
          }}
          style={{ transformOrigin: 'top center' }}
          className="w-[1.5px] h-28 sm:h-36 md:h-40 bg-gradient-to-b from-white via-white/90 to-white/65 shadow-[0_0_3px_rgba(255,255,255,0.75)]" 
        />

        {/* 3. PENDULUM SWINGING SPIDER-MAN CONTAINER */}
        <motion.div
          className="relative w-full -mt-1 cursor-pointer flex flex-col items-center"
          style={{ transformOrigin: 'top center' }}
          animate={isSwinging ? {
            rotate: [0, -9, 8, -5, 3, -1, 0],
            transition: { duration: 2.2, ease: [0.25, 1, 0.5, 1] }
          } : {
            rotate: [-2, 2, -2],
            transition: { duration: 4.8, repeat: Infinity, ease: "easeInOut" }
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96, y: -2 }}
        >
          {/* SPIDER-MAN IMAGE WITH MATTE FABRIC COLOR GRADING AND SOFT DROP SHADOW ON THE FORM */}
          <div className="relative w-full">
            <img
              src="/images/spiderman_upside_down.png"
              alt="Spider-Man hanging upside down"
              className="w-full h-auto object-contain pointer-events-none"
              style={{
                filter: `brightness(1.03) saturate(0.96) contrast(0.93) drop-shadow(0 10px 20px ${
                  isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.35)'
                })`,
              }}
              draggable={false}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
