import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { designData } from '../constants/data';

// Top 3 Flagship Projects (matching the reference card design)
const TOP_PROJECTS = [
  {
    id: 1,
    rawId: 1,
    title: "OtakuCircle",
    subtitle: "Community & Anime Discovery · Full Stack SaaS",
    desc: "A full social platform for anime enthusiasts to browse, review, and track their journey with friends. Designed an immersive obsidian dark UI with frosted glassmorphism, smart search by scenario, and AI vibe-based recommendation architecture.",
    tags: ["SaaS platform", "Social discovery", "Design tokens"],
    footerNote: "End-to-end flows, dark mode tokens & responsive web application",
    image: "/images/otakucircle/landing.webp",
    accent: "#10b981"
  },
  {
    id: 2,
    rawId: 2,
    title: "SquadSync",
    subtitle: "Merit-Based Team Collaboration · Studio Suite",
    desc: "Collaboration platform connecting university students based on competency with a structured 'Request & Approval' workflow. Replaced chaotic social groups with skill-matching logic, project workspaces, and applicant review dashboards.",
    tags: ["Collaboration", "SaaS workflow", "Dashboard UI"],
    footerNote: "Competency matching algorithm & applicant review dashboards",
    image: "/images/squadsync_cover.jpg",
    accent: "#ec4899"
  },
  {
    id: 3,
    rawId: 3,
    title: "Ledgerly",
    subtitle: "High-Speed Resource Library · Asset Vault",
    desc: "A centralized digital library built to eliminate the chaos of scattered bookmarks. Provides a structured environment where developers and designers can discover curated domain-specific tools and maintain personalized repositories for instant access.",
    tags: ["Tool vault", "Resource curation", "React architecture"],
    footerNote: "High-speed retrieval architecture, token design & interactive vaults",
    image: "/images/ledgerly_cover.jpg",
    accent: "#f97316"
  }
];

export default function SelectedWorksShowcase({ onProjectClick }) {
  const { isDark } = useTheme();
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [windowSize, setWindowSize] = useState({
    w: typeof window !== 'undefined' ? window.innerWidth : 1200,
    h: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  // Responsive detector & screen dimension tracker
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        w: window.innerWidth,
        h: window.innerHeight
      });
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pinned vertical scroll watcher with native & Lenis synchronization (RAF throttled for 60/120fps fluid paint)
  useEffect(() => {
    let ticking = false;

    const computeProgress = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;

      const scrolled = -rect.top;
      const raw = Math.max(0, Math.min(1, scrolled / scrollable));
      setProgress(raw);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(computeProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    if (window.__lenis) {
      window.__lenis.on('scroll', handleScroll);
    }
    computeProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (window.__lenis) {
        window.__lenis.off('scroll', handleScroll);
      }
    };
  }, []);

  // Helper to open case study modal
  const handleOpenCaseStudy = (rawId) => {
    if (!onProjectClick) return;
    let matched = null;
    for (const sec of designData.sections || []) {
      matched = sec.projects.find((p) => p.id === rawId);
      if (matched) break;
    }
    if (matched) {
      onProjectClick(matched);
    }
  };

  /* -------------------------------------------------------------
     1. ORANGE CONTAINER MORPH CYCLE:
     - Phase 1 (0.00 -> 0.16): Entry from ProcessSection above.
       Orange box starts FULL SCREEN (100vw width, full height, 0 radius).
       Smoothly contracts into inset card (targetWidth, targetHeight, rounded top corners).
     - Phase 2 (0.16 -> 0.80): Inset card state while user explores the 3 project cards.
     - Phase 3 (0.80 -> 1.00): Exit to lower section / scrolling back up from lower section.
       As user scrolls towards the lower section (0.80 -> 1.00), the orange box smoothly
       expands BACK OUT to full screen width (100vw) and full height.
       Conversely, when a visitor scrolls UP from the lower section into Selected Works,
       the box is initially full screen, and contracts smoothly into the inset card!
     ------------------------------------------------------------- */
  let boxEase = 0;
  if (progress <= 0.16) {
    // Entry phase (0.00 -> 0.16): 0 -> 1
    const tIn = progress / 0.16;
    boxEase = 1 - Math.pow(1 - tIn, 3);
  } else if (progress < 0.80) {
    // Inset showcase phase (0.16 -> 0.80): 1
    boxEase = 1.0;
  } else {
    // Exit & scroll-up phase (0.80 -> 1.00): 1 -> 0
    // Morph back to full screen width and height
    const tOut = Math.min(1, Math.max(0, (progress - 0.80) / 0.20));
    boxEase = 1 - Math.pow(tOut, 2.2);
  }

  // Target inset dimensions for the orange box (attached to bottom edge of visible screen)
  const targetWidth = isMobile
    ? Math.max(300, windowSize.w - 24)
    : Math.min(1280, windowSize.w - 64);

  const topClearance = isMobile ? 60 : 84;
  const initialHeight = windowSize.h; // Full screen height when boxEase = 0
  const targetHeight = Math.max(520, windowSize.h - topClearance);

  // Smooth interpolation:
  // At boxEase = 0: 100vw full screen width, 100vh full screen height, 0 radius
  // At boxEase = 1: inset showcase container with rounded top corners and pointed bottom corners
  const boxWidth = Math.round(windowSize.w - boxEase * (windowSize.w - targetWidth));
  const boxHeight = Math.round(initialHeight - boxEase * (initialHeight - targetHeight));
  const boxRadius = Math.round(boxEase * (isMobile ? 24 : 36));

  /* -------------------------------------------------------------
     2. CARD STACKING INTERPOLATION (Progress: 0.16 -> 0.78)
     - Card 1: Starts in place; peeks out behind Cards 2 & 3
     - Card 2: Moves up from below (p: 0.16 -> 0.46)
     - Card 3: Moves up from below (p: 0.48 -> 0.78)
     ------------------------------------------------------------- */
  const p2Raw = Math.min(1, Math.max(0, (progress - 0.16) / 0.30));
  const ease2 = 1 - Math.pow(1 - p2Raw, 3);

  const p3Raw = Math.min(1, Math.max(0, (progress - 0.48) / 0.30));
  const ease3 = 1 - Math.pow(1 - p3Raw, 3);

  // Subtle stacking offset so layered cards peek cleanly without crowding the top rim
  const card1Y = -(ease2 * 10 + ease3 * 10);

  const card2EntranceY = (1 - ease2) * (isMobile ? 720 : 940);
  const card2StackY = -(ease3 * 10);
  const card2TotalY = card2EntranceY + card2StackY;

  const card3EntranceY = (1 - ease3) * (isMobile ? 720 : 940);
  const card3TotalY = card3EntranceY;

  return (
    <section id="selected-works-section" className="relative w-full">
      {/* ==============================================================
          PINNED SCROLL ARENA (Crisp, responsive 260vh runway)
          ============================================================== */}
      <div
        ref={trackRef}
        id="project-showcase"
        className="relative w-full"
        style={{ height: '260vh' }}
      >
        {/* Sticky Fullscreen Viewport */}
        <div className="sticky top-0 h-screen w-full overflow-hidden select-none">

          {/* ==============================================================
              THE DYNAMIC ORANGE BOX CONTAINER
              - Encompasses "Selected Works" title inside it at the top
              - Bottom part attached to the visible screen bottom line (bottom: 0)
              - Top corners rounded, bottom corners POINTED (square 0px)
              - Morphs to full width & height at both top entry and lower exit
              ============================================================== */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 overflow-hidden flex flex-col items-center justify-between transition-[box-shadow,border-color] duration-300"
            style={{
              width: `${boxWidth}px`,
              height: `${boxHeight}px`,
              // Top corners rounded, bottom corners pointed:
              borderRadius: `${boxRadius}px ${boxRadius}px 0 0`,
              background: isDark
                ? 'radial-gradient(ellipse 95% 70% at 50% 45%, #ff6b28 0%, #ff5e1a 35%, #d94e10 70%, #9e3204 100%)'
                : 'radial-gradient(ellipse 95% 70% at 50% 45%, #ff7938 0%, #ff5e1a 40%, #e64d0d 75%, #b83800 100%)',
              boxShadow: boxEase > 0.15
                ? isDark
                  ? '0 -15px 60px -15px rgba(255, 94, 26, 0.35), 0 10px 40px -10px rgba(0, 0, 0, 0.7)'
                  : '0 -12px 50px -15px rgba(255, 94, 26, 0.25), 0 10px 30px -10px rgba(0, 0, 0, 0.12)'
                : 'none',
              borderTop: boxEase > 0.15
                ? isDark ? '1px solid rgba(255, 255, 255, 0.22)' : '1px solid rgba(0, 0, 0, 0.12)'
                : 'none',
              borderLeft: boxEase > 0.15
                ? isDark ? '1px solid rgba(255, 255, 255, 0.22)' : '1px solid rgba(0, 0, 0, 0.12)'
                : 'none',
              borderRight: boxEase > 0.15
                ? isDark ? '1px solid rgba(255, 255, 255, 0.22)' : '1px solid rgba(0, 0, 0, 0.12)'
                : 'none',
              borderBottom: 'none'
            }}
          >
            {/* Ambient Lighting Gradient inside Orange Box */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-700"
              style={{
                background: 'radial-gradient(ellipse at 50% 15%, rgba(255, 235, 210, 0.35) 0%, transparent 60%), linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, transparent 40%, rgba(0,0,0,0.25) 100%)'
              }}
            />

            {/* ==============================================================
                1. SECTION HEADER INSIDE ORANGE BOX: SELECTED WORKS
                Left-aligned with the project cards below
                ============================================================== */}
            <div className="w-full max-w-[1160px] px-3 sm:px-6 md:px-8 pt-5 sm:pt-6 md:pt-7 pb-1 sm:pb-2 z-20 flex items-center justify-between pointer-events-none">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-bold tracking-tight leading-none text-white select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
              >
                Selected Works
              </motion.h2>
            </div>

            {/* ==============================================================
                2. CARDS STAGE (VERTICALLY & HORIZONTALLY CENTERED)
                Maintains equal space above and below the card stack
                inside the orange box.
                ============================================================== */}
            <div className="relative flex-1 w-full flex items-center justify-center p-3 sm:p-5 md:p-6 pb-5 sm:pb-7">
              
              <div className="relative w-full max-w-[1160px] px-3 sm:px-6 md:px-8 flex items-center justify-center">
                
                {/* CARD 1: OTAKUCIRCLE (Base in-flow card - defines centered bounds) */}
                <div
                  className="w-full will-change-transform"
                  style={{
                    zIndex: 10,
                    transform: `translate3d(0, ${card1Y.toFixed(1)}px, 0)`,
                    opacity: 1
                  }}
                >
                  <ProjectHorizontalCard
                    project={TOP_PROJECTS[0]}
                    isMobile={isMobile}
                    onOpenCaseStudy={handleOpenCaseStudy}
                  />
                </div>

                {/* CARD 2: SQUADSYNC (Moves in from below - same dimensions & alignment) */}
                <div
                  className="absolute inset-x-3 sm:inset-x-6 md:inset-x-8 will-change-transform"
                  style={{
                    zIndex: 20,
                    transform: `translate3d(0, ${card2TotalY.toFixed(1)}px, 0)`,
                    opacity: 1,
                    display: p2Raw <= 0.005 ? 'none' : 'block',
                    pointerEvents: p2Raw > 0.75 ? 'auto' : 'none'
                  }}
                >
                  <ProjectHorizontalCard
                    project={TOP_PROJECTS[1]}
                    isMobile={isMobile}
                    onOpenCaseStudy={handleOpenCaseStudy}
                  />
                </div>

                {/* CARD 3: LEDGERLY (Moves in from below - same dimensions & alignment) */}
                <div
                  className="absolute inset-x-3 sm:inset-x-6 md:inset-x-8 will-change-transform"
                  style={{
                    zIndex: 30,
                    transform: `translate3d(0, ${card3TotalY.toFixed(1)}px, 0)`,
                    opacity: 1,
                    display: p3Raw <= 0.005 ? 'none' : 'block',
                    pointerEvents: p3Raw > 0.75 ? 'auto' : 'none'
                  }}
                >
                  <ProjectHorizontalCard
                    project={TOP_PROJECTS[2]}
                    isMobile={isMobile}
                    onOpenCaseStudy={handleOpenCaseStudy}
                  />
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

// Export aliases for backwards compatibility
export { SelectedWorksShowcase as ReelRingShowcase };

/* =========================================================================
   INDIVIDUAL HORIZONTAL PROJECT CARD COMPONENT
   Faithfully crafted to match the reference design:
   - Clean solid pure white card surface (100% opacity)
   - Left side: Project title, summary and metadata
   - Right side: High-precision hardware desktop monitor displaying the product UI
   ========================================================================= */
function ProjectHorizontalCard({ project, isMobile, onOpenCaseStudy }) {
  return (
    <div
      className="relative w-full rounded-[22px] sm:rounded-[28px] md:rounded-[32px] p-5 sm:p-7 md:p-7 lg:p-8 xl:p-9 shadow-[0_24px_55px_rgba(0,0,0,0.25)] border border-black/[0.08] bg-[#F8F8F5] text-neutral-900 transition-all duration-300 overflow-hidden opacity-100 select-none min-h-[415px] sm:min-h-[450px] md:min-h-[490px] lg:min-h-[520px] xl:min-h-[545px] flex flex-col justify-center"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-7 md:gap-9 lg:gap-11 w-full h-full">
        
        {/* LEFT COLUMN: EDITORIAL CONTENT PANE (~44% width) */}
        <div className="w-full md:w-[46%] lg:w-[44%] flex flex-col justify-between text-left z-10 py-1.5 sm:py-2">
          
          {/* 2. Bold Project Title */}
          <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-[40px] font-bold tracking-tight leading-[1.04] text-neutral-900 mb-1 sm:mb-1.5">
            {project.title}
          </h3>

          {/* 3. Subtitle / Domain Label */}
          <p className="text-xs sm:text-[13px] md:text-sm font-medium text-neutral-600 mb-2 sm:mb-3">
            {project.subtitle}
          </p>

          {/* 4. Grounded Paragraph Description */}
          <p className="text-xs sm:text-[13px] md:text-sm text-neutral-600 leading-relaxed font-normal mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-4">
            {project.desc}
          </p>

          {/* 5. Minimal Horizontal Tag Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3.5 sm:mb-5">
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-medium border border-neutral-300/80 bg-neutral-100/90 text-neutral-700 shadow-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 6. Footer Note with Bullet & Direct Case Study Trigger */}
          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-neutral-200/90 w-full">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-neutral-500 font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="line-clamp-1">{project.footerNote}</span>
            </div>

            <button
              onClick={() => onOpenCaseStudy(project.rawId)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-[#ff5e1a] hover:bg-[#ff5e1a]/10 transition-all cursor-pointer flex-shrink-0"
              title="Open full interactive case study"
            >
              <span>Explore</span>
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: REALISTIC HARDWARE DESKTOP MONITOR MOCKUP (~56% width) */}
        <div className="w-full md:w-[54%] lg:w-[56%] flex flex-col items-center justify-center relative py-1 sm:py-1.5">
          
          {/* MONITOR DISPLAY SCREEN & BEZEL */}
          <div className="relative w-full aspect-[16/10] max-h-[240px] sm:max-h-[285px] md:max-h-[325px] lg:max-h-[365px] xl:max-h-[385px] rounded-[14px] sm:rounded-[18px] md:rounded-[22px] bg-[#0a0a0c] p-1.5 sm:p-2 md:p-2.5 shadow-[0_22px_55px_rgba(0,0,0,0.5)] border border-neutral-800">
            
            {/* Top Bezel Camera Dot */}
            <div className="absolute top-1 sm:top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-neutral-700/80 pointer-events-none" />

            {/* Inner Glass Display with Project UI Screenshot */}
            <div className="relative w-full h-full rounded-[8px] sm:rounded-[12px] md:rounded-[14px] overflow-hidden bg-neutral-900 border border-black/40">
              <img
                src={project.image}
                alt={`${project.title} Interface Preview`}
                className="w-full h-full object-cover object-top select-none pointer-events-none transition-transform duration-700 hover:scale-[1.02]"
                loading="eager"
              />

              {/* Specular Diagonal Reflection Sheen */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 30%, transparent 60%)'
                }}
              />
            </div>
          </div>

          {/* MONITOR METALLIC STAND NECK */}
          <div className="w-9 sm:w-11 md:w-13 h-4 sm:h-5 md:h-6 bg-gradient-to-b from-[#8f949e] via-[#6c727d] to-[#4c5057] shadow-inner -mt-0.5 border-x border-neutral-700/50" />

          {/* MONITOR HORIZONTAL / ELLIPTICAL STAND BASE */}
          <div className="relative w-26 sm:w-32 md:w-40 h-2 sm:h-3 rounded-full bg-gradient-to-r from-[#7a7f8a] via-[#a3a9b5] to-[#7a7f8a] shadow-[0_4px_10px_rgba(0,0,0,0.4)] border border-neutral-600/60" />

          {/* REALISTIC CONTACT SHADOW ON WHITE CARD FLOOR */}
          <div className="w-34 sm:w-48 h-2 rounded-full bg-black/25 blur-[5px] -mt-1 pointer-events-none" />

        </div>

      </div>
    </div>
  );
}

