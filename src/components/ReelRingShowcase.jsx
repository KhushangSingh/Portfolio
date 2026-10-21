import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, RotateCcw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { designData } from '../constants/data';

// --- 1. CORE CONSTANTS & MATHEMATICAL POSE FUNCTIONS (avivashishta.com concept) ---
export const REEL_SLOTS = 15;
const DEAL = 0.32; // Share of formation each card spends swinging out

// Calculate slot resting angle around cylinder (-180° to +180°)
export function reelAngle(slot, angle, slots = REEL_SLOTS) {
  return ((slot * 360 / slots + angle + 180) % 360 + 360) % 360 - 180;
}

// Pure function returning 3D position and rotation for any card at any moment
export function reelPose(angle, formation, scene) {
  const around = ((angle + 180) % 360 + 360) % 360;
  const order = around / 360;
  
  // Each card has its own slice of 0..1 formation, staggered by order
  const t = Math.max(0, Math.min(1, (formation - order * (1 - DEAL)) / DEAL));
  const dealt = 1 - Math.pow(1 - t, 3); // Ease-out cubic
  
  // Placed angle around cylinder (-180° front stack to resting angle)
  const placed = -180 + around * dealt;
  const exp = scene.expansion || 0;

  // 1. Initial 3D Ring Pose (exp = 0)
  // Formed smoothly on an authentic Dutch-tilted 3D cylinder
  const r_ring = (placed * Math.PI) / 180;
  const ringRadius = scene.radius;
  const x_ring = -Math.sin(r_ring) * ringRadius;
  const z_ring = -Math.cos(r_ring) * ringRadius;
  const yaw_ring = placed;
  const scale_ring = scene.scaleStart || 0.36;

  // 2. Expanded Carousel Pose (exp = 1)
  // Spreads slots comfortably to ~38° so exactly 3 cards frame the stage with generous room
  const carouselAngle = placed * 1.6;
  const r_car = (carouselAngle * Math.PI) / 180;
  const carRadius = scene.carouselRadius || 980;
  const x_car = -Math.sin(r_car) * carRadius;
  // Gentle concave curvature: center card is closest and proud, side wings curve back smoothly
  const z_car = -(1 - Math.cos(r_car)) * (carRadius * 0.36) + (scene.zOffset || 120);
  const yaw_car = carouselAngle * 0.76;
  const scale_car = scene.scale;

  // 3. Smooth, Continuous Interpolation between Ring and Carousel
  const x = (1 - exp) * x_ring + exp * x_car;
  const y = scene.yOffset || 0;
  const z = (1 - exp) * z_ring + exp * z_car;
  const yaw = (1 - exp) * yaw_ring + exp * yaw_car;
  const scale = (1 - exp) * scale_ring + exp * scale_car;

  // In expanded carousel, cards fade smoothly off-screen across a wide 30° window (48° to 78°)
  // This guarantees silky, non-sticking exits on the left and smooth incoming entries on the right
  const angleFromCenter = Math.abs(carouselAngle);
  const carouselFade = angleFromCenter <= 48 
    ? 1 
    : Math.max(0, 1 - (angleFromCenter - 48) / 30);
  
  const arcVisibility = (1 - exp) * 1.0 + exp * carouselFade;

  return {
    x,
    y,
    z,
    yaw,
    carouselAngle,
    placed,
    appear: Math.min(1, t * 2.5) * arcVisibility,
    scale,
    behindCamera: exp > 0.5 && angleFromCenter > 85
  };
}

// Scene camera and ring configuration interpolated by expansion (0 = loader ring, 1 = full carousel)
export function reelScene(
  expansion, 
  responsiveRadius = 980, 
  targetScale = 1.45, 
  responsiveCamera = 750, 
  responsiveZOffset = 120
) {
  // In the initial ring (expansion = 0):
  // Authentic 3D loader ring seen from above at a Dutch tilt
  const START = { 
    radius: Math.min(340, responsiveRadius * 0.35), 
    perspective: 1000, 
    tilt: -22, 
    roll: -18, 
    scale: 0.36,
    yOffset: 0,
    zOffset: 0
  };
  
  // Squared scale easing: cards stay compact in the ring, then swell into hero stage
  const scaleEase = expansion * expansion;

  return {
    expansion,
    radius: START.radius + (responsiveRadius - START.radius) * expansion,
    carouselRadius: responsiveRadius,
    perspective: START.perspective + (responsiveCamera - START.perspective) * expansion,
    tilt: START.tilt * (1 - expansion),
    roll: START.roll * (1 - expansion),
    scale: START.scale + (targetScale - START.scale) * scaleEase,
    scaleStart: START.scale,
    yOffset: START.yOffset * (1 - expansion),
    zOffset: responsiveZOffset * scaleEase
  };
}



// --- 2. THE 5 CORE CURATED SHOWCASE REEL CARDS ---
// Rotating the exact same 5 cards infinitely in a 15-slot cylinder (15 % 5 === 0)
const RAW_PROJECTS = [
  {
    id: 1,
    title: "OtakuCircle",
    category: "Product Design",
    subCat: "Web Applications",
    tag: "Social Discovery",
    desc: "1-Click Anime Cataloging & Recommendation Platform",
    image: "/images/otakucircle_cover.jpg",
    accent: "#10b981",
    year: "2024"
  },
  {
    id: 2,
    title: "SquadSync",
    category: "Product Design",
    subCat: "SaaS",
    tag: "Studio Suite",
    desc: "Merit-Based Collaborative Squad Management Suite",
    image: "/images/squadsync_cover.jpg",
    accent: "#ec4899",
    year: "2024"
  },
  {
    id: 3,
    title: "Arkade Ledgerly",
    category: "Design Engineering",
    subCat: "Web Applications",
    tag: "Resource Vault",
    desc: "Centralized Digital Resource & Utility Library",
    image: "/images/ledgerly_cover.jpg",
    accent: "#f97316",
    year: "2024"
  },
  {
    id: 302,
    title: "Anime Key Visuals",
    category: "Visual Design",
    subCat: "Visual Design",
    tag: "Cinematic Poster",
    desc: "Explorations in Cinematic Anime Poster Typography",
    image: "/images/keyvisuals_cover.jpg",
    accent: "#e11d48",
    year: "2024"
  },
  {
    id: 101,
    title: "Glasio UI",
    category: "Design Engineering",
    subCat: "Design Systems",
    tag: "Component System",
    desc: "Production Glassmorphism Token Architecture",
    image: "/images/glasio_cover.jpg",
    accent: "#06b6d4",
    year: "2024"
  }
];

// Populate 15 slots seamlessly by cycling the 5 curated projects exactly 3 times
const REEL_SLOTS_DATA = Array.from({ length: REEL_SLOTS }).map((_, i) => ({
  slot: i,
  ...RAW_PROJECTS[i % RAW_PROJECTS.length]
}));

// --- 3. THE 3D REEL RING COMPONENT ---
export default function ReelRingShowcase({ onProjectClick }) {
  const { isDark } = useTheme();
  const sectionRef = useRef(null);

  // Responsive dimensions for 16:9 widescreen horizontal cards (optimized for bigger center hero card in 3-card curved stage)
  const [responsiveRadius, setResponsiveRadius] = useState(980);
  const [targetScale, setTargetScale] = useState(1.45);
  const [responsiveCamera, setResponsiveCamera] = useState(750);
  const [responsiveZOffset, setResponsiveZOffset] = useState(660);
  const [cardSize, setCardSize] = useState({ width: 540, height: 304 });
  const [stageHeight, setStageHeight] = useState(560);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Calculate orange box height so section title sits comfortably below the top-left bulb rope (~140px)
      // and the orange box attaches flush to the bottom of the visible screen
      const topClearance = w < 768 ? 165 : 195;
      const computedStageH = Math.max(480, Math.min(680, h - topClearance));
      setStageHeight(computedStageH);

      if (w < 640) {
        setResponsiveRadius(560);
        setTargetScale(1.18);
        setResponsiveCamera(550);
        setResponsiveZOffset(80);
        setCardSize({ width: 310, height: 174 });
      } else if (w < 1024) {
        setResponsiveRadius(780);
        setTargetScale(1.30);
        setResponsiveCamera(650);
        setResponsiveZOffset(100);
        setCardSize({ width: 420, height: 236 });
      } else {
        setResponsiveRadius(980);
        setTargetScale(1.45);
        setResponsiveCamera(750);
        setResponsiveZOffset(120);
        setCardSize({ width: 540, height: 304 });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation drivers: formation (0..1) & expansion (0..1)
  const [formation, setFormation] = useState(0);
  const [expansion, setExpansion] = useState(0);
  const [phase, setPhase] = useState('unstarted'); // 'unstarted' | 'dealing' | 'expanding' | 'interactive'
  const phaseRef = useRef('unstarted');

  // Animation frame and leave timer refs for clean re-triggering
  const animFrameRef = useRef(null);
  const leaveTimeoutRef = useRef(null);

  // Ring rotation angle
  const currentAngleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const [renderTick, setRenderTick] = useState(0);

  // Drag interaction state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startAngleRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const velocityRef = useRef(0);
  const hasMovedRef = useRef(false);

  // Autoplay hover pause state (with debounce grace window so crossing cards/corridor never jitters)
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef(null);

  const handleHoverStart = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
  }, []);

  const handleHoverEnd = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      hoverTimeoutRef.current = null;
    }, 90);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Cancel any running deal / expansion animation frames
  const cancelRunningAnimation = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  // Reset showcase to unstarted state so it re-runs when returning
  const resetToUnstarted = useCallback(() => {
    cancelRunningAnimation();
    phaseRef.current = 'unstarted';
    setPhase('unstarted');
    setFormation(0);
    setExpansion(0);
  }, [cancelRunningAnimation]);

  // Jump straight to interactive carousel (Skip / Reduce Motion escape)
  const skipToInteractive = useCallback(() => {
    cancelRunningAnimation();
    phaseRef.current = 'interactive';
    setFormation(1);
    setExpansion(1);
    setPhase('interactive');
  }, [cancelRunningAnimation]);

  // Trigger entrance sequence (Deal cards, then expand into carousel)
  const startEntranceSequence = useCallback(() => {
    cancelRunningAnimation();
    phaseRef.current = 'dealing';
    setPhase('dealing');
    setFormation(0);
    setExpansion(0);

    const formationDuration = 2600; // 2.6s linear deal
    const startTime = performance.now();

    const stepFormation = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / formationDuration);
      setFormation(progress);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(stepFormation);
      } else {
        // Formation complete: trigger Expansion
        phaseRef.current = 'expanding';
        setPhase('expanding');
        const expandStart = performance.now();
        const expandDuration = 1900; // 1.9s cubic expansion

        const stepExpansion = (expandNow) => {
          const expElapsed = expandNow - expandStart;
          const expProgress = Math.min(1, expElapsed / expandDuration);
          
          const t = expProgress;
          const eased = t < 0.5 
            ? 4 * t * t * t 
            : 1 - Math.pow(-2 * t + 2, 3) / 2;

          setExpansion(eased);

          if (expProgress < 1) {
            animFrameRef.current = requestAnimationFrame(stepExpansion);
          } else {
            phaseRef.current = 'interactive';
            setPhase('interactive');
            animFrameRef.current = null;
          }
        };

        animFrameRef.current = requestAnimationFrame(stepExpansion);
      }
    };

    animFrameRef.current = requestAnimationFrame(stepFormation);
  }, [cancelRunningAnimation]);

  // IntersectionObserver: trigger motion only when user scrolls down and at least 50% of showcase is visible
  // Also auto-scrolls smoothly to fit the section into the visible screen for the full immersion experience
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          // Returning to or entering the 3D showcase section with >= 50% visibility
          if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current);
            leaveTimeoutRef.current = null;
          }

          if (phaseRef.current === 'unstarted') {
            // Smoothly auto-scroll to fit the section into the visible screen
            // so the user experiences the full immersive motion without missing top or bottom parts
            const vh = window.innerHeight;
            const sectionRect = el.getBoundingClientRect();
            const sectionH = sectionRect.height;
            
            let scrollTarget;
            if (sectionH <= vh + 30) {
              // Section fits visible screen: attach bottom flush to bottom of screen
              scrollTarget = window.scrollY + sectionRect.bottom - vh;
            } else {
              // Section is slightly taller: position top so title clears the bulb rope comfortably
              scrollTarget = window.scrollY + sectionRect.top - 15;
            }

            window.scrollTo({
              top: Math.max(0, Math.round(scrollTarget)),
              behavior: 'smooth'
            });

            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
              skipToInteractive();
            } else {
              startEntranceSequence();
            }
          }
        } else if (entry.intersectionRatio < 0.2) {
          // Moving away to another section
          // If the user stays away for 3.5 seconds, reset state so it re-runs fresh upon return
          if (!leaveTimeoutRef.current && phaseRef.current !== 'unstarted') {
            leaveTimeoutRef.current = setTimeout(() => {
              resetToUnstarted();
              leaveTimeoutRef.current = null;
            }, 3500); // 3.5 seconds away
          }
        }
      },
      { threshold: [0.2, 0.5] }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
      cancelRunningAnimation();
    };
  }, [skipToInteractive, startEntranceSequence, resetToUnstarted, cancelRunningAnimation]);

  // Keyboard accessibility: Escape skips, Left/Right steps carousel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        skipToInteractive();
      } else if (e.key === 'ArrowLeft') {
        targetAngleRef.current += 360 / REEL_SLOTS;
      } else if (e.key === 'ArrowRight') {
        targetAngleRef.current -= 360 / REEL_SLOTS;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [skipToInteractive]);

  // Main 60fps Physics & Autoplay Loop
  useEffect(() => {
    let animId;

    const loop = () => {
      // 1. Autoplay rotation when idle in interactive phase
      if (phase === 'interactive' && !isDraggingRef.current && !isHovered) {
        targetAngleRef.current += 0.08;
      }

      // 2. Spring smoothing: currentAngle chases targetAngle smoothly
      const diff = targetAngleRef.current - currentAngleRef.current;
      currentAngleRef.current += diff * 0.09;

      setRenderTick(prev => prev + 1);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [phase, isHovered]);

  // Pointer Drag & Swipe Handling
  const handlePointerDown = (e) => {
    if (phase === 'dealing' || phase === 'expanding') return;
    isDraggingRef.current = true;
    setIsDragging(true);
    hasMovedRef.current = false;
    startXRef.current = e.clientX;
    startAngleRef.current = targetAngleRef.current;
    lastXRef.current = e.clientX;
    lastTimeRef.current = Date.now();
    velocityRef.current = 0;

    const onPointerMove = (moveEv) => {
      if (!isDraggingRef.current) return;
      const dx = moveEv.clientX - startXRef.current;
      if (Math.abs(dx) > 3) hasMovedRef.current = true;

      const now = Date.now();
      const dt = Math.max(1, now - lastTimeRef.current);
      velocityRef.current = (moveEv.clientX - lastXRef.current) / dt;
      lastXRef.current = moveEv.clientX;
      lastTimeRef.current = now;

      // Sensitivity: drag 1px = ~0.24 degrees rotation
      targetAngleRef.current = startAngleRef.current - dx * 0.24;
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      isDraggingRef.current = false;
      setIsDragging(false);

      // Impart inertia flick upon release
      const fling = velocityRef.current * 18;
      targetAngleRef.current -= fling;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  // Mouse wheel horizontal spin
  const handleWheel = (e) => {
    if (phase === 'dealing' || phase === 'expanding') return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      targetAngleRef.current += e.deltaX * 0.2;
    } else if (e.shiftKey) {
      e.preventDefault();
      targetAngleRef.current += e.deltaY * 0.2;
    }
  };

  // Step carousel by 1 slot
  const stepSlot = (direction) => {
    const slotAngle = 360 / REEL_SLOTS;
    targetAngleRef.current += direction * slotAngle;
  };

  // Card click handler: maps card to full project case study if found in designData
  const handleCardClick = (item) => {
    if (hasMovedRef.current) return;
    if (!onProjectClick) return;
    let fullProject = null;
    for (const sec of designData.sections || []) {
      const found = sec.projects?.find(
        (p) => p.id === item.id || p.title?.toLowerCase() === item.title?.toLowerCase()
      );
      if (found) {
        fullProject = found;
        break;
      }
    }
    onProjectClick(fullProject || item);
  };

  // Current interpolated scene configuration
  const currentScene = reelScene(
    expansion, 
    responsiveRadius, 
    targetScale, 
    responsiveCamera, 
    responsiveZOffset
  );

  return (
    <section 
      ref={sectionRef}
      id="reel-ring-showcase"
      onWheel={handleWheel}
      className={`relative w-full min-h-screen pt-28 pb-0 sm:pt-32 sm:pb-0 md:pt-36 md:pb-0 flex flex-col justify-between overflow-hidden transition-colors duration-700 select-none ${
        isDark ? 'bg-[#060606] text-white border-t border-white/5' : 'bg-[#F5F5F0] text-neutral-900 border-t border-black/5'
      }`}
      style={{
        paddingLeft: `${Math.round(expansion * 24)}px`,
        paddingRight: `${Math.round(expansion * 24)}px`,
        paddingBottom: `${Math.round((1 - expansion) * 20)}px`,
      }}
    >
      {/* Predefined Elegant Hand Cursor (grab & grabbing) */}
      <style>{`
        #reel-ring-showcase .reel-stage,
        #reel-ring-showcase .reel-stage * {
          cursor: ${isDragging ? 'grabbing' : 'grab'} !important;
        }
        #reel-ring-showcase button,
        #reel-ring-showcase button * {
          cursor: pointer !important;
        }
      `}</style>


      {/* 1. TOP HEADER & METRICS BAR (Smoothly reveals as expansion unfolds, hidden during initial deal) */}
      <div 
        className={`max-w-[1400px] w-full mx-auto flex flex-col md:flex-row md:items-end justify-between border-b pb-3 mb-2 gap-4 z-20 transition-all duration-500 ${
          isDark ? 'border-white/10' : 'border-black/10'
        }`}
        style={{
          opacity: phase === 'dealing' ? Math.max(0, (expansion - 0.2) / 0.8) : 1,
          transform: `translateY(${(1 - Math.min(1, expansion * 1.4)) * -18}px)`,
          pointerEvents: expansion > 0.4 ? 'auto' : 'none'
        }}
      >
        <div>
          <h3 className={`text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-[0.95] ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}>
            Selected Works
          </h3>
        </div>

        {/* Replay 3D Intro Button (Minimal circle replay arrow, borderless, with clean hover cue) */}
        <div className="relative group self-start md:self-end">
          <button
            onClick={startEntranceSequence}
            aria-label="Replay 3D Intro"
            className={`p-2 transition-all duration-300 hover:scale-110 active:scale-90 flex items-center justify-center bg-transparent border-0 outline-none ${
              isDark 
                ? 'text-neutral-400 hover:text-[#ff5e1a]' 
                : 'text-neutral-500 hover:text-[#ff5e1a]'
            }`}
          >
            <RotateCcw size={20} className="transition-transform duration-500 group-hover:-rotate-90" />
          </button>

          {/* Clean, Elegant Hover Cue */}
          <div className="absolute right-0 top-full mt-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-30 whitespace-nowrap">
            <div className={`relative px-3 py-1.5 rounded-lg text-xs font-mono font-medium tracking-wide shadow-xl backdrop-blur-md ${
              isDark 
                ? 'bg-[#181818]/95 text-neutral-200 border border-white/10' 
                : 'bg-white/95 text-neutral-800 border border-black/10'
            }`}>
              <div 
                className={`absolute -top-1 right-3 w-2 h-2 rotate-45 border-l border-t ${
                  isDark ? 'bg-[#181818] border-white/10' : 'bg-white border-black/10'
                }`} 
              />
              <span>Replay 3D Intro</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE ANIMATED ORANGE STAGE CONTAINER (Shape, Size & Position interpolate smoothly from 0 to 1, attached to bottom) */}
      <div 
        className="relative w-full max-w-[1400px] mx-auto overflow-hidden flex items-center justify-center transition-[border-radius,box-shadow,border-color] duration-300 ease-out mt-auto"
        style={{
          borderRadius: `${Math.round(expansion * 34)}px`,
          height: `${Math.round(stageHeight + (1 - expansion) * 40)}px`,
          minHeight: '480px',
          background: isDark
            ? 'radial-gradient(ellipse 95% 70% at 50% 45%, #ff6b28 0%, #ff5e1a 35%, #d94e10 70%, #9e3204 100%)'
            : 'radial-gradient(ellipse 95% 70% at 50% 45%, #ff7938 0%, #ff5e1a 40%, #e64d0d 75%, #b83800 100%)',
          boxShadow: expansion > 0.25 
            ? isDark
              ? '0 25px 80px -15px rgba(255, 94, 26, 0.35), 0 10px 30px -10px rgba(0, 0, 0, 0.5)'
              : '0 25px 60px -15px rgba(255, 94, 26, 0.25), 0 10px 25px -10px rgba(0, 0, 0, 0.15)'
            : 'none',
          border: expansion > 0.15
            ? isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.12)'
            : '1px solid transparent'
        }}
      >
        {/* Ambient Warm Solar Lighting & Vignette Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: 'radial-gradient(ellipse at 50% 25%, rgba(255, 220, 190, 0.32) 0%, transparent 65%), linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 40%, rgba(0,0,0,0.3) 100%)'
          }}
        />

        {/* 3D VIEWPORT STAGE */}
        {/* Notice: onMouseEnter / onMouseLeave REMOVED from outer stage so auto-scroll remains active across the orange container */}
        <div 
          className="reel-stage relative w-full h-full flex items-center justify-center overflow-visible touch-none"
          onPointerDown={handlePointerDown}
          style={{
            perspective: `${currentScene.perspective}px`,
            perspectiveOrigin: '50% 50%'
          }}
        >
          {/* Center Lighting Glow inside Stage */}
          <div 
            className="absolute w-[480px] h-[480px] rounded-full blur-[100px] pointer-events-none transition-opacity duration-700 bg-white/15 opacity-60"
          />

          {/* Active Card Motion Line / Corridor Zone: Only hovers directly over this horizontal line of motion pause auto-scroll */}
          <div 
            className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-10 pointer-events-auto"
            style={{
              height: `${Math.round(Math.min(stageHeight * 0.54, 300))}px`
            }}
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
          />

          {/* 3D ROTATING RING CONTAINER (Controlled strictly by tilt, roll and angle) */}
          <div
            className="relative w-0 h-0 transition-transform duration-75 ease-out will-change-transform z-20"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${currentScene.tilt}deg) rotateZ(${currentScene.roll}deg)`
            }}
          >
            {REEL_SLOTS_DATA.map((item) => {
              // Compute real-time 3D pose for this card
              const a = reelAngle(item.slot, currentAngleRef.current);
              const pose = reelPose(a, formation, currentScene);
              const isFacing = Math.abs(pose.carouselAngle || a) < 18;

              return (
                <div
                  key={`reel-slot-${item.slot}`}
                  onClick={() => handleCardClick(item)}
                  onMouseEnter={handleHoverStart}
                  onMouseLeave={handleHoverEnd}
                  className={`reel-card absolute left-0 top-0 rounded-2xl overflow-visible transition-shadow duration-300 group will-change-transform ${
                    isFacing ? 'shadow-[0_25px_60px_rgba(0,0,0,0.85)] ring-1 ring-white/20' : 'shadow-md'
                  }`}
                  style={{
                    width: `${cardSize.width}px`,
                    height: `${cardSize.height}px`,
                    marginLeft: `-${cardSize.width / 2}px`,
                    marginTop: `-${cardSize.height / 2}px`,
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'center center',
                    transform: `translate3d(${pose.x.toFixed(2)}px, ${pose.y.toFixed(2)}px, ${pose.z.toFixed(2)}px) rotateY(${pose.yaw.toFixed(2)}deg) scale(${pose.scale.toFixed(3)})`,
                    zIndex: Math.round(pose.z + 1000),
                    opacity: pose.appear,
                    display: pose.appear <= 0.01 ? 'none' : 'block',
                    pointerEvents: pose.appear > 0.4 ? 'auto' : 'none'
                  }}
                >
                  {/* FRONT FACE */}
                  <div
                    className="absolute inset-0 rounded-2xl overflow-hidden border border-white/15"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* HD Project Cover Image */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 pointer-events-none select-none"
                      loading="lazy"
                    />

                    {/* Dark Gradient Overlay for Supreme Text Contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10 pointer-events-none transition-opacity duration-300 group-hover:opacity-90" />

                    {/* Card Editorial Chrome & Typography - Balanced for 16:9 Horizontal Ratio */}
                    <div className="absolute inset-0 p-3.5 sm:p-4 md:p-5 flex flex-col justify-between z-10 pointer-events-none">
                      {/* Top Bar: Slot Index & Category Tag */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-black/60 text-white/90 border border-white/15 backdrop-blur-md">
                          #{String((item.slot % RAW_PROJECTS.length) + 1).padStart(2, '0')}
                        </span>

                        <span 
                          className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase backdrop-blur-md border"
                          style={{
                            backgroundColor: `${item.accent}25`,
                            borderColor: `${item.accent}60`,
                            color: '#ffffff'
                          }}
                        >
                          {item.tag}
                        </span>
                      </div>

                      {/* Bottom: Title, Description & Action Pill */}
                      <div>
                        <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#ff5e1a] font-bold block mb-0.5 sm:mb-1">
                          {item.category}
                        </span>

                        <h4 className="text-base sm:text-lg md:text-xl font-bold uppercase tracking-tight text-white leading-tight mb-1 drop-shadow-md">
                          {item.title}
                        </h4>

                        <p className="text-[11px] sm:text-xs text-gray-300 font-light line-clamp-1 sm:line-clamp-2 leading-snug sm:leading-relaxed mb-2">
                          {item.desc}
                        </p>

                        <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-white/15">
                          <span className="text-[9px] sm:text-[10px] font-mono text-gray-400">
                            {item.year} · Case Study
                          </span>

                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 group-hover:bg-[#ff5e1a] flex items-center justify-center text-white transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                            <ArrowUpRight size={13} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Specular Glint Border */}
                    <div className="absolute inset-0 rounded-2xl border border-white/15 pointer-events-none group-hover:border-[#ff5e1a]/80 transition-colors duration-300" />
                  </div>

                  {/* BACK FACE (For 3D ring cards when facing away into cylinder) */}
                  <div
                    className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 flex flex-col items-center justify-center select-none pointer-events-none"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: isDark 
                        ? 'linear-gradient(135deg, #141418 0%, #0a0a0d 100%)' 
                        : 'linear-gradient(135deg, #25252b 0%, #16161a 100%)'
                    }}
                  >
                    <div 
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: 'radial-gradient(#ff5e1a 1px, transparent 1px)',
                        backgroundSize: '16px 16px'
                      }}
                    />
                    <div className="relative z-10 w-14 h-14 rounded-xl border border-white/15 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm shadow-inner">
                      <span className="text-[12px] font-mono font-black tracking-widest text-[#ff5e1a]">
                        KS
                      </span>
                      <span className="text-[7.5px] font-mono text-gray-400 mt-0.5">
                        PORTFOLIO
                      </span>
                    </div>
                    <div className="absolute bottom-3 text-[8px] font-mono tracking-widest uppercase text-gray-400">
                      SHOWCASE // #{String((item.slot % RAW_PROJECTS.length) + 1).padStart(2, '0')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
