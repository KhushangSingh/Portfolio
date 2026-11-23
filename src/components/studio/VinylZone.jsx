import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useMusic } from '../../context/MusicContext';
import { favoriteTrack } from '../../constants/favoriteTrack';
import { playCustomEffect, playSoundEffect } from '../../utils/soundEffects';

/**
 * Left Side Table & Hi-Fi Turntable Zone
 * Renders the authentic photographic left-side credenza table in the studio
 * with dual-theme (Sunlit Day vs Warm Amber Night) crossfade and interactive hotspots.
 * 
 * Strict Writing Rules:
 * - Zero commas before "and" or "or".
 * - Zero em dashes.
 */

export default function VinylZone({ onCloseZone }) {
  const { isDark, toggleTheme } = useTheme();
  const { isPlaying: globalIsPlaying, setIsPlaying: setGlobalIsPlaying } = useMusic();

  const records = [
    {
      id: 'suzume',
      title: 'Suzume no Tojimari (Theme)',
      artist: 'RADWIMPS & Kazuma Jinnouchi',
      labelColor: '#0284C7',
      coverGradient: 'from-[#0369a1] via-[#0284c7] to-[#38bdf8]',
      tag: 'Anime OST',
      rpm: '33 RPM',
      edition: '180g Sky Blue Picture Disc',
      year: '2022'
    },
    {
      id: 'earrings',
      title: favoriteTrack.title,
      artist: favoriteTrack.artist,
      labelColor: '#FF5E1A',
      coverGradient: 'from-[#ff7a3d] via-[#ea4e0c] to-[#c73c02]',
      tag: 'Indie R&B',
      rpm: '33 RPM',
      edition: 'Studio Master Pressing',
      year: '2023'
    },
    {
      id: 'city-pop',
      title: 'Plastic Love & Midnight Door',
      artist: 'Mariya Takeuchi & Miki Matsubara',
      labelColor: '#EC4899',
      coverGradient: 'from-[#be185d] via-[#831843] to-[#4c0519]',
      tag: '80s Tokyo Nostalgia',
      rpm: '45 RPM',
      edition: 'Pink Vinyl Edition',
      year: '1984'
    },
    {
      id: 'ghibli',
      title: 'One Summer\'s Day (Lo-Fi Piano)',
      artist: 'Joe Hisaishi / Studio Ghibli',
      labelColor: '#10B981',
      coverGradient: 'from-[#047857] via-[#059669] to-[#10b981]',
      tag: 'Peaceful Nostalgia',
      rpm: '33 RPM',
      edition: 'Studio Ghibli Vinyl',
      year: '2001'
    }
  ];

  const [activeRecord, setActiveRecord] = useState(records[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rpm, setRpm] = useState('33');
  const [isCrateOpen, setIsCrateOpen] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);

  // Sync with global music player
  useEffect(() => {
    setIsPlaying(globalIsPlaying);
  }, [globalIsPlaying]);

  // Play needle drop sound via Web Audio API
  const playNeedleDrop = useCallback(() => {
    playCustomEffect(.12, (ctx, output, now) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.1);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(output);
      osc.start(now);
      osc.stop(now + 0.12);
    });
  }, []);

  const handleTogglePlay = () => {
    if (!isPlaying) {
      playNeedleDrop();
      setIsPlaying(true);
      setGlobalIsPlaying(true);
    } else {
      setIsPlaying(false);
      setGlobalIsPlaying(false);
      playSoundEffect('close');
    }
  };

  const handleSelectRecord = (record) => {
    setActiveRecord(record);
    setRpm(record.rpm.split(' ')[0]);
    playNeedleDrop();
    setIsPlaying(true);
    setGlobalIsPlaying(true);
    setIsCrateOpen(false);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none bg-black">
      
      {/* ===================================================================
          1. TOP HUD BAR
          =================================================================== */}
      <header className="absolute top-0 inset-x-0 h-16 sm:h-20 px-4 sm:px-8 flex items-center justify-between z-30 pointer-events-auto bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        {/* Left: Back Link */}
        <button
          onClick={() => {
            if (onCloseZone) onCloseZone();
          }}
          className="px-3.5 py-1.5 rounded border border-white/30 bg-black/50 backdrop-blur-md text-[10.5px] font-mono font-bold uppercase tracking-wider text-white hover:bg-[#ff5e1a] hover:border-[#ff5e1a] transition-colors shadow-lg cursor-pointer"
          title="Return to Studio Overview"
        >
          BACK / 戻る
        </button>

        {/* Center: Title */}
        <div className="flex flex-col items-center justify-center text-center">
          <span 
            className="text-sm sm:text-base font-bold tracking-[0.08em] text-[#ff5e1a]"
            style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
          >
            左のサイドテーブル
          </span>
          <span className="text-[8.5px] sm:text-[9.5px] font-mono uppercase tracking-[0.25em] text-white/80">
            LEFT SIDE CREDENZA // HI-FI DECK &amp; ARTIFACTS
          </span>
        </div>

        {/* Right: Lighting Mode Button */}
        <button
          onClick={() => {
            toggleTheme();
            playSoundEffect('select');
          }}
          className="px-3 py-1.5 rounded border border-white/30 bg-black/50 backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-wider text-white hover:border-[#ff5e1a] hover:text-[#ff5e1a] transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
          title="Toggle Day and Night studio lighting"
        >
          <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-sky-400'}`} />
          <span>{isDark ? 'AMBER NIGHT' : 'SUNLIT DAY'}</span>
        </button>
      </header>

      {/* ===================================================================
          2. PHOTOGRAPHIC TABLE SCENE (DUAL THEME CROSSFADE)
          =================================================================== */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        
        {/* Aspect-ratio preserving container for 16:9 photo */}
        <div className="relative w-full h-full max-w-[177.78vh] aspect-[16/9] flex items-center justify-center">
          
          {/* Day Photo: Sunlit Wooden Tabletop */}
          <motion.img
            src="/images/left_table_day.jpg"
            alt="Left side credenza table in daylight"
            animate={{ opacity: isDark ? 0 : 1 }}
            transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            loading="eager"
          />

          {/* Night Photo: Warm Amber Evening Lamp Tabletop */}
          <motion.img
            src="/images/left_table_night.jpg"
            alt="Left side credenza table in amber evening light"
            animate={{ opacity: isDark ? 1 : 0 }}
            transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            loading="eager"
          />

          {/* Atmospheric Depth Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

          {/* ===============================================================
              3. INTERACTIVE HOTSPOTS ON THE TABLE OBJECTS
              =============================================================== */}
          
          {/* A. TURNTABLE PLATTER & SPINNING VINYL GROOVE ILLUMINATION */}
          <div 
            onClick={handleTogglePlay}
            onMouseEnter={() => setActiveHotspot('turntable')}
            onMouseLeave={() => setActiveHotspot(null)}
            className="absolute cursor-pointer group z-20"
            style={{
              left: '16.5%',
              top: '32%',
              width: '24%',
              height: '40%',
            }}
            title="Audio-Technica Turntable - Click to Play/Pause"
          >
            {/* Spinning Groove Shimmer Overlay over the Suzume Vinyl */}
            <div 
              className="absolute rounded-full border border-white/20 shadow-2xl pointer-events-none"
              style={{
                left: '20%',
                top: '12%',
                width: '64%',
                height: '74%',
              }}
            >
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{
                  repeat: Infinity,
                  duration: rpm === '45' ? 1.33 : 1.8,
                  ease: 'linear'
                }}
                className="relative w-full h-full rounded-full"
              >
                {/* Microgroove reflection fan */}
                <div 
                  className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
                    isPlaying ? 'opacity-40 mix-blend-screen' : 'opacity-0'
                  }`}
                  style={{
                    background: 'conic-gradient(from 45deg, transparent 0deg, rgba(255,255,255,0.4) 35deg, transparent 70deg, transparent 180deg, rgba(255,255,255,0.4) 215deg, transparent 250deg)'
                  }}
                />
              </motion.div>
            </div>

            {/* Target Reticle Hover Cue */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#ff5e1a] group-hover:bg-[#ff5e1a]/10 transition-all duration-200 pointer-events-none flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 px-2.5 py-1 rounded bg-black/85 text-[#ff5e1a] font-mono text-[10px] font-bold tracking-wider uppercase border border-[#ff5e1a]/50 shadow-xl transition-opacity">
                {isPlaying ? 'PAUSE MOTOR' : 'DROP NEEDLE'}
              </span>
            </div>
          </div>

          {/* B. AMBER GLOBE MUSHROOM LAMP */}
          <div 
            onClick={() => {
              toggleTheme();
              playSoundEffect('select');
            }}
            onMouseEnter={() => setActiveHotspot('lamp')}
            onMouseLeave={() => setActiveHotspot(null)}
            className="absolute cursor-pointer group z-20"
            style={{
              left: '2.5%',
              top: '46%',
              width: '13%',
              height: '42%',
            }}
            title="Globe Lamp - Click to toggle Day/Night lighting"
          >
            <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-amber-400 group-hover:bg-amber-400/15 transition-all duration-200 pointer-events-none flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 px-2 py-0.5 rounded bg-black/85 text-amber-300 font-mono text-[9px] font-bold uppercase tracking-wider border border-amber-400/50 shadow-xl transition-opacity">
                SWITCH LIGHT
              </span>
            </div>
          </div>

          {/* C. SUZUME NO TOJIMARI GATEFOLD SLEEVE */}
          <div 
            onClick={() => handleSelectRecord(records[0])}
            onMouseEnter={() => setActiveHotspot('album')}
            onMouseLeave={() => setActiveHotspot(null)}
            className="absolute cursor-pointer group z-20"
            style={{
              left: '61%',
              top: '34%',
              width: '20%',
              height: '30%',
            }}
            title="Suzume OST Gatefold Vinyl Sleeve"
          >
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[#ff5e1a] group-hover:bg-[#ff5e1a]/10 transition-all duration-200 pointer-events-none flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 px-2.5 py-1 rounded bg-black/85 text-white font-mono text-[9.5px] font-bold uppercase tracking-wider border border-[#ff5e1a]/50 shadow-xl transition-opacity">
                SPIN SUZUME LP
              </span>
            </div>
          </div>

          {/* D. STUDIO COLLECTIBLES (GOKU, SOOT SPRITE & KAIJU) */}
          <div 
            onMouseEnter={() => setActiveHotspot('figures')}
            onMouseLeave={() => setActiveHotspot(null)}
            className="absolute cursor-default group z-20"
            style={{
              left: '41%',
              top: '40%',
              width: '17%',
              height: '18%',
            }}
          >
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-white/40 group-hover:bg-white/5 transition-all duration-200 pointer-events-none flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 px-2 py-0.5 rounded bg-black/85 text-gray-200 font-mono text-[9px] font-bold uppercase tracking-wider border border-white/20 shadow-xl transition-opacity">
                STUDIO TOYS
              </span>
            </div>
          </div>

          {/* E. DIECAST CAR MIRROR & BAUHAUS PRINTS */}
          <div 
            onMouseEnter={() => setActiveHotspot('wall')}
            onMouseLeave={() => setActiveHotspot(null)}
            className="absolute cursor-default group z-20"
            style={{
              left: '34%',
              top: '0%',
              width: '32%',
              height: '24%',
            }}
          >
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-white/30 transition-all duration-200 pointer-events-none flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 px-2.5 py-1 rounded bg-black/85 text-gray-300 font-mono text-[9px] font-bold uppercase tracking-wider border border-white/20 shadow-xl transition-opacity">
                HOT WHEELS MIRROR &amp; BAUHAUS
              </span>
            </div>
          </div>

          {/* F. LOWER RECORD CRATE */}
          <div 
            onClick={() => setIsCrateOpen(true)}
            onMouseEnter={() => setActiveHotspot('crate')}
            onMouseLeave={() => setActiveHotspot(null)}
            className="absolute cursor-pointer group z-20"
            style={{
              left: '72%',
              top: '71%',
              width: '16%',
              height: '16%',
            }}
            title="Browse Studio Record Collection"
          >
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[#ff5e1a] group-hover:bg-[#ff5e1a]/15 transition-all duration-200 pointer-events-none flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 px-2.5 py-1 rounded bg-black/85 text-[#ff5e1a] font-mono text-[9.5px] font-bold uppercase tracking-wider border border-[#ff5e1a]/50 shadow-xl transition-opacity">
                BROWSE CRATE
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* ===================================================================
          4. BOTTOM HI-FI CONTROLS HUD
          =================================================================== */}
      <footer className="absolute bottom-4 inset-x-4 sm:inset-x-8 z-30 pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-white/15 shadow-2xl">
        
        {/* Track Metadata & On-Air Indicator */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-white/20 shadow-md font-mono text-xs font-bold text-white"
            style={{ backgroundColor: activeRecord.labelColor }}
          >
            LP
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-white text-xs sm:text-sm font-bold truncate">
                {activeRecord.title}
              </span>
              {isPlaying && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold uppercase tracking-widest animate-pulse border border-emerald-500/30">
                  ON AIR
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-400 truncate">
              {activeRecord.artist} · {activeRecord.edition}
            </p>
          </div>
        </div>

        {/* Center / Right Player Actions */}
        <div className="flex items-center gap-3">
          {/* Speed Selector (33 vs 45 RPM) */}
          <div className="flex items-center bg-white/10 p-1 rounded-lg border border-white/10">
            {['33', '45'].map((speed) => (
              <button
                key={speed}
                onClick={() => setRpm(speed)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                  rpm === speed ? 'bg-[#ff5e1a] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {speed} RPM
              </button>
            ))}
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={handleTogglePlay}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
              isPlaying
                ? 'bg-[#ff5e1a] text-white shadow-[#ff5e1a]/30'
                : 'bg-white text-black hover:bg-gray-200'
            }`}
          >
            <span>{isPlaying ? 'PAUSE MOTOR' : 'START TURNTABLE'}</span>
          </button>

          {/* Open Record Crate Drawer Button */}
          <button
            onClick={() => setIsCrateOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-colors border border-white/15 cursor-pointer"
          >
            VINYL CRATE
          </button>
        </div>
      </footer>

      {/* ===================================================================
          5. SLIDE-UP RECORD CRATE DRAWER MODAL
          =================================================================== */}
      <AnimatePresence>
        {isCrateOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCrateOpen(false)}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              initial={{ y: 80, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 80, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl rounded-2xl bg-gradient-to-br from-[#1E202A] to-[#111218] border border-white/20 p-5 sm:p-7 shadow-2xl text-white cursor-default"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div>
                  <h3 className="font-bold text-base sm:text-lg">Studio Vinyl Crate</h3>
                  <p className="text-gray-400 text-xs">Select an album to load onto the Audio-Technica turntable</p>
                </div>
                <button
                  onClick={() => setIsCrateOpen(false)}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-mono font-bold"
                >
                  Close
                </button>
              </div>

              <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {records.map((rec) => {
                  const isSelected = activeRecord.id === rec.id;
                  return (
                    <div
                      key={rec.id}
                      onClick={() => handleSelectRecord(rec)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected 
                          ? 'bg-[#ff5e1a]/20 border-[#ff5e1a] text-white shadow-lg' 
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div 
                          className="w-11 h-11 rounded-lg flex items-center justify-center font-mono text-xs font-bold text-white shrink-0 shadow-md"
                          style={{ backgroundColor: rec.labelColor }}
                        >
                          LP
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm truncate text-white">{rec.title}</div>
                          <div className="text-xs text-gray-400 truncate">{rec.artist} · {rec.edition}</div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-[10px] text-gray-400 block">{rec.rpm}</span>
                        {isSelected && (
                          <span className="font-mono text-[9px] text-[#ff5e1a] uppercase font-bold">Loaded</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
