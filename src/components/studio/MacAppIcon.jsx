import React from 'react';
import BrandMark from '../BrandMark';

/**
 * High-Fidelity macOS App Icons
 * Modeled strictly after Apple Human Interface Guidelines and macOS design specifications:
 * - 22.5% continuous curvature squircle profile
 * - Realistic multi-layered specular sheen and directional drop shadows
 * - Authentic macOS app iconography for Finder, Safari, Messages, Maps, Terminal, Notes, etc.
 */

export default function MacAppIcon({ name, className = "w-10 h-10", badge }) {
  const iconId = name?.toLowerCase();

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      {/* 1. FINDER */}
      {iconId === 'finder' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
          <defs>
            <linearGradient id="finderBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4facfe" />
              <stop offset="100%" stopColor="#0066eb" />
            </linearGradient>
            <linearGradient id="finderLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#80d0ff" />
              <stop offset="100%" stopColor="#389bf2" />
            </linearGradient>
            <linearGradient id="finderRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2080e5" />
              <stop offset="100%" stopColor="#0d52b5" />
            </linearGradient>
          </defs>
          {/* Squircle Base */}
          <rect x="5" y="5" width="90" height="90" rx="21" fill="url(#finderBg)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
          {/* Inner Two-Tone Split Face */}
          <g transform="translate(14, 14)">
            {/* Left Face Half */}
            <path d="M0 16 C0 6 6 0 16 0 L36 0 L36 72 L16 72 C6 72 0 66 0 56 Z" fill="url(#finderLeft)" />
            {/* Right Face Half */}
            <path d="M36 0 L56 0 C66 0 72 6 72 16 L72 56 C72 66 66 72 56 72 L36 72 Z" fill="url(#finderRight)" />
            {/* Dividing Nose Line */}
            <path d="M36 0 L36 34 Q39 42 45 42 L36 42 L36 72" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* Left Eye */}
            <circle cx="22" cy="28" r="4.5" fill="#FFFFFF" />
            {/* Right Eye */}
            <circle cx="50" cy="28" r="4.5" fill="#FFFFFF" />
            {/* Smile Arc */}
            <path d="M18 48 Q36 66 54 48" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
          {/* Subtle Specular Sheen */}
          <rect x="5" y="5" width="90" height="45" rx="21" fill="white" opacity="0.12" pointerEvents="none" />
        </svg>
      )}

      {/* 2. SAFARI */}
      {iconId === 'safari' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
          <defs>
            <linearGradient id="safariBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#29B6F6" />
              <stop offset="50%" stopColor="#0288D1" />
              <stop offset="100%" stopColor="#01579B" />
            </linearGradient>
            <linearGradient id="needleRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF5252" />
              <stop offset="100%" stopColor="#D50000" />
            </linearGradient>
            <linearGradient id="needleWhite" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#CFD8DC" />
            </linearGradient>
          </defs>
          {/* Squircle Base */}
          <rect x="5" y="5" width="90" height="90" rx="21" fill="url(#safariBg)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
          {/* Compass Dial Outer Silver Ring */}
          <circle cx="50" cy="50" r="36" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.85" />
          <circle cx="50" cy="50" r="33" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="2 3" />
          {/* Degree Tick Marks (NSEW) */}
          <path d="M50 17 L50 22 M50 78 L50 83 M17 50 L22 50 M78 50 L83 50" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          {/* Diagonal Ticks */}
          <path d="M27 27 L31 31 M69 69 L73 73 M73 27 L69 31 M27 73 L31 69" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.7" />
          {/* Compass Needle (Angled ~45deg pointing Northwest) */}
          <g transform="rotate(-45 50 50)">
            {/* Red North Tip */}
            <polygon points="50,18 45,50 55,50" fill="url(#needleRed)" />
            {/* White South Tip */}
            <polygon points="50,82 45,50 55,50" fill="url(#needleWhite)" />
            {/* Center Pivot Pin */}
            <circle cx="50" cy="50" r="4.5" fill="#FFFFFF" stroke="#90A4AE" strokeWidth="1" />
            <circle cx="50" cy="50" r="2" fill="#D50000" />
          </g>
          {/* Specular Sheen */}
          <rect x="5" y="5" width="90" height="45" rx="21" fill="white" opacity="0.12" pointerEvents="none" />
        </svg>
      )}

      {/* 3. MESSAGES */}
      {iconId === 'messages' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
          <defs>
            <linearGradient id="msgBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4cd964" />
              <stop offset="100%" stopColor="#28cd41" />
            </linearGradient>
            <linearGradient id="msgBubble" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F1F8E9" />
            </linearGradient>
          </defs>
          {/* Squircle Base */}
          <rect x="5" y="5" width="90" height="90" rx="21" fill="url(#msgBg)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          {/* Speech Bubble with Tail */}
          <path
            d="M50 23 C32 23 18 34 18 47.5 C18 55.5 23 62.5 31 67 C30 73 26 77 24 78 C29 78 37 75 42 71.5 C44.5 72 47.2 72 50 72 C68 72 82 61 82 47.5 C82 34 68 23 50 23 Z"
            fill="url(#msgBubble)"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
          />
          {/* Specular Sheen */}
          <rect x="5" y="5" width="90" height="45" rx="21" fill="white" opacity="0.12" pointerEvents="none" />
        </svg>
      )}

      {/* 4. MAPS */}
      {iconId === 'maps' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
          <defs>
            <linearGradient id="mapsGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A8E6CF" />
              <stop offset="100%" stopColor="#81C784" />
            </linearGradient>
            <linearGradient id="mapsWater" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#90CAF9" />
              <stop offset="100%" stopColor="#64B5F6" />
            </linearGradient>
            <clipPath id="mapsSquircle">
              <rect x="5" y="5" width="90" height="90" rx="21" />
            </clipPath>
          </defs>
          <g clipPath="url(#mapsSquircle)">
            {/* Map Terrain Panels */}
            <rect x="5" y="5" width="90" height="90" fill="#F5F5F0" />
            {/* Green Parks */}
            <path d="M5 5 L60 5 L40 60 L5 40 Z" fill="url(#mapsGreen)" />
            <path d="M60 50 L95 40 L95 95 L40 95 Z" fill="url(#mapsGreen)" opacity="0.8" />
            {/* Blue Water Corner */}
            <path d="M5 65 Q 30 75 45 95 L5 95 Z" fill="url(#mapsWater)" />
            {/* Highway Roads */}
            <path d="M10 20 Q 50 40 85 25" stroke="#FFFFFF" strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d="M10 20 Q 50 40 85 25" stroke="#FFB74D" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M35 10 L65 90" stroke="#FFFFFF" strokeWidth="9" fill="none" strokeLinecap="round" />
            <path d="M35 10 L65 90" stroke="#FFD54F" strokeWidth="6" fill="none" strokeLinecap="round" />
            {/* 3D Apple Maps Red Pin */}
            <g transform="translate(52, 28)">
              {/* Cast Shadow */}
              <ellipse cx="6" cy="38" rx="8" ry="3" fill="rgba(0,0,0,0.3)" />
              {/* Pin Head and Point */}
              <path d="M6 0 C-4 0 -10 6 -10 16 C-10 26 6 38 6 38 C6 38 22 26 22 16 C22 6 16 0 6 0 Z" fill="#FF3B30" />
              <circle cx="6" cy="15" r="5" fill="#FFFFFF" />
            </g>
          </g>
          {/* Squircle Border & Sheen */}
          <rect x="5" y="5" width="90" height="90" rx="21" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
          <rect x="5" y="5" width="90" height="45" rx="21" fill="white" opacity="0.1" pointerEvents="none" />
        </svg>
      )}

      {/* 5. VS CODE */}
      {iconId === 'vscode' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
          <defs>
            <linearGradient id="vscBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="vscRibbon1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#007ACC" />
              <stop offset="100%" stopColor="#005A9E" />
            </linearGradient>
            <linearGradient id="vscRibbon2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          <rect x="5" y="5" width="90" height="90" rx="21" fill="url(#vscBg)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          {/* Authentic VS Code Ribbon */}
          <g transform="translate(18, 18) scale(0.64)">
            <path d="M72 5 L96 24 L72 43 L54 28 Z" fill="#0066B8" opacity="0.6" />
            <path d="M96 24 L96 76 L72 95 L72 5 Z" fill="url(#vscRibbon1)" />
            <path d="M72 95 L25 58 L5 70 L2 67 L28 47 L2 27 L5 24 L25 36 Z" fill="url(#vscRibbon2)" />
            <path d="M72 43 L28 78 L5 60 L72 5 Z" fill="#007ACC" opacity="0.75" />
          </g>
          <rect x="5" y="5" width="90" height="45" rx="21" fill="white" opacity="0.1" pointerEvents="none" />
        </svg>
      )}

      {/* 6. FIGMA */}
      {iconId === 'figma' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
          <defs>
            <linearGradient id="figmaBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#27272A" />
              <stop offset="100%" stopColor="#18181B" />
            </linearGradient>
          </defs>
          <rect x="5" y="5" width="90" height="90" rx="21" fill="url(#figmaBg)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          {/* Authentic 5-component Figma Emblem */}
          <g transform="translate(32, 20)">
            {/* Top Left: Orange */}
            <path d="M0 12 C0 5.4 5.4 0 12 0 L24 0 L24 24 L12 24 C5.4 24 0 18.6 0 12 Z" fill="#F24E1E" />
            {/* Top Right: Coral */}
            <path d="M24 0 L36 0 C42.6 0 48 5.4 48 12 C48 18.6 42.6 24 36 24 L24 24 Z" fill="#FF7262" />
            {/* Middle Left: Purple */}
            <path d="M0 36 C0 29.4 5.4 24 12 24 L24 24 L24 48 L12 48 C5.4 48 0 42.6 0 36 Z" fill="#A259FF" />
            {/* Middle Right: Cyan */}
            <circle cx="36" cy="36" r="12" fill="#1ABCFE" />
            {/* Bottom Left: Green */}
            <path d="M0 60 C0 53.4 5.4 48 12 48 L24 48 L24 60 C24 66.6 18.6 72 12 72 C5.4 72 0 66.6 0 60 Z" fill="#0ACF83" />
          </g>
          <rect x="5" y="5" width="90" height="45" rx="21" fill="white" opacity="0.1" pointerEvents="none" />
        </svg>
      )}

      {/* 7. SPOTIFY */}
      {iconId === 'spotify' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
          <defs>
            <linearGradient id="spotBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1ED760" />
              <stop offset="100%" stopColor="#1DB954" />
            </linearGradient>
          </defs>
          <rect x="5" y="5" width="90" height="90" rx="21" fill="url(#spotBg)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          {/* Black Sound Waves */}
          <g fill="#121212" transform="translate(18, 22)">
            <path d="M57.8 24.3 C46.2 17.4 27 16.8 15.9 20.2 C14.1 20.7 12.2 19.7 11.7 17.9 C11.2 16.1 12.2 14.2 14 13.7 C26.8 9.8 48 10.5 61.4 18.5 C63 19.4 63.5 21.5 62.6 23.1 C61.6 24.5 59.4 25.1 57.8 24.3 Z" />
            <path d="M53 35.8 C44.8 30.7 29.8 28.9 19.3 32.1 C17.8 32.5 16.2 31.7 15.8 30.2 C15.4 28.7 16.2 27.1 17.7 26.7 C30 23 46.5 24.9 56.1 30.8 C57.4 31.6 57.8 33.3 57 34.6 C56.1 35.8 54.4 36.5 53 35.8 Z" />
            <path d="M48.2 46.8 C41.2 42.5 28.5 41.3 19.8 44 C18.5 44.4 17.2 43.6 16.8 42.3 C16.4 41 17.2 39.7 18.5 39.3 C28.6 36.2 42.6 37.6 50.8 42.6 C51.9 43.3 52.3 44.8 51.6 45.9 C50.9 47 49.3 47.4 48.2 46.8 Z" />
          </g>
          <rect x="5" y="5" width="90" height="45" rx="21" fill="white" opacity="0.12" pointerEvents="none" />
        </svg>
      )}

      {/* 8. TERMINAL */}
      {iconId === 'terminal' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
          <defs>
            <linearGradient id="termBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2A2A2E" />
              <stop offset="100%" stopColor="#141416" />
            </linearGradient>
          </defs>
          <rect x="5" y="5" width="90" height="90" rx="21" fill="url(#termBg)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          {/* Shell Prompt: >_ */}
          <path d="M26 32 L44 48 L26 64" stroke="#E5E5EA" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <rect x="52" y="58" width="22" height="6" rx="2" fill="#30D158" />
          <rect x="5" y="5" width="90" height="45" rx="21" fill="white" opacity="0.08" pointerEvents="none" />
        </svg>
      )}

      {/* 9. NOTES */}
      {iconId === 'notes' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
          <defs>
            <linearGradient id="notesBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEA" />
              <stop offset="100%" stopColor="#FFF3C4" />
            </linearGradient>
            <clipPath id="notesClip">
              <rect x="5" y="5" width="90" height="90" rx="21" />
            </clipPath>
          </defs>
          <g clipPath="url(#notesClip)">
            <rect x="5" y="5" width="90" height="90" fill="url(#notesBg)" />
            {/* Lined Grid */}
            <line x1="12" y1="36" x2="88" y2="36" stroke="#E2D9B7" strokeWidth="1.5" />
            <line x1="12" y1="50" x2="88" y2="50" stroke="#E2D9B7" strokeWidth="1.5" />
            <line x1="12" y1="64" x2="88" y2="64" stroke="#E2D9B7" strokeWidth="1.5" />
            <line x1="12" y1="78" x2="88" y2="78" stroke="#E2D9B7" strokeWidth="1.5" />
            {/* Leather Header Top Band */}
            <rect x="5" y="5" width="90" height="20" fill="#8D6E63" />
            <line x1="5" y1="24" x2="95" y2="24" stroke="#D7CCC8" strokeWidth="1" strokeDasharray="3 2" />
          </g>
          <rect x="5" y="5" width="90" height="90" rx="21" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
          <rect x="5" y="5" width="90" height="45" rx="21" fill="white" opacity="0.1" pointerEvents="none" />
        </svg>
      )}

      {/* 10. SYSTEM SETTINGS */}
      {iconId === 'settings' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
          <defs>
            <linearGradient id="settingsBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3A3A3C" />
              <stop offset="100%" stopColor="#1C1C1E" />
            </linearGradient>
            <linearGradient id="gearMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E5E5EA" />
              <stop offset="100%" stopColor="#8E8E93" />
            </linearGradient>
          </defs>
          <rect x="5" y="5" width="90" height="90" rx="21" fill="url(#settingsBg)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          {/* Concentric Double Gear */}
          <g transform="translate(50, 50)" fill="url(#gearMetal)">
            {/* Gear Teeth Outer Ring */}
            <circle cx="0" cy="0" r="28" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <rect key={deg} x="-5" y="-36" width="10" height="12" rx="2" transform={`rotate(${deg})`} />
            ))}
            {/* Hollow Center */}
            <circle cx="0" cy="0" r="14" fill="#2C2C2E" />
            {/* Center Core */}
            <circle cx="0" cy="0" r="6" fill="url(#gearMetal)" />
          </g>
          <rect x="5" y="5" width="90" height="45" rx="21" fill="white" opacity="0.1" pointerEvents="none" />
        </svg>
      )}

      {/* 11. TRASH */}
      {iconId === 'trash' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
          <defs>
            <linearGradient id="trashBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
          </defs>
          <rect x="5" y="5" width="90" height="90" rx="21" fill="url(#trashBg)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          {/* Wire Mesh Basket Silhouette */}
          <g transform="translate(24, 22)" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round">
            {/* Basket Rim */}
            <ellipse cx="26" cy="10" rx="26" ry="6" fill="#F8FAFC" />
            {/* Basket Body */}
            <path d="M4 11 L10 54 Q12 58 18 58 L34 58 Q40 58 42 54 L48 11" />
            {/* Wire Mesh Ribs */}
            <line x1="15" y1="14" x2="18" y2="56" strokeOpacity="0.5" />
            <line x1="26" y1="16" x2="26" y2="58" strokeOpacity="0.5" />
            <line x1="37" y1="14" x2="34" y2="56" strokeOpacity="0.5" />
            <ellipse cx="26" cy="35" rx="19" ry="3" strokeOpacity="0.4" />
          </g>
          <rect x="5" y="5" width="90" height="45" rx="21" fill="white" opacity="0.15" pointerEvents="none" />
        </svg>
      )}

      {/* 12. GITHUB */}
      {iconId === 'github' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
          <rect x="5" y="5" width="90" height="90" rx="21" fill="#18181B" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <path
            fill="#FFFFFF"
            d="M50 20 C33.4 20 20 33.4 20 50 C20 63.3 28.6 74.5 40.6 78.5 C42.1 78.8 42.6 77.8 42.6 77 C42.6 76.3 42.6 74.5 42.6 72 C34.2 73.8 32.5 68 32.5 68 C31.1 64.5 29.2 63.5 29.2 63.5 C26.5 61.6 29.4 61.7 29.4 61.7 C32.4 61.9 34 64.8 34 64.8 C36.7 69.4 41 68 42.7 67.3 C43 65.3 43.8 64 44.7 63.2 C38 62.4 31 59.8 31 48.3 C31 45 32.2 42.3 34.1 40.2 C33.8 39.4 32.8 36.3 34.4 32.1 C34.4 32.1 37 31.3 42.8 35.2 C45.3 34.5 47.9 34.1 50.5 34.1 C53.1 34.1 55.7 34.5 58.2 35.2 C64 31.3 66.6 32.1 66.6 32.1 C68.2 36.3 67.2 39.4 66.9 40.2 C68.8 42.3 70 45 70 48.3 C70 59.9 62.9 62.4 56.2 63.2 C57.3 64.1 58.3 65.9 58.3 68.7 C58.3 72.7 58.3 75.9 58.3 77 C58.3 77.8 58.8 78.8 60.4 78.5 C72.4 74.5 81 63.3 81 50 C81 33.4 67.6 20 50 20 Z"
          />
          <rect x="5" y="5" width="90" height="45" rx="21" fill="white" opacity="0.1" pointerEvents="none" />
        </svg>
      )}

      {/* 13. LINKEDIN */}
      {iconId === 'linkedin' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
          <rect x="5" y="5" width="90" height="90" rx="21" fill="#0A66C2" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <g fill="#FFFFFF" transform="translate(24, 24) scale(0.65)">
            <rect x="4" y="24" width="16" height="52" rx="3" />
            <circle cx="12" cy="10" r="10" />
            <path d="M30 24 L45 24 L45 32 Q51 22 64 22 C76 22 80 30 80 44 L80 76 L64 76 L64 48 C64 42 62 36 54 36 C46 36 45 42 45 48 L45 76 L30 76 Z" />
          </g>
          <rect x="5" y="5" width="90" height="45" rx="21" fill="white" opacity="0.12" pointerEvents="none" />
        </svg>
      )}

      {/* 14. GOOGLE */}
      {iconId === 'google' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
          <rect x="5" y="5" width="90" height="90" rx="21" fill="#FFFFFF" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
          <g transform="translate(24, 24) scale(0.52)">
            <path d="M96 50.5 C96 46.8 95.7 43.3 95 40 L50 40 L50 60 L76 60 C75 66 71 71 65 74.8 L65 87 L81.5 87 C91 78.2 96 65.6 96 50.5 Z" fill="#4285F4" />
            <path d="M50 97 C63 97 73.8 92.7 81.5 85.6 L65 73.4 C60.5 76.4 55.7 78.2 50 78.2 C37.8 78.2 27.5 70 23.8 59 L7 59 L7 72 C15 88 31.2 97 50 97 Z" fill="#34A853" />
            <path d="M23.8 59 C22.8 56 22.2 52.8 22.2 49.5 C22.2 46.2 22.8 43 23.8 40 L7 40 C3.5 47 1.5 54.8 1.5 63 C1.5 71.2 3.5 79 7 86 L23.8 72 Z" fill="#FBBC05" />
            <path d="M50 20.8 C57 20.8 63.3 23.2 68.3 28 L82.5 13.8 C73.8 5.7 63 0.8 50 0.8 C31.2 0.8 15 9.8 7 25.8 L23.8 38.8 C27.5 27.8 37.8 20.8 50 20.8 Z" fill="#EA4335" />
          </g>
          <rect x="5" y="5" width="90" height="45" rx="21" fill="white" opacity="0.1" pointerEvents="none" />
        </svg>
      )}

      {/* 15. APPLE */}
      {iconId === 'apple' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
          <rect x="5" y="5" width="90" height="90" rx="21" fill="#1C1C1E" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <g transform="translate(24, 22) scale(0.31)" fill="#FFFFFF">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.74-11.64-14.1-6.19-9.8-10.89-20.73-14.1-32.8-3.21-12.06-4.82-23.49-4.82-34.28 0-16.14 4.17-29.43 12.52-39.87 8.35-10.43 18.7-15.75 31.05-15.96 4.79 0 10.15 1.25 16.08 3.76 5.93 2.51 9.77 3.86 11.52 4.06 1.76-.2 5.7-1.55 11.83-4.06 6.13-2.51 11.41-3.71 15.86-3.6 13.91.54 24.87 5.75 32.87 15.64-12.4 7.51-18.49 17.84-18.28 31 0 11.32 4.39 21.1 13.17 29.35 4.13 3.91 8.87 6.8 14.22 8.68-2.61 7.73-5.76 15.24-9.47 22.52zM119.22 33.15c0-7.39 2.67-14.41 8.01-21.06 5.34-6.65 11.96-10.74 19.86-12.28.32 1.41.48 2.61.48 3.6 0 7.49-2.8 14.57-8.41 21.23-5.61 6.66-12.39 10.66-20.34 12-0.21-1.09-.32-2.26-.32-3.49z" />
          </g>
          <rect x="5" y="5" width="90" height="45" rx="21" fill="white" opacity="0.1" pointerEvents="none" />
        </svg>
      )}

      {/* 16. OTAKUCIRCLE */}
      {iconId === 'otakucircle' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none">
          <defs>
            <linearGradient id="otakuBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF7A3D" />
              <stop offset="100%" stopColor="#FF5E1A" />
            </linearGradient>
          </defs>
          <rect x="5" y="5" width="90" height="90" rx="21" fill="url(#otakuBg)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <foreignObject x="20" y="20" width="60" height="60">
            <div className="w-full h-full flex items-center justify-center">
              <BrandMark brand="otakucircle" className="w-12 h-12 object-contain filter brightness-0 invert" />
            </div>
          </foreignObject>
          <rect x="5" y="5" width="90" height="45" rx="21" fill="white" opacity="0.12" pointerEvents="none" />
        </svg>
      )}

      {/* Red Unread Notification Badge */}
      {badge && (
        <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white font-bold text-[9px] flex items-center justify-center shadow-md ring-2 ring-white dark:ring-neutral-900">
          {badge}
        </span>
      )}
    </div>
  );
}
