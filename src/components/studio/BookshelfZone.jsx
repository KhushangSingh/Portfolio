import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BOOKS, CATEGORIES } from './bookshelfData';
import BookArtwork from './BookArtwork';
import { playSoundEffect } from '../../utils/soundEffects';

/**
 * 3D Physical Bookshelf Studio Zone
 * Inspired by the Leon Vasari endless 3D physical shelf architecture.
 * 
 * Features:
 * - 3D rotating endless shelf with smooth-step spacing formula B(r) and openness o
 * - 12 curated masterwork books across Design, Systems, Manga and Sci-Fi/Philosophy
 * - Spine-to-cover 3D turn on selection with real-time cursor tilt
 * - Direction-aware masked caption transitions
 * - Sliding category indicator tab bar
 * - Interactive custom cursor with OPEN disc transformation
 * - Paper sheet ink-bleed detail inspection modal with SVG turbulence diffusion
 * 
 * Strict Writing Rules:
 * - Zero commas before "and" or "or".
 * - Zero em dashes.
 */

// Math helpers
function smoothstep(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

function B(r) {
  if (Math.abs(r) < 1) {
    return (r + Math.sin(Math.PI * r) / Math.PI) / 2;
  }
  return r > 0 ? 0.5 : -0.5;
}

function F(r, ws, d, gap) {
  return r * (ws + gap) + (d - ws + 1.6 * gap) * B(r);
}

export default function BookshelfZone({ onCloseZone }) {
  const { isDark } = useTheme();
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const tapesRef = useRef([]);
  const coverFacesRef = useRef([]);
  const playRingRef = useRef(null);
  const cursorRingRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorLabelRef = useRef(null);

  // Detail Modal Refs
  const detailModalRef = useRef(null);
  const inkCirclesRef = useRef([]);

  // Animation & Motion State Refs (to drive 60-120fps rAF loop without re-renders)
  const motionRef = useRef({
    s: 12, // start on middle loop, book 0 (Grid Systems)
    T: 12,
    k: 5.2,
    isDragging: false,
    startX: 0,
    startT: 12,
    hasDragged: false,
    activeBookIndex: 0,
    lastActiveBookIndex: 0,
    hoverVirtualIndex: -1,
    liftValues: new Array(36).fill(0),
    tiltX: 0,
    tiltY: 0,
    mx: -999,
    my: -999,
    cx: -999,
    cy: -999,
    cursorState: 'default',
    isDetailOpen: false,
    dimensions: { H: 260, ws: 44, d: 137, gap: 8, W: 1200, shelfY: 300 },
    wheelSnapTimer: null,
  });

  // React state for DOM elements that need clean reactivity
  const [activeBookIndex, setActiveBookIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedBook, setSelectedBook] = useState(null);
  const [captionDirection, setCaptionDirection] = useState(1);
  const [captionKey, setCaptionKey] = useState(0);
  const [isDetailActive, setIsDetailActive] = useState(false);

  // 36 virtual books (12 books copied 3 times for seamless wrapping)
  const virtualBooks = [];
  for (let copy = 0; copy < 3; copy++) {
    for (let i = 0; i < 12; i++) {
      virtualBooks.push({
        ...BOOKS[i],
        virtualIndex: copy * 12 + i,
        bookIndex: i,
        copy,
      });
    }
  }

  // Update shelf dimensions based on viewport size
  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const W = rect.width || window.innerWidth;
    const H_viewport = rect.height || window.innerHeight;
    const isMobile = W <= 768;

    // Vasari proportion: min(44vh, 28vw) desktop, min(58vw, 38svh) mobile
    const baseH = isMobile
      ? Math.min(W * 0.58, H_viewport * 0.38)
      : Math.min(H_viewport * 0.44, W * 0.28);
    const H = Math.max(180, Math.min(360, Math.round(baseH)));
    const ws = Math.round(H * 142 / 840);
    const d = Math.round(H * 474 / 900);
    const gap = Math.round(H * 0.03);
    const shelfY = Math.round(H_viewport * 0.48);

    motionRef.current.dimensions = { H, ws, d, gap, W, shelfY };

    if (stageRef.current) {
      stageRef.current.style.setProperty('--ws', `${ws}px`);
      stageRef.current.style.setProperty('--d', `${d}px`);
      stageRef.current.style.setProperty('--H', `${H}px`);
    }
  }, []);

  // Jump to specific book index with shortest modulo distance
  const jumpToBook = useCallback((targetIndex) => {
    const m = motionRef.current;
    const currentActive = Math.round(((m.s % 12) + 12) % 12);
    let delta = (targetIndex - currentActive) % 12;
    if (delta > 6) delta -= 12;
    if (delta < -6) delta += 12;

    const dir = delta >= 0 ? 1 : -1;
    setCaptionDirection(dir);
    m.T = Math.round(m.T + delta);
    playSoundEffect('select');
  }, []);

  // Open detail sheet modal
  const openDetail = useCallback((book) => {
    if (motionRef.current.isDetailOpen) return;
    motionRef.current.isDetailOpen = true;
    motionRef.current.T = Math.round(motionRef.current.T);
    setSelectedBook(book);
    setIsDetailActive(true);
    playSoundEffect('open');

    // Web Animations API: Grow paper sheet from active cover's projected rect
    requestAnimationFrame(() => {
      const activeVirtual = Math.round(motionRef.current.s);
      const activeCoverEl = coverFacesRef.current[activeVirtual];
      const modalEl = detailModalRef.current;

      if (modalEl && activeCoverEl) {
        const rect = activeCoverEl.getBoundingClientRect();
        const startClip = `inset(${rect.top}px ${window.innerWidth - rect.right}px ${window.innerHeight - rect.bottom}px ${rect.left}px round 4px)`;
        const endClip = 'inset(0px 0px 0px 0px round 0px)';

        modalEl.animate([
          { clipPath: startClip, transform: 'rotate(-4.5deg)' },
          { clipPath: endClip, transform: 'rotate(0deg)' }
        ], {
          duration: 950,
          easing: 'cubic-bezier(.76, 0, .18, 1)',
          fill: 'both'
        });

        // Ink-bleed effect: Animate 7 SVG circles expanding through turbulence filter
        const circles = inkCirclesRef.current;
        if (circles && circles.length === 7) {
          circles.forEach(c => { if (c) c.setAttribute('r', '0'); });
          const delays = [0, 120, 220, 300, 360, 420, 180];
          const startTime = performance.now() + 480;

          const animateInk = (now) => {
            let allDone = true;
            circles.forEach((circle, i) => {
              if (!circle) return;
              const circleStart = startTime + delays[i];
              if (now < circleStart) {
                circle.setAttribute('r', '0');
                allDone = false;
              } else {
                const progress = Math.min(1, (now - circleStart) / 1200);
                const eased = 1 - Math.pow(1 - progress, 3);
                circle.setAttribute('r', String(eased * 720));
                if (progress < 1) allDone = false;
              }
            });

            if (!allDone && motionRef.current.isDetailOpen) {
              requestAnimationFrame(animateInk);
            }
          };

          requestAnimationFrame(animateInk);
        }
      }
    });
  }, []);

  // Close detail sheet modal
  const closeDetail = useCallback(() => {
    if (!motionRef.current.isDetailOpen) return;
    const modalEl = detailModalRef.current;
    const activeVirtual = Math.round(motionRef.current.s);
    const activeCoverEl = coverFacesRef.current[activeVirtual];

    playSoundEffect('close');

    if (modalEl && activeCoverEl) {
      const rect = activeCoverEl.getBoundingClientRect();
      const endClip = `inset(${rect.top}px ${window.innerWidth - rect.right}px ${window.innerHeight - rect.bottom}px ${rect.left}px round 4px)`;

      const anim = modalEl.animate([
        { clipPath: 'inset(0px 0px 0px 0px round 0px)', transform: 'rotate(0deg)' },
        { clipPath: endClip, transform: 'rotate(-4.5deg)' }
      ], {
        duration: 750,
        easing: 'cubic-bezier(.76, 0, .18, 1)',
        fill: 'both'
      });

      anim.onfinish = () => {
        motionRef.current.isDetailOpen = false;
        setIsDetailActive(false);
        setSelectedBook(null);
      };
    } else {
      motionRef.current.isDetailOpen = false;
      setIsDetailActive(false);
      setSelectedBook(null);
    }
  }, []);

  // =========================================================================
  // MAIN 60-120FPS REQUEST-ANIMATION-FRAME PHYSICS LOOP
  // =========================================================================
  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    let animationFrameId;
    let lastTime = performance.now();

    const loop = (currentTime) => {
      const dt = Math.min(0.05, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      const m = motionRef.current;
      const { H, ws, d, gap, W, shelfY } = m.dimensions;

      // 1. Spring motion: s -> T
      const springRate = m.isDragging ? 18 : 5.2;
      m.s += (m.T - m.s) * (1 - Math.exp(-springRate * dt));
      if (Math.abs(m.T - m.s) < 0.0001) {
        m.s = m.T;
      }

      // 2. Modulo Normalization (seamless infinite loop across 36 virtual books)
      if (m.s < 6) {
        m.s += 12;
        m.T += 12;
      } else if (m.s > 30) {
        m.s -= 12;
        m.T -= 12;
      }

      // 3. Active Book Detection & Caption Trigger
      const rawActive = Math.round(m.s);
      const currActiveIndex = ((rawActive % 12) + 12) % 12;
      if (currActiveIndex !== m.lastActiveBookIndex) {
        const dir = (m.T - m.s) >= 0 ? 1 : -1;
        m.lastActiveBookIndex = currActiveIndex;
        m.activeBookIndex = currActiveIndex;
        setActiveBookIndex(currActiveIndex);
        setCaptionDirection(dir);
        setCaptionKey(prev => prev + 1);

        const currentGroup = BOOKS[currActiveIndex].categoryGroup;
        setActiveCategory(currentGroup);
      }

      // 4. Cursor position smoothing
      if (m.mx > -100) {
        m.cx += (m.mx - m.cx) * (1 - Math.exp(-16 * dt));
        m.cy += (m.my - m.cy) * (1 - Math.exp(-16 * dt));
      }

      // 5. Test if cursor is on the pulled-out cover face
      const onCover = Math.abs(m.mx - W / 2) < 0.55 * d &&
                      Math.abs(m.my - shelfY) < 0.55 * H &&
                      !m.isDetailOpen &&
                      Math.abs(m.T - m.s) < 0.35;

      // 6. Cover Tilt targets
      const targetTiltY = onCover
        ? ((m.mx - W / 2) / (0.55 * d)) * 9
        : ((m.mx - W / 2) / W) * 5;
      const targetTiltX = onCover
        ? -((m.my - shelfY) / (H / 2)) * 6
        : 0;

      m.tiltY += (targetTiltY - m.tiltY) * (1 - Math.exp(-7 * dt));
      m.tiltX += (targetTiltX - m.tiltX) * (1 - Math.exp(-7 * dt));

      // 7. Update Custom Cursor DOM
      if (cursorRingRef.current) {
        const isHoveringSpine = m.hoverVirtualIndex >= 0 && Math.abs(m.hoverVirtualIndex - m.s) > 0.5;
        let scale = 1;
        let isDisc = false;

        if (onCover) {
          scale = 1.75;
          isDisc = true;
          m.cursorState = 'open';
        } else if (isHoveringSpine) {
          scale = 0.72;
          m.cursorState = 'spine';
        } else if (m.cursorState === 'btn') {
          scale = 0.55;
        } else {
          scale = 1;
          m.cursorState = 'default';
        }

        cursorRingRef.current.style.transform = `translate3d(${m.cx.toFixed(1)}px, ${m.cy.toFixed(1)}px, 0) scale(${scale})`;
        cursorRingRef.current.style.backgroundColor = isDisc ? '#ff5e1a' : 'transparent';
        cursorRingRef.current.style.borderColor = isDisc ? '#ff5e1a' : (isDark ? '#F4F4EE' : '#141414');

        if (cursorDotRef.current) {
          cursorDotRef.current.style.transform = isDisc || m.cursorState === 'btn' ? 'scale(0)' : 'scale(1)';
        }
        if (cursorLabelRef.current) {
          cursorLabelRef.current.style.opacity = isDisc ? '1' : '0';
          cursorLabelRef.current.style.transform = isDisc ? 'scale(1)' : 'scale(0.5)';
        }
      }

      // 8. Update Play / Pull-out Ring Button DOM
      if (playRingRef.current) {
        const playRingScale = m.isDetailOpen ? 0 : smoothstep(Math.max(0, 1 - Math.abs(m.T - m.s) * 3));
        playRingRef.current.style.transform = `translate3d(${(W / 2 - 0.5 * d - 14).toFixed(1)}px, ${(shelfY + 0.36 * H).toFixed(1)}px, 40px) scale(${playRingScale.toFixed(3)})`;
      }

      // 9. Position and Render all 36 Virtual Books in 3D Stage
      for (let v = 0; v < 36; v++) {
        const tapeEl = tapesRef.current[v];
        if (!tapeEl) continue;

        // Relative index r in range [-18, 18]
        let r = (v - m.s) % 36;
        if (r > 18) r -= 36;
        if (r < -18) r += 36;

        // Continuous Placement Formula
        const x = F(r, ws, d, gap);

        // Culling: off-screen tapes skipped
        if (Math.abs(x) > W / 2 + 1.6 * d) {
          tapeEl.style.visibility = 'hidden';
          continue;
        }
        tapeEl.style.visibility = 'visible';

        // Openness o: 1 for active book, 0 for spines, smoothstep interpolation in between
        const o = smoothstep(Math.max(0, 1 - Math.abs(r)));

        // Hover lift on non-active spines
        const isHovered = m.hoverVirtualIndex === v && Math.abs(r) > 0.5;
        const targetLift = isHovered ? 1 : 0;
        m.liftValues[v] += (targetLift - m.liftValues[v]) * (1 - Math.exp(-12 * dt));
        const lift = m.liftValues[v];

        // 3D Transforms
        const rotateY = -90 * o + m.tiltY * o;
        const rotateX = m.tiltX * o;
        const rotateZ = -4.5 * o;
        const translateZ = o * 0.2 * H;
        const translateY = -o * 0.025 * H - lift * 0.045 * H;

        tapeEl.style.transform = `translate3d(${x.toFixed(2)}px, ${translateY.toFixed(2)}px, ${translateZ.toFixed(2)}px) rotateZ(${rotateZ.toFixed(2)}deg) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
        tapeEl.style.zIndex = Math.round(100 - Math.abs(r) * 4);

        // Lighting Shade CSS Variables
        tapeEl.style.setProperty('--spine-shade', (o * 0.55).toFixed(3));
        tapeEl.style.setProperty('--cover-shade', ((1 - o) * 0.5).toFixed(3));
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateDimensions);
    };
  }, [updateDimensions, isDark]);

  // =========================================================================
  // GESTURE & POINTER HANDLERS
  // =========================================================================
  const handlePointerDown = (e) => {
    if (motionRef.current.isDetailOpen) return;
    const m = motionRef.current;
    m.isDragging = true;
    m.hasDragged = false;
    m.startX = e.clientX;
    m.startT = m.T;
  };

  const handlePointerMove = (e) => {
    const m = motionRef.current;
    m.mx = e.clientX;
    m.my = e.clientY;

    if (m.isDragging) {
      const dx = e.clientX - m.startX;
      if (Math.abs(dx) > 6) {
        m.hasDragged = true;
      }
      const { ws, gap } = m.dimensions;
      m.T = m.startT - dx / (ws + gap);
    }
  };

  const handlePointerUp = () => {
    const m = motionRef.current;
    if (m.isDragging) {
      m.isDragging = false;
      m.T = Math.round(m.T);
    }
  };

  // Wheel handling with smooth spring & idle snap
  const handleWheel = (e) => {
    if (motionRef.current.isDetailOpen) return;
    e.preventDefault();
    const m = motionRef.current;
    const { ws, gap } = m.dimensions;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

    m.T += (delta / (ws + gap)) * 0.42;

    if (m.wheelSnapTimer) clearTimeout(m.wheelSnapTimer);
    m.wheelSnapTimer = setTimeout(() => {
      m.T = Math.round(m.T);
    }, 160);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (motionRef.current.isDetailOpen) {
          closeDetail();
        } else if (onCloseZone) {
          onCloseZone();
        }
      } else if (!motionRef.current.isDetailOpen) {
        if (e.key === 'ArrowRight') {
          motionRef.current.T = Math.round(motionRef.current.T) + 1;
          playSoundEffect('select');
        } else if (e.key === 'ArrowLeft') {
          motionRef.current.T = Math.round(motionRef.current.T) - 1;
          playSoundEffect('select');
        } else if (e.key === 'Enter') {
          const currentBook = BOOKS[motionRef.current.activeBookIndex];
          if (currentBook) openDetail(currentBook);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeDetail, onCloseZone, openDetail]);

  const activeBook = BOOKS[activeBookIndex] || BOOKS[0];

  return (
    <div 
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      className={`relative w-full h-full overflow-hidden select-none touch-none ${
        isDark ? 'bg-[#0D0D10] text-[#F4F4EE]' : 'bg-[#EDEBE6] text-[#141414]'
      }`}
      style={{
        fontFamily: '"Inter Tight", "Noto Sans JP", sans-serif'
      }}
    >
      {/* ===================================================================
          1. PAPER GRAIN TEXTURE SVG FILTER OVERLAY
          =================================================================== */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-multiply z-10" aria-hidden="true">
        <filter id="shelf-paper-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.42  0 0 0 0 0.38  0 0 0 0.22 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#shelf-paper-grain)" />
      </svg>

      {/* SVG Ink Bleed Filter for Detail Poster */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <filter id="shelf-ink-bleed">
          <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="3" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="120" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* ===================================================================
          2. TOP BAR
          =================================================================== */}
      <header className="absolute top-0 inset-x-0 h-16 sm:h-20 px-4 sm:px-8 flex items-center justify-between z-20 pointer-events-auto">
        {/* Left: Back Link */}
        <button
          onClick={() => {
            if (onCloseZone) onCloseZone();
          }}
          onMouseEnter={() => { motionRef.current.cursorState = 'btn'; }}
          onMouseLeave={() => { motionRef.current.cursorState = 'default'; }}
          className="px-3 py-1.5 rounded border border-current text-[10.5px] font-mono font-bold uppercase tracking-wider hover:bg-[#ff5e1a] hover:text-white hover:border-[#ff5e1a] transition-colors"
          title="Return to Studio Camera Overview"
        >
          BACK / 戻る
        </button>

        {/* Center: Studio Library Logo */}
        <div className="flex flex-col items-center justify-center text-center">
          <span 
            className="text-base sm:text-lg font-bold tracking-[0.08em] text-[#ff5e1a]"
            style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
          >
            スタジオ 書棚
          </span>
          <span className="text-[8.5px] sm:text-[9.5px] font-mono uppercase tracking-[0.28em] opacity-75">
            STUDIO SHELF // KHUSHANG SINGH
          </span>
        </div>

        {/* Right: Shelf Meta Tag */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#ff5e1a] font-bold">
            12 CURATED MASTERWORKS
          </span>
        </div>
      </header>

      {/* ===================================================================
          3. CATEGORY PILL TABS
          =================================================================== */}
      <nav 
        aria-label="Book Categories"
        className="absolute top-20 sm:top-24 inset-x-0 flex items-center justify-center z-20 px-4 pointer-events-auto"
      >
        <div className="relative inline-flex items-center p-0.5 rounded-lg border border-black/15 dark:border-white/15 bg-black/5 dark:bg-white/5 backdrop-blur-sm">
          {CATEGORIES.map((cat) => {
            const isTabActive = (cat.id === 'all' && activeCategory === 'all') || (cat.id === activeCategory);
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  jumpToBook(cat.firstIndex);
                }}
                onMouseEnter={() => { motionRef.current.cursorState = 'btn'; }}
                onMouseLeave={() => { motionRef.current.cursorState = 'default'; }}
                className={`relative px-2.5 sm:px-3.5 py-1 text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase rounded-md transition-colors duration-200 z-10 ${
                  isTabActive 
                    ? 'text-white' 
                    : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                {/* Active Tab Sliding Background Highlight */}
                {isTabActive && (
                  <span 
                    className="absolute inset-0 rounded-md bg-[#ff5e1a] -z-10 shadow-sm"
                  />
                )}
                {cat.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ===================================================================
          4. THE 3D ROTATING PHYSICAL SHELF STAGE
          =================================================================== */}
      <div 
        className="absolute inset-0 flex items-center justify-center overflow-visible"
        style={{
          perspective: '2200px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* Stage Center Anchor */}
        <div 
          ref={stageRef}
          className="relative w-0 h-0"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* 36 Virtual Books */}
          {virtualBooks.map((vBook, vIndex) => {
            return (
              <div
                key={vIndex}
                ref={el => { tapesRef.current[vIndex] = el; }}
                onPointerEnter={() => { motionRef.current.hoverVirtualIndex = vIndex; }}
                onPointerLeave={() => {
                  if (motionRef.current.hoverVirtualIndex === vIndex) {
                    motionRef.current.hoverVirtualIndex = -1;
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (motionRef.current.hasDragged) return;
                  const r = ((vIndex - motionRef.current.s) % 36 + 54) % 36 - 18;
                  if (Math.abs(r) < 0.5) {
                    openDetail(vBook);
                  } else {
                    const dir = r >= 0 ? 1 : -1;
                    setCaptionDirection(dir);
                    motionRef.current.T = Math.round(motionRef.current.T + r);
                    playSoundEffect('select');
                  }
                }}
                className="absolute top-0 left-0 cursor-pointer will-change-transform"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* 1. SPINE FACE (Front of the standing cuboid) */}
                <div 
                  className="absolute rounded-t-[3px] overflow-hidden"
                  style={{
                    width: 'var(--ws)',
                    height: 'var(--H)',
                    left: 'calc(var(--ws) * -0.5)',
                    top: 'calc(var(--H) * -0.5)',
                    transform: 'translateZ(calc(var(--d) * 0.5))',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <BookArtwork book={vBook} face="spine" isDark={isDark} />
                  {/* Dynamic Shading Overlay */}
                  <div 
                    className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-75"
                    style={{ opacity: 'var(--spine-shade, 0)' }}
                  />
                </div>

                {/* 2. COVER FACE (Right side of the cuboid that swings forward) */}
                <div 
                  ref={el => { coverFacesRef.current[vIndex] = el; }}
                  className="absolute rounded-r-[3px] overflow-hidden"
                  style={{
                    width: 'var(--d)',
                    height: 'var(--H)',
                    left: 'calc(var(--d) * -0.5)',
                    top: 'calc(var(--H) * -0.5)',
                    transform: 'rotateY(90deg) translateZ(calc(var(--ws) * 0.5))',
                    backfaceVisibility: 'hidden',
                    boxShadow: '0 30px 60px -28px rgba(20, 16, 10, 0.65)',
                  }}
                >
                  <BookArtwork book={vBook} face="cover" isDark={isDark} />
                  {/* Dynamic Shading Overlay */}
                  <div 
                    className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-75"
                    style={{ opacity: 'var(--cover-shade, 0.5)' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Architectural Solid Oak / Brushed Aluminum Shelf Plinth */}
        <div 
          className="absolute inset-x-8 sm:inset-x-20 h-4 rounded-md pointer-events-none shadow-2xl flex items-center justify-between px-6 z-0"
          style={{
            top: 'calc(48% + (var(--H, 260px) * 0.5))',
            background: isDark 
              ? 'linear-gradient(to right, #1F2026, #323542, #1F2026)' 
              : 'linear-gradient(to right, #D8D4CC, #EDE9E1, #D8D4CC)',
            borderTop: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.12)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
          }}
        >
          <span className="w-3 h-1 rounded-sm bg-black/20 dark:bg-white/20" />
          <span className="font-mono text-[8px] tracking-[0.25em] uppercase opacity-40">
            SOLID OAK &amp; BRUSHED ALUMINUM STUDIO MOUNT
          </span>
          <span className="w-3 h-1 rounded-sm bg-black/20 dark:bg-white/20" />
        </div>

        {/* Soft Shelf Cast Shadow */}
        <div 
          className="absolute inset-x-12 sm:inset-x-28 h-8 bg-black/40 filter blur-xl pointer-events-none -z-10"
          style={{
            top: 'calc(48% + (var(--H, 260px) * 0.5) + 4px)',
          }}
        />

        {/* Play / Pull-out Ring Button positioned at the active cover's bottom left */}
        <button
          ref={playRingRef}
          onClick={(e) => {
            e.stopPropagation();
            openDetail(activeBook);
          }}
          onMouseEnter={() => { motionRef.current.cursorState = 'btn'; }}
          onMouseLeave={() => { motionRef.current.cursorState = 'default'; }}
          aria-label={`Open ${activeBook.title}`}
          className="fixed w-11 h-11 rounded-full border-2 border-[#ff5e1a] bg-[#ff5e1a]/15 backdrop-blur-md text-[#ff5e1a] hover:bg-[#ff5e1a] hover:text-white transition-colors duration-150 flex items-center justify-center cursor-pointer shadow-xl z-20"
          style={{
            transform: 'scale(0)',
          }}
          title="Pull out book to inspect"
        >
          {/* Handcrafted Play Triangle SVG */}
          <svg viewBox="0 0 24 24" className="w-4 h-4 ml-0.5 fill-current" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      {/* ===================================================================
          5. MASKED DIRECTION-AWARE CAPTION
          =================================================================== */}
      <div 
        className="absolute bottom-12 sm:bottom-16 inset-x-0 flex flex-col items-center justify-center text-center pointer-events-none z-20 px-4"
      >
        <div 
          key={captionKey}
          className="flex flex-col items-center gap-1.5 max-w-xl overflow-hidden"
        >
          {/* Masked Line 1: Book Title */}
          <div className="overflow-hidden">
            <h2 
              className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight animate-caption-slide leading-tight"
              style={{
                fontFamily: '"Newsreader", Georgia, serif',
                '--caption-dir': captionDirection,
              }}
            >
              {activeBook.title}
            </h2>
          </div>

          {/* Masked Line 2: Japanese Romanised Subtitle / Kanji */}
          <div className="overflow-hidden">
            <p 
              className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase text-[#ff5e1a] animate-caption-slide"
              style={{
                '--caption-dir': captionDirection,
                animationDelay: '60ms',
              }}
            >
              {activeBook.subtitleRomaji} / {activeBook.subtitleKanji}
            </p>
          </div>

          {/* Masked Line 3: Category, Year and Publisher */}
          <div className="overflow-hidden">
            <p 
              className="text-[9.5px] sm:text-[10.5px] font-mono tracking-wider opacity-60 uppercase animate-caption-slide"
              style={{
                '--caption-dir': captionDirection,
                animationDelay: '120ms',
              }}
            >
              {activeBook.year} · {activeBook.category} · {activeBook.publisher}
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================================
          6. STEP NAVIGATION ARROWS
          =================================================================== */}
      <button
        onClick={() => {
          setCaptionDirection(-1);
          motionRef.current.T = Math.round(motionRef.current.T) - 1;
          playSoundEffect('select');
        }}
        onMouseEnter={() => { motionRef.current.cursorState = 'btn'; }}
        onMouseLeave={() => { motionRef.current.cursorState = 'default'; }}
        aria-label="Previous book"
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-[#ff5e1a] hover:border-[#ff5e1a] hover:text-white transition-colors duration-150 z-20 cursor-pointer"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-[2]">
          <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        onClick={() => {
          setCaptionDirection(1);
          motionRef.current.T = Math.round(motionRef.current.T) + 1;
          playSoundEffect('select');
        }}
        onMouseEnter={() => { motionRef.current.cursorState = 'btn'; }}
        onMouseLeave={() => { motionRef.current.cursorState = 'default'; }}
        aria-label="Next book"
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-[#ff5e1a] hover:border-[#ff5e1a] hover:text-white transition-colors duration-150 z-20 cursor-pointer"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-[2]">
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* ===================================================================
          7. FOOTER
          =================================================================== */}
      <footer className="absolute bottom-3 inset-x-4 sm:inset-x-8 flex items-center justify-between text-[8px] sm:text-[9px] font-mono tracking-widest uppercase opacity-50 pointer-events-none z-20">
        <span>KHUSHANG SINGH STUDIO ARCHIVE</span>
        <span>CLICK COVER TO INSPECT · DRAG TO SCRUB</span>
      </footer>

      {/* ===================================================================
          8. CUSTOM CURSOR
          =================================================================== */}
      <div 
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-[58px] h-[58px] -ml-[29px] -mt-[29px] rounded-full border-[1.5px] pointer-events-none z-50 hidden md:flex items-center justify-center transition-[background-color,border-color] duration-200 will-change-transform"
        style={{
          transform: 'translate3d(-999px, -999px, 0) scale(1)',
        }}
      >
        {/* Cursor Center Dot */}
        <div 
          ref={cursorDotRef}
          className="w-1.5 h-1.5 rounded-full transition-transform duration-200"
          style={{ backgroundColor: isDark ? '#F4F4EE' : '#141414' }}
        />

        {/* Cursor Open Label */}
        <div 
          ref={cursorLabelRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-white text-[9px] font-mono font-bold leading-none tracking-widest uppercase opacity-0 transition-all duration-200"
        >
          <span>OPEN</span>
          <span className="text-[7.5px] mt-0.5">開く</span>
        </div>
      </div>

      {/* ===================================================================
          9. PAPER SHEET DETAIL MODAL WITH SVG INK-BLEED EFFECT
          =================================================================== */}
      {isDetailActive && selectedBook && (
        <div 
          ref={detailModalRef}
          role="dialog"
          aria-modal="true"
          aria-label={selectedBook.title}
          onClick={closeDetail}
          className={`fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12 md:p-16 overflow-y-auto cursor-pointer ${
            isDark ? 'bg-[#15151A] text-[#F4F4EE]' : 'bg-[#F4F2ED] text-[#141414]'
          }`}
          style={{
            transformOrigin: '50% 50%',
            fontFamily: '"Inter Tight", sans-serif',
          }}
        >
          {/* Container Card */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl my-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center cursor-default"
          >
            {/* Top Close Button */}
            <button
              onClick={closeDetail}
              className="absolute -top-10 sm:-top-12 left-0 px-3.5 py-1.5 rounded border border-current text-[11px] font-mono font-bold uppercase tracking-wider hover:bg-[#ff5e1a] hover:text-white hover:border-[#ff5e1a] transition-colors"
            >
              CLOSE / 閉じる
            </button>

            {/* LEFT COLUMN: EDITORIAL METADATA & KHUSHANG'S READER NOTES */}
            <div className="flex flex-col gap-5 max-w-lg">
              {/* Category Pill Tag */}
              <div>
                <span 
                  className="px-2.5 py-1 rounded text-[10.5px] font-mono font-bold uppercase tracking-widest inline-block"
                  style={{
                    backgroundColor: `${selectedBook.palette.accent}25`,
                    color: selectedBook.palette.accent,
                  }}
                >
                  {selectedBook.subtitleRomaji} / {selectedBook.subtitleKanji}
                </span>
              </div>

              {/* Huge Book Title */}
              <h1 
                className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-[1.08]"
                style={{ fontFamily: '"Newsreader", Georgia, serif' }}
              >
                {selectedBook.title}
              </h1>

              {/* Metadata Line */}
              <p className="text-[11px] font-mono uppercase tracking-widest opacity-60">
                {selectedBook.year} / {selectedBook.category} / {selectedBook.pages} PAGES / {selectedBook.publisher}
              </p>

              {/* Core Synopsis */}
              <p 
                className="text-sm sm:text-base leading-relaxed opacity-90"
                style={{ fontFamily: '"Newsreader", serif' }}
              >
                {selectedBook.synopsis}
              </p>

              {/* Iconic Quote */}
              <blockquote 
                className="p-4 rounded-xl border-l-2 bg-black/5 dark:bg-white/5 text-sm sm:text-base italic leading-relaxed"
                style={{
                  borderColor: selectedBook.palette.accent,
                  fontFamily: '"Newsreader", serif',
                }}
              >
                "{selectedBook.quote}"
                <cite className="block text-[11px] font-mono font-bold not-italic mt-2 uppercase opacity-75">
                  {selectedBook.author}
                </cite>
              </blockquote>

              {/* Khushang's Personal Reader Takeaway */}
              <div className="pt-2">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#ff5e1a] block mb-1">
                  KHUSHANG'S ENGINEERING NOTES
                </span>
                <p className="text-xs sm:text-sm leading-relaxed opacity-85">
                  {selectedBook.takeaway}
                </p>
              </div>

              {/* Put Back on Shelf Action Button */}
              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={closeDetail}
                  className="px-5 py-2.5 rounded-lg bg-[#ff5e1a] text-white text-xs font-mono font-bold tracking-wider hover:brightness-110 shadow-lg cursor-pointer transition-all"
                >
                  RETURN TO SHELF
                </button>
                <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest">
                  Hardcover in Personal Studio
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN: HIGH-RES POSTER WITH SVG INK-BLEED MASK */}
            <div className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-[474/900] rounded-xl overflow-hidden shadow-2xl">
              {/* Ink Mask Definition */}
              <svg className="absolute w-0 h-0" aria-hidden="true">
                <defs>
                  <mask id="shelf-ink-mask" maskUnits="userSpaceOnUse" x="-200" y="-200" width="874" height="1300">
                    <rect x="-200" y="-200" width="874" height="1300" fill="#000000" />
                    <g filter="url(#shelf-ink-bleed)" fill="#FFFFFF">
                      {/* 7 Spreading Ink Blobs */}
                      <circle ref={el => { inkCirclesRef.current[0] = el; }} cx="150" cy="330" r="0" />
                      <circle ref={el => { inkCirclesRef.current[1] = el; }} cx="340" cy="600" r="0" />
                      <circle ref={el => { inkCirclesRef.current[2] = el; }} cx="250" cy="120" r="0" />
                      <circle ref={el => { inkCirclesRef.current[3] = el; }} cx="90" cy="760" r="0" />
                      <circle ref={el => { inkCirclesRef.current[4] = el; }} cx="400" cy="250" r="0" />
                      <circle ref={el => { inkCirclesRef.current[5] = el; }} cx="260" cy="860" r="0" />
                      <circle ref={el => { inkCirclesRef.current[6] = el; }} cx="230" cy="470" r="0" />
                    </g>
                  </mask>
                </defs>
              </svg>

              {/* Masked Book Poster */}
              <div 
                className="w-full h-full"
                style={{
                  mask: 'url(#shelf-ink-mask)',
                  WebkitMask: 'url(#shelf-ink-mask)',
                }}
              >
                <BookArtwork book={selectedBook} face="poster" isDark={isDark} />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Caption Slide Animation Styles */}
      <style>{`
        @keyframes captionSlide {
          0% {
            transform: translateY(calc(var(--caption-dir, 1) * 110%));
            opacity: 0;
          }
          100% {
            transform: translateY(0%);
            opacity: 1;
          }
        }
        .animate-caption-slide {
          animation: captionSlide 600ms cubic-bezier(.2, .8, .2, 1) both;
        }
      `}</style>
    </div>
  );
}
