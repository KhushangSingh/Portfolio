import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function BookshelfZone({ onCloseZone }) {
  const { isDark } = useTheme();
  const [selectedBook, setSelectedBook] = useState(null);
  const [hoveredBookId, setHoveredBookId] = useState(null);

  // Day Books: Design & Engineering
  const dayBooks = [
    {
      id: 'ddia',
      title: 'Designing Data-Intensive Apps',
      spineTitle: 'DATA-INTENSIVE APPLICATIONS',
      author: 'Martin Kleppmann',
      spineColor: '#1E293B',
      accentColor: '#38BDF8',
      height: 220,
      width: 48,
      pages: 616,
      category: 'System Architecture',
      quote: "Reliability is continuing to work correctly even when things go wrong.",
      takeaway: "The bible of distributed systems. Taught me why consistency guarantees and event-driven architectures are the bedrock of high-scale apps.",
      year: 'O\'Reilly Media'
    },
    {
      id: 'refactoring-ui',
      title: 'Refactoring UI',
      spineTitle: 'REFACTORING UI',
      author: 'Adam Wathan & Steve Schoger',
      spineColor: '#0F172A',
      accentColor: '#38BDF8',
      height: 200,
      width: 42,
      pages: 250,
      category: 'Interface Craft',
      quote: "Start with too much white space, then remove it until it looks right.",
      takeaway: "The definitive practical guide to visual hierarchy. Don't design with decoration; design with depth, contrast and spacing rhythm.",
      year: 'Independent'
    },
    {
      id: 'everyday-things',
      title: 'The Design of Everyday Things',
      spineTitle: 'DESIGN OF EVERYDAY THINGS',
      author: 'Don Norman',
      spineColor: '#831843',
      accentColor: '#F472B6',
      height: 195,
      width: 38,
      pages: 368,
      category: 'Cognitive UX',
      quote: "Good design is actually a lot harder to notice than poor design, in part because good designs fit our needs so well.",
      takeaway: "Affordances and signifiers over cleverness. If an interactive element needs a paragraph of instruction to use, the interface failed.",
      year: 'Basic Books'
    },
    {
      id: 'clean-code',
      title: 'Clean Code',
      spineTitle: 'CLEAN CODE',
      author: 'Robert C. Martin',
      spineColor: '#14532D',
      accentColor: '#4ADE80',
      height: 210,
      width: 44,
      pages: 464,
      category: 'Software Engineering',
      quote: "Clean code always looks like it was written by someone who cares.",
      takeaway: "The Boy Scout Rule: Always check code in cleaner than you checked it out. High cohesion, single responsibility, meaningful naming.",
      year: 'Prentice Hall'
    },
    {
      id: 'grid-systems',
      title: 'Grid Systems in Graphic Design',
      spineTitle: 'GRID SYSTEMS',
      author: 'Josef Müller-Brockmann',
      spineColor: '#7C2D12',
      accentColor: '#FB923C',
      height: 230,
      width: 50,
      pages: 176,
      category: 'Swiss Typography',
      quote: "The grid system is an aid, not a guarantee. It permits a number of possible uses and each designer can look for a solution appropriate to his personal style.",
      takeaway: "The Swiss typographic foundation that governs modern modular layout, golden ratios and responsive web typography.",
      year: 'Niggli'
    },
    {
      id: 'sicp',
      title: 'Structure & Interpretation of Computer Programs',
      spineTitle: 'SICP',
      author: 'Abelson & Sussman',
      spineColor: '#312E81',
      accentColor: '#818CF8',
      height: 215,
      width: 46,
      pages: 657,
      category: 'Computer Science',
      quote: "Programs must be written for people to read and only incidentally for machines to execute.",
      takeaway: "Metalinguistic abstraction, closures and the recursive purity of functional computation. Foundational mental models.",
      year: 'MIT Press'
    }
  ];

  // Night Books: Sci-Fi, Manga, Philosophy
  const nightBooks = [
    {
      id: 'neuromancer',
      title: 'Neuromancer',
      spineTitle: 'NEUROMANCER',
      author: 'William Gibson',
      spineColor: '#052E16',
      accentColor: '#22C55E',
      height: 195,
      width: 36,
      pages: 271,
      category: 'Cyberpunk Sci-Fi',
      quote: "The sky above the port was the color of television, tuned to a dead channel.",
      takeaway: "Coined 'cyberspace' and the matrix. The dark obsidian, neon-lit aesthetics of night mode trace back to Gibson's Chiba City.",
      year: 'Ace Books'
    },
    {
      id: 'berserk',
      title: 'Berserk: Deluxe Edition Vol. 1',
      spineTitle: 'BERSERK // DELUXE 01',
      author: 'Kentaro Miura',
      spineColor: '#0F0F12',
      accentColor: '#EF4444',
      height: 235,
      width: 56,
      pages: 700,
      category: 'Dark Fantasy Manga',
      quote: "You have the strongest armor, because you are the one who knows pain.",
      takeaway: "Mastery of ink cross-hatching, anatomy and unwavering human resilience. Miura's page layouts are a masterclass in dynamic motion.",
      year: 'Dark Horse'
    },
    {
      id: 'evangelion',
      title: 'Evangelion: Der Mond',
      spineTitle: 'DER MOND // SADAMOTO',
      author: 'Yoshiyuki Sadamoto',
      spineColor: '#172554',
      accentColor: '#60A5FA',
      height: 225,
      width: 48,
      pages: 180,
      category: 'Mecha & Concept Art',
      quote: "Art is not imitation, but a direct reflection of psychological interiority.",
      takeaway: "Sadamoto's atmospheric watercolor washes and stark silhouettes heavily influence my mood boards and spatial lighting.",
      year: 'Kadokawa'
    },
    {
      id: 'akira',
      title: 'Akira: Master Edition Vol. 1',
      spineTitle: 'AKIRA // OTOMO',
      author: 'Katsuhiro Otomo',
      spineColor: '#7F1D1D',
      accentColor: '#F87171',
      height: 230,
      width: 52,
      pages: 360,
      category: 'Neo-Tokyo Cyberpunk',
      quote: "The city was destroyed, but out of the rubble we built our own future.",
      takeaway: "Unrivaled urban isometric scale, cinematic pan speeds and red pill motorcycle kinetics that redefined modern animation.",
      year: 'Kodansha'
    },
    {
      id: 'meditations',
      title: 'Meditations',
      spineTitle: 'MEDITATIONS',
      author: 'Marcus Aurelius',
      spineColor: '#451A03',
      accentColor: '#FBBF24',
      height: 185,
      width: 34,
      pages: 256,
      category: 'Stoic Philosophy',
      quote: "You have power over your mind - not outside events. Realize this and you will find strength.",
      takeaway: "Keep code and life simple. Focus ruthlessly on what is within direct control and let external noise dissolve.",
      year: 'Penguin Classics'
    },
    {
      id: 'gits',
      title: 'The Ghost in the Shell',
      spineTitle: 'GHOST IN THE SHELL',
      author: 'Masamune Shirow',
      spineColor: '#1E1B4B',
      accentColor: '#A78BFA',
      height: 220,
      width: 46,
      pages: 368,
      category: 'Cybernetic Philosophy',
      quote: "Man is an individual only because of his intangible memory.",
      takeaway: "Exploration of mind-machine interfaces, augmented memory and what makes code feel sentient. Pure inspiration.",
      year: 'Kodansha'
    }
  ];

  const currentBooks = isDark ? nightBooks : dayBooks;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden select-none">
      
      {/* Header Info */}
      <div className="text-center mb-6 sm:mb-8 z-10">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ff5e1a]">
            {isDark ? 'NIGHTTIME PHILOSOPHY & MANGA' : 'DAYTIME ENGINEERING & DESIGN'}
          </span>
        </div>
        <p className="text-gray-400 text-xs sm:text-sm">
          A physical single-line shelf of books that shaped my worldview and engineering craft. Click any spine to pull it out.
        </p>
      </div>

      {/* ==============================================================
          PHYSICAL ARCHITECTURAL FLOATING SHELF
          ============================================================== */}
      <div className="relative w-full max-w-4xl flex flex-col items-center justify-end pb-8">
        
        {/* Books Row */}
        <div 
          className="flex items-end justify-center gap-2 sm:gap-4 px-4 sm:px-8 z-10"
          style={{ perspective: 1000 }}
        >
          {currentBooks.map((book) => {
            const isHovered = hoveredBookId === book.id;

            return (
              <motion.div
                key={book.id}
                onMouseEnter={() => setHoveredBookId(book.id)}
                onMouseLeave={() => setHoveredBookId(null)}
                onClick={() => setSelectedBook(book)}
                animate={{
                  y: isHovered ? -16 : 0,
                  rotateX: isHovered ? -12 : 0,
                  scale: isHovered ? 1.05 : 1,
                  z: isHovered ? 25 : 0,
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 260 }}
                className="relative cursor-pointer rounded-t-md shadow-2xl flex flex-col justify-between p-2 will-change-transform"
                style={{
                  height: book.height,
                  width: book.width + 8,
                  backgroundColor: book.spineColor,
                  borderLeft: `2px solid ${book.accentColor}80`,
                  borderRight: '1px solid rgba(0,0,0,0.6)',
                  borderTop: `1px solid ${book.accentColor}`,
                  boxShadow: isHovered 
                    ? `0 20px 30px rgba(0,0,0,0.9), 0 0 15px ${book.accentColor}50` 
                    : '0 10px 20px rgba(0,0,0,0.7)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Book Spine Texture Lines */}
                <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:6px_6px]" />
                
                {/* Top Spine Ribbon / Accent */}
                <div className="w-full flex items-center justify-center pt-1">
                  <span className="w-2.5 h-1 rounded-full" style={{ backgroundColor: book.accentColor }} />
                </div>

                {/* Vertical Spine Title */}
                <div className="flex-1 flex items-center justify-center py-2 overflow-hidden">
                  <span 
                    className="font-mono text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase [writing-mode:vertical-rl] rotate-180 truncate"
                    style={{ color: '#F4F4EE' }}
                  >
                    {book.spineTitle}
                  </span>
                </div>

                {/* Author Name at Bottom */}
                <div className="w-full text-center pb-1">
                  <span className="font-mono text-[7px] text-gray-400 block truncate uppercase">
                    {book.author.split(' ')[0]}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Shelf Plinth Base */}
        <div className="relative w-full h-5 rounded-md bg-gradient-to-r from-[#2c2d38] via-[#434658] to-[#2c2d38] border-t-2 border-[#ff5e1a] shadow-[0_15px_35px_rgba(0,0,0,0.9)] flex items-center justify-between px-6 z-20">
          <span className="w-3 h-1.5 rounded-sm bg-white/20" />
          <span className="font-mono text-[8px] uppercase tracking-widest text-[#ff5e1a]/80">
            SOLID OAK &amp; BRUSHED ANODIZED ALUMINUM SHELF
          </span>
          <span className="w-3 h-1.5 rounded-sm bg-white/20" />
        </div>

        {/* Soft Shelf Cast Shadow below */}
        <div className="w-[90%] h-6 bg-black/60 filter blur-xl -mt-1 pointer-events-none" />

      </div>

      {/* ==============================================================
          PULL-OUT 3D BOOK INSPECTION MODAL
          ============================================================== */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBook(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.88, y: 24, rotateY: -15 }}
              animate={{ scale: 1, y: 0, rotateY: 0 }}
              exit={{ scale: 0.9, y: 16, opacity: 0 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl rounded-2xl bg-gradient-to-br from-[#1b1c26] to-[#0f1016] border-2 border-white/20 p-6 sm:p-8 shadow-2xl text-white flex flex-col gap-5 overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div 
                className="absolute top-0 inset-x-0 h-1.5"
                style={{ backgroundColor: selectedBook.accentColor }}
              />

              {/* Close Button */}
              <button 
                onClick={() => setSelectedBook(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
                title="Put back on shelf"
              >
                <span className="px-1 text-xs font-semibold">Close</span>
              </button>

              {/* Book Header */}
              <div className="flex items-start gap-4 pr-8">
                <div 
                  className="w-14 h-20 rounded-md shadow-xl flex items-center justify-center text-center p-2 shrink-0 border border-white/20"
                  style={{ backgroundColor: selectedBook.spineColor }}
                >
                  <span className="px-1 text-center text-[9px] font-semibold leading-tight" style={{ color: selectedBook.accentColor }}>{selectedBook.title}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${selectedBook.accentColor}25`, color: selectedBook.accentColor }}
                    >
                      {selectedBook.category}
                    </span>
                    <span className="text-gray-400 font-mono text-[10px]">
                      {selectedBook.pages} pages · {selectedBook.year}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl text-white leading-tight">
                    {selectedBook.title}
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm mt-0.5">
                    By {selectedBook.author}
                  </p>
                </div>
              </div>

              {/* Core Quote */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 italic text-xs sm:text-sm text-gray-200 border-l-4" style={{ borderLeftColor: selectedBook.accentColor }}>
                "{selectedBook.quote}"
              </div>

              {/* Khushang's Personal Takeaway */}
              <div>
                <div className="font-mono text-[10px] text-[#ff5e1a] uppercase font-bold tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span>Khushang's Reader Notes</span>
                </div>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  {selectedBook.takeaway}
                </p>
              </div>

              {/* Modal Footer Action */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="font-mono text-[10px] text-gray-400">
                  Physical Hardcover in Studio Shelf
                </span>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="px-4 py-2 rounded-xl bg-[#ff5e1a] text-white font-mono text-xs font-bold hover:brightness-110 flex items-center gap-2"
                >
                  <span>Return to Shelf</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
