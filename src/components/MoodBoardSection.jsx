import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function MoodBoardSection() {
  const { isDark } = useTheme();
  const boardRef = useRef(null);
  
  // Track top-most z-index so clicked/dragged cards rise to top
  const [topZ, setTopZ] = useState(30);
  const [cardZ, setCardZ] = useState({});
  const [scatterKey, setScatterKey] = useState(0);
  const [scatterOffsets, setScatterOffsets] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const bringToFront = (id) => {
    setTopZ(prev => {
      const next = prev + 1;
      setCardZ(current => ({ ...current, [id]: next }));
      return next;
    });
  };

  const handleReset = () => {
    setScatterOffsets({});
    setScatterKey(prev => prev + 1);
  };


  return (
    <section id="moodboard-section" data-moodboard="true" data-no-cursor="true" className="relative w-full pt-6 pb-4">
      {/* SECTION HEADER: BEYOND DESIGNING */}
      <div className="flex items-end justify-between pb-2 mb-8 gap-6">
        <div className="pl-4 sm:pl-8 md:pl-14 lg:pl-20">
          <motion.h3 
            initial={{ opacity: 0, y: 35, filter: 'blur(12px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] will-change-[transform,opacity,filter] ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}
          >
            Beyond Designing
          </motion.h3>
        </div>

        {/* INTERACTIVE CONTROLS */}
        <motion.div 
          initial={{ opacity: 0, x: 20, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2.5 self-end will-change-[transform,opacity,filter]"
        >

          <div className="relative group/reset flex items-center">
            <button
              onClick={handleReset}
              aria-label="Reset Board"
              className={`min-h-9 px-3 text-xs font-semibold rounded-lg border flex items-center justify-center transition-all duration-200 active:scale-95 ${
                isDark
                  ? 'border-white/15 bg-white/5 hover:bg-white/10 text-gray-200 hover:border-[#ff5e1a]/60 shadow-sm'
                  : 'border-black/15 bg-white hover:bg-neutral-100 text-neutral-800 hover:border-[#ff5e1a]/60 shadow-sm'
              }`}
            >
              Reset board
            </button>

          </div>
        </motion.div>
      </div>

      {/* FREE-ROAM CANVAS CONTAINER */}
      <motion.div 
        ref={boardRef}
        initial={{ opacity: 0, y: 40, scale: 0.98, filter: 'blur(14px)' }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className={`relative w-full h-[2500px] md:h-[78vh] md:min-h-[660px] md:max-h-[860px] rounded-2xl md:rounded-3xl border-2 overflow-hidden select-none shadow-2xl transition-colors duration-500 will-change-[transform,opacity,filter] ${
          isDark 
            ? 'bg-[#8a2f07] border-[#ff5e1a]/60 shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_0_120px_rgba(255,120,40,0.35)]' 
            : 'bg-[#ffd5bc] border-[#ff5e1a]/50 shadow-[0_25px_60px_rgba(255,94,26,0.22),inset_0_0_100px_rgba(255,94,26,0.18)]'
        }`}
        style={{
          // Architectural Drafting Dot Grid in signature brand orange
          backgroundImage: isDark
            ? 'radial-gradient(rgba(255, 205, 175, 0.45) 1.3px, transparent 1.3px)'
            : 'radial-gradient(rgba(255, 94, 26, 0.40) 1.3px, transparent 1.3px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0'
        }}
      >

        {/* 11 CURATED INTERACTIVE MOOD CARDS */}
        {CARDS.map((card, index) => {
          const zIndex = cardZ[card.id] || card.defaultZ;
          const offset = scatterOffsets[card.id] || { x: 0, y: 0, rotate: 0 };
          const posStyle = isMobile ? card.mobileStyle : card.desktopStyle;

          return (
            <motion.div
              key={`${card.id}-${scatterKey}`}
              drag
              dragConstraints={boardRef}
              dragElastic={0.12}
              dragMomentum={true}
              onPointerDown={() => bringToFront(card.id)}
              style={{
                position: 'absolute',
                ...posStyle,
                zIndex: zIndex,
                touchAction: 'none'
              }}
              initial={{ 
                opacity: 0, 
                scale: 0.85, 
                y: 30, 
                rotate: card.defaultRotate 
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                x: offset.x,
                y: offset.y, 
                rotate: card.defaultRotate + offset.rotate,
                transition: { 
                  type: 'spring', 
                  stiffness: 280, 
                  damping: 22, 
                  delay: index * 0.035 
                }
              }}
              whileHover={{ 
                scale: 1.03, 
                cursor: 'grab',
                transition: { duration: 0.15 }
              }}
              whileDrag={{ 
                scale: 1.08, 
                cursor: 'grabbing',
                boxShadow: isDark 
                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 35px rgba(255, 94, 26, 0.45)' 
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 25px rgba(255, 94, 26, 0.35)',
                transition: { duration: 0.05 }
              }}
              className="group will-change-transform cursor-grab active:cursor-grabbing"
            >
              <CardRenderer card={card} isDark={isDark} />
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

// --- CARD RENDERER COMPONENT ---
function CardRenderer({ card, isDark }) {
  switch (card.type) {
    // 1. SELFIE / PORTRAIT SNAPSHOT (Clean photo with "Hi!" comic speech bubble)
    case 'selfie':
      return (
        <div className="w-[195px] sm:w-[215px] p-2.5 pb-2.5 rounded-xl bg-neutral-100 dark:bg-[#1a1a1e] border border-black/10 dark:border-white/10 shadow-2xl relative select-none">
          {/* Orange Washi Tape at Top */}
          <div 
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#ff5e1a]/85 backdrop-blur-sm shadow-sm rotate-[-1deg] border border-[#ff5e1a]/40 z-30" 
          />

          {/* Photo Frame Container */}
          <div className="w-full aspect-[3/4] rounded-lg overflow-hidden border border-black/10 dark:border-white/10 bg-black relative">
            <img 
              src="/images/moodboard/Photo.jpeg" 
              alt="Khushang Singh portrait" 
              className="w-full h-full object-cover object-top pointer-events-none"
              loading="lazy"
              draggable={false}
            />

            {/* Comic Speech Cloud / Bubble with "Hi!" */}
            <div className="absolute top-2.5 right-2 z-20 pointer-events-none select-none transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <svg 
                width="56" 
                height="40" 
                viewBox="0 0 58 42" 
                fill="none" 
                className="drop-shadow-[2px_3px_0px_rgba(0,0,0,0.85)]"
              >
                {/* Comic Speech Bubble with Tail pointing bottom-left */}
                <path 
                  d="M 6 18 C 6 7, 16 3, 30 3 C 44 3, 52 7, 52 18 C 52 27, 44 31, 30 31 C 24 31, 19 30, 16 28 L 9 37 L 12 26 C 8 24, 6 21, 6 18 Z" 
                  fill="#ffffff" 
                  stroke="#111111" 
                  strokeWidth="2.2" 
                  strokeLinejoin="round" 
                  strokeLinecap="round" 
                />
                <text 
                  x="29" 
                  y="21" 
                  textAnchor="middle" 
                  fill="#111111" 
                  fontSize="13" 
                  fontWeight="900" 
                  fontFamily="'Bricolage Grotesque', system-ui, -apple-system, sans-serif" 
                  letterSpacing="-0.5"
                >
                  Hi!
                </text>
              </svg>
            </div>
          </div>
        </div>
      );

    // 2. ALL-TIME FAVORITE SONG (AUTHENTIC ED SHEERAN DIVIDE VINYL SLEEVE & RECORD SLIP)
    case 'alltime_music':
      return <AllTimeMusicCard isDark={isDark} />;

    // 3. CURRENT FAVORITE SONG (BAD BUNNY - DTMF)
    case 'current_music':
      return (
        <div className={`w-[220px] sm:w-[245px] p-3.5 sm:p-4 rounded-xl border relative shadow-xl backdrop-blur-md select-none ${
          isDark 
            ? 'bg-[#141416]/95 border-[#ff5e1a]/30 text-white' 
            : 'bg-white/95 border-[#ff5e1a]/30 text-neutral-900'
        }`}>
          {/* Card Category Header */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-black tracking-tight text-neutral-900 dark:text-white">
              Current Repeat
            </span>
            <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500">2025</span>
          </div>

          <div className="mb-2.5">
            <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 font-bold block mb-0.5">Bad Bunny</span>
            <h4 className="text-sm sm:text-base font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
              DTMF (DeBÍ TiRAR MáS FOToS)
            </h4>
          </div>

          {/* Stepped Frequency Waveform / Beats Design */}
          <div className="flex items-end gap-1 h-7 px-0.5 pt-1">
            {[45, 80, 60, 95, 70, 85, 50, 100, 75, 55, 90, 65, 80, 45, 70, 90, 60].map((h, i) => (
              <div 
                key={i} 
                className="flex-1 bg-[#ff5e1a] rounded-full opacity-90" 
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      );

    // 4. FAVORITE MOVIES (CLEAN STICKY NOTE WITH BOLD HEADING & MINIMAL LIST)
    case 'movie':
      return (
        <div className="w-[215px] sm:w-[235px] p-4 rounded-xl bg-[#fffef0] dark:bg-[#1c1a16] border-2 border-amber-500/35 text-neutral-900 dark:text-neutral-100 shadow-xl relative select-none">
          {/* Orange Washi Tape at Top */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#ff5e1a]/90 backdrop-blur-sm shadow-sm rotate-[-1deg] border border-[#ff5e1a]/40" />

          <h4 className="text-base sm:text-lg font-black tracking-tight text-neutral-900 dark:text-white mb-2.5">
            Favorite Movies
          </h4>

          <ul className="space-y-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-200">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5e1a]" />
              <span>Inception</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5e1a]" />
              <span>Your Name</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5e1a]" />
              <span>Arcane</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5e1a]" />
              <span>10 Things I Hate About You</span>
            </li>
            <li className="text-[11px] font-mono text-gray-500 dark:text-gray-400 pl-3.5 italic">
              ...and more
            </li>
          </ul>
        </div>
      );

    // 5. FAVORITE ANIME & CARTOONS (COMPACT DOUBLE-COLUMN GRID)
    case 'anime':
      return (
        <div className={`w-[260px] sm:w-[285px] p-3.5 sm:p-4 rounded-xl border border-[#ff5e1a]/35 relative shadow-xl backdrop-blur-md select-none ${
          isDark ? 'bg-[#151518]/95 text-white' : 'bg-white/95 text-neutral-900'
        }`}>
          <h4 className="text-base sm:text-lg font-black tracking-tight text-neutral-900 dark:text-white mb-2.5 leading-tight">
            Favorite Anime & Cartoons
          </h4>

          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-medium text-neutral-800 dark:text-neutral-200">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5e1a] shrink-0" />
              <span>Pokémon</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5e1a] shrink-0" />
              <span>Naruto</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5e1a] shrink-0" />
              <span>Haikyuu!!</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5e1a] shrink-0" />
              <span>Death Note</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5e1a] shrink-0" />
              <span>Attack on Titan</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5e1a] shrink-0" />
              <span>Beyblade</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5e1a] shrink-0" />
              <span>Redakai</span>
            </li>
          </ul>
        </div>
      );

    // 6. FAVORITE HERO (SPIDER-MAN // WEB-SLINGER SWINGING CARD)
    case 'hero':
      return (
        <div className={`w-[235px] sm:w-[260px] min-h-[142px] sm:min-h-[148px] p-3.5 sm:p-4 rounded-xl border border-[#ff5e1a]/35 relative shadow-xl backdrop-blur-md overflow-hidden select-none flex flex-col justify-between ${
          isDark ? 'bg-[#171216]/95 text-white' : 'bg-white/95 text-neutral-900'
        }`}>
          {/* Subtle Halftone Dot Matrix Texture */}
          <div 
            className="absolute inset-0 rounded-xl pointer-events-none opacity-[0.04] dark:opacity-[0.06]"
            style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '12px 12px'
            }}
          />

          {/* Left Column: Comic Lore & Quotes */}
          <div className="relative z-10">
            <h4 className="text-base sm:text-lg font-black tracking-tight text-neutral-900 dark:text-white leading-tight mb-1 whitespace-nowrap">
              Favorite Superhero
            </h4>

            <div className="text-xs sm:text-sm font-bold tracking-tight text-neutral-800 dark:text-neutral-200 mb-2">
              Spider-Man
            </div>

            <blockquote className="max-w-[120px] sm:max-w-[130px] text-[9.5px] italic text-gray-600 dark:text-gray-400 border-l-2 border-[#ff5e1a] pl-2 leading-snug">
              "With great power comes great responsibility."
            </blockquote>
          </div>

          {/* Swinging Spider-Man Dynamic Motion Layer (In front of single-line title) */}
          <motion.div 
            className="absolute right-0 top-[-16px] sm:top-[-20px] w-[125px] sm:w-[140px] aspect-square pointer-events-none z-20 select-none"
            style={{ transformOrigin: '100% 35%' }}
            animate={{
              rotate: [-1.4, 1.8, -1.4],
            }}
            transition={{
              duration: 3.6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img 
              src="/images/moodboard/spiderman_swing.png"
              alt="Spider-Man swinging"
              className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]"
              loading="lazy"
              draggable={false}
            />
          </motion.div>
        </div>
      );

    // 7. VOLLEYBALL (SEPARATE DEDICATED CARD: MIDDLE BLOCKER)
    case 'volleyball':
      return (
        <div className="w-[220px] sm:w-[245px] p-2.5 pb-3.5 rounded-xl bg-neutral-100 dark:bg-[#1a1a1e] border border-[#ff5e1a]/25 dark:border-[#ff5e1a]/25 shadow-2xl relative select-none">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#ff5e1a]/90 backdrop-blur-sm shadow-sm rotate-[-1deg] border border-[#ff5e1a]/50" />
          <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-2 border border-black/10 dark:border-white/10 relative">
            <img 
              src="/images/moodboard/volleyball.jpg" 
              alt="Volleyball action middle blocker" 
              className="w-full h-full object-cover pointer-events-none"
              loading="lazy"
              draggable={false}
            />
          </div>
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
              Volleyball
            </h4>
            <span className="text-[10px] sm:text-xs font-mono font-medium text-[#ff5e1a] tracking-tight">
              Middle Blocker
            </span>
          </div>
        </div>
      );

    // 8. BASKETBALL (SEPARATE DEDICATED CARD: SHOOTING GUARD)
    case 'basketball':
      return (
        <div className="w-[220px] sm:w-[245px] p-2.5 pb-3.5 rounded-xl bg-neutral-100 dark:bg-[#1a1a1e] border border-[#ff5e1a]/25 dark:border-[#ff5e1a]/25 shadow-2xl relative select-none">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#ff5e1a]/90 backdrop-blur-sm shadow-sm rotate-[1deg] border border-[#ff5e1a]/50" />
          <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-2 border border-black/10 dark:border-white/10 relative">
            <img 
              src="/images/moodboard/basketball.jpg" 
              alt="Basketball action shooting guard" 
              className="w-full h-full object-cover pointer-events-none"
              loading="lazy"
              draggable={false}
            />
          </div>
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
              Basketball
            </h4>
            <span className="text-[10px] sm:text-xs font-mono font-medium text-[#ff5e1a] tracking-tight">
              Shooting Guard
            </span>
          </div>
        </div>
      );

    // 9. ART & SKETCHING (SLIDESHOW OF SKETCHES)
    case 'sketchbook':
      return <SketchSlideshowCard isDark={isDark} />;

    // 10. TRAVEL & EXPLORING (CLEAN PHOTO, NO TEXT OVERLAY)
    case 'travel':
      return (
        <div className="w-[220px] sm:w-[245px] p-2.5 pb-3.5 rounded-xl bg-neutral-100 dark:bg-[#1a1a1e] border border-[#ff5e1a]/25 dark:border-[#ff5e1a]/25 shadow-2xl relative select-none">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#ff5e1a]/90 backdrop-blur-sm shadow-sm rotate-[1deg] border border-[#ff5e1a]/50" />
          <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-2 border border-black/10 dark:border-white/10 relative">
            <img 
              src="/images/moodboard/travel_explore.jpg" 
              alt="Misty mountain switchbacks and hiking explorer" 
              className="w-full h-full object-cover pointer-events-none"
              loading="lazy"
              draggable={false}
            />
          </div>
          <h4 className="text-xs sm:text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
            Wanderlust & Trails
          </h4>
          <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-snug mt-0.5">
            High-altitude passes, winding mountain switchbacks and open horizons.
          </p>
        </div>
      );

    // 11. BUCKET LIST (CLEAN STICKY NOTE: PURE "BUCKET LIST" HEADING, CONCISE BULLETS & BOTTOM NOTE)
    case 'aspirations':
      return (
        <div className="w-[215px] sm:w-[235px] p-3.5 rounded-xl bg-[#fff8f2] dark:bg-[#1a120c] text-neutral-900 dark:text-neutral-100 shadow-2xl relative border-2 border-[#ff5e1a]/45 select-none">
          {/* Orange Physical Pushpin */}
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-[#ff5e1a] shadow-md border-2 border-white flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-orange-200" />
            </div>
          </div>

          <h4 className="text-base font-bold text-neutral-900 dark:text-white mb-2 mt-0.5 tracking-tight">
            Bucket List
          </h4>

          <ul className="space-y-1.5 text-[11px] font-medium text-neutral-800 dark:text-neutral-200 leading-snug">
            <li className="flex items-start gap-1.5">
              <span className="text-[#ff5e1a] font-bold">•</span>
              <span>Learn to play drums</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#ff5e1a] font-bold">•</span>
              <span>Learn vector / graphic animation</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#ff5e1a] font-bold">•</span>
              <span>Go on solo mountain trek</span>
            </li>
          </ul>

          <div className="text-[9px] font-mono text-[#ff5e1a] mt-3 pt-1 border-t border-[#ff5e1a]/20 text-right italic font-medium">
            and never stop learning something new
          </div>
        </div>
      );

    default:
      return null;
  }
}

// --- DEDICATED SKETCH SLIDESHOW CARD ---
function SketchSlideshowCard({ isDark }) {
  const images = [
    { src: '/images/moodboard/sketchbook.jpg', alt: 'Hand-drawn anime sketches and graphite studies' },
    { src: '/images/moodboard/sketch_hero_ink.jpg', alt: 'Ink hero line art study' },
    { src: '/images/moodboard/sketch_portrait.jpg', alt: 'Graphite pencil portrait study' }
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % images.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="w-[225px] sm:w-[250px] p-2.5 pb-2.5 rounded-xl bg-neutral-100 dark:bg-[#1a1a1e] border border-[#ff5e1a]/25 dark:border-[#ff5e1a]/25 shadow-2xl relative select-none">
      {/* Orange Washi Tape Strip at Top (Clean, unbranded) */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#ff5e1a]/90 backdrop-blur-sm shadow-sm rotate-[-1.5deg] border border-[#ff5e1a]/50" />

      {/* Slideshow Photo Container */}
      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-2 border border-black/10 dark:border-white/10 bg-neutral-900 isolate [transform:translateZ(0)]">
        <AnimatePresence initial={false}>
          <motion.img 
            key={index}
            src={images[index].src} 
            alt={images[index].alt} 
            initial={{ opacity: 0, filter: 'blur(12px)', scale: 1.04 }}
            animate={{ 
              opacity: 1, 
              filter: 'blur(0px)', 
              scale: 1,
              transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] }
            }}
            exit={{ 
              opacity: 0, 
              filter: 'blur(12px)', 
              scale: 0.98,
              transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] }
            }}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none will-change-[filter,transform,opacity] [transform:translateZ(0)]"
            loading="lazy"
            draggable={false}
          />
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'bg-[#ff5e1a] w-3.5' : 'bg-white/40 hover:bg-white/70 w-1.5'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <h4 className="text-xs sm:text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
        Pencil & Ink Studies
      </h4>
    </div>
  );
}

// --- DEDICATED ALL-TIME FAVORITE VINYL DISC CARD WITH HOVER 40-50% SLIDE & INSTANT AUDIO ---
function AllTimeMusicCard({ isDark }) {
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.85;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay preview notice:", err);
        });
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (audioRef.current) {
      // Smooth fade out
      const fadeAudio = () => {
        if (!audioRef.current) return;
        if (audioRef.current.volume > 0.15) {
          audioRef.current.volume = Math.max(0, audioRef.current.volume - 0.2);
          setTimeout(fadeAudio, 25);
        } else {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.volume = 0.85;
        }
      };
      fadeAudio();
    }
  };

  return (
    <div 
      className="relative select-none cursor-grab active:cursor-grabbing w-[250px] sm:w-[305px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Preloaded Audio Element */}
      <audio 
        ref={audioRef} 
        preload="auto" 
        loop 
        playsInline
      >
        <source src="/audio/shape_of_you.m4a" type="audio/mp4" />
        <source src="https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/44/c7/4f/44c74f0d-72dc-6143-d4d0-ba14d661ca0d/mzaf_9566898362556366703.plus.aac.p.m4a" type="audio/mp4" />
      </audio>

      {/* Main 12" Vinyl Jacket Box */}
      <div className="relative w-[170px] h-[170px] sm:w-[205px] sm:h-[205px]">
        {/* 1. Cardboard Sleeve Backing / Inner Pocket */}
        <div className="absolute inset-0 rounded-[6px] bg-[#141416] border border-black/20 dark:border-white/10" />

        {/* 2. The Vinyl Record Disc: Tucked inside by default, slides exactly 40-50% out on hover */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-[160px] h-[160px] sm:w-[195px] sm:h-[195px] left-[6px] z-10 pointer-events-none transition-transform duration-700 ease-[0.16,1,0.3,1]"
          style={{
            transform: isHovered 
              ? 'translateY(-50%) translateX(82px)' 
              : 'translateY(-50%) translateX(0px)'
          }}
        >
          {/* Vinyl body: paused when idle, spins smoothly when hovered / playing */}
          <div 
            className="relative w-full h-full rounded-full bg-[#08080a] border border-neutral-700/70 shadow-[0_4px_16px_rgba(0,0,0,0.35)] flex items-center justify-center animate-spin"
            style={{ 
              animationDuration: '10s',
              animationPlayState: isHovered ? 'running' : 'paused'
            }}
          >
            {/* Conic light reflection sheen */}
            <div 
              className="absolute inset-0 rounded-full opacity-65 pointer-events-none"
              style={{
                background: 'conic-gradient(from 45deg, rgba(255,255,255,0.14) 0deg, transparent 40deg, rgba(255,255,255,0.08) 90deg, transparent 140deg, rgba(255,255,255,0.16) 180deg, transparent 220deg, rgba(255,255,255,0.08) 270deg, transparent 320deg, rgba(255,255,255,0.14) 360deg)'
              }}
            />

            {/* Concentric Vinyl Groove Rings */}
            <div className="absolute inset-2.5 rounded-full border border-white/5" />
            <div className="absolute inset-5 rounded-full border border-white/5" />
            <div className="absolute inset-8 rounded-full border border-white/5" />
            <div className="absolute inset-11 rounded-full border border-white/5" />
            <div className="absolute inset-14 rounded-full border border-white/5" />

            {/* Center Vinyl Label */}
            <div className="relative z-10 w-[62px] h-[62px] sm:w-[74px] sm:h-[74px] rounded-full bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 border-2 border-black/80 shadow-md flex flex-col items-center justify-center text-black select-none p-1 text-center">
              <span className="text-[6px] font-mono font-black tracking-widest uppercase leading-none text-black">ED SHEERAN</span>
              <span className="text-[5.5px] font-sans font-bold tracking-tight text-neutral-900 mt-0.5">SHAPE OF YOU</span>
              
              {/* Spindle hole */}
              <div className="w-2.5 h-2.5 my-0.5 rounded-full bg-[#0a0a0c] border border-cyan-300/60 shadow-inner flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-white/40" />
              </div>

              <div className="flex items-center gap-1 text-[5px] font-mono font-bold text-neutral-900">
                <span>33⅓</span>
                <span>·</span>
                <span>SIDE A</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. The Front Cover (Authentic Ed Sheeran ÷ Divide 12" LP Sleeve) */}
        <div className="relative z-20 w-full h-full rounded-[6px] overflow-hidden border border-black/20 dark:border-white/10 bg-black shadow-[0_6px_20px_rgba(0,0,0,0.14)] transition-all duration-300">
          <img 
            src="/images/moodboard/ed_sheeran_divide.jpg" 
            alt="Ed Sheeran - ÷ Divide original album cover"
            className="w-full h-full object-cover scale-[1.14] select-none pointer-events-none"
            loading="lazy"
            draggable={false}
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 via-transparent to-transparent" />

          {/* Direct Heading on cover with Track Name beside it */}
          <div className="absolute top-2.5 sm:top-3.5 left-2.5 sm:left-3.5 right-2.5 sm:right-3.5 select-none pointer-events-none flex items-baseline flex-wrap gap-1.5 sm:gap-2">
            <span className="text-sm sm:text-base font-black tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] [text-shadow:0_2px_6px_rgba(0,0,0,0.9)]">
              All Time Fav
            </span>
            <span className="text-xs sm:text-[13px] font-bold tracking-tight text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] [text-shadow:0_1px_4px_rgba(0,0,0,0.9)]">
              Shape of You
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 11 CURATED CARDS CONFIGURATION (ANALYZED EXACTLY FROM REFERENCE IMAGE) ---
const CARDS = [
  // --- ROW 1 (TOP) ---
  // 1. Selfie Snapshot with "Hi!" comic speech bubble (top-left)
  {
    id: 'selfie',
    type: 'selfie',
    defaultZ: 14,
    defaultRotate: -3.5,
    desktopStyle: { left: '3.2%', top: '6.5%' },
    mobileStyle: { left: '4%', top: '2%' }
  },
  // 2. All Time Fav Music (Ed Sheeran - Shape of You with vinyl disc)
  {
    id: 'alltime_music',
    type: 'alltime_music',
    defaultZ: 12,
    defaultRotate: -0.5,
    desktopStyle: { left: '20.5%', top: '7%' },
    mobileStyle: { left: '7%', top: '11%' }
  },
  // 3. Favorite Movies (yellow sticky note, top center-left)
  {
    id: 'movie',
    type: 'movie',
    defaultZ: 11,
    defaultRotate: 0.5,
    desktopStyle: { left: '40.8%', top: '7.5%' },
    mobileStyle: { left: '4%', top: '20%' }
  },
  // 4. Favorite Anime & Cartoons (white card, top center-right)
  {
    id: 'anime',
    type: 'anime',
    defaultZ: 13,
    defaultRotate: -1,
    desktopStyle: { left: '58.8%', top: '8.5%' },
    mobileStyle: { left: '8%', top: '29%' }
  },
  // 5. Volleyball - Middle Blocker (top-right)
  {
    id: 'volleyball',
    type: 'volleyball',
    defaultZ: 15,
    defaultRotate: 2.5,
    desktopStyle: { right: '3.2%', top: '6.5%' },
    mobileStyle: { left: '5%', top: '38%' }
  },

  // --- ROW 2 (MIDDLE & LOWER) ---
  // 6. Pencil & Ink Studies (bottom-left, directly under Selfie)
  {
    id: 'sketchbook',
    type: 'sketchbook',
    defaultZ: 16,
    defaultRotate: 1.5,
    desktopStyle: { left: '4.2%', top: '56.5%' },
    mobileStyle: { left: '5%', top: '47%' }
  },
  // 7. Basketball - Shooting Guard (bottom, between Sketchbook and Spiderman)
  {
    id: 'basketball',
    type: 'basketball',
    defaultZ: 14,
    defaultRotate: -2,
    desktopStyle: { left: '24.8%', top: '56.5%' },
    mobileStyle: { left: '8%', top: '56%' }
  },
  // 8. Current Repeat (Bad Bunny DTMF, center-middle under Favorite Movies)
  {
    id: 'current_music',
    type: 'current_music',
    defaultZ: 10,
    defaultRotate: 0,
    desktopStyle: { left: '45.2%', top: '38%' },
    mobileStyle: { left: '5%', top: '65%' }
  },
  // 9. Favorite Superhero - Spider-Man (bottom-center, directly under Current Repeat)
  {
    id: 'hero',
    type: 'hero',
    defaultZ: 12,
    defaultRotate: 0,
    desktopStyle: { left: '45.2%', top: '69%' },
    mobileStyle: { left: '6%', top: '74%' }
  },
  // 10. Wanderlust & Trails (right center, below Anime & left of Volleyball)
  {
    id: 'travel',
    type: 'travel',
    defaultZ: 13,
    defaultRotate: 1,
    desktopStyle: { right: '18%', top: '40%' },
    mobileStyle: { left: '5%', top: '83%' }
  },
  // 11. Bucket List (bottom-right, tucked under Wanderlust and Volleyball)
  {
    id: 'aspirations',
    type: 'aspirations',
    defaultZ: 18,
    defaultRotate: 3.5,
    desktopStyle: { right: '2.8%', bottom: '6%' },
    mobileStyle: { left: '7%', top: '92%' }
  }
];
