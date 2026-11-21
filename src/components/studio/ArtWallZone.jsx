import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function ArtWallZone({ onCloseZone }) {
  const { isDark } = useTheme();
  const [selectedArt, setSelectedArt] = useState(null);

  const artworks = [
    {
      id: 'sketchbook-hero',
      title: 'Studio Sketchbook · Volume 03',
      subtitle: 'Original Ink & Graphite Explorations',
      image: '/images/moodboard/sketchbook.jpg',
      aspect: 'aspect-[4/3]',
      tag: 'HERO SKETCHBOOK',
      medium: 'Graphite 2B, Sakura Pigma Micron 0.3, Copic Warm Grey',
      date: 'Fall 2026',
      notes: 'Hand-drawn ideation spreads exploring spatial perspective, mechanical hinge damping and physical affordances before writing a single line of React code.',
      colSpan: 'sm:col-span-2'
    },
    {
      id: 'sports-court',
      title: 'Spatial Kinetics & Court Dynamics',
      subtitle: 'Volleyball & Basketball Flow Study',
      image: '/images/moodboard/sports_court.jpg',
      aspect: 'aspect-[3/4]',
      tag: 'KINETIC STUDY',
      medium: 'Photography & Digital Overlay',
      date: 'Summer 2026',
      notes: 'Observing the parabolic arcs of basketball shots and volleyball spikes. Movement in interface design follows the exact same momentum and friction curves.',
      colSpan: 'sm:col-span-1'
    },
    {
      id: 'travel-explore',
      title: 'Architectural Shadows & City Textures',
      subtitle: 'Urban Horizon Light Study',
      image: '/images/moodboard/travel_explore.jpg',
      aspect: 'aspect-[3/4]',
      tag: 'COLOR PALETTE',
      medium: '35mm Film Grain Study',
      date: 'Spring 2026',
      notes: 'Natural daylight casting stark diagonal geometric shadows across concrete and glass facades. Informs the high-contrast lighting of daylight mode.',
      colSpan: 'sm:col-span-1'
    }
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden select-none">
      
      {/* Header Info */}
      <div className="text-center mb-4 sm:mb-6 z-10">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ff5e1a]">
            ANALOG PIN-BOARD &amp; ARTWORK GALLERY
          </span>
        </div>
        <p className="text-gray-400 text-xs sm:text-sm">
          Physical sketches, notebook pages and visual references. Click any piece to inspect.
        </p>
      </div>

      {/* ==============================================================
          PHYSICAL PIN-BOARD CORKBOARD / GALLERY WALL
          ============================================================== */}
      <div className="relative w-full max-w-4xl rounded-3xl p-4 sm:p-6 bg-gradient-to-br from-[#20222a] via-[#16171f] to-[#0c0d12] border-2 sm:border-[3px] border-[#383b48] shadow-[0_30px_70px_rgba(0,0,0,0.95)] flex flex-col justify-between overflow-hidden">
        
        {/* Gallery Pin-board Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6 z-10">
          {artworks.map((art) => (
            <motion.div
              key={art.id}
              whileHover={{ scale: 1.025, y: -4 }}
              onClick={() => setSelectedArt(art)}
              className={`relative rounded-2xl bg-[#0e0f14] border border-white/15 p-2 shadow-xl cursor-pointer group overflow-hidden ${art.colSpan}`}
            >
              {/* Brass Pushpin at Top */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#FFD700] via-[#D4AF37] to-[#8C6D1F] border border-black/80 shadow-md flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FFE57F]" />
                </div>
              </div>

              {/* Artwork Image Container */}
              <div className={`relative w-full ${art.aspect} rounded-xl overflow-hidden bg-black/60 mt-1`}>
                <img 
                  src={art.image} 
                  alt={art.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                />
                
                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white font-mono text-xs font-bold">
                  <span>INSPECT</span>
                </div>
              </div>

              {/* Art Caption */}
              <div className="pt-2 px-1 flex flex-col">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-mono text-[8px] uppercase tracking-wider text-[#ff5e1a] font-bold">
                    {art.tag}
                  </span>
                  <span className="font-mono text-[8px] text-gray-400">{art.date}</span>
                </div>
                <div className="font-bold text-xs text-white truncate">
                  {art.title}
                </div>
                <div className="text-[10px] text-gray-400 truncate">
                  {art.subtitle}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Studio Pin-board Footer Note */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-gray-400">
          <span className="text-[#ff5e1a] font-bold">KHUSHANG ART ARCHIVE</span>
          <span>Authentic sketchbook prints &middot; No generated placeholders</span>
        </div>

      </div>

      {/* ==============================================================
          HIGH-DEFINITION LIGHTBOX MODAL
          ============================================================== */}
      <AnimatePresence>
        {selectedArt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArt(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 16, opacity: 0 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-br from-[#1c1d27] to-[#0e0f14] border-2 border-white/20 p-5 sm:p-7 shadow-2xl text-white flex flex-col gap-4 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedArt(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors z-20"
                title="Close Lightbox"
              >
                <span className="px-1 text-xs font-semibold">Close</span>
              </button>

              {/* Modal Artwork Preview */}
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-black/60 border border-white/10">
                <img 
                  src={selectedArt.image} 
                  alt={selectedArt.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Artwork Metadata Details */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#ff5e1a]/20 text-[#ff5e1a] font-mono text-[10px] font-bold uppercase tracking-wider">
                    {selectedArt.tag}
                  </span>
                  <span className="font-mono text-xs text-gray-400">
                    {selectedArt.date}
                  </span>
                </div>

                <h3 className="font-bold text-lg sm:text-xl text-white">
                  {selectedArt.title}
                </h3>

                <div className="text-xs text-gray-300 font-mono">
                  <strong className="text-white">Medium:</strong> {selectedArt.medium}
                </div>

                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mt-1">
                  {selectedArt.notes}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">Khushang Singh Studio</span>
                <button
                  onClick={() => setSelectedArt(null)}
                  className="px-4 py-1.5 rounded-lg bg-[#ff5e1a] text-white font-bold hover:brightness-110"
                >
                  Close Inspection
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
