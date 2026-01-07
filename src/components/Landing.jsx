import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Code2, PenTool } from 'lucide-react';

const Landing = ({ setMode }) => {
  const [hoveredSide, setHoveredSide] = useState(null); // 'dev' | 'design' | null
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper to determine dimensions based on hover state
  const getSize = (side) => {
    const isHovered = hoveredSide === side;
    const isOtherHovered = hoveredSide && hoveredSide !== side;
    
    // Default split is 50%
    let size = '50%';
    
    if (isHovered) size = '60%';
    if (isOtherHovered) size = '40%';

    return size;
  };

  return (
    <div className="fixed inset-0 flex flex-col md:flex-row z-40 bg-black font-sans overflow-hidden">
      
      {/* =========================================
          TOP CENTER NAME - BOLD & DYNAMIC
      ========================================= */}
      <div className="absolute top-6 md:top-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none mix-blend-difference text-white select-none w-full text-center">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight flex justify-center gap-2 md:gap-4 leading-none">
            <span>Khushang</span>
            <span>Singh</span>
        </h1>
      </div>

      {/* =========================================
          SECTION 1: DEVELOPER (Top on Mobile / Left on Desktop)
          ========================================= */}
      <motion.div 
        onClick={() => setMode('dev')}
        onMouseEnter={() => !isMobile && setHoveredSide('dev')}
        onMouseLeave={() => !isMobile && setHoveredSide(null)}
        initial={false}
        animate={{ 
            // On Mobile: Animate Height, Keep Width 100%
            // On Desktop: Animate Width, Keep Height 100%
            width: isMobile ? '100%' : getSize('dev'),
            height: isMobile ? getSize('dev') : '100%',
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-[#F3F3F1] border-b md:border-b-0 md:border-r border-gray-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden group"
      >
        {/* BG Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50" />
        
        {/* Floating Icon */}
        <div className="absolute top-6 left-6 md:top-10 md:left-10 text-black/10 group-hover:text-blue-600 transition-colors duration-500">
            <Code2 size={isMobile ? 32 : 48} />
        </div>

        <div className="relative z-10 text-center mt-8 md:mt-0">
            <h2 className="text-[15vw] md:text-[8vw] leading-[0.85] font-bold text-[#1A1A1A] tracking-tighter uppercase group-hover:scale-105 transition-transform duration-700">
                Code
            </h2>
            <p className="mt-2 md:mt-4 text-gray-500 font-mono text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase group-hover:text-blue-600 transition-colors duration-500">
                Architecture & Logic
            </p>
        </div>

        {/* Button */}
        <div className="absolute bottom-6 md:bottom-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 md:translate-y-4 md:group-hover:translate-y-0">
            <button className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-black text-white rounded-full font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-blue-600 transition-colors shadow-xl">
                Enter Engineer <ArrowUpRight size={14} />
            </button>
        </div>
      </motion.div>

      {/* =========================================
          SECTION 2: DESIGNER (Bottom on Mobile / Right on Desktop)
          ========================================= */}
      <motion.div 
        onClick={() => setMode('design')}
        onMouseEnter={() => !isMobile && setHoveredSide('design')}
        onMouseLeave={() => !isMobile && setHoveredSide(null)}
        initial={false}
        animate={{ 
            width: isMobile ? '100%' : getSize('design'),
            height: isMobile ? getSize('design') : '100%',
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-[#050505] flex flex-col items-center justify-center cursor-pointer overflow-hidden group"
      >
        {/* BG Texture */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
        </div>

        {/* Floating Icon */}
        <div className="absolute top-6 right-6 md:top-10 md:right-10 text-white/10 group-hover:text-[#ff4d00]/80 transition-colors duration-500">
            <PenTool size={isMobile ? 32 : 48} />
        </div>

        <div className="relative z-10 text-center mix-blend-screen mt-8 md:mt-0">
            <h2 className="text-[15vw] md:text-[8vw] leading-[0.85] font-bold text-white tracking-tighter uppercase group-hover:scale-105 transition-transform duration-700">
                Craft
            </h2>
            <p className="mt-2 md:mt-4 text-gray-500 font-bold text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase group-hover:text-[#ff4d00] transition-colors duration-500">
                Visuals & Empathy
            </p>
        </div>

        {/* Button */}
        <div className="absolute bottom-6 md:bottom-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 md:translate-y-4 md:group-hover:translate-y-0">
            <button className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-white text-black rounded-full font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-[#ff4d00] hover:text-white transition-colors shadow-xl shadow-[#ff4d00]/20">
                Enter Designer <ArrowUpRight size={14} />
            </button>
        </div>
      </motion.div>

    </div>
  );
};

export default Landing;