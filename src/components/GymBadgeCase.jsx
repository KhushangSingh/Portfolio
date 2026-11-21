import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

// ==========================================
// BESPOKE 18 COLLECTOR ENAMEL PINS
// Exact replicas of the enamel lapel pins in reference photos:
// Polished chrome/silver rims, cloisonné hard enamel fills and contact shadows.
// ==========================================
const EnamelPin = ({ id, name, work, isHovered, isClicked, onHoverStart, onHoverEnd, onClick, isDark }) => {
  const active = isHovered || isClicked;

  const renderPinArtwork = () => {
    switch (id) {
      // 1. FIGMA PIN
      case 'figma':
        return (
          <svg viewBox="0 0 32 48" className="w-7 h-10 sm:w-8 sm:h-11 drop-shadow-md" fill="none">
            <defs>
              <linearGradient id="chrome_figma" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#64748B" />
              </linearGradient>
            </defs>
            <path
              d="M16 24C16 19.6 19.6 16 24 16C28.4 16 32 19.6 32 24C32 28.4 28.4 32 24 32C19.6 32 16 28.4 16 24Z M0 40C0 35.6 3.6 32 8 32H16V40C16 44.4 12.4 48 8 48C3.6 48 0 44.4 0 40Z M16 0V16H24C28.4 16 32 12.4 32 8C32 3.6 28.4 0 24 0H16Z M0 8C0 12.4 3.6 16 8 16H16V0H8C3.6 0 0 3.6 0 8Z M0 24C0 28.4 3.6 32 8 32H16V16H8C3.6 16 0 19.6 0 24Z"
              fill="url(#chrome_figma)"
              stroke="#E2E8F0"
              strokeWidth="1.2"
            />
            <circle cx="24" cy="24" r="7" fill="#1ABCFE" stroke="url(#chrome_figma)" strokeWidth="1.2" />
            <path d="M1.2 40C1.2 36.2 4.2 33.2 8 33.2H14.8V40C14.8 43.8 11.8 46.8 8 46.8C4.2 46.8 1.2 43.8 1.2 40Z" fill="#0ACF83" stroke="url(#chrome_figma)" strokeWidth="1.2" />
            <path d="M16 1.2V14.8H24C27.8 14.8 30.8 11.8 30.8 8C30.8 4.2 27.8 1.2 24 1.2H16Z" fill="#FF7262" stroke="url(#chrome_figma)" strokeWidth="1.2" />
            <path d="M1.2 8C1.2 11.8 4.2 14.8 8 14.8H14.8V1.2H8C4.2 1.2 1.2 4.2 1.2 8Z" fill="#F24E1E" stroke="url(#chrome_figma)" strokeWidth="1.2" />
            <path d="M1.2 24C1.2 27.8 4.2 30.8 8 30.8H14.8V17.2H8C4.2 17.2 1.2 20.2 1.2 24Z" fill="#A259FF" stroke="url(#chrome_figma)" strokeWidth="1.2" />
          </svg>
        );

      // 2. ADOBE CREATIVE CLOUD PIN
      case 'creative-cloud':
        return (
          <svg viewBox="0 0 46 36" className="w-9 h-7 sm:w-10 sm:h-8" fill="none">
            <path
              d="M14 6C8 6 4 11 4 18C4 25 8 30 14 30C19 30 22 26 23 23C24 26 27 30 32 30C38 30 42 25 42 18C42 11 38 6 32 6C27 6 24 10 23 13C22 10 19 6 14 6Z"
              fill="#DC2626"
              stroke="#CBD5E1"
              strokeWidth="2.4"
            />
            <path
              d="M14 11C10 11 8 14 8 18C8 22 10 25 14 25C17 25 19 23 20 20C20.5 18 21.5 13 23 13C24.5 13 25.5 18 26 20C27 23 29 25 32 25C36 25 38 22 38 18C38 14 36 11 32 11C29 11 27 13 26 16C24 21 22 21 20 16C19 13 17 11 14 11Z"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        );

      // 3. ADOBE 'A' PIN
      case 'adobe':
        return (
          <svg viewBox="0 0 38 38" className="w-8 h-8 sm:w-9 sm:h-9" fill="none">
            <polygon points="19,2 36,34 26,34 21,23 29,23 19,6 9,23 14,23 9,34 2,34" fill="#DC2626" stroke="#CBD5E1" strokeWidth="2.2" strokeLinejoin="round" />
            <polygon points="19,10 24,20 14,20" fill="#FFFFFF" opacity="0.9" />
          </svg>
        );

      // 4. REACT 19 PIN
      case 'react':
        return (
          <svg viewBox="0 0 42 42" className="w-8 h-8 sm:w-9 sm:h-9" fill="none">
            <circle cx="21" cy="21" r="18" fill="#080C14" stroke="#CBD5E1" strokeWidth="2" />
            <ellipse cx="21" cy="21" rx="15" ry="5.8" stroke="#38BDF8" strokeWidth="2.2" transform="rotate(0 21 21)" />
            <ellipse cx="21" cy="21" rx="15" ry="5.8" stroke="#38BDF8" strokeWidth="2.2" transform="rotate(60 21 21)" />
            <ellipse cx="21" cy="21" rx="15" ry="5.8" stroke="#38BDF8" strokeWidth="2.2" transform="rotate(120 21 21)" />
            <circle cx="21" cy="21" r="3.4" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.2" />
          </svg>
        );

      // 5. TAILWIND CSS PIN
      case 'tailwind':
        return (
          <svg viewBox="0 0 44 32" className="w-9 h-7 sm:w-10 sm:h-8" fill="none">
            <path
              d="M11 6C12.8 2 17 0 21.5 0C28 0 29.5 4.5 32 5.5C34 6.2 35.8 5.2 37 3.5C35.2 7.5 31 9.5 26.5 9.5C20 9.5 18.5 5 16 4C14 3.3 12.2 4.3 11 6ZM3 14C4.8 10 9 8 13.5 8C20 8 21.5 12.5 24 13.5C26 14.2 27.8 13.2 29 11.5C27.2 15.5 23 17.5 18.5 17.5C12 17.5 10.5 13 8 12C6 11.3 4.2 12.3 3 14Z"
              fill="#38BDF8"
              stroke="#E2E8F0"
              strokeWidth="2"
              strokeLinejoin="round"
              transform="scale(1.15) translate(-0.5, 3)"
            />
          </svg>
        );

      // 6. OPENAI / CHATGPT PIN
      case 'openai':
        return (
          <svg viewBox="0 0 42 42" className="w-8 h-8 sm:w-9 sm:h-9" fill="none">
            <circle cx="21" cy="21" r="18" fill="#064E3B" stroke="#CBD5E1" strokeWidth="2.2" />
            <path
              d="M21 9C23 9 25 10 26 12L23 14C22.5 13 21.8 12.5 21 12.5C19.5 12.5 18.2 13.5 18 15L15.5 14C16.2 11 18.4 9 21 9ZM29 15C30 16.5 30 18.5 29 20L26.5 18.5C27 17.8 27 16.8 26.5 16C25.8 14.8 24.5 14.2 23 14.5L23 11.8C25.8 11.5 28.2 12.8 29 15ZM29 23C28 25 26 26.5 23.5 26.5L23.5 23.8C24.5 23.8 25.2 23.2 25.5 22.5L28 24C28.5 23.5 28.8 22.8 29 22L26.5 20.5L29 23ZM21 29C19 29 17 28 16 26L19 24C19.5 25 20.2 25.5 21 25.5C22.5 25.5 23.8 24.5 24 23L26.5 24C25.8 27 23.6 29 21 29ZM13 23C12 21.5 12 19.5 13 18L15.5 19.5C15 20.2 15 21.2 15.5 22C16.2 23.2 17.5 23.8 19 23.5L19 26.2C16.2 26.5 13.8 25.2 13 23Z"
              fill="#34D399"
              stroke="#FFFFFF"
              strokeWidth="0.8"
            />
            <circle cx="21" cy="21" r="3.2" fill="#FFFFFF" />
          </svg>
        );

      // 7. AI SPARKLE / STAR PIN
      case 'spline':
        return (
          <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-9 sm:h-9" fill="none">
            <defs>
              <linearGradient id="spline_grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="50%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
            <path
              d="M20 2C20 12 28 20 38 20C28 20 20 28 20 38C20 28 12 20 2 20C12 20 20 12 20 2Z"
              fill="url(#spline_grad)"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <circle cx="20" cy="20" r="4.5" fill="#FFFFFF" />
          </svg>
        );

      // 8. PROTOTYPING / SAILBOAT PIN
      case 'midjourney':
        return (
          <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-9 sm:h-9" fill="none">
            <path d="M5 28C10 33 30 33 35 28L30 34H10L5 28Z" fill="#CBD5E1" stroke="#FFFFFF" strokeWidth="1.8" />
            <path d="M19 6V26H29L19 6Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M16 11V26H9L16 11Z" fill="#94A3B8" stroke="#E2E8F0" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M4 35C8 37 14 37 18 35C22 33 28 33 32 35C34 36 36 36 38 35" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      // 9. NOTION PIN
      case 'notion':
        return (
          <svg viewBox="0 0 38 40" className="w-8 h-8 sm:w-9 sm:h-9" fill="none">
            <polygon points="19,2 36,11 19,21 2,11" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="2,11 19,21 19,38 2,28" fill="#1E293B" stroke="#CBD5E1" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="36,11 19,21 19,38 36,28" fill="#0F172A" stroke="#CBD5E1" strokeWidth="2" strokeLinejoin="round" />
            <text x="19" y="15" textAnchor="middle" fill="#0F172A" fontFamily="monospace" fontWeight="900" fontSize="9">N</text>
          </svg>
        );

      // 10. FRAMER MOTION PIN
      case 'framer':
        return (
          <svg viewBox="0 0 34 44" className="w-7 h-9 sm:w-8 sm:h-10" fill="none">
            <path d="M4 2H30V16H17L30 30H17V42L4 28V16H17L4 2Z" fill="#1E40AF" stroke="#E2E8F0" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="4,2 30,2 17,16 4,16" fill="#3B82F6" stroke="#E2E8F0" strokeWidth="1.2" />
            <polygon points="17,16 30,16 17,30" fill="#2563EB" stroke="#E2E8F0" strokeWidth="1.2" />
            <polygon points="4,16 17,16 4,28" fill="#1D4ED8" stroke="#E2E8F0" strokeWidth="1.2" />
            <polygon points="4,28 17,28 17,42" fill="#60A5FA" stroke="#E2E8F0" strokeWidth="1.2" />
          </svg>
        );

      // 11. BLENDER 3D PIN
      case 'blender':
        return (
          <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-9 sm:h-9" fill="none">
            <circle cx="20" cy="23" r="11" fill="#EA580C" stroke="#CBD5E1" strokeWidth="2.2" />
            <circle cx="20" cy="23" r="6" fill="#1E3A8A" stroke="#CBD5E1" strokeWidth="1.4" />
            <circle cx="20" cy="23" r="3.2" fill="#38BDF8" />
            <path d="M19 4L14 17H19L22 4H19Z" fill="#EA580C" stroke="#CBD5E1" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M7 19L17 19L14 23L5 22L7 19Z" fill="#EA580C" stroke="#CBD5E1" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M30 11L21 17L24 20L33 14L30 11Z" fill="#EA580C" stroke="#CBD5E1" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        );

      // 12. VS CODE PIN
      case 'vscode':
        return (
          <svg viewBox="0 0 38 38" className="w-8 h-8 sm:w-9 sm:h-9" fill="none">
            <rect x="2" y="2" width="34" height="34" rx="7" fill="#0369A1" stroke="#CBD5E1" strokeWidth="2.2" />
            <path d="M10 12L20 20L10 28M18 28H28" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      // 13. DAVINCI RESOLVE COLOR WHEEL PIN
      case 'davinci':
        return (
          <svg viewBox="0 0 38 38" className="w-8 h-8 sm:w-9 sm:h-9" fill="none">
            <circle cx="19" cy="19" r="17" fill="#0B0F19" stroke="#E2E8F0" strokeWidth="2.2" />
            <circle cx="19" cy="19" r="12" fill="#1E293B" />
            <circle cx="19" cy="12" r="3.2" fill="#EF4444" stroke="#FFFFFF" strokeWidth="0.8" />
            <circle cx="13" cy="23" r="3.2" fill="#EAB308" stroke="#FFFFFF" strokeWidth="0.8" />
            <circle cx="25" cy="23" r="3.2" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="0.8" />
            <circle cx="19" cy="19" r="2" fill="#FFFFFF" />
          </svg>
        );

      // 14. THREE.JS / 3D ORB PIN
      case 'threejs':
        return (
          <svg viewBox="0 0 38 38" className="w-8 h-8 sm:w-9 sm:h-9" fill="none">
            <circle cx="19" cy="19" r="17" fill="#0B132B" stroke="#CBD5E1" strokeWidth="2.4" />
            <circle cx="19" cy="19" r="12" fill="#1C2541" />
            <path d="M19 8C24 13 26 19 23 23C20 27 14 26 11 22C8 18 14 12 19 8Z" fill="#3B82F6" stroke="#60A5FA" strokeWidth="1" />
            <circle cx="17" cy="16" r="3" fill="#93C5FD" />
            <circle cx="16" cy="15" r="1" fill="#FFFFFF" />
          </svg>
        );

      // 15. DESIGN SYSTEMS / PRISMA DELTA PIN
      case 'design-systems':
        return (
          <svg viewBox="0 0 40 38" className="w-9 h-8 sm:w-10 sm:h-9" fill="none">
            <polygon points="20,2 38,34 2,34" fill="#4C1D95" stroke="#E2E8F0" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="20,8 32,30 20,30" fill="#7C3AED" stroke="#CBD5E1" strokeWidth="1" />
            <polygon points="20,8 20,30 8,30" fill="#A78BFA" stroke="#CBD5E1" strokeWidth="1" />
            <polygon points="20,16 26,27 14,27" fill="#FFFFFF" />
          </svg>
        );

      // 16. PROCREATE RAINBOW FEATHER PIN
      case 'procreate':
        return (
          <svg viewBox="0 0 42 36" className="w-9 h-8 sm:w-10 sm:h-9" fill="none">
            <defs>
              <linearGradient id="feather_grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="25%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="75%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
            <path
              d="M3 28C10 27 18 20 26 12C32 6 36 3 39 3C38 8 33 16 26 22C19 28 11 31 3 28Z"
              fill="url(#feather_grad)"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M5 27C14 24 22 18 30 11" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
          </svg>
        );

      // 17. SKETCH DIAMOND PIN
      case 'sketch':
        return (
          <svg viewBox="0 0 38 38" className="w-8 h-8 sm:w-9 sm:h-9" fill="none">
            <polygon points="10,4 28,4 36,15 19,34 2,15" fill="#D97706" stroke="#CBD5E1" strokeWidth="2.2" strokeLinejoin="round" />
            <polygon points="10,4 28,4 23,15 15,15" fill="#FDE047" stroke="#CBD5E1" strokeWidth="1" />
            <polygon points="10,4 15,15 2,15" fill="#F59E0B" stroke="#CBD5E1" strokeWidth="1" />
            <polygon points="28,4 36,15 23,15" fill="#B45309" stroke="#CBD5E1" strokeWidth="1" />
            <polygon points="15,15 23,15 19,34" fill="#FBBF24" stroke="#CBD5E1" strokeWidth="1" />
            <polygon points="2,15 15,15 19,34" fill="#D97706" stroke="#CBD5E1" strokeWidth="1" />
            <polygon points="36,15 23,15 19,34" fill="#92400E" stroke="#CBD5E1" strokeWidth="1" />
          </svg>
        );

      // 18. WEBGL 3D POLYGON MESH PIN
      case 'webgl':
      default:
        return (
          <svg viewBox="0 0 38 40" className="w-8 h-8 sm:w-9 sm:h-9" fill="none">
            <polygon points="19,2 36,12 30,36 8,36 2,12" fill="#0F172A" stroke="#E2E8F0" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="19,2 36,12 24,20" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="0.8" />
            <polygon points="19,2 24,20 14,20" fill="#94A3B8" stroke="#CBD5E1" strokeWidth="0.8" />
            <polygon points="19,2 14,20 2,12" fill="#475569" stroke="#CBD5E1" strokeWidth="0.8" />
            <polygon points="2,12 14,20 8,36" fill="#1E293B" stroke="#CBD5E1" strokeWidth="0.8" />
            <polygon points="14,20 24,20 19,36" fill="#64748B" stroke="#CBD5E1" strokeWidth="0.8" />
            <polygon points="24,20 36,12 30,36" fill="#0F172A" stroke="#CBD5E1" strokeWidth="0.8" />
          </svg>
        );
    }
  };

  return (
    <div 
      className="relative flex items-center justify-center cursor-pointer select-none"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onClick={onClick}
    >
      {/* Floating Micro-Popup directly over badge - Clean, matte, zero neon/shiny effects */}
      <AnimatePresence>
        {active && (
          <motion.div
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
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-1.5 overflow-hidden pointer-events-none">
              <div className={`w-2 h-2 rotate-45 transform origin-top-left mx-auto border-r border-b ${
                isDark ? 'bg-[#141518] border-neutral-700/60' : 'bg-white border-neutral-200'
              }`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pin Body with Contact Shadow & Spring Lift */}
      <motion.div
        animate={{
          scale: active ? 1.25 : 1,
          y: active ? -5 : 0
        }}
        transition={{ type: 'spring', damping: 14, stiffness: 340 }}
        className="relative flex items-center justify-center"
      >
        {/* Soft Contact Drop Shadow on Velvet */}
        <div 
          className={`absolute inset-0 rounded-full transition-all duration-200 pointer-events-none ${
            active 
              ? 'opacity-90 filter blur-md bg-black/90 translate-x-1.5 translate-y-2.5 scale-90' 
              : 'opacity-70 filter blur-xs bg-black/80 translate-x-1 translate-y-1.5'
          }`}
        />

        {/* Enameled Lapel Pin Artwork */}
        <div className="relative z-10 flex items-center justify-center">
          {renderPinArtwork()}
        </div>
      </motion.div>
    </div>
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
    { id: 'figma', name: 'Figma', work: 'UI Systems & Multi-Brand Libraries' },
    { id: 'creative-cloud', name: 'Creative Cloud', work: 'Vector & Motion Asset Pipelines' },
    { id: 'adobe', name: 'Adobe Suite', work: 'Visual Design & Layout Production' },
    { id: 'react', name: 'React 19', work: 'Web Apps & State Architecture' },
    { id: 'tailwind', name: 'Tailwind CSS', work: 'Design Tokens & Utility Styling' }
  ];

  const row2Badges = [
    { id: 'openai', name: 'OpenAI', work: 'LLM Pipelines & Agentic Workflows' },
    { id: 'spline', name: 'Spline 3D', work: 'Interactive WebGL Scenes & Cameras' },
    { id: 'midjourney', name: 'Prototyping', work: 'High-Fidelity Interaction Flows' },
    { id: 'notion', name: 'Notion', work: 'Documentation & Knowledge Systems' },
    { id: 'framer', name: 'Framer Motion', work: 'Spring Physics & Layout Animations' },
    { id: 'blender', name: 'Blender 3D', work: '3D Modeling & PBR Baking' }
  ];

  const row3Badges = [
    { id: 'vscode', name: 'VS Code', work: 'Code Editing & TypeScript' },
    { id: 'davinci', name: 'DaVinci Resolve', work: 'Motion Graphics & Color Grading' },
    { id: 'threejs', name: 'Three.js', work: 'Custom Shaders & 3D Math' },
    { id: 'design-systems', name: 'Design Systems', work: 'Component Governance & Specs' },
    { id: 'procreate', name: 'Procreate', work: 'Digital Art & Storyboards' },
    { id: 'sketch', name: 'Sketch', work: 'Vector Design & Tokens' },
    { id: 'webgl', name: 'WebGL & GLSL', work: 'GPU Shaders & Graphics Engines' }
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
                    id={badge.id}
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
                    id={badge.id}
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
                    id={badge.id}
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
