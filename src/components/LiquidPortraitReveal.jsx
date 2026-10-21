import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * LiquidPortraitReveal
 * Displays theme-aware base portraits (Light: Orange Geometric, Dark: Neon Thermal DJ)
 * with an interactive liquid cloudy trail on cursor hover or touch drag.
 * 
 * Architecture:
 * 1. Permanent hardware-accelerated DOM <img> base:
 *    Guarantees the portrait is 100% reliably visible at all times across light/dark themes
 *    with zero blank frames, zero stale pixels, and instant CSS transitions.
 * 2. Active canvas overlay for liquid reveal:
 *    Renders the aligned blue X-Ray portrait through organic liquid cloudy particles.
 *    The canvas is 100% transparent when not interacting, ensuring zero frozen overlays
 *    and perfect theme synchronization.
 */
export default function LiquidPortraitReveal({ isDark }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const maskCanvasRef = useRef(null);

  // Preloaded X-Ray image ref for canvas overlay
  const xrayImgRef = useRef(null);

  // States
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Animation and physics refs
  const particlesRef = useRef([]);
  const lastPosRef = useRef(null);
  const rafIdRef = useRef(null);
  const isRunningRef = useRef(false);

  // Preload the blue X-Ray portrait for the liquid overlay
  useEffect(() => {
    let isCancelled = false;

    const loadSingle = (src, fallbackSrc = null) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => {
          if (fallbackSrc) {
            const fallback = new Image();
            fallback.onload = () => resolve(fallback);
            fallback.onerror = () => resolve(null);
            fallback.src = fallbackSrc;
            if (fallback.complete && fallback.naturalWidth > 0) resolve(fallback);
          } else {
            resolve(null);
          }
        };
        img.src = src;
        if (img.complete && img.naturalWidth > 0) {
          resolve(img);
        }
      });
    };

    loadSingle('/images/xray_portrait.webp', '/images/xray_portrait.png').then((xrayImg) => {
      if (isCancelled) return;
      if (xrayImg) xrayImgRef.current = xrayImg;
      setIsLoaded(true);
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  // When theme changes: immediately wipe canvas, clear particles, and cancel any active loop
  useEffect(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    isRunningRef.current = false;
    particlesRef.current = [];
    lastPosRef.current = null;
    setIsHovering(false);

    const cvs = canvasRef.current;
    if (cvs) {
      const ctx = cvs.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
      }
    }
    const maskCvs = maskCanvasRef.current;
    if (maskCvs) {
      const maskCtx = maskCvs.getContext('2d');
      if (maskCtx) {
        maskCtx.clearRect(0, 0, maskCvs.width, maskCvs.height);
      }
    }
  }, [isDark]);

  // Clean up if window loses focus or user switches tabs
  useEffect(() => {
    const handleWindowBlur = () => {
      setIsHovering(false);
      lastPosRef.current = null;
      particlesRef.current.forEach(p => {
        p.decay = Math.max(p.decay * 3, 0.06);
      });
    };
    window.addEventListener('blur', handleWindowBlur);
    return () => window.removeEventListener('blur', handleWindowBlur);
  }, []);

  // Spawn liquid cloudy puffs with organic fluid diffusion
  const spawnLiquidPuff = useCallback((x, y, radius, alpha = 1.0) => {
    // Keep max 90 particles active simultaneously for peak 60fps performance
    if (particlesRef.current.length > 90) {
      particlesRef.current.shift();
    }
    particlesRef.current.push({
      x,
      y,
      radius: radius * (0.9 + Math.random() * 0.25),
      maxRadius: radius * 1.55,
      alpha,
      // Snappy liquid reveal decay and responsive fluid spread
      decay: 0.0075 + Math.random() * 0.002,
      growth: 0.22 + Math.random() * 0.08,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22
    });
  }, []);

  // Interpolate trail between previous and current pointer position
  const addPointerTrail = useCallback((currentX, currentY) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width <= 0) return;

    const baseRadius = Math.max(36, Math.min(rect.width * 0.13, 54));

    if (!lastPosRef.current) {
      lastPosRef.current = { x: currentX, y: currentY };
      spawnLiquidPuff(currentX, currentY, baseRadius, 1.0);
      return;
    }

    const lastX = lastPosRef.current.x;
    const lastY = lastPosRef.current.y;
    const dist = Math.hypot(currentX - lastX, currentY - lastY);
    const stepSize = 8;
    const steps = Math.max(1, Math.min(Math.floor(dist / stepSize), 8));

    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const px = lastX + (currentX - lastX) * t;
      const py = lastY + (currentY - lastY) * t;

      spawnLiquidPuff(px, py, baseRadius, 0.95);

      if (Math.random() < 0.4) {
        const offsetAngle = Math.random() * Math.PI * 2;
        const offsetDist = Math.random() * (baseRadius * 0.4);
        spawnLiquidPuff(
          px + Math.cos(offsetAngle) * offsetDist,
          py + Math.sin(offsetAngle) * offsetDist,
          baseRadius * 0.72,
          0.7
        );
      }
    }

    lastPosRef.current = { x: currentX, y: currentY };
  }, [spawnLiquidPuff]);

  // Main canvas animation render loop with 1:1 pixel buffer compositing
  const startLoop = useCallback(() => {
    if (isRunningRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    isRunningRef.current = true;

    const render = () => {
      const cvs = canvasRef.current;
      const cont = containerRef.current;
      const xrayImg = xrayImgRef.current;

      if (!cvs || !cont) {
        isRunningRef.current = false;
        return;
      }

      const currentRect = cont.getBoundingClientRect();
      const width = currentRect.width;
      const height = currentRect.height;
      if (width <= 0 || height <= 0) {
        isRunningRef.current = false;
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetW = Math.round(width * dpr);
      const targetH = Math.round(height * dpr);

      if (cvs.width !== targetW || cvs.height !== targetH) {
        cvs.width = targetW;
        cvs.height = targetH;
      }

      // Initialize or retrieve offscreen mask canvas
      if (!maskCanvasRef.current) {
        maskCanvasRef.current = document.createElement('canvas');
      }
      const maskCanvas = maskCanvasRef.current;
      if (maskCanvas.width !== targetW || maskCanvas.height !== targetH) {
        maskCanvas.width = targetW;
        maskCanvas.height = targetH;
      }

      const ctx = cvs.getContext('2d');
      const maskCtx = maskCanvas.getContext('2d');

      // Clear both buffers completely
      ctx.clearRect(0, 0, targetW, targetH);
      maskCtx.clearRect(0, 0, targetW, targetH);

      const particles = particlesRef.current;
      const hasParticles = particles.length > 0;

      // Draw the liquid cloudy X-ray reveal only when particles and xrayImg exist
      if (hasParticles && xrayImg) {
        maskCtx.save();
        maskCtx.scale(dpr, dpr);
        maskCtx.globalCompositeOperation = 'source-over';

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          if (p.radius < p.maxRadius) {
            p.radius += p.growth;
          }
          p.alpha -= p.decay;

          if (p.alpha <= 0.01) {
            particles.splice(i, 1);
            continue;
          }

          const grad = maskCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          grad.addColorStop(0, `rgba(255, 255, 255, ${p.alpha * 0.98})`);
          grad.addColorStop(0.35, `rgba(255, 255, 255, ${p.alpha * 0.82})`);
          grad.addColorStop(0.7, `rgba(255, 255, 255, ${p.alpha * 0.38})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          maskCtx.fillStyle = grad;
          maskCtx.beginPath();
          maskCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          maskCtx.fill();
        }

        // Composite the aligned blue X-Ray portrait inside maskCanvas using source-in
        maskCtx.globalCompositeOperation = 'source-in';
        maskCtx.drawImage(xrayImg, 0, 0, width, height);
        maskCtx.restore();

        // Blit the masked X-ray portrait onto the main canvas at exact 1:1 pixel scale
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(maskCanvas, 0, 0);
      }

      // Continue animating while particles remain active
      if (particles.length > 0) {
        rafIdRef.current = requestAnimationFrame(render);
      } else {
        // When all particles decay, guarantee the canvas is 100% clean and transparent
        ctx.clearRect(0, 0, targetW, targetH);
        isRunningRef.current = false;
        lastPosRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(render);
  }, []);

  // Observers for layout measurement and viewport entry
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          const cvs = canvasRef.current;
          if (cvs && particlesRef.current.length === 0) {
            const ctx = cvs.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, cvs.width, cvs.height);
          }
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // Event handlers for mouse interaction
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    addPointerTrail(x, y);
    startLoop();
  }, [addPointerTrail, startLoop]);

  const handleMouseEnter = useCallback((e) => {
    setIsHovering(true);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    lastPosRef.current = { x, y };
    const baseRadius = Math.max(34, Math.min(rect.width * 0.12, 52));
    spawnLiquidPuff(x, y, baseRadius, 0.9);
    startLoop();
  }, [spawnLiquidPuff, startLoop]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    lastPosRef.current = null;
    // Accelerate decay so existing clouds vanish smoothly within ~150ms
    particlesRef.current.forEach(p => {
      p.decay = Math.max(p.decay * 3, 0.05);
    });
  }, []);

  // Touch event handlers for mobile
  const handleTouchMove = useCallback((e) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      addPointerTrail(x, y);
      startLoop();
    }
  }, [addPointerTrail, startLoop]);

  const handleTouchStart = useCallback((e) => {
    setIsHovering(true);
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    lastPosRef.current = { x, y };
    const baseRadius = Math.max(34, Math.min(rect.width * 0.12, 52));
    spawnLiquidPuff(x, y, baseRadius, 0.9);
    startLoop();
  }, [spawnLiquidPuff, startLoop]);

  const handleTouchEnd = useCallback(() => {
    setIsHovering(false);
    lastPosRef.current = null;
    particlesRef.current.forEach(p => {
      p.decay = Math.max(p.decay * 3, 0.05);
    });
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full aspect-[1122/1402] select-none cursor-crosshair overflow-visible transition-[filter] duration-700 ${
        isDark 
          ? '' 
          : 'drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)]'
      }`}
      style={{ touchAction: 'none', aspectRatio: '1122 / 1402' }}
    >
      {/* Soft Vignette Mask Wrapper: smoothly dissolves left/right arm borders and bottom torso border into background */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)'
        }}
      >
        <div 
          className="relative w-full h-full"
          style={{
            maskImage: 'linear-gradient(to bottom, black 0%, black 74%, transparent 98%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 74%, transparent 98%)'
          }}
        >
          {/* 1. Permanent hardware-accelerated DOM Base Portraits:
              Light portrait and Dark portrait transition cleanly via CSS opacity.
              Never hidden, never stale, 100% synchronized with theme state. */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Light theme base portrait */}
            <img
              src="/images/orange_geometric_portrait.png"
              alt="Khushang Singh portrait"
              className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-500 ${
                isDark ? 'opacity-0' : 'opacity-100'
              }`}
              loading="eager"
              decoding="async"
            />

            {/* Dark theme base portrait */}
            <picture>
              <source srcSet="/images/neon_thermal_portrait.webp" type="image/webp" />
              <img
                src="/images/neon_thermal_portrait.png"
                alt="Khushang Singh portrait (dark)"
                className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-500 ${
                  isDark ? 'opacity-100' : 'opacity-0'
                }`}
                loading="eager"
                decoding="async"
              />
            </picture>
          </div>

          {/* 2. Interactive Liquid Cloudy X-Ray Overlay Canvas:
              Draws glowing blue radiographic trails wherever the cursor hovers.
              Guaranteed 100% transparent when idle so the base portrait shines through. */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
        </div>
      </div>

      {/* 3. Floating Toast-like Affordance Box beside the portrait: fades away completely during hover */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 4 }}
        animate={{ 
          opacity: isHovering ? 0 : 1, 
          scale: isHovering ? 0.92 : 1, 
          y: isHovering ? -4 : [0, -3, 0] 
        }}
        transition={{
          y: isHovering 
            ? { duration: 0.2 } 
            : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: 0.25 },
          scale: { duration: 0.25 }
        }}
        style={{ pointerEvents: isHovering ? 'none' : 'auto' }}
        className={`absolute top-4 right-3 sm:top-8 sm:-right-8 lg:-right-12 z-30 px-3 py-1.5 rounded-lg border shadow-lg backdrop-blur-md flex items-center transition-colors duration-300 ${
          isDark
            ? 'bg-[#0f1117]/90 border-white/15 shadow-black/60'
            : 'bg-white/95 border-black/10 shadow-neutral-400/30'
        }`}
      >
        <span className="font-mono text-[11px] font-bold tracking-wide whitespace-nowrap text-[#ff5e1a]">
          Hover over me
        </span>

        {/* Crisp triangular beak pointing towards the portrait */}
        <div 
          className="hidden sm:block absolute -left-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-r-4 border-y-transparent"
          style={{
            borderRightColor: isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.2)'
          }}
        />
      </motion.div>
    </div>
  );
}
