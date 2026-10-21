import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Disc3, Play, Pause, Volume2, RotateCcw, Music, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useMusic } from '../../context/MusicContext';

export default function VinylZone({ onCloseZone }) {
  const { isDark } = useTheme();
  const { isPlaying: globalIsPlaying, setIsPlaying: setGlobalIsPlaying } = useMusic();

  const records = [
    {
      id: 'bad-bunny',
      title: 'DtMF (Lo-Fi Chill Rework)',
      artist: 'Bad Bunny',
      labelColor: '#FF5E1A',
      coverGradient: 'from-[#ff7a3d] via-[#ea4e0c] to-[#c73c02]',
      tag: 'Caribbean Chill Beats',
      bpm: '84 BPM',
      rpm: '33 RPM'
    },
    {
      id: 'city-pop',
      title: 'Plastic Love & Midnight Door',
      artist: 'Mariya Takeuchi & Miki Matsubara',
      labelColor: '#EC4899',
      coverGradient: 'from-[#be185d] via-[#831843] to-[#4c0519]',
      tag: '80s Tokyo Nostalgia',
      bpm: '105 BPM',
      rpm: '45 RPM'
    },
    {
      id: 'ghibli',
      title: 'One Summer\'s Day (Lo-Fi Piano)',
      artist: 'Joe Hisaishi / Studio Ghibli',
      labelColor: '#0EA5E9',
      coverGradient: 'from-[#0369a1] via-[#075985] to-[#0c4a6e]',
      tag: 'Peaceful Nostalgia',
      bpm: '72 BPM',
      rpm: '33 RPM'
    }
  ];

  const [activeRecord, setActiveRecord] = useState(records[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rpm, setRpm] = useState('33');
  const [volume, setVolume] = useState(80);

  // Play needle drop sound via Web Audio API
  const playNeedleDrop = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.1);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  };

  const handleTogglePlay = () => {
    if (!isPlaying) {
      playNeedleDrop();
      setIsPlaying(true);
      setGlobalIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleSelectRecord = (record) => {
    setActiveRecord(record);
    setRpm(record.rpm.split(' ')[0]);
    playNeedleDrop();
    setIsPlaying(true);
    setGlobalIsPlaying(true);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden select-none">
      
      {/* Zone Header */}
      <div className="text-center mb-4 sm:mb-6 z-10">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Disc3 className="w-4 h-4 text-[#ff5e1a] animate-spin" style={{ animationDuration: isPlaying ? '3s' : '0s' }} />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ff5e1a]">
            ANALOG HI-FI DECK &amp; RECORD CRATE
          </span>
        </div>
        <p className="text-gray-400 text-xs sm:text-sm">
          Precision direct-drive turntable. Select a vinyl from the crate to drop the needle.
        </p>
      </div>

      <div className="relative w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-10">
        
        {/* ==============================================================
            1. THE HIGH-FIDELITY TURNTABLE DECK
            ============================================================== */}
        <div className="relative w-[310px] sm:w-[380px] h-[310px] sm:h-[380px] rounded-3xl p-4 bg-gradient-to-br from-[#252834] via-[#181922] to-[#0e0f14] border-2 sm:border-[3px] border-[#383b49] shadow-[0_30px_70px_rgba(0,0,0,0.95)] flex flex-col justify-between overflow-hidden">
          
          {/* Deck Top Surface Specular */}
          <div className="absolute top-0 inset-x-8 h-1 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

          {/* Top Plate Brand Header */}
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 z-10">
            <span className="text-[#ff5e1a] font-bold">KHUSHANG HI-FI // 01</span>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
              <span>{isPlaying ? `${rpm} RPM MOTOR ACTIVE` : 'PARKED'}</span>
            </div>
          </div>

          {/* Turntable Platter & Vinyl Record */}
          <div className="relative w-full aspect-square flex items-center justify-center my-auto">
            
            {/* Cast Aluminum Platter Rim with Strobe Dots */}
            <div className="absolute w-[230px] sm:w-[270px] h-[230px] sm:h-[270px] rounded-full bg-gradient-to-br from-[#475569] via-[#1e293b] to-[#0f172a] p-1.5 shadow-2xl flex items-center justify-center border border-white/20">
              
              {/* Spinning 12" Vinyl Disc */}
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ 
                  repeat: Infinity, 
                  duration: rpm === '45' ? 1.33 : 1.8, 
                  ease: 'linear' 
                }}
                className="relative w-full h-full rounded-full bg-[#0d0e12] shadow-inner flex items-center justify-center overflow-hidden border border-black/80"
              >
                {/* Microgroove concentric ridges */}
                <div 
                  className="absolute inset-0 rounded-full opacity-35 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle, transparent 38%, rgba(255,255,255,0.06) 40%, transparent 42%, rgba(255,255,255,0.06) 44%, transparent 46%, rgba(255,255,255,0.08) 55%, transparent 57%, rgba(255,255,255,0.06) 70%, transparent 72%)'
                  }}
                />

                {/* Anisotropic Light Sheen Fan */}
                <div 
                  className="absolute inset-0 rounded-full pointer-events-none opacity-40 mix-blend-screen"
                  style={{
                    background: 'conic-gradient(from 45deg, transparent 0deg, rgba(255,255,255,0.2) 40deg, transparent 75deg, transparent 180deg, rgba(255,255,255,0.2) 220deg, transparent 255deg)'
                  }}
                />

                {/* Center Record Label */}
                <div 
                  className="w-20 sm:w-24 h-20 sm:h-24 rounded-full flex flex-col items-center justify-center text-center p-1 shadow-lg relative border-2 border-black z-10"
                  style={{ backgroundColor: activeRecord.labelColor }}
                >
                  <span className="text-[7px] font-mono uppercase font-bold text-black/80 tracking-widest">
                    33⅓ RPM
                  </span>
                  <span className="text-[8.5px] font-bold text-white leading-tight px-1 truncate max-w-full drop-shadow">
                    {activeRecord.title.split(' ')[0]}
                  </span>
                  <span className="text-[6.5px] text-white/90 truncate max-w-full">
                    {activeRecord.artist.split(' ')[0]}
                  </span>

                  {/* Brass Center Spindle Cavity */}
                  <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#ffffff] via-[#cbd5e1] to-[#64748b] border border-black flex items-center justify-center mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-black" />
                  </div>
                </div>

              </motion.div>

            </div>

            {/* Tonearm Assembly */}
            <motion.div
              animate={{ rotate: isPlaying ? 24 : 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 120 }}
              className="absolute top-2 right-4 w-12 h-44 origin-top pointer-events-none z-20 flex flex-col items-center"
            >
              {/* Tonearm Pivot Bearing */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ffffff] via-[#94a3b8] to-[#334155] border border-black shadow-lg flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[#1e293b] border border-white/40" />
              </div>
              {/* Aluminum Tonearm Wand */}
              <div className="w-1 flex-1 bg-gradient-to-b from-[#ffffff] to-[#94a3b8] shadow-md -mt-1" />
              {/* Headshell & Cartridge Needle */}
              <div className="w-4 h-6 rounded-b bg-[#1e293b] border border-white/30 flex items-center justify-center shadow-lg">
                <span className="w-1 h-2 bg-[#ff5e1a] rounded-full" />
              </div>
            </motion.div>

          </div>

          {/* Bottom Tactile Hardware Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 z-10">
            {/* Play/Stop Power Switch */}
            <button
              onClick={handleTogglePlay}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 shadow-lg transition-all ${
                isPlaying 
                  ? 'bg-[#ff5e1a] text-white shadow-[#ff5e1a]/30' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'PAUSE' : 'START MOTOR'}</span>
            </button>

            {/* Speed Toggle */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10">
              {['33', '45'].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setRpm(speed)}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-colors ${
                    rpm === speed ? 'bg-[#ff5e1a] text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* ==============================================================
            2. THE RECORD CRATE (FLIP THROUGH ALBUMS)
            ============================================================== */}
        <div className="w-full max-w-[340px] flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span className="text-[#ff5e1a] font-bold">STUDIO VINYL CRATE</span>
            <span>3 RECORDS READY</span>
          </div>

          <div className="space-y-2.5">
            {records.map((rec) => {
              const isSelected = activeRecord.id === rec.id;

              return (
                <motion.div
                  key={rec.id}
                  whileHover={{ x: 6 }}
                  onClick={() => handleSelectRecord(rec)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                    isSelected 
                      ? 'bg-white/10 border-[#ff5e1a] shadow-lg shadow-[#ff5e1a]/15 text-white' 
                      : 'bg-black/40 border-white/10 text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {/* Miniature 12" Vinyl Sleeve Cover */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${rec.coverGradient} shadow-md flex items-center justify-center shrink-0 border border-white/20 relative overflow-hidden`}>
                    <Disc3 className="w-7 h-7 text-white/90" />
                    {isSelected && (
                      <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-white shadow-sm" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#ff5e1a] font-bold">
                        {rec.tag}
                      </span>
                      <span className="font-mono text-[9px] text-gray-400">{rec.rpm}</span>
                    </div>
                    <div className="font-bold text-xs sm:text-sm text-white truncate">
                      {rec.title}
                    </div>
                    <div className="text-[11px] text-gray-400 truncate">
                      {rec.artist}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Current track now playing card */}
          <div className="p-3 rounded-xl bg-[#ff5e1a]/10 border border-[#ff5e1a]/30 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="w-3.5 h-3.5 text-[#ff5e1a]" />
              <span className="font-mono text-[10px] text-white">
                {isPlaying ? `Spinning: ${activeRecord.title}` : 'Turntable in standby'}
              </span>
            </div>
            {isPlaying && (
              <span className="font-mono text-[9px] text-emerald-400 uppercase font-bold animate-pulse">
                ON AIR
              </span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
