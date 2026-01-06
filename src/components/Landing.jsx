import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Code2, PenTool } from 'lucide-react';

const Landing = ({ setMode }) => {
  const [hoveredSide, setHoveredSide] = useState(null); // 'dev' | 'design' | null

  return (
    <div className="fixed inset-0 flex flex-col md:flex-row z-40 bg-black font-sans overflow-hidden">
      
      {/* =========================================
          TOP CENTER NAME - BOLD & DYNAMIC
          mix-blend-difference ensures:
          - Text over White background turns BLACK (Khushang)
          - Text over Black background turns WHITE (Singh)
      ========================================= */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none mix-blend-difference text-white select-none">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight flex gap-3 md:gap-4 leading-none">
            <span>Khushang</span>
            <span>Singh</span>
        </h1>
      </div>

      {/* =========================================
          LEFT SIDE: DEVELOPER (LIGHT THEME)
          ========================================= */}
      <motion.div 
        onClick={() => setMode('dev')}
        onMouseEnter={() => setHoveredSide('dev')}
        onMouseLeave={() => setHoveredSide(null)}
        animate={{ 
            width: hoveredSide === 'dev' ? '60%' : hoveredSide === 'design' ? '40%' : '50%' 
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-1/2 md:h-full bg-[#F3F3F1] border-b md:border-b-0 md:border-r border-gray-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden group"
      >
        {/* BG Texture: Technical Grid (Dark lines on light bg) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50" />
        
        {/* Floating Code Icon (Dark -> Blue on hover) */}
        <div className="absolute top-10 left-10 text-black/10 group-hover:text-blue-600 transition-colors duration-500">
            <Code2 size={48} />
        </div>

        <div className="relative z-10 text-center">
            {/* Dark Text for Light Theme */}
            <h2 className="text-[12vw] leading-[0.85] font-bold text-[#1A1A1A] tracking-tighter uppercase group-hover:scale-105 transition-transform duration-700">
                Code
            </h2>
            <p className="mt-4 text-gray-500 font-mono text-sm tracking-[0.3em] uppercase group-hover:text-blue-600 transition-colors duration-500">
                Architecture & Logic
            </p>
        </div>

        {/* Enter Button (Black button for Light Theme) */}
        <div className="absolute bottom-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
            <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-blue-600 transition-colors shadow-xl">
                Enter Engineer <ArrowUpRight size={16} />
            </button>
        </div>
      </motion.div>

      {/* =========================================
          RIGHT SIDE: DESIGNER (DARK THEME)
          ========================================= */}
      <motion.div 
        onClick={() => setMode('design')}
        onMouseEnter={() => setHoveredSide('design')}
        onMouseLeave={() => setHoveredSide(null)}
        animate={{ 
            width: hoveredSide === 'design' ? '60%' : hoveredSide === 'dev' ? '40%' : '50%' 
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-1/2 md:h-full bg-[#050505] flex flex-col items-center justify-center cursor-pointer overflow-hidden group"
      >
        {/* BG Texture: Noise (White noise on dark bg) */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
        </div>

        {/* Floating Design Icon (Light) */}
        <div className="absolute top-10 right-10 text-white/10 group-hover:text-[#ff4d00]/80 transition-colors duration-500">
            <PenTool size={48} />
        </div>

        <div className="relative z-10 text-center mix-blend-screen">
            {/* White Text for Dark Theme */}
            <h2 className="text-[12vw] leading-[0.85] font-bold text-white tracking-tighter uppercase group-hover:scale-105 transition-transform duration-700">
                Craft
            </h2>
            <p className="mt-4 text-gray-500 font-bold text-sm tracking-[0.3em] uppercase group-hover:text-[#ff4d00] transition-colors duration-500">
                Visuals & Empathy
            </p>
        </div>

        {/* Enter Button (White button for Dark Theme) */}
        <div className="absolute bottom-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#ff4d00] hover:text-white transition-colors shadow-xl shadow-[#ff4d00]/20">
                Enter Designer <ArrowUpRight size={16} />
            </button>
        </div>
      </motion.div>

    </div>
  );
};

export default Landing;