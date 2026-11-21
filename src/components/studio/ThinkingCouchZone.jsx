import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function ThinkingCouchZone({ onCloseZone }) {
  const { isDark } = useTheme();

  const creativePrompts = [
    {
      principle: "Physical Affordance Over Cleverness",
      quote: "If an interactive element needs a tooltip to explain what it does, the visual hierarchy or tactile physics failed. Make digital things behave like heavy, satisfying mechanical objects.",
      author: "Khushang's Studio Log · Entry #42"
    },
    {
      principle: "The 5-Second Recruiter Gate",
      quote: "Recruiters and evaluators form opinions in seconds. Avoid mysterious metaphors that require manual decoding; anchor physical concepts with clear one-line cues.",
      author: "Khushang's Studio Log · Entry #19"
    },
    {
      principle: "Zero AI Boilerplate",
      quote: "AI loves purple-cyan gradients, floating blurred spheres and generic 3-card grids. Break the mold with bespoke typography, asymmetric editorial structures and real human taste.",
      author: "Khushang's Studio Log · Entry #88"
    },
    {
      principle: "Code as Architecture",
      quote: "Great frontend engineering is not just moving pixels; it is managing state machines, spring physics and memory budgets with the discipline of an architect.",
      author: "Khushang's Studio Log · Entry #63"
    }
  ];

  const [promptIndex, setPromptIndex] = useState(0);

  const handleNextPrompt = () => {
    setPromptIndex((prev) => (prev + 1) % creativePrompts.length);
  };

  const activePrompt = creativePrompts[promptIndex];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden select-none">
      
      {/* Header Info */}
      <div className="text-center mb-4 sm:mb-6 z-10">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ff5e1a]">
            ANALOG IDEATION NOOK &amp; THINKING LOUNGE
          </span>
        </div>
        <p className="text-gray-400 text-xs sm:text-sm">
          Where chaotic ideas become structured interfaces. A warm coffee, an open notebook and zero screen distractions.
        </p>
      </div>

      <div className="relative w-full max-w-3xl flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
        
        {/* ==============================================================
            STEAMING CERAMIC COFFEE MUG
            ============================================================== */}
        <div className="relative w-36 h-36 rounded-3xl bg-gradient-to-br from-[#272935] via-[#1a1b24] to-[#0e0f14] border-2 border-white/15 p-4 flex flex-col items-center justify-center shadow-2xl">
          
          {/* Animated Rising SVG Steam */}
          <div className="w-12 h-10 mb-1 flex items-center justify-center overflow-visible">
            <svg viewBox="0 0 40 40" className="w-8 h-8 overflow-visible">
              <motion.path
                d="M10,35 Q15,20 10,5 Q5,20 10,35"
                fill="none"
                stroke="rgba(255,255,255,0.45)"
                strokeWidth="1.8"
                strokeLinecap="round"
                animate={{ y: [-4, -14, -4], opacity: [0.2, 0.7, 0.2] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              />
              <motion.path
                d="M20,35 Q25,18 20,2 Q15,18 20,35"
                fill="none"
                stroke="rgba(255,94,26,0.6)"
                strokeWidth="1.8"
                strokeLinecap="round"
                animate={{ y: [-2, -16, -2], opacity: [0.3, 0.8, 0.3] }}
                transition={{ repeat: Infinity, duration: 3.1, ease: 'easeInOut', delay: 0.4 }}
              />
              <motion.path
                d="M30,35 Q35,20 30,6 Q25,20 30,35"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.8"
                strokeLinecap="round"
                animate={{ y: [-3, -12, -3], opacity: [0.2, 0.6, 0.2] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut', delay: 0.8 }}
              />
            </svg>
          </div>

          {/* Ceramic Cup */}
          <div className="relative w-14 h-12 rounded-b-2xl bg-gradient-to-br from-[#E2E8F0] via-[#CBD5E1] to-[#94A3B8] border-2 border-white/60 shadow-lg flex items-center justify-center">
            {/* Dark Brew Surface */}
            <div className="absolute top-1 inset-x-1.5 h-3 rounded-full bg-[#1A0F08] border border-amber-900 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-700/60" />
            </div>
            {/* Cup Handle */}
            <div className="absolute -right-3 top-2 w-3.5 h-6 rounded-r-xl border-2 border-[#CBD5E1]" />
          </div>

          <span className="font-mono text-[8px] uppercase tracking-wider text-[#ff5e1a] font-bold mt-2">
            FRESH BREW
          </span>
        </div>

        {/* ==============================================================
            OPEN MOLESKINE NOTEBOOK (ANALOG IDEATION)
            ============================================================== */}
        <div className="flex-1 w-full rounded-3xl p-5 sm:p-7 bg-gradient-to-br from-[#f8f5ee] to-[#ebe5d8] text-neutral-900 border-4 border-[#3c2a21] shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex flex-col justify-between relative overflow-hidden">
          
          {/* Notebook Center Spine Crease */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-transparent via-black/10 to-transparent pointer-events-none" />

          {/* Ribbon Bookmark */}
          <div className="absolute top-0 right-10 w-4 h-12 bg-[#ff5e1a] shadow-md rounded-b-sm pointer-events-none" />

          {/* Top Label */}
          <div className="flex items-center justify-between border-b border-neutral-300 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-neutral-600">
                MOLESKINE // STUDIO DIALOGUE
              </span>
            </div>
            <span className="font-mono text-[9px] text-neutral-400">Page 142</span>
          </div>

          {/* Handwritten Principle Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={promptIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-2 py-1"
            >
              <h4 className="font-bold text-base sm:text-lg text-neutral-900 tracking-tight leading-snug">
                "{activePrompt.principle}"
              </h4>
              <p className="font-serif italic text-neutral-700 text-xs sm:text-sm leading-relaxed">
                {activePrompt.quote}
              </p>
              <div className="font-mono text-[9px] text-[#ff5e1a] uppercase font-bold pt-1">
                · {activePrompt.author}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Interactive Spark Button */}
          <div className="mt-4 pt-3 border-t border-neutral-300 flex items-center justify-between">
            <span className="text-[10px] text-neutral-500 font-mono">
              Prompt {promptIndex + 1} of {creativePrompts.length}
            </span>
            <button
              onClick={handleNextPrompt}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white hover:bg-[#ff5e1a] transition-colors font-mono text-[10px] font-bold flex items-center gap-1.5 shadow"
            >
              <span>Next Spark</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
