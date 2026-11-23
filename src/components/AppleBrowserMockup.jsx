import React from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * AppleBrowserMockup Component
 * Renders an authentic wide macOS browser window frame for flagship website project previews.
 * Features full-width display without clipping left or right side content.
 */
export default function AppleBrowserMockup({
  src,
  alt = 'Project preview',
  className = '',
  loading = 'lazy',
  priority = false,
  aspectRatio = '',
  objectPosition = 'object-top'
}) {
  const { isDark } = useTheme();
  const loadMode = priority ? 'eager' : loading;

  return (
    <div
      className={`relative w-full rounded-xl sm:rounded-2xl border overflow-hidden shadow-xl transition-all duration-300 ${
        isDark 
          ? 'bg-[#15161b] border-white/10 shadow-black/50' 
          : 'bg-white border-black/10 shadow-black/5'
      } ${className}`}
      role="figure"
      aria-label={alt}
    >
      {/* 1. APPLE MACOS BROWSER TOP BAR (Wide Desktop Window Header) */}
      <div className={`h-8 sm:h-9 px-3.5 sm:px-4.5 flex items-center justify-between border-b select-none ${
        isDark 
          ? 'bg-[#1e1f26] border-white/10' 
          : 'bg-[#EDEDEB] border-black/10'
      }`}>
        {/* macOS Traffic Lights (Close, Minimize, Expand) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span 
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/40 inline-block shrink-0 shadow-xs" 
            aria-hidden="true" 
          />
          <span 
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/40 inline-block shrink-0 shadow-xs" 
            aria-hidden="true" 
          />
          <span 
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/40 inline-block shrink-0 shadow-xs" 
            aria-hidden="true" 
          />
        </div>

        {/* Minimalist URL pill placeholder */}
        <div 
          className={`w-40 sm:w-64 md:w-80 h-4 sm:h-5 rounded-md mx-auto hidden sm:block ${
            isDark ? 'bg-white/5 border border-white/5' : 'bg-black/5 border border-black/5'
          }`} 
          aria-hidden="true" 
        />

        {/* Symmetrical right spacer */}
        <div className="w-8 sm:w-12" aria-hidden="true" />
      </div>

      {/* 2. BROWSER VIEWPORT APERTURE (Full Width Website Screen) */}
      <div className={`relative w-full overflow-hidden ${aspectRatio} ${
        isDark ? 'bg-black' : 'bg-white'
      }`}>
        <img
          src={src}
          alt={alt}
          className={`w-full ${aspectRatio ? 'h-full object-cover' : 'h-auto block'} ${objectPosition}`}
          loading={loadMode}
          decoding="async"
        />
      </div>
    </div>
  );
}
