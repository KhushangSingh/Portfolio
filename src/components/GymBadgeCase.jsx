import React, { useState, useRef, useEffect } from 'react';
import BrandMark from './BrandMark';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

// ==========================================
// BESPOKE 18 COLLECTOR ENAMEL PINS
// Tool marks set into enamel lapel pins.
// Polished chrome/silver rims, cloisonné hard enamel fills and contact shadows.
// ==========================================
const EnamelPin = ({ brand, name, work, isHovered, isClicked, onHoverStart, onHoverEnd, onClick, isDark }) => {
  const active = isHovered || isClicked;

  return (
    <button
      type="button"
      aria-label={name}
      className="relative flex items-center justify-center cursor-pointer select-none"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      onClick={onClick}
    >
      {/* Floating Micro-Popup directly over badge - Clean, matte, zero neon/shiny effects */}
      <AnimatePresence>
        {active && (
          <motion.span
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 3, scale: 0.95 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className={`absolute -top-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-3 py-1.5 rounded-lg border shadow-lg flex flex-col items-center text-center whitespace-nowrap ${
              isDark 
                ? 'bg-[#141518] border-neutral-700/60 text-white shadow-black/60' 
                : 'bg-white border-neutral-200 text-neutral-900 shadow-neutral-500/20'
            }`}
          >
            <span className={`font-mono text-[11px] font-bold uppercase tracking-wider ${
              isDark ? 'text-neutral-100' : 'text-neutral-900'
            }`}>
              {name}
            </span>
            <span className={`text-[10px] font-medium leading-tight mt-0.5 ${
              isDark ? 'text-neutral-400' : 'text-neutral-500'
            }`}>
              {work}
            </span>

            {/* Downward triangular beak */}
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-1.5 overflow-hidden pointer-events-none">
              <span className={`w-2 h-2 rotate-45 transform origin-top-left mx-auto border-r border-b ${
                isDark ? 'bg-[#141518] border-neutral-700/60' : 'bg-white border-neutral-200'
              }`} />
            </span>
          </motion.span>
        )}
      </AnimatePresence>

      {/* Pin Body with Contact Shadow & Spring Lift */}
      <motion.span
        animate={{
          scale: active ? 1.25 : 1,
          y: active ? -5 : 0
        }}
        transition={{ type: 'spring', damping: 14, stiffness: 340 }}
        className="relative flex items-center justify-center"
      >
        {/* Soft Contact Drop Shadow on Velvet */}
        <span
          className={`absolute inset-0 rounded-full transition-all duration-200 pointer-events-none ${
            active 
              ? 'opacity-90 filter blur-md bg-black/90 translate-x-1.5 translate-y-2.5 scale-90' 
              : 'opacity-70 filter blur-xs bg-black/80 translate-x-1 translate-y-1.5'
          }`}
        />

        {/* Enameled Lapel Pin Artwork */}
        <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-lg border border-white/80 bg-[#f5f3ef] shadow-md sm:h-12 sm:w-12">
          {brand ? (
            <BrandMark brand={brand} className="w-8 h-8 sm:w-10 sm:h-10" />
          ) : (
            <span className="px-1 text-center text-[8px] font-semibold leading-tight text-neutral-900">{name}</span>
          )}
        </span>
      </motion.span>
    </button>
  );
};

// ==========================================
// METALLIC HARDWARE ACCESSORIES
// ==========================================

// Front Wall Chrome Toggle Draw Latch
const FrontChromeLatch = ({ isOpen, onToggle }) => (
  <div 
    onClick={(e) => {
      e.stopPropagation();
      onToggle();
    }}
    className="relative w-6 h-8 flex flex-col items-center cursor-pointer group"
    title={isOpen ? "Click to lock case lid" : "Click to open case lid"}
  >
    <div className="w-5 h-7 rounded-sm bg-gradient-to-b from-[#F1F5F9] via-[#CBD5E1] to-[#64748B] border border-[#1E293B] shadow-[0_2px_4px_rgba(0,0,0,0.6)] flex flex-col items-center justify-between py-0.5">
      <div className="w-full flex justify-between px-0.5">
        <span className="w-0.5 h-0.5 rounded-full bg-[#0F172A]" />
        <span className="w-0.5 h-0.5 rounded-full bg-[#0F172A]" />
      </div>

      <div className="w-3.5 h-3.5 rounded-sm bg-gradient-to-b from-[#FFFFFF] via-[#E2E8F0] to-[#94A3B8] border border-[#0F172A] shadow-inner flex items-center justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] shadow-sm" />
      </div>

      <div className="w-full flex justify-between px-0.5">
        <span className="w-0.5 h-0.5 rounded-full bg-[#0F172A]" />
        <span className="w-0.5 h-0.5 rounded-full bg-[#0F172A]" />
      </div>
    </div>

    {/* Silver Wire Bail Loop */}
    <div 
      className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-none ${
        isOpen ? '-top-2.5 w-4 h-3.5' : '-top-1.5 w-4 h-2.5'
      }`}
    >
      <svg viewBox="0 0 20 16" className="w-full h-full" fill="none">
        <path
          d={isOpen ? "M2 14 C2 2, 18 2, 18 14" : "M2 14 C2 5, 18 5, 18 14"}
          stroke="#E2E8F0"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d={isOpen ? "M2 14 C2 2, 18 2, 18 14" : "M2 14 C2 5, 18 5, 18 14"}
          stroke="#0F172A"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  </div>
);

// Glass Lid Top Chrome Latch Brackets
const LidTopLatchBracket = () => (
  <div className="relative w-6 h-5 flex flex-col items-center pointer-events-none">
    {/* Silver Wire Loop pointing upward */}
    <div className="w-4 h-2.5 rounded-t-sm border-t-2 border-x-2 border-[#E2E8F0] bg-transparent shadow-sm" />
    {/* Chrome Clasp Base */}
    <div className="w-5 h-3 rounded-sm bg-gradient-to-b from-[#FFFFFF] via-[#CBD5E1] to-[#64748B] border border-[#1E293B] shadow-sm flex items-center justify-center">
      <span className="w-2.5 h-1.5 rounded-xs bg-[#0F172A]" />
    </div>
  </div>
);

// Heavy Duty Chrome Hinge
const ChromeHingeBracket = () => (
  <div className="w-8 h-4 bg-gradient-to-r from-[#64748B] via-[#F8FAFC] to-[#475569] border border-[#1E293B] rounded-sm shadow-sm flex items-center justify-center pointer-events-none">
    <div className="w-6 h-1.5 bg-[#0F172A] rounded-sm" />
  </div>
);

// ==========================================
// GYMBADGECASE MAIN COMPONENT
// ==========================================
export const GymBadgeCase = () => {
  const { isDark } = useTheme();
  const [hoveredBadgeId, setHoveredBadgeId] = useState(null);
  const [clickedBadgeId, setClickedBadgeId] = useState(null);
  const [isCaseHovered, setIsCaseHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  // Container & Scroll In-View Observer
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { 
    margin: '-60px 0px -60px 0px', 
    once: false 
  });

  useEffect(() => {
    if (isInView) {
      setIsOpen(true);
    }
  }, [isInView]);

  // Parallax subtle tilt
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const rotateY = ((x / rect.width) - 0.5) * 5;
    const rotateX = -((y / rect.height) - 0.5) * 5;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handlePointerLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHoveredBadgeId(null);
    setIsCaseHovered(false);
  };

  // Sound synthesis for tactile latch snap
  const playLatchSound = (closing) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(closing ? 1200 : 700, now);
      osc.frequency.exponentialRampToValueAtTime(closing ? 250 : 1600, now + 0.06);
      
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Audio context silently ignored if blocked
    }
  };

  const toggleLid = () => {
    playLatchSound(isOpen);
    setIsOpen(prev => !prev);
  };

  // 18 Badges in the exact 5 - 6 - 7 row distribution matching reference images
  const row1Badges = [
    { id: 'figma', brand: 'figma', name: 'Figma', work: 'UI Systems & Multi-Brand Libraries' },
    { id: 'creative-cloud', name: 'Adobe Creative Cloud', work: 'Vector & Motion Asset Pipelines' },
    { id: 'adobe', name: 'Adobe Suite', work: 'Visual Design & Layout Production' },
    { id: 'react', brand: 'react', name: 'React 19', work: 'Web Apps & State Architecture' },
    { id: 'tailwind', brand: 'tailwind', name: 'Tailwind CSS', work: 'Design Tokens & Utility Styling' }
  ];

  const row2Badges = [
    { id: 'openai', brand: 'openai', name: 'OpenAI', work: 'LLM Pipelines & Agentic Workflows' },
    { id: 'spline', brand: 'spline', name: 'Spline 3D', work: 'Interactive WebGL Scenes & Cameras' },
    { id: 'midjourney', name: 'Prototyping', work: 'High-Fidelity Interaction Flows' },
    { id: 'notion', brand: 'notion', name: 'Notion', work: 'Documentation & Knowledge Systems' },
    { id: 'framer', brand: 'motion', name: 'Framer Motion', work: 'Spring Physics & Layout Animations' },
    { id: 'blender', brand: 'blender', name: 'Blender 3D', work: '3D Modeling & PBR Baking' }
  ];

  const row3Badges = [
    { id: 'vscode', brand: 'vscode', name: 'VS Code', work: 'Code Editing & TypeScript' },
    { id: 'davinci', brand: 'davinci', name: 'DaVinci Resolve', work: 'Motion Graphics & Color Grading' },
    { id: 'threejs', brand: 'threejs', name: 'Three.js', work: 'Custom Shaders & 3D Math' },
    { id: 'design-systems', name: 'Design Systems', work: 'Component Governance & Specs' },
    { id: 'procreate', brand: 'procreate', name: 'Procreate', work: 'Digital Art & Storyboards' },
    { id: 'sketch', brand: 'sketch', name: 'Sketch', work: 'Vector Design & Tokens' },
    { id: 'webgl', brand: 'webgl', name: 'WebGL & GLSL', work: 'GPU Shaders & Graphics Engines' }
  ];

  return (
    <div
      ref={sectionRef}
      id="gym-badge-case"
      data-no-cursor="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="w-full flex flex-col items-center select-none pt-28 sm:pt-36 lg:pt-48 pb-4 overflow-visible"
    >
      {/* ==============================================================
          THE STUDIO STAGE
          Transforms smoothly between:
          - Image 1 (Default): 3/4 Isometric Perspective Pose on Studio Desk
          - Image 2 (Hover/Click): Straight-on Front-Facing Top-Down Display Pose
          ============================================================== */}
      <div 
        className="relative w-full max-w-[460px] sm:max-w-[500px] lg:max-w-[520px] perspective-[1300px] touch-pan-y overflow-visible flex flex-col items-center cursor-pointer"
        onMouseEnter={() => setIsCaseHovered(true)}
        onMouseLeave={() => {
          setIsCaseHovered(false);
          setHoveredBadgeId(null);
        }}
      >
        
        {/* Soft Ambient Contact Shadow Under Case */}
        <div 
          className="absolute inset-2 rounded-3xl pointer-events-none -z-30 filter blur-xl transition-all duration-500"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse at 50% 60%, rgba(234,88,12,0.2) 0%, rgba(0,0,0,0.7) 50%, transparent 75%)'
              : 'radial-gradient(ellipse at 50% 60%, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.02) 45%, transparent 70%)',
            transform: isCaseHovered
              ? 'translateZ(-40px) translateY(18px) scale(1.02)'
              : 'translateZ(-40px) translateY(22px) scale(0.96)',
            opacity: isDark ? 0.7 : 0.5
          }}
        />

        {/* ==============================================================
            3D BRIEFCASE CHASSIS
            - Default: rotateX: 48, rotateY: -5, rotateZ: 32 (Exact match to reference presentation box)
            - Hovered: rotateX: 20, rotateY: 0, rotateZ: 0 (Straight-on Accessible Inspection)
            ============================================================== */}
        <motion.div
          animate={{
            rotateX: isCaseHovered ? (20 + tilt.x * 0.05) : (48 + tilt.x * 0.08),
            rotateY: isCaseHovered ? (0 + tilt.y * 0.04) : (-5 + tilt.y * 0.08),
            rotateZ: isCaseHovered ? 0 : (32 + tilt.y * 0.03),
            scale: isCaseHovered ? 1.02 : 0.94,
            y: isCaseHovered ? 0 : 8
          }}
          transition={{ 
            type: 'spring', 
            damping: 22, 
            stiffness: 125, 
            mass: 0.9 
          }}
          className="relative w-full aspect-[16/10.5] select-none will-change-transform"
          style={{
            transformStyle: 'preserve-3d'
          }}
        >
          {/* ==========================================================
              1. FRONT WALL (Extruded 3D Height facing viewer in anodized orange with rounded corners)
              - 38px height, rotated -90deg down
              - Features diagonal black rubber corner grips and dual chrome latches
              ========================================================== */}
          <div 
            className="absolute left-0 right-0 h-[38px] bg-gradient-to-b from-[#FF8C42] via-[#EA580C] to-[#9A3412] border-t-[1.5px] border-white/60 border-b-2 border-black/90 rounded-b-2xl flex items-center justify-between px-3 pointer-events-auto z-20 overflow-hidden"
            style={{
              bottom: 0,
              transformOrigin: 'bottom center',
              transform: 'rotateX(-90deg)',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Left Diagonal Black Protective Rubber Corner Grip */}
            <div 
              className="absolute left-0 bottom-0 top-0 w-20 pointer-events-none rounded-bl-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #111215 0%, #17181C 52%, transparent 53%)'
              }}
            />

            {/* Right Diagonal Black Protective Rubber Corner Grip */}
            <div 
              className="absolute right-0 bottom-0 top-0 w-20 pointer-events-none rounded-br-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(225deg, #111215 0%, #17181C 52%, transparent 53%)'
              }}
            />

            {/* Solid Black Rubber Corner Caps with Rounded Base Corners */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-[#0F1013] border-r border-black/80 z-10 pointer-events-none rounded-bl-xl" />
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-[#0F1013] border-l border-black/80 z-10 pointer-events-none rounded-br-xl" />

            {/* Left Front Chrome Draw Latch (at 22% width) */}
            <div className="absolute left-[22%] -translate-x-1/2 -top-1 z-30">
              <FrontChromeLatch isOpen={isOpen} onToggle={toggleLid} />
            </div>

            {/* Chassis Title Mark (Compliant human typography without synthetic double slashes) */}
            <div className="mx-auto text-[7.5px] font-mono font-bold tracking-[0.25em] text-white/90 uppercase select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] z-10">
              TOOL BADGE CASE · ANODIZED ORANGE
            </div>

            {/* Right Front Chrome Draw Latch (at 78% width) */}
            <div className="absolute left-[78%] -translate-x-1/2 -top-1 z-30">
              <FrontChromeLatch isOpen={isOpen} onToggle={toggleLid} />
            </div>
          </div>

          {/* ==========================================================
              2. LEFT SIDE WALL (Extruded 3D depth, rounded corners, zero protruding shadow smudges)
              ========================================================== */}
          <div 
            className="absolute top-0 bottom-0 w-[38px] bg-gradient-to-r from-[#7C2D12] via-[#C2410C] to-[#EA580C] border-t border-white/40 border-l border-white/20 border-r border-black/80 rounded-l-2xl z-10 overflow-hidden"
            style={{
              left: 0,
              transformOrigin: 'left center',
              transform: 'rotateY(-90deg)'
            }}
          >
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#0F1013] border-t border-black/80 rounded-bl-xl" />
            <div className="absolute top-0 left-0 right-0 h-4 bg-[#0F1013] border-b border-black/80 rounded-tl-xl" />
          </div>

          {/* ==========================================================
              3. RIGHT SIDE WALL (Extruded 3D depth, rounded corners)
              ========================================================== */}
          <div 
            className="absolute top-0 bottom-0 w-[38px] bg-gradient-to-l from-[#661E08] via-[#9A3412] to-[#EA580C] border-t border-white/30 border-r border-white/20 rounded-r-2xl z-10 overflow-hidden"
            style={{
              right: 0,
              transformOrigin: 'right center',
              transform: 'rotateY(90deg)'
            }}
          >
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#0F1013] border-t border-black/80 rounded-br-xl" />
            <div className="absolute top-0 left-0 right-0 h-4 bg-[#0F1013] border-b border-black/80 rounded-tr-xl" />
          </div>

          {/* ==========================================================
              4. BACK WALL (Connects Glass Lid via Heavy-Duty Chrome Hinges with rounded top edge)
              ========================================================== */}
          <div 
            className="absolute left-0 right-0 h-[38px] bg-gradient-to-t from-[#9A3412] to-[#FF8C42] border-t border-white/30 rounded-t-2xl z-10 overflow-hidden"
            style={{
              top: 0,
              transformOrigin: 'top center',
              transform: 'rotateX(90deg)'
            }}
          >
            <div className="absolute left-[20%] -translate-x-1/2 -top-1">
              <ChromeHingeBracket />
            </div>
            <div className="absolute left-[80%] -translate-x-1/2 -top-1">
              <ChromeHingeBracket />
            </div>
          </div>

          {/* ==========================================================
              5. MAIN TRAY & RECESSED MATTE BLACK VELVET BADGE BED
              ========================================================== */}
          <div 
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF8C42] via-[#EA580C] to-[#9A3412] border-[6px] border-[#EA580C] shadow-[0_14px_30px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_50px_-15px_rgba(0,0,0,0.85)]"
            style={{
              transform: 'translateZ(0px)',
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="absolute inset-0 rounded-xl pointer-events-none opacity-25 bg-gradient-to-tr from-transparent via-white/30 to-transparent" />

            {/* Recessed Matte Black Velvet Cushion (Inset 12px) */}
            <div className="absolute inset-[10px] sm:inset-[12px] rounded-xl bg-[#0B0C10] border-2 border-black/90 shadow-[inset_0_14px_35px_rgba(0,0,0,0.98),inset_0_2px_8px_rgba(0,0,0,0.9)] flex flex-col justify-around py-2.5 px-2 sm:px-4 overflow-visible">
              
              {/* Subtle Velvet Grain */}
              <div 
                className="absolute inset-0 rounded-xl opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)',
                  backgroundSize: '8px 8px'
                }}
              />

              {/* ROW 1: 5 PINS (Centered, matching photo) */}
              <div className="relative z-20 flex justify-center items-center gap-4 sm:gap-6 w-full overflow-visible">
                {row1Badges.map((badge) => (
                  <EnamelPin
                    key={badge.id}
                    brand={badge.brand}
                    name={badge.name}
                    work={badge.work}
                    isHovered={hoveredBadgeId === badge.id}
                    isClicked={clickedBadgeId === badge.id}
                    onHoverStart={() => setHoveredBadgeId(badge.id)}
                    onHoverEnd={() => setHoveredBadgeId(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setClickedBadgeId(prev => prev === badge.id ? null : badge.id);
                    }}
                    isDark={isDark}
                  />
                ))}
              </div>

              {/* ROW 2: 6 PINS (Centered, matching photo) */}
              <div className="relative z-20 flex justify-center items-center gap-3 sm:gap-4.5 w-full overflow-visible">
                {row2Badges.map((badge) => (
                  <EnamelPin
                    key={badge.id}
                    brand={badge.brand}
                    name={badge.name}
                    work={badge.work}
                    isHovered={hoveredBadgeId === badge.id}
                    isClicked={clickedBadgeId === badge.id}
                    onHoverStart={() => setHoveredBadgeId(badge.id)}
                    onHoverEnd={() => setHoveredBadgeId(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setClickedBadgeId(prev => prev === badge.id ? null : badge.id);
                    }}
                    isDark={isDark}
                  />
                ))}
              </div>

              {/* ROW 3: 7 PINS (Centered, matching photo) */}
              <div className="relative z-20 flex justify-center items-center gap-2.5 sm:gap-3.5 w-full overflow-visible">
                {row3Badges.map((badge) => (
                  <EnamelPin
                    key={badge.id}
                    brand={badge.brand}
                    name={badge.name}
                    work={badge.work}
                    isHovered={hoveredBadgeId === badge.id}
                    isClicked={clickedBadgeId === badge.id}
                    onHoverStart={() => setHoveredBadgeId(badge.id)}
                    onHoverEnd={() => setHoveredBadgeId(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setClickedBadgeId(prev => prev === badge.id ? null : badge.id);
                    }}
                    isDark={isDark}
                  />
                ))}
              </div>

            </div>

          </div>

          {/* ==========================================================
              6. HINGED TRANSPARENT GLASS LID (Open upright perpendicular, shorter height)
              ========================================================== */}
          <motion.div
            animate={{
              rotateX: isOpen ? (isCaseHovered ? -90 : -88) : -180,
              height: isOpen ? (isCaseHovered ? '64%' : '68%') : '100%',
              z: 38
            }}
            transition={{ 
              type: 'spring', 
              damping: 22, 
              stiffness: 110, 
              mass: 0.95 
            }}
            onClick={toggleLid}
            className={`absolute left-0 right-0 rounded-2xl z-40 transition-shadow duration-500 ${
              isOpen ? 'pointer-events-none' : 'cursor-pointer pointer-events-auto'
            }`}
            style={{
              bottom: '100%',
              transformOrigin: 'bottom center',
              transformStyle: 'preserve-3d'
            }}
          >
            <div 
              className="absolute inset-0 rounded-2xl border-[6px] border-[#EA580C] shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden"
              style={{
                boxShadow: isOpen 
                  ? '0 24px 60px -15px rgba(0,0,0,0.85), inset 0 2px 4px rgba(255,255,255,0.45)' 
                  : '0 10px 30px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.5)'
              }}
            >
              <div className="absolute inset-0 border-2 border-[#15161A] pointer-events-none" />

              {/* Rubber Corner Bumper Guards on Lid */}
              <div className="absolute top-0 left-0 w-3.5 h-3.5 bg-[#0F1013] border-r border-b border-black/80 pointer-events-none" />
              <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#0F1013] border-l border-b border-black/80 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-3.5 h-3.5 bg-[#0F1013] border-r border-t border-black/80 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#0F1013] border-l border-t border-black/80 pointer-events-none" />

              {/* Crystal Clear Transparent Glass Pane */}
              <div className="w-full h-full backdrop-blur-[0.5px] bg-white/[0.03]" />

              {/* Diagonal Window Daylight Reflection Glare */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  background: 'linear-gradient(115deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.06) 24%, transparent 44%, rgba(255,255,255,0.15) 70%, transparent 100%)'
                }}
              />

              <div className="absolute inset-[2px] rounded-xl border border-white/20 pointer-events-none" />
            </div>

            {/* Top Rim Chrome Latch Loops (Mounted at 22% and 78% width on the TOP rim, pointing UP) */}
            <div className="absolute -top-3 left-[22%] -translate-x-1/2 pointer-events-none">
              <LidTopLatchBracket />
            </div>
            <div className="absolute -top-3 left-[78%] -translate-x-1/2 pointer-events-none">
              <LidTopLatchBracket />
            </div>

            {/* Black Rubber Grip Blocks on Top Rim */}
            <div className="absolute -top-1 left-[40%] -translate-x-1/2 w-8 h-2 rounded-b-sm bg-[#111215] border border-black/80 pointer-events-none" />
            <div className="absolute -top-1 left-[60%] -translate-x-1/2 w-8 h-2 rounded-b-sm bg-[#111215] border border-black/80 pointer-events-none" />

            {/* Heavy-Duty Chrome Hinges along bottom seam */}
            <div className="absolute -bottom-2 left-[20%] -translate-x-1/2 z-30 pointer-events-none">
              <ChromeHingeBracket />
            </div>
            <div className="absolute -bottom-2 left-[80%] -translate-x-1/2 z-30 pointer-events-none">
              <ChromeHingeBracket />
            </div>
          </motion.div>

        </motion.div>

      </div>

    </div>
  );
};

export default GymBadgeCase;
