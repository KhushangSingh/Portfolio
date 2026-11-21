import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

/**
 * Social Platform Vector Logos
 * Rendered with pixel precision directly inside the social action cursor badge.
 */
const SocialLogo = ({ platform, isDark }) => {
  switch (platform) {
    case 'behance':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-[#0057ff]">
          <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.171 3-4.148 0-6.555-2.618-6.555-6.983 0-4.496 2.766-7.017 6.641-7.017 4.148 0 6.183 2.871 5.86 6.983h-9.529c.119 2.22 1.487 3.518 3.585 3.518 1.488 0 2.502-.693 2.913-1.501h2.256zm-7.23-4.5c.084-1.748.983-2.83 2.545-2.83 1.564 0 2.378 1.082 2.463 2.83h-5.008zM4.97 19.5H0V3.5h5.539c3.072 0 4.961 1.341 4.961 3.86 0 1.644-.949 2.793-2.28 3.328 1.777.498 2.78 1.838 2.78 3.738 0 3.018-2.296 5.074-6.001 5.074zm-2.062-9.404h2.723c1.373 0 2.28-.584 2.28-1.879 0-1.168-.79-1.72-2.128-1.72H2.908v3.599zm0 6.404h2.951c1.564 0 2.518-.68 2.518-2.068 0-1.422-.983-2.068-2.584-2.068H2.908v4.136z" />
        </svg>
      );

    case 'dribbble':
      return (
        <svg viewBox="0 0 256 256" className="w-6 h-6" preserveAspectRatio="xMidYMid">
          <path d="M128 8.5c66 0 119.4 53.4 119.4 119.3S194 247.2 128 247.2 8.6 193.8 8.6 127.9 62 8.5 128 8.5z" fill="#E74D89" />
          <path d="M128 255.7c-70.6 0-128-57.3-128-127.8C0 57.3 57.4 0 128 0s128 57.3 128 127.8-57.4 127.9-128 127.9zm107.9-110.4c-3.7-1.2-33.8-10.1-68.1-4.7 14.3 39.2 20.1 71.2 21.2 77.8 24.6-16.5 42.1-42.7 46.9-73.1zm-65.2 83.2c-1.6-9.6-8-43-23.3-82.8-.2.1-.5.2-.7.2-61.7 21.5-83.8 64.2-85.8 68.2 18.5 14.4 41.8 23 67.1 23 15.1.1 29.6-3 42.7-8.6zM46.8 201c2.5-4.2 32.5-53.8 88.9-72.1 1.4-.5 2.9-.9 4.3-1.3-2.7-6.2-5.7-12.4-8.9-18.5-54.6 16.3-107.6 15.6-112.4 15.5 0 1.1-.1 2.2-.1 3.3.1 28.1 10.7 53.7 28.2 73.1zM21 105.6c4.9.1 49.9.3 101.1-13.3C104 60.1 84.4 33.1 81.6 29.2 50.9 43.6 28.1 71.8 21 105.6zm81.4-83.8c3 4 22.9 31 40.8 63.9 38.9-14.6 55.3-36.6 57.3-39.4-19.3-17.1-44.7-27.5-72.5-27.5-8.8 0-17.4 1.1-25.6 3zm110.2 37.1c-2.3 3.1-20.6 26.6-61 43.1 2.5 5.2 5 10.5 7.3 15.8.8 1.9 1.6 3.8 2.4 5.6 36.4-4.6 72.5 2.8 76.1 3.5-.3-25.7-9.5-49.4-24.8-68z" fill="#B2215A" />
        </svg>
      );

    case 'medium':
      return (
        <svg viewBox="0 0 24 24" className={`w-6 h-6 fill-current ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
        </svg>
      );

    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-[#0A66C2]">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      );

    case 'github':
      return (
        <svg viewBox="0 0 24 24" className={`w-6 h-6 fill-current ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      );

    case 'twitter':
    case 'x':
      return (
        <svg viewBox="0 0 24 24" className={`w-5 h-5 fill-current ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );

    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-[#E4405F]">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );

    default:
      return null;
  }
};

/**
 * ActionCursor Component
 * Specialized Social Platform Logo Cursor:
 * - Automatically activates ONLY when hovering over social platform links.
 * - Transitions directly from the bespoke orange pointer triangle to the official vector logo badge with zero intermediate cursor flicker.
 * - Strictly disabled on draggable elements, cards, and touch devices where native cursors operate directly.
 */
export const ActionCursor = () => {
  const { isDark } = useTheme();
  const [platform, setPlatform] = useState(null);
  const activePlatformRef = useRef(null);

  // Direct, zero-lag pointer tracking
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  useEffect(() => {
    // Disable on touch devices to respect native touch interaction
    if (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    ) {
      return;
    }

    const updatePointer = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target;
      if (!target) return;

      const socialEl = target.closest(
        '[data-social], [data-cursor-social], a[data-social], a[href*="behance"], a[href*="dribbble"], a[href*="medium"], a[href*="linkedin"], a[href*="github"], a[href*="twitter"], a[href*="x.com"], a[href*="instagram"]'
      );

      if (socialEl) {
        const explicit = (
          socialEl.getAttribute('data-social') ||
          socialEl.getAttribute('data-cursor-social') ||
          ''
        ).toLowerCase();

        let detected = explicit;
        if (!detected) {
          const href = (socialEl.getAttribute('href') || '').toLowerCase();
          if (href.includes('behance')) detected = 'behance';
          else if (href.includes('dribbble')) detected = 'dribbble';
          else if (href.includes('medium')) detected = 'medium';
          else if (href.includes('linkedin')) detected = 'linkedin';
          else if (href.includes('github')) detected = 'github';
          else if (href.includes('twitter') || href.includes('x.com')) detected = 'x';
          else if (href.includes('instagram')) detected = 'instagram';
        }

        if (detected && activePlatformRef.current !== detected) {
          activePlatformRef.current = detected;
          setPlatform(detected);
        }
      } else {
        if (activePlatformRef.current !== null) {
          activePlatformRef.current = null;
          setPlatform(null);
        }
      }
    };

    window.addEventListener('pointermove', updatePointer, { passive: true });
    window.addEventListener('pointerover', updatePointer, { passive: true });

    return () => {
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('pointerover', updatePointer);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden">
      <AnimatePresence>
        {platform && (
          <motion.div
            key={platform}
            style={{
              x: mouseX,
              y: mouseY,
              translateX: '-50%',
              translateY: '-50%',
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-0 left-0 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl border pointer-events-none will-change-transform ${
              isDark
                ? 'bg-[#121214]/90 border-white/20 shadow-[0_12px_28px_rgba(0,0,0,0.85)]'
                : 'bg-white/95 border-black/15 shadow-[0_12px_28px_rgba(0,0,0,0.18)]'
            }`}
          >
            <SocialLogo platform={platform} isDark={isDark} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActionCursor;
