import React from 'react';

/**
 * Handcrafted vector artwork for each book's spine, front cover and detail poster.
 * Designed with authentic typographical and graphic motifs for each of the 12 masterworks.
 * 
 * Rules:
 * - Zero generic Lucide icons. Handcrafted SVGs only.
 * - Zero commas before "and" or "or".
 * - Zero em dashes.
 */

export default function BookArtwork({ book, face = 'cover', isDark = false, className = '' }) {
  const { id, title, author, year, publisher, category, subtitleRomaji, subtitleKanji, palette } = book;

  // Choose palette based on light/dark mode
  const spineBg = isDark ? (palette.darkSpineBg || palette.spineBg) : palette.spineBg;
  const coverBg = isDark ? (palette.darkCoverBg || palette.coverBg) : palette.coverBg;
  const coverText = isDark ? (palette.darkCoverText || palette.coverText) : palette.coverText;
  const accent = palette.accent;

  // =========================================================================
  // 1. SPINE FACE
  // =========================================================================
  if (face === 'spine') {
    return (
      <div 
        className={`relative w-full h-full flex flex-col justify-between py-3 px-1.5 overflow-hidden select-none ${className}`}
        style={{
          backgroundColor: spineBg,
          color: palette.text,
          borderLeft: `1.5px solid ${accent}50`,
          borderRight: '1.5px solid rgba(0,0,0,0.55)',
          boxShadow: 'inset 0 0 12px rgba(0,0,0,0.4)',
        }}
      >
        {/* Paper / leather fiber texture overlay */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none" 
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.25) 2px, rgba(0,0,0,0.25) 4px)'
          }}
        />

        {/* Top Spine Ribbon & Category Tag */}
        <div className="relative z-10 w-full flex flex-col items-center gap-1">
          <div 
            className="w-3.5 h-1 rounded-sm shadow-sm"
            style={{ backgroundColor: accent }} 
          />
          <span 
            className="text-[7.5px] font-mono tracking-widest uppercase opacity-75 truncate max-w-full"
            style={{ letterSpacing: '0.12em' }}
          >
            {category.split(' ')[0]}
          </span>
        </div>

        {/* Vertical Running Title */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-2 overflow-hidden">
          <span 
            className="font-mono text-[9.5px] sm:text-[10.5px] font-bold tracking-[0.22em] uppercase [writing-mode:vertical-rl] rotate-180 truncate"
            style={{ 
              color: palette.text,
              textShadow: '0 1px 2px rgba(0,0,0,0.6)'
            }}
          >
            {title}
          </span>
        </div>

        {/* Bottom Metadata & Colophon */}
        <div className="relative z-10 w-full flex flex-col items-center gap-0.5 pt-1 border-t border-white/10">
          <span className="font-mono text-[7px] opacity-75 truncate uppercase tracking-wider">
            {author.split(' ').pop()}
          </span>
          <span className="font-mono text-[6px] opacity-50 tracking-tighter">
            {year}
          </span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. FRONT COVER & DETAIL POSTER (SVG VIEWBOX 474 x 900)
  // =========================================================================
  return (
    <svg 
      viewBox="0 0 474 900" 
      className={`w-full h-full block ${className}`}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Subtle book paper texture */}
        <radialGradient id={`rad-${id}`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </radialGradient>
      </defs>

      {/* Book Cover Background Ground */}
      <rect width="474" height="900" fill={coverBg} />
      <rect width="474" height="900" fill={`url(#rad-${id})`} />

      {/* Book Spine Fold Shadow on left edge */}
      <rect width="18" height="900" fill="#000000" opacity="0.35" />
      <line x1="18" y1="0" x2="18" y2="900" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" />

      {/* Outer Editorial Margin Inset */}
      <rect 
        x="28" 
        y="28" 
        width="418" 
        height="844" 
        fill="none" 
        stroke={accent} 
        strokeOpacity="0.4" 
        strokeWidth="1.5" 
      />

      {/* ===================================================================
          BOOK-SPECIFIC BESPOKE COVER ARTWORK
          =================================================================== */}
      
      {/* 1. GRID SYSTEMS IN GRAPHIC DESIGN */}
      {id === 'grid-systems' && (
        <g>
          {/* Swiss 8-Module Typographic Grid */}
          <g stroke={accent} strokeOpacity="0.35" strokeWidth="1" strokeDasharray="3 3">
            <line x1="48" y1="180" x2="426" y2="180" />
            <line x1="48" y1="320" x2="426" y2="320" />
            <line x1="48" y1="460" x2="426" y2="460" />
            <line x1="48" y1="600" x2="426" y2="600" />
            <line x1="142" y1="180" x2="142" y2="720" />
            <line x1="237" y1="180" x2="237" y2="720" />
            <line x1="332" y1="180" x2="332" y2="720" />
          </g>

          {/* Solid Swiss Orange Accent Blocks */}
          <rect x="48" y="180" width="94" height="140" fill={accent} opacity="0.9" />
          <rect x="237" y="320" width="189" height="140" fill={accent} opacity="0.25" />

          {/* Bilingual Swiss Display Typography */}
          <text x="48" y="80" fontFamily="'Inter Tight', sans-serif" fontSize="11" fontWeight="700" fill={accent} letterSpacing="3">
            VERLAG NIGGLI EDITION
          </text>
          <text x="48" y="115" fontFamily="'Inter Tight', sans-serif" fontSize="30" fontWeight="700" fill={coverText} letterSpacing="-0.5">
            Raster Systeme
          </text>
          <text x="48" y="145" fontFamily="'Inter Tight', sans-serif" fontSize="22" fontWeight="600" fill={coverText} opacity="0.85">
            Grid Systems in Graphic Design
          </text>

          {/* Geometric Grid Diagram Text */}
          <text x="58" y="255" fontFamily="'Inter Tight', sans-serif" fontSize="13" fontWeight="700" fill="#ffffff">
            MODUL A
          </text>
          <text x="250" y="395" fontFamily="'Inter Tight', sans-serif" fontSize="13" fontWeight="700" fill={coverText}>
            PROPORTION 8 : 12
          </text>

          {/* Footer Metadata */}
          <text x="48" y="790" fontFamily="'Newsreader', serif" fontStyle="italic" fontSize="18" fill={coverText}>
            Josef Müller-Brockmann
          </text>
          <text x="48" y="825" fontFamily="'Inter Tight', sans-serif" fontSize="10" fontWeight="600" fill={accent} letterSpacing="2">
            ZÜRICH · SWITZERLAND · 1981
          </text>
        </g>
      )}

      {/* 2. REFACTORING UI */}
      {id === 'refactoring-ui' && (
        <g>
          {/* Card Elevation Wireframe Art */}
          <g transform="translate(48, 220)">
            <rect x="0" y="0" width="378" height="380" rx="16" fill="#1E293B" opacity="0.6" stroke={accent} strokeWidth="1.5" />
            <rect x="24" y="24" width="330" height="70" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <circle cx="56" cy="59" r="16" fill={accent} opacity="0.8" />
            <rect x="88" y="48" width="140" height="10" rx="4" fill="#F8FAFC" />
            <rect x="88" y="66" width="90" height="6" rx="3" fill="#94A3B8" />

            {/* Depth cards */}
            <rect x="24" y="118" width="155" height="140" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <rect x="199" y="118" width="155" height="140" rx="10" fill="#0F172A" stroke={accent} strokeWidth="1.5" />
            <rect x="219" y="140" width="70" height="8" rx="4" fill={accent} />
            <rect x="219" y="160" width="115" height="6" rx="3" fill="#94A3B8" />
            <rect x="219" y="174" width="95" height="6" rx="3" fill="#94A3B8" opacity="0.6" />

            <rect x="24" y="282" width="330" height="60" rx="10" fill={accent} opacity="0.15" stroke={accent} strokeWidth="1" />
            <text x="189" y="318" textAnchor="middle" fontFamily="'Inter Tight', sans-serif" fontSize="13" fontWeight="700" fill={accent} letterSpacing="1">
              SYSTEMATIC HIERARCHY
            </text>
          </g>

          <text x="48" y="80" fontFamily="'Inter Tight', sans-serif" fontSize="11" fontWeight="700" fill={accent} letterSpacing="3">
            TAILWIND LABS MANUAL
          </text>
          <text x="48" y="125" fontFamily="'Inter Tight', sans-serif" fontSize="38" fontWeight="700" fill="#F8FAFC" letterSpacing="-1">
            Refactoring UI
          </text>
          <text x="48" y="160" fontFamily="'Inter Tight', sans-serif" fontSize="14" fontWeight="500" fill="#94A3B8">
            Visual hierarchy, spacing rhythm and UI craft
          </text>

          <text x="48" y="790" fontFamily="'Inter Tight', sans-serif" fontSize="16" fontWeight="600" fill="#F8FAFC">
            Adam Wathan &amp; Steve Schoger
          </text>
          <text x="48" y="825" fontFamily="'Inter Tight', sans-serif" fontSize="10" fontWeight="700" fill={accent} letterSpacing="2">
            DESIGN THINKING FOR DEVELOPERS
          </text>
        </g>
      )}

      {/* 3. THE DESIGN OF EVERYDAY THINGS */}
      {id === 'everyday-things' && (
        <g>
          {/* Norman Impossible Coffeepot Silhouette Lineart */}
          <g transform="translate(140, 260)" stroke={accent} strokeWidth="2.5" fill="none">
            {/* Coffeepot body */}
            <path d="M40 80 Q30 200 60 260 L140 260 Q170 200 160 80 Z" fill={accent} fillOpacity="0.12" />
            <ellipse cx="100" cy="80" rx="60" ry="14" fill="#FAF5EF" />
            {/* Handle on same side as spout! */}
            <path d="M45 100 C-10 110 -15 220 45 240" strokeWidth="6" strokeLinecap="round" />
            {/* Spout on same side */}
            <path d="M50 110 L10 90 L10 130 Z" fill={accent} />
            {/* Lid & knob */}
            <path d="M70 80 Q100 60 130 80" strokeWidth="2" />
            <circle cx="100" cy="60" r="8" fill={accent} />
          </g>

          <text x="237" y="580" textAnchor="middle" fontFamily="'Newsreader', serif" fontStyle="italic" fontSize="15" fill={accent}>
            The Coffeepot for Masochists
          </text>

          <text x="48" y="80" fontFamily="'Inter Tight', sans-serif" fontSize="11" fontWeight="700" fill={accent} letterSpacing="3">
            BASIC BOOKS CLASSIC
          </text>
          <text x="48" y="125" fontFamily="'Newsreader', serif" fontSize="36" fontWeight="500" fill={coverText} letterSpacing="-0.5">
            The Design of
          </text>
          <text x="48" y="165" fontFamily="'Newsreader', serif" fontSize="36" fontWeight="500" fill={coverText} letterSpacing="-0.5">
            Everyday Things
          </text>

          <text x="48" y="790" fontFamily="'Newsreader', serif" fontStyle="italic" fontSize="22" fill={coverText}>
            Don Norman
          </text>
          <text x="48" y="825" fontFamily="'Inter Tight', sans-serif" fontSize="10" fontWeight="700" fill={accent} letterSpacing="2">
            REVISED &amp; EXPANDED EDITION
          </text>
        </g>
      )}

      {/* 4. DESIGNING DATA-INTENSIVE APPLICATIONS */}
      {id === 'ddia' && (
        <g>
          {/* Classic O'Reilly Signature Header Box */}
          <rect x="28" y="28" width="418" height="70" fill="#FFFFFF" />
          <rect x="44" y="44" width="38" height="38" fill="#DC2626" />
          <text x="96" y="68" fontFamily="'Inter Tight', sans-serif" fontSize="20" fontWeight="800" fill="#0F172A" letterSpacing="4">
            O'REILLY
          </text>

          {/* O'Reilly Woodcut Wild Boar Artwork */}
          <g transform="translate(100, 270)">
            <ellipse cx="140" cy="140" rx="110" ry="85" fill="none" stroke="#0284C7" strokeWidth="2" strokeDasharray="4 2" />
            <path 
              d="M60 140 Q80 80 150 90 Q220 95 240 130 Q250 160 210 180 Q160 190 110 180 Q70 170 60 140 Z" 
              fill="#1E293B" 
              stroke="#0284C7" 
              strokeWidth="2.5" 
            />
            {/* Boar tusks & ear */}
            <path d="M70 140 L45 130" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <path d="M120 90 L135 65 L145 90 Z" fill="#0284C7" />
            {/* Network data nodes around boar */}
            <circle cx="50" cy="90" r="4" fill="#0284C7" />
            <circle cx="230" cy="80" r="4" fill="#0284C7" />
            <circle cx="250" cy="170" r="4" fill="#0284C7" />
            <line x1="50" y1="90" x2="80" y2="100" stroke="#0284C7" strokeWidth="1" />
            <line x1="230" y1="80" x2="200" y2="100" stroke="#0284C7" strokeWidth="1" />
          </g>

          {/* O'Reilly Bold Condensed Book Title */}
          <text x="48" y="150" fontFamily="'Inter Tight', sans-serif" fontSize="28" fontWeight="800" fill={coverText} letterSpacing="-0.5">
            Designing Data-Intensive
          </text>
          <text x="48" y="185" fontFamily="'Inter Tight', sans-serif" fontSize="32" fontWeight="800" fill="#0284C7" letterSpacing="-0.5">
            Applications
          </text>
          <text x="48" y="218" fontFamily="'Newsreader', serif" fontStyle="italic" fontSize="15" fill={coverText} opacity="0.8">
            Reliable, Scalable and Maintainable Systems
          </text>

          <text x="48" y="790" fontFamily="'Newsreader', serif" fontSize="20" fontWeight="600" fill={coverText}>
            Martin Kleppmann
          </text>
          <text x="48" y="825" fontFamily="'Inter Tight', sans-serif" fontSize="10" fontWeight="700" fill="#0284C7" letterSpacing="2">
            DISTRIBUTED SYSTEMS BIBLE
          </text>
        </g>
      )}

      {/* 5. STRUCTURE AND INTERPRETATION OF COMPUTER PROGRAMS */}
      {id === 'sicp' && (
        <g>
          {/* Mythical MIT Wizard Casting Lambda Lightning */}
          <g transform="translate(140, 240)">
            {/* Wizard Hat & Robe */}
            <path d="M100 40 L50 160 L150 160 Z" fill={accent} opacity="0.3" stroke={accent} strokeWidth="2" />
            <circle cx="100" cy="20" r="10" fill="#F59E0B" />
            {/* Giant Greek Lambda Symbol */}
            <text x="100" y="270" textAnchor="middle" fontFamily="'Newsreader', serif" fontSize="110" fontWeight="400" fill="#F59E0B">
              λ
            </text>
            <circle cx="100" cy="240" r="70" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="6 4" />
          </g>

          <text x="48" y="80" fontFamily="'Inter Tight', sans-serif" fontSize="11" fontWeight="700" fill="#F59E0B" letterSpacing="3">
            THE MIT PRESS SERIES
          </text>
          <text x="48" y="125" fontFamily="'Newsreader', serif" fontSize="30" fontWeight="400" fill="#FAF5FF" letterSpacing="-0.5">
            Structure and
          </text>
          <text x="48" y="160" fontFamily="'Newsreader', serif" fontSize="30" fontWeight="400" fill="#FAF5FF" letterSpacing="-0.5">
            Interpretation
          </text>
          <text x="48" y="195" fontFamily="'Newsreader', serif" fontStyle="italic" fontSize="18" fill="#F59E0B">
            of Computer Programs
          </text>

          <text x="48" y="785" fontFamily="'Inter Tight', sans-serif" fontSize="14" fontWeight="600" fill="#FAF5FF">
            Harold Abelson &amp; Gerald Jay Sussman
          </text>
          <text x="48" y="810" fontFamily="'Inter Tight', sans-serif" fontSize="12" fontWeight="500" fill="#D8B4FE">
            with Julie Sussman
          </text>
          <text x="48" y="835" fontFamily="'Inter Tight', sans-serif" fontSize="9" fontWeight="700" fill="#F59E0B" letterSpacing="2">
            MASSACHUSETTS INSTITUTE OF TECHNOLOGY
          </text>
        </g>
      )}

      {/* 6. CLEAN CODE */}
      {id === 'clean-code' && (
        <g>
          {/* Technical Code Indentation Matrix Art */}
          <g transform="translate(68, 260)" stroke={accent} strokeWidth="1.5" fill="none">
            <rect x="0" y="0" width="338" height="280" rx="8" fill="#032C22" stroke={accent} strokeWidth="1.5" />
            <line x1="20" y1="30" x2="160" y2="30" stroke="#34D399" strokeWidth="3" strokeLinecap="round" />
            <line x1="40" y1="55" x2="220" y2="55" stroke="#34D399" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <line x1="60" y1="80" x2="180" y2="80" stroke="#34D399" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <line x1="80" y1="105" x2="140" y2="105" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="60" y1="130" x2="260" y2="130" stroke="#34D399" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <line x1="40" y1="155" x2="200" y2="155" stroke="#34D399" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <line x1="20" y1="180" x2="100" y2="180" stroke="#34D399" strokeWidth="3" strokeLinecap="round" />

            {/* Boy Scout Rule Seal */}
            <circle cx="169" cy="225" r="28" fill="#064E3B" stroke={accent} strokeWidth="2" />
            <text x="169" y="229" textAnchor="middle" fontFamily="'Inter Tight', sans-serif" fontSize="9" fontWeight="700" fill="#ECFDF5" letterSpacing="1">
              CLEAN
            </text>
          </g>

          <text x="48" y="80" fontFamily="'Inter Tight', sans-serif" fontSize="11" fontWeight="700" fill={accent} letterSpacing="3">
            ROBERT C. MARTIN SERIES
          </text>
          <text x="48" y="125" fontFamily="'Newsreader', serif" fontSize="40" fontWeight="500" fill="#ECFDF5" letterSpacing="-1">
            Clean Code
          </text>
          <text x="48" y="160" fontFamily="'Inter Tight', sans-serif" fontSize="13" fontWeight="600" fill="#6EE7B7">
            A Handbook of Agile Software Craftsmanship
          </text>

          <text x="48" y="790" fontFamily="'Newsreader', serif" fontSize="20" fontWeight="600" fill="#ECFDF5">
            Robert C. Martin
          </text>
          <text x="48" y="825" fontFamily="'Inter Tight', sans-serif" fontSize="10" fontWeight="700" fill={accent} letterSpacing="2">
            PRENTICE HALL PTR
          </text>
        </g>
      )}

      {/* 7. AKIRA: MASTER EDITION */}
      {id === 'akira' && (
        <g>
          {/* Kaneda's Capsule Jacket Motif & Japanese Kanji */}
          <g transform="translate(237, 360)">
            {/* Red Motorcycle Capsule Pill Emblem */}
            <ellipse cx="0" cy="0" rx="90" ry="46" fill="#DC2626" transform="rotate(-30)" />
            <ellipse cx="-20" cy="12" rx="40" ry="46" fill="#FFFFFF" transform="rotate(-30)" />
            <text x="0" y="8" textAnchor="middle" fontFamily="'Noto Sans JP', sans-serif" fontSize="18" fontWeight="900" fill="#0A0A0A" letterSpacing="4">
              CAPSULE
            </text>
          </g>

          {/* Monumental Japanese Brush Kanji AKIRA */}
          <text x="237" y="240" textAnchor="middle" fontFamily="'Noto Sans JP', sans-serif" fontSize="74" fontWeight="900" fill="#EF4444" letterSpacing="6">
            アキラ
          </text>

          {/* Yellow Warning Hazard Tape Line */}
          <g transform="translate(48, 540)">
            <rect x="0" y="0" width="378" height="20" fill="#FBBF24" />
            <text x="189" y="14" textAnchor="middle" fontFamily="'Inter Tight', sans-serif" fontSize="10" fontWeight="900" fill="#0A0A0A" letterSpacing="3">
              WARNING: NEO TOKYO 2019 A.D.
            </text>
          </g>

          <text x="48" y="80" fontFamily="'Inter Tight', sans-serif" fontSize="11" fontWeight="700" fill="#EF4444" letterSpacing="3">
            KODANSHA MASTER EDITION 01
          </text>
          <text x="48" y="130" fontFamily="'Inter Tight', sans-serif" fontSize="48" fontWeight="900" fill="#FEF2F2" letterSpacing="2">
            AKIRA
          </text>

          <text x="48" y="790" fontFamily="'Inter Tight', sans-serif" fontSize="22" fontWeight="700" fill="#FEF2F2">
            Katsuhiro Otomo
          </text>
          <text x="48" y="825" fontFamily="'Inter Tight', sans-serif" fontSize="10" fontWeight="700" fill="#EF4444" letterSpacing="2">
            THE ORIGINAL CYBERPUNK MANGA
          </text>
        </g>
      )}

      {/* 8. BERSERK: DELUXE EDITION */}
      {id === 'berserk' && (
        <g>
          {/* Leatherette Debossed Texture & Foil Brand of Sacrifice Rune */}
          <g transform="translate(237, 360)">
            {/* The Brand of Sacrifice Rune in Blood Crimson */}
            <path 
              d="M0 -120 L0 120 M-60 -40 L60 -40 M-60 40 L60 40 M-60 -40 L0 -90 L60 -40 L0 30 L-60 -40 M-60 40 L0 -10 L60 40 L0 100 L-60 40" 
              stroke="#DC2626" 
              strokeWidth="7" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              fill="none" 
            />
          </g>

          <text x="48" y="80" fontFamily="'Inter Tight', sans-serif" fontSize="11" fontWeight="700" fill="#DC2626" letterSpacing="3">
            DARK HORSE DELUXE 01
          </text>
          <text x="48" y="135" fontFamily="'Newsreader', serif" fontSize="44" fontWeight="600" fill="#FFFFFF" letterSpacing="2">
            BERSERK
          </text>
          <text x="48" y="170" fontFamily="'Inter Tight', sans-serif" fontSize="12" fontWeight="700" fill="#DC2626" letterSpacing="4">
            DELUXE EDITION
          </text>

          <text x="48" y="790" fontFamily="'Newsreader', serif" fontSize="24" fontWeight="500" fill="#F5F5F5">
            Kentaro Miura
          </text>
          <text x="48" y="825" fontFamily="'Inter Tight', sans-serif" fontSize="10" fontWeight="700" fill="#DC2626" letterSpacing="2">
            DARK HORSE MANGA
          </text>
        </g>
      )}

      {/* 9. THE GHOST IN THE SHELL */}
      {id === 'gits' && (
        <g>
          {/* Section 9 Neural Wiring Interface */}
          <g transform="translate(237, 360)">
            <circle cx="0" cy="0" r="110" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="10 6" />
            <circle cx="0" cy="0" r="75" fill="#1E1B4B" stroke={accent} strokeWidth="2" />
            <path d="M-50 0 L50 0 M0 -50 L0 50" stroke={accent} strokeWidth="2" />
            {/* Cybernetic connector nodes */}
            <circle cx="-75" cy="0" r="6" fill="#C084FC" />
            <circle cx="75" cy="0" r="6" fill="#C084FC" />
            <circle cx="0" cy="-75" r="6" fill="#C084FC" />
            <circle cx="0" cy="75" r="6" fill="#C084FC" />
          </g>

          {/* Kanji Subtitle */}
          <text x="237" y="540" textAnchor="middle" fontFamily="'Noto Sans JP', sans-serif" fontSize="24" fontWeight="700" fill={accent} letterSpacing="4">
            攻殻機動隊
          </text>

          <text x="48" y="80" fontFamily="'Inter Tight', sans-serif" fontSize="11" fontWeight="700" fill={accent} letterSpacing="3">
            KODANSHA YOUNG MAGAZINE
          </text>
          <text x="48" y="125" fontFamily="'Inter Tight', sans-serif" fontSize="30" fontWeight="800" fill="#EEF2FF" letterSpacing="1">
            THE GHOST IN
          </text>
          <text x="48" y="165" fontFamily="'Inter Tight', sans-serif" fontSize="36" fontWeight="800" fill={accent} letterSpacing="1">
            THE SHELL
          </text>

          <text x="48" y="790" fontFamily="'Inter Tight', sans-serif" fontSize="20" fontWeight="700" fill="#EEF2FF">
            Masamune Shirow
          </text>
          <text x="48" y="825" fontFamily="'Inter Tight', sans-serif" fontSize="10" fontWeight="700" fill={accent} letterSpacing="2">
            SECTION 9 INTELLIGENCE
          </text>
        </g>
      )}

      {/* 10. NEUROMANCER */}
      {id === 'neuromancer' && (
        <g>
          {/* CRT Television Dead Channel Grid & Chiba City Matrix */}
          <g transform="translate(48, 220)">
            <rect x="0" y="0" width="378" height="360" rx="12" fill="#011A19" stroke={accent} strokeWidth="2" />
            {/* CRT Horizontal Scanlines */}
            <g stroke="#10B981" strokeOpacity="0.15" strokeWidth="1">
              {Array.from({ length: 18 }).map((_, i) => (
                <line key={i} x1="0" y1={i * 20} x2="378" y2={i * 20} />
              ))}
            </g>
            {/* Perspective Wireframe Ground Grid */}
            <path d="M0 360 L189 200 L378 360 M60 360 L189 200 L318 360 M120 360 L189 200 L258 360" stroke={accent} strokeWidth="1.5" />
            {/* Matrix Console Prompt */}
            <text x="24" y="50" fontFamily="'Inter Tight', monospace" fontSize="13" fontWeight="700" fill={accent}>
              CHIBA_NET // ONO-SENDAI 7
            </text>
            <text x="24" y="75" fontFamily="'Inter Tight', monospace" fontSize="11" fill="#6EE7B7">
              STATUS: MATRIX DECK JACKED IN
            </text>
          </g>

          <text x="48" y="80" fontFamily="'Inter Tight', sans-serif" fontSize="11" fontWeight="700" fill={accent} letterSpacing="3">
            ACE SCIENCE FICTION NOVEL
          </text>
          <text x="48" y="130" fontFamily="'Newsreader', serif" fontSize="42" fontWeight="500" fill="#ECFDF5" letterSpacing="-0.5">
            Neuromancer
          </text>
          <text x="48" y="165" fontFamily="'Inter Tight', sans-serif" fontSize="13" fontWeight="600" fill="#6EE7B7">
            The Sprawl Trilogy · Cyberspace Genesis
          </text>

          <text x="48" y="790" fontFamily="'Newsreader', serif" fontSize="22" fontWeight="500" fill="#ECFDF5">
            William Gibson
          </text>
          <text x="48" y="825" fontFamily="'Inter Tight', sans-serif" fontSize="10" fontWeight="700" fill={accent} letterSpacing="2">
            HUGO &amp; NEBULA AWARD WINNER
          </text>
        </g>
      )}

      {/* 11. DUNE */}
      {id === 'dune' && (
        <g>
          {/* Sweeping Desert Dunes & Solar Eclipse Ring */}
          <g transform="translate(48, 220)">
            {/* Solar Eclipse Crest */}
            <circle cx="189" cy="90" r="60" fill="#F59E0B" />
            <circle cx="180" cy="80" r="58" fill="#60220D" />
            {/* Flowing Arrakis Sand Dunes */}
            <path d="M0 340 Q100 200 220 280 Q320 180 378 260 L378 380 L0 380 Z" fill="#7C2D12" />
            <path d="M0 360 Q140 260 280 330 L378 300 L378 380 L0 380 Z" fill="#9A3412" />
          </g>

          <text x="48" y="80" fontFamily="'Inter Tight', sans-serif" fontSize="11" fontWeight="700" fill={accent} letterSpacing="3">
            THE CHILTON CLASSIC
          </text>
          <text x="48" y="140" fontFamily="'Newsreader', serif" fontSize="64" fontWeight="400" fill="#FFFBEB" letterSpacing="4">
            DUNE
          </text>

          <text x="48" y="790" fontFamily="'Newsreader', serif" fontSize="24" fontWeight="400" fill="#FFFBEB">
            Frank Herbert
          </text>
          <text x="48" y="825" fontFamily="'Inter Tight', sans-serif" fontSize="10" fontWeight="700" fill={accent} letterSpacing="2">
            THE ARRAKIS CHRONICLES
          </text>
        </g>
      )}

      {/* 12. MEDITATIONS */}
      {id === 'meditations' && (
        <g>
          {/* Classical Roman Imperial Travertine Meander & Emperor Bust Silhouette */}
          <g transform="translate(48, 220)">
            {/* Greek Key Inner Border */}
            <rect x="20" y="20" width="338" height="340" fill="none" stroke={accent} strokeWidth="2" strokeDasharray="16 8" />
            {/* Roman Laurel Wreath */}
            <circle cx="189" cy="180" r="85" fill="none" stroke={accent} strokeWidth="3" />
            <circle cx="189" cy="180" r="70" fill="none" stroke={accent} strokeWidth="1" strokeDasharray="6 4" />
            {/* Roman Imperial Profile Bust Silhouette */}
            <path 
              d="M170 120 Q195 110 205 130 Q215 150 205 170 Q215 180 200 200 Q205 230 180 240 L160 240 Z" 
              fill={accent} 
              opacity="0.25" 
            />
          </g>

          <text x="48" y="80" fontFamily="'Inter Tight', sans-serif" fontSize="11" fontWeight="700" fill={accent} letterSpacing="3">
            PENGUIN CLASSICS EDITION
          </text>
          <text x="48" y="125" fontFamily="'Newsreader', serif" fontSize="38" fontWeight="400" fill={coverText} letterSpacing="1">
            Meditations
          </text>
          <text x="48" y="160" fontFamily="'Newsreader', serif" fontStyle="italic" fontSize="16" fill={accent}>
            The Private Notebook of the Emperor
          </text>

          <text x="48" y="790" fontFamily="'Newsreader', serif" fontSize="22" fontWeight="400" fill={coverText}>
            Marcus Aurelius
          </text>
          <text x="48" y="825" fontFamily="'Inter Tight', sans-serif" fontSize="10" fontWeight="700" fill={accent} letterSpacing="2">
            ROME · 180 A.D.
          </text>
        </g>
      )}
    </svg>
  );
}
