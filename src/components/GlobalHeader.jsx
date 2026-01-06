import React from 'react';
import { ArrowRightLeft } from 'lucide-react';

const GlobalHeader = ({ currentMode, setMode }) => {
  // 1. Determine the theme mode based on current view
  const isDarkTheme = currentMode === 'design';
  const targetMode = currentMode === 'dev' ? 'design' : 'dev';

  // 2. Define dynamic color classes based on the theme
  const textColor = isDarkTheme ? 'text-white' : 'text-[#1A1A1A]';
  const textMuted = isDarkTheme ? 'text-gray-300' : 'text-gray-600';

  // Glass Background Styles
  const glassStyle = isDarkTheme 
    ? 'bg-white/10 border-white/10 hover:bg-white/20' 
    : 'bg-[#1A1A1A]/5 border-[#1A1A1A]/10 hover:bg-[#1A1A1A]/10';

  // Shared base classes for glass elements
  const glassBase = "backdrop-blur-md border rounded-full transition-all duration-300 pointer-events-auto";

  return (
    <div className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-10 flex justify-between items-start pointer-events-none font-sans">
      
      {/* 1. TOP LEFT: HOME BUTTON (Logo) */}
      <button 
        onClick={() => setMode('landing')}
        className={`${glassBase} ${glassStyle} ${textColor} px-5 py-2.5 flex items-center gap-1.5 uppercase font-bold tracking-tighter leading-none select-none cursor-pointer hover:scale-105 active:scale-95`}
      >
        <span className="text-lg md:text-xl">KHUSHANG</span>
        <span className={`text-lg md:text-xl ${textMuted}`}>SINGH</span>
      </button>

      {/* 2. TOP RIGHT: SWITCH BUTTON */}
      {currentMode !== 'landing' && (
        <button
          onClick={() => setMode(targetMode)}
          className={`
            ${glassBase} ${glassStyle} ${textColor}
            flex items-center gap-2 px-5 py-2.5
            group font-bold text-xs uppercase tracking-wide
            hover:scale-105 active:scale-95
          `}
        >
          <span>Switch Persona</span>
          <ArrowRightLeft size={16} className="group-hover:rotate-180 transition-transform duration-500" />
        </button>
      )}

    </div>
  );
};

export default GlobalHeader;