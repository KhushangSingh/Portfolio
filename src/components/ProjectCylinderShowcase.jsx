import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { designData } from '../constants/data';

// Exactly 5 curated showcase items representing the best & latest works
const SHOWCASE_ITEMS = [
  {
    id: 1,
    title: "OtakuCircle",
    subtitle: "Community & Anime Cataloging Platform",
    category: "Product Design",
    tag: "Web Application",
    year: "2024",
    image: "/images/otakucircle_cover.jpg",
    accent: "#10b981",
    fallbackBg: "from-[#0d3d2c] via-[#107049] to-[#128a5a]"
  },
  {
    id: 2,
    title: "SquadSync",
    subtitle: "Merit-Based Team Collaboration & Studio Suite",
    category: "Product Design",
    tag: "Final Project @ VIT",
    year: "2024",
    image: "/images/squadsync_cover.jpg",
    accent: "#ec4899",
    fallbackBg: "from-[#831843] via-[#9d174d] to-[#be185d]"
  },
  {
    id: 3,
    title: "Arkade Ledgerly",
    subtitle: "High-Speed Resource Library & Asset Vault",
    category: "Design Engineering",
    tag: "Tool Hub & Vault",
    year: "2024",
    image: "/images/ledgerly_cover.jpg",
    accent: "#f97316",
    fallbackBg: "from-[#7c2d12] via-[#c2410c] to-[#ea580c]"
  },
  {
    id: 201,
    title: "McDelivery Redesign",
    subtitle: "Heuristic Usability Audit & Order Flow Overhaul",
    category: "UX Research",
    tag: "Usability Research",
    year: "2024",
    image: "/images/McDonaldsUXResearchCover.jpg",
    accent: "#f59e0b",
    fallbackBg: "from-[#450a0a] via-[#851e1e] to-[#b45309]"
  },
  {
    id: 301,
    title: "EV Club Identity",
    subtitle: "Electric Mobility Visual Architecture & Portal",
    category: "Brand & Systems",
    tag: "Visual Systems",
    year: "2024",
    image: "/images/EVClubWebCover.png",
    accent: "#38bdf8",
    fallbackBg: "from-[#0f172a] via-[#1e293b] to-[#0284c7]"
  }
];

export const ProjectCylinderShowcase = ({ onProjectClick }) => {
  const { isDark } = useTheme();
  const total = SHOWCASE_ITEMS.length;

  // Outer scroll container reference for scroll pinning
  const trackRef = useRef(null);
  const containerRef = useRef(null);

  // Position management
  const [displayPos, setDisplayPos] = useState(0);
  const targetPosRef = useRef(0);
  const currentPosRef = useRef(0);
  const progressLineRef = useRef(null);
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const hasMovedRef = useRef(false);

  // Drag interaction tracking
  const startXRef = useRef(0);
  const startPosRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const velocityRef = useRef(0);

  // Auto-centering debounce timer
  const scrollSnapTimeoutRef = useRef(null);
  const isAutoSnappingRef = useRef(false);

  // Responsive dimensions for 16:9 landscape cards & inward cylinder curvature
  const [dimensions, setDimensions] = useState({
    cardWidth: 640,
    cardHeight: 360,
    cylinderRadius: 1300,
    angleDeg: 28
  });

  // Track broken images to gracefully fall back to colored gradient cards
  const [brokenImages, setBrokenImages] = useState({});

  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window === 'undefined') return;
      const w = window.innerWidth;
      if (w < 640) {
        const cardW = Math.min(w - 32, 360);
        setDimensions({
          cardWidth: cardW,
          cardHeight: (cardW * 9) / 16,
          cylinderRadius: 750,
          angleDeg: 30
        });
      } else if (w < 1024) {
        const cardW = 500;
        setDimensions({
          cardWidth: cardW,
          cardHeight: (cardW * 9) / 16,
          cylinderRadius: 1050,
          angleDeg: 28
        });
      } else {
        const cardW = 640;
        setDimensions({
          cardWidth: cardW,
          cardHeight: (cardW * 9) / 16,
          cylinderRadius: 1300,
          angleDeg: 28
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // 1. PINNED SCROLL & AUTO-CENTERING SNAP:
  // As user scrolls vertically through this pinned section, vertical scroll rotates through all projects.
  // When scrolling settles, if a card is placed a little left or right of center, it automatically
  // snaps and centers that card smoothly.
  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      if (scrollableDistance <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

      // If user is not pointer-dragging, vertical scroll drives target position
      if (!isDraggingRef.current) {
        targetPosRef.current = progress * (total - 1);
      }

      // Clear existing snap timeout on active scroll
      if (scrollSnapTimeoutRef.current) {
        clearTimeout(scrollSnapTimeoutRef.current);
      }

      // Only perform auto-center snap when the user is within the showcase section
      // and not currently dragging
      if (!isDraggingRef.current && progress > 0.02 && progress < 0.98) {
        scrollSnapTimeoutRef.current = setTimeout(() => {
          if (isDraggingRef.current) return;
          
          const currentTarget = targetPosRef.current;
          const nearestIndex = Math.round(currentTarget);
          const offset = Math.abs(currentTarget - nearestIndex);

          // Auto-position to center ONLY if the card is slightly left or right (offset between 0.02 and 0.48)
          if (offset > 0.02 && offset <= 0.48) {
            isAutoSnappingRef.current = true;
            targetPosRef.current = nearestIndex;

            // Smoothly align page scroll position to the exact center of this card
            const targetScrollY = window.scrollY + rect.top + (nearestIndex / (total - 1)) * scrollableDistance;
            
            if (window.__lenis) {
              window.__lenis.scrollTo(targetScrollY, { duration: 0.6, immediate: false });
            } else {
              window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
            }

            setTimeout(() => {
              isAutoSnappingRef.current = false;
            }, 650);
          }
        }, 180); // Snappy settle time
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollSnapTimeoutRef.current) clearTimeout(scrollSnapTimeoutRef.current);
    };
  }, [total]);

  // 2. SMOOTH PHYSICAL INTERPOLATION LOOP (60-120fps)
  useEffect(() => {
    let rafId;
    const animate = () => {
      const diff = targetPosRef.current - currentPosRef.current;
      if (Math.abs(diff) > 0.0005) {
        // Dynamic adaptive lerp: scales smoothly with scroll distance/velocity so fast scrolls update instantly
        const absDiff = Math.abs(diff);
        const lerpFactor = isDraggingRef.current 
          ? 0.38 
          : Math.min(0.48, 0.15 + absDiff * 0.15);
        currentPosRef.current += diff * lerpFactor;
        setDisplayPos(currentPosRef.current);
      }

      // Update progress bar with 120fps GPU hardware acceleration (zero layout reflow & zero latency)
      if (progressLineRef.current) {
        const ratio = Math.max(0, Math.min(1, currentPosRef.current / (total - 1)));
        progressLineRef.current.style.transform = `scaleX(${ratio})`;
      }

      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [total]);

  // 3. HORIZONTAL POINTER DRAG (Mouse click-and-drag & touch)
  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;

    if (scrollSnapTimeoutRef.current) clearTimeout(scrollSnapTimeoutRef.current);
    isDraggingRef.current = true;
    setIsDragging(true);
    hasMovedRef.current = false;
    startXRef.current = e.clientX;
    startPosRef.current = targetPosRef.current;
    lastXRef.current = e.clientX;
    lastTimeRef.current = Date.now();
    velocityRef.current = 0;

    const onPointerMove = (moveEv) => {
      if (!isDraggingRef.current) return;
      const dx = moveEv.clientX - startXRef.current;
      if (Math.abs(dx) > 4) hasMovedRef.current = true;

      const now = Date.now();
      const dt = Math.max(1, now - lastTimeRef.current);
      velocityRef.current = ((moveEv.clientX - lastXRef.current) / dt) * 16;
      lastXRef.current = moveEv.clientX;
      lastTimeRef.current = now;

      // Sensitivity: dragging ~dimensions.cardWidth * 0.7 rotates by 1 card
      const deltaCards = -dx / (dimensions.cardWidth * 0.7);
      targetPosRef.current = Math.max(-0.2, Math.min(total - 0.8, startPosRef.current + deltaCards));
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);

      // Momentum throw on release
      const throwImpulse = -velocityRef.current * 0.035;
      const targetWithImpulse = targetPosRef.current + throwImpulse;

      // Auto-snap to exact nearest integer project card within [0, total - 1]
      const finalIndex = Math.max(0, Math.min(total - 1, Math.round(targetWithImpulse)));
      targetPosRef.current = finalIndex;

      // Also align scroll position to match the released snap position
      if (trackRef.current) {
        const rect = trackRef.current.getBoundingClientRect();
        const scrollableDistance = rect.height - window.innerHeight;
        if (scrollableDistance > 0) {
          const targetScrollY = window.scrollY + rect.top + (finalIndex / (total - 1)) * scrollableDistance;
          if (window.__lenis) {
            window.__lenis.scrollTo(targetScrollY, { duration: 0.6, immediate: false });
          } else {
            window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
          }
        }
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  // 4. WHEEL LISTENER FOR TRACKPAD HORIZONTAL SWIPE
  const handleWheel = (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 8) {
      targetPosRef.current = Math.max(
        0,
        Math.min(total - 1, targetPosRef.current + (e.deltaX > 0 ? 0.035 : -0.035))
      );
    }
  };

  // 5. CARD CLICK TO OPEN MODAL OR ROTATE
  const handleCardClick = (item, idx, isCenter) => {
    if (hasMovedRef.current) return;
    if (isCenter) {
      if (onProjectClick) {
        let matched = null;
        for (const sec of designData.sections || []) {
          matched = sec.projects.find((p) => p.id === item.id);
          if (matched) break;
        }
        if (matched) {
          onProjectClick(matched);
        }
      }
    } else {
      targetPosRef.current = idx;
      if (trackRef.current) {
        const rect = trackRef.current.getBoundingClientRect();
        const scrollableDistance = rect.height - window.innerHeight;
        if (scrollableDistance > 0) {
          const targetScrollY = window.scrollY + rect.top + (idx / (total - 1)) * scrollableDistance;
          if (window.__lenis) {
            window.__lenis.scrollTo(targetScrollY, { duration: 0.6, immediate: false });
          } else {
            window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
          }
        }
      }
    }
  };

  const activeIndex = Math.max(0, Math.min(total - 1, Math.round(displayPos)));

  return (
    // Outer scroll track: height budget allows smooth pinned vertical scrolling through all 5 projects
    <section 
      ref={trackRef}
      id="project-showcase"
      className="relative w-full"
      style={{ height: `${total * 65 + 100}vh` }}
    >
      {/* Pinned Sticky Stage Viewport: fixed to top-0 while scrolling through trackRef */}
      <div 
        onWheel={handleWheel}
        className={`sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pt-20 md:pt-24 pb-6 md:pb-8 select-none transition-colors duration-500 border-t ${
          isDark ? 'bg-[#050505] border-white/5' : 'bg-[#f4f4ee] border-black/5'
        }`}
      >
        {/* 1. TOP HEADER BAR: Standardized size & alignment */}
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 z-30 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -24, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="will-change-[transform,opacity,filter]"
          >
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight uppercase leading-[0.95] ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}>
              Selected Works
            </h2>
          </motion.div>
        </div>

        {/* 2. THE 3D CYLINDRICAL CURVED STAGE (Centered Horizontally) */}
        {/* IMPORTANT: transform-style: preserve-3d REMOVED so cards never physically penetrate/intersect adjacent cards */}
        <div 
          ref={containerRef}
          onPointerDown={handlePointerDown}
          data-cursor="DRAG"
          className="w-full flex-1 flex items-center justify-center relative touch-none cursor-grab active:cursor-grabbing z-20"
          style={{
            perspective: '1400px',
            perspectiveOrigin: '50% 50%'
          }}
        >
          {/* Centered Anchor: 0px x 0px at dead center of screen */}
          <div 
            className="relative w-0 h-0 flex items-center justify-center"
            style={{ transformStyle: 'flat' }}
          >
            {SHOWCASE_ITEMS.map((item, idx) => {
              // Angular offset along cylinder
              const diff = idx - displayPos;

              // Distance falloff
              const distance = Math.abs(diff);
              if (distance > 2.8) return null; // Cull cards beyond peripheral field

              // Angular separation along cylinder arc
              const angleDeg = diff * dimensions.angleDeg;
              const angleRad = (angleDeg * Math.PI) / 180;

              // 3D cylindrical projection: X along tangent, Z curving gently backward into amphitheater
              const x = Math.sin(angleRad) * dimensions.cylinderRadius;
              const z = (Math.cos(angleRad) - 1) * dimensions.cylinderRadius;
              
              // BESPOKE INWARD CYLINDRICAL CURVE (Concave Amphitheater Arc):
              // Negative rotateY for right cards, positive for left cards.
              // This angles cards inward toward the viewer while pushing their overlapping inner edges
              // deep into background depth (-Z), making it physically impossible for cards to pass through or intersect!
              const rotateY = -angleDeg;

              const isCenter = distance < 0.45;
              const scale = Math.max(0.78, 1 - distance * 0.08);
              const opacity = 1; // 100% opaque throughout
              const brightness = Math.max(0.68, 1 - distance * 0.12);

              // STRICT CONTINUOUS Z-INDEX STACKING:
              // Whichever card is closest to the focal center at any point in time has highest z-index.
              // Combined with flat transform-style and inward tangent depth, adjacent cards layer with pristine separation!
              const zIndex = Math.round(100 - distance * 25);

              const hasImageError = brokenImages[item.id];

              return (
                <div
                  key={item.id}
                  onClick={() => handleCardClick(item, idx, isCenter)}
                  data-cursor={isCenter ? "VIEW" : "DRAG"}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: `${dimensions.cardWidth}px`,
                    height: `${dimensions.cardHeight}px`,
                    marginLeft: `-${dimensions.cardWidth / 2}px`,
                    marginTop: `-${dimensions.cardHeight / 2}px`,
                    transform: `translate3d(${x.toFixed(1)}px, 0, ${z.toFixed(1)}px) rotateY(${rotateY.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
                    zIndex,
                    opacity,
                    filter: `brightness(${brightness.toFixed(2)})`,
                    transformStyle: 'flat',
                    backfaceVisibility: 'hidden',
                    isolation: 'isolate',
                    transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), filter 0.45s ease'
                  }}
                  className={`group relative rounded-none overflow-hidden select-none aspect-[16/9] transition-all duration-300 border border-white/10 shadow-[0_24px_50px_rgba(0,0,0,0.65)] ${
                    isCenter 
                      ? 'ring-2 ring-white/60 dark:ring-white/40 shadow-[0_30px_70px_rgba(0,0,0,0.85)] cursor-pointer' 
                      : 'cursor-pointer hover:ring-1 hover:ring-white/30'
                  }`}
                >
                  {/* PROJECT COVER IMAGE: Edge-to-edge 16:9 landscape view without rounded corners */}
                  {!hasImageError ? (
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="absolute inset-0 w-full h-full object-cover object-center rounded-none group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                      loading="eager"
                      onError={() => {
                        setBrokenImages(prev => ({ ...prev, [item.id]: true }));
                      }}
                    />
                  ) : (
                    // Graceful fallback gradient in case image fails to load
                    <div className={`absolute inset-0 w-full h-full bg-gradient-to-br ${item.fallbackBg} flex items-center justify-center rounded-none`}>
                      <span className="text-3xl font-black font-mono text-white/20 uppercase tracking-widest">
                        {item.title}
                      </span>
                    </div>
                  )}

                  {/* Specular Top Glare Sheen for physical realism */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-transparent pointer-events-none h-20" 
                  />

                  {/* 1. TOP BADGES */}
                  <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between z-10 pointer-events-none">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-mono uppercase tracking-wider text-white">
                      {item.category}
                    </span>

                    {isCenter && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-mono tracking-wide transition-all duration-200">
                        <span>Case Study</span>
                        <ArrowUpRight size={13} />
                      </div>
                    )}
                  </div>

                  {/* 2. DARKER BLACK BOTTOM OVERLAY FOR HIGH READABILITY */}
                  <div className="absolute bottom-0 left-0 right-0 h-[58%] bg-gradient-to-t from-black/95 via-black/80 via-black/40 to-transparent flex flex-col justify-end p-5 md:p-7 text-white pointer-events-none">
                    <div className="space-y-1.5">
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                        {item.title}
                      </h3>
                      
                      <p className="text-xs sm:text-sm font-normal text-neutral-200 line-clamp-1 max-w-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. HORIZONTAL PROGRESS LINE ATTACHED DIRECTLY TO VISIBLE SCREEN BOTTOM EDGE */}
        <div 
          className={`absolute bottom-0 left-0 w-full h-[3.5px] bg-black/10 dark:bg-white/10 z-50 pointer-events-none transition-opacity duration-300 ${
            displayPos >= total - 1.02 ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div 
            ref={progressLineRef}
            className="h-full w-full bg-[#ff5e1a] origin-left will-change-transform"
            style={{ 
              transform: `scaleX(${Math.max(0, Math.min(1, displayPos / (total - 1)))})`,
              transformOrigin: 'left'
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default ProjectCylinderShowcase;
