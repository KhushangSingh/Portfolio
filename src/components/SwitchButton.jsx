import React from 'react';
import { ArrowRightLeft } from 'lucide-react';

const SwitchButton = ({ currentMode, setMode }) => {
  const isDev = currentMode === 'dev';
  const targetMode = isDev ? 'design' : 'dev';

  // Dynamic styles based on the background it sits on
  const wrapperStyles = isDev
    ? 'bg-white/5 border-white/20 text-white hover:bg-white/10' // Dark mode styles
    : 'bg-black/5 border-black/10 text-black hover:bg-black/10'; // Light mode styles

  const liquidColor = isDev 
    ? 'via-white/40'  // Bright shimmer on dark bg
    : 'via-black/20'; // Dark shimmer on light bg

  return (
    <button
      onClick={() => setMode(targetMode)}

      className={`
        fixed bottom-8 right-8 z-50
        flex items-center gap-3 px-6 py-3
        rounded-full border
        backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
        overflow-hidden group transition-all duration-500
        hover:scale-105 active:scale-95
        ${wrapperStyles}
      `}
    >
      {/* THE LIQUID LAYER: A skewed gradient that moves continuously */}
      <div
        className={`absolute inset-0 w-[200%] h-full animate-liquid bg-gradient-to-r from-transparent ${liquidColor} to-transparent pointer-events-none`}
      ></div>

      {/* A subtle gloss overlay for extra "glassiness" */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 pointer-events-none rounded-full"></div>

      {/* Button Content (Text & Icon) */}
      <span className="relative z-10 font-medium tracking-wide text-xs uppercase">
        Switch Persona
      </span>
      <ArrowRightLeft className="relative z-10 w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
    </button>
  );
};

export default SwitchButton;