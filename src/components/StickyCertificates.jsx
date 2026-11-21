import React, { useState, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { CERTIFICATES_DATA } from '../constants/credentialsData';

const slideTransition = { duration: 0.72, ease: [0.42, 0, 0.32, 1] };
const returnTransition = { duration: 0.82, ease: [0.42, 0, 0.24, 1] };
const stackTransition = { duration: 0.62, ease: [0.3, 0, 0.28, 1] };
const expandPreview = { duration: 0.72, ease: [0.35, 0, 0.22, 1] };
const collapsePreview = { duration: 0.48, ease: [0.4, 0, 0.25, 1] };

/**
 * StickyCertificates / CertificateCardDeck Component
 * A tactile deck of horizontal cards stacked above each other:
 * - Cards are displaced vertically to reveal below cards' top edges
 * - Floating prompt above the deck in right corner invites user to shuffle
 * - Cards and certificate previews are larger for maximum legibility
 * - Clicking on top card slides it smoothly down at 100% solid opacity and cycles it to the back
 * - Dedicated 'View' button opens a silky-smooth, hardware-accelerated detail pop-up modal
 */
export const StickyCertificates = () => {
  const { isDark } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const deckId = useId();
  const [preview, setPreview] = useState(null);
  const selectedCert = preview?.certificate;
  const previewTrigger = preview?.trigger;

  // Deck order: array of indices into CERTIFICATES_DATA [0, 1, 2]
  const [deck, setDeck] = useState([0, 1, 2]);
  const [shuffle, setShuffle] = useState(null);

  useEffect(() => {
    if (!selectedCert) return;

    const app = document.getElementById('root');
    const previousInert = app?.inert ?? false;
    const previousOverflow = document.body.style.overflow;
    if (app) app.inert = true;
    document.body.style.overflow = 'hidden';

    return () => {
      if (app) app.inert = previousInert;
      document.body.style.overflow = previousOverflow;
      previewTrigger?.focus({ preventScroll: true });
    };
  }, [selectedCert, previewTrigger]);

  const closePreview = () => {
    setPreview((current) => {
      if (!current || current.closing) return current;
      return { ...current, closing: true };
    });
  };

  const cycleDeck = () => {
    setDeck(([front, ...rest]) => [...rest, front]);
  };

  const handleCycle = (event) => {
    if (shuffle) return;
    if (prefersReducedMotion) {
      cycleDeck();
      return;
    }

    setShuffle({ phase: 'slidingOut', distance: event.currentTarget.offsetHeight + 24 });
  };

  const returnCardToBack = () => {
    cycleDeck();
    setShuffle({ phase: 'returning' });
  };

  return (
    <div className="w-full flex flex-col items-center relative select-none pt-8 sm:pt-10">
      
      {/* FLOATING ACTION PROMPT (ABOVE DECK, RIGHT CORNER - Elevated z-index & styled matching name bulb / prompt cues) */}
      <div className="w-full max-w-[600px] flex justify-end items-center mb-6 sm:mb-7 px-2 pointer-events-none relative z-40">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`relative px-3.5 py-1.5 rounded-lg shadow-xl border backdrop-blur-md flex items-center gap-1.5 font-sans font-bold text-xs tracking-tight select-none transition-colors duration-300 ${
            isDark 
              ? 'bg-[#0a0a0a]/95 text-[#ff5e1a] border-[#ff5e1a]/40 shadow-black/80' 
              : 'bg-white/95 text-[#ff5e1a] border-[#ff5e1a]/30 shadow-black/10'
          }`}
        >
          {/* Triangular Outward Pointed Beak pointing downward towards the deck */}
          <div 
            className={`absolute -bottom-[5px] right-6 w-2.5 h-2.5 rotate-45 border-r border-b transition-colors duration-300 ${
              isDark 
                ? 'bg-[#0a0a0a] border-[#ff5e1a]/40' 
                : 'bg-white border-[#ff5e1a]/30'
            }`} 
          />

          <span className="relative z-10 leading-none">Click card to shuffle deck</span>
        </motion.div>
      </div>

      {/* THE STACKED HORIZONTAL CARDS ARENA (Enlarged with vertical card cascade) */}
      <div className="relative w-full max-w-[600px] h-[390px] sm:h-[285px]">
        {deck.map((certIdx, stackIndex) => {
          const cert = CERTIFICATES_DATA[certIdx];
          const isTop = stackIndex === 0;
          const isSlidingOut = shuffle?.phase === 'slidingOut';
          const isLeavingFront = isTop && isSlidingOut;
          const isReturning = stackIndex === deck.length - 1 && shuffle?.phase === 'returning';
          const depth = isSlidingOut && !isTop ? stackIndex - 1 : stackIndex;
          const canShuffle = isTop && !shuffle && !selectedCert;
          const transition = isLeavingFront ? slideTransition : isReturning ? returnTransition : stackTransition;
          const cardLayoutId = prefersReducedMotion ? undefined : `${deckId}-card-${cert.id}`;
          const imageLayoutId = prefersReducedMotion ? undefined : `${deckId}-image-${cert.id}`;

          return (
            <motion.div
              key={cert.id}
              layoutId={cardLayoutId}
              onClick={canShuffle ? handleCycle : undefined}
              initial={false}
              animate={{
                y: isLeavingFront ? shuffle.distance : -16 * depth,
                scale: isLeavingFront ? 0.97 : 1 - 0.02 * depth,
                rotate: isLeavingFront ? -3 : 0,
              }}
              transition={prefersReducedMotion ? { duration: 0 } : { ...transition, layout: collapsePreview }}
              onAnimationComplete={isLeavingFront ? returnCardToBack : isReturning ? () => setShuffle(null) : undefined}
              style={{
                zIndex: 30 - 10 * stackIndex,
                borderRadius: 16,
                pointerEvents: canShuffle ? 'auto' : 'none',
                willChange: 'transform'
              }}
              className={`absolute inset-0 w-full p-4 sm:p-5 border transition-shadow duration-300 select-none overflow-hidden bg-[#F8F8F5] text-neutral-900 ${
                isDark 
                  ? 'border-black/15 border-t-black/20 shadow-[0_20px_50px_rgba(0,0,0,0.7)]' 
                  : 'border-black/10 border-t-black/15 shadow-[0_16px_40px_rgba(0,0,0,0.12)]'
              } ${isTop ? 'cursor-pointer hover:shadow-2xl' : ''}`}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4 sm:gap-5 h-full w-full">
                
                {/* LEFT: ENLARGED CERTIFICATE DISPLAY (Full document width, uncropped, clean preview without company badge) */}
                <motion.div
                  layoutId={imageLayoutId}
                  transition={{ layout: collapsePreview }}
                  style={{ borderRadius: 12 }}
                  className="w-full sm:w-[53%] h-[185px] sm:h-full overflow-hidden bg-white border border-black/10 shrink-0 relative flex items-center justify-center p-2 shadow-inner"
                >
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-full object-contain object-center select-none pointer-events-none rounded-lg"
                    loading="lazy"
                  />
                </motion.div>

                {/* RIGHT: BRIEF DETAIL & VIEW BUTTON */}
                <div className="w-full sm:w-[47%] flex flex-col justify-between text-left h-full pl-0 sm:pl-1 py-0.5">
                  <div className="flex flex-col">
                    {/* Title */}
                    <h4 className="text-sm sm:text-base font-bold tracking-tight text-neutral-900 leading-snug line-clamp-2 mb-1.5">
                      {cert.title}
                    </h4>

                    {/* Brief Summary */}
                    <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed mb-2 font-normal">
                      {cert.summary}
                    </p>

                    {/* Orange Category Badge moved below description */}
                    <span className="text-[10px] sm:text-[10.5px] font-mono uppercase tracking-wider text-[#ff5e1a] font-bold">
                      {cert.badgeText}
                    </span>
                  </div>

                  {/* Card Bottom Row: Year of Issuing (Left) & 'View' Button (Right) */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-black/[0.08] mt-auto w-full">
                    <span className="text-[11px] font-mono font-medium text-neutral-500">
                      {cert.date}
                    </span>

                    <button
                      type="button"
                      tabIndex={canShuffle ? 0 : -1}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (canShuffle) setPreview({ certificate: cert, trigger: e.currentTarget, closing: false });
                      }}
                      className="px-4 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-[#ff5e1a] text-white hover:bg-[#e0480a] transition-all flex items-center gap-1.5 shadow-sm hover:scale-[1.03] active:scale-[0.97] cursor-pointer shrink-0"
                      title="View full certificate details"
                    >
                      <span>View</span>
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

      {createPortal(
        <AnimatePresence onExitComplete={() => setPreview(null)}>
          {selectedCert && !preview.closing && (
            <div
              key={selectedCert.id}
              data-lenis-prevent
              onKeyDown={(event) => {
                if (event.key === 'Escape') closePreview();
              }}
              className="fixed inset-0 z-[11000] flex items-center justify-center p-4 sm:p-6 md:p-8 select-none font-sans"
            >
              {/* Smooth Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.34, ease: 'easeOut' }}
                onClick={closePreview}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
              />

              <motion.div
                layoutId={prefersReducedMotion ? undefined : `${deckId}-card-${selectedCert.id}`}
                transition={{ layout: expandPreview }}
                style={{ borderRadius: 24 }}
                role="dialog"
                aria-modal="true"
                aria-labelledby={`${deckId}-title`}
                className={`relative max-w-4xl lg:max-w-5xl w-full max-h-full overflow-y-auto overscroll-contain p-5 sm:p-7 shadow-2xl z-10 border ${
                  isDark
                    ? 'bg-[#111114] text-white border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.9)]'
                    : 'bg-white text-neutral-900 border-black/15 shadow-2xl'
                }`}
              >
                {/* Close Button */}
                <button
                  type="button"
                  autoFocus
                  onClick={closePreview}
                  aria-label="Close certificate preview"
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/10 dark:bg-white/10 hover:bg-[#ff5e1a] hover:text-white transition-colors z-20 cursor-pointer"
                >
                  <span className="px-2 text-xs font-semibold">Close</span>
                </button>

                {/* HORIZONTAL SPLIT STAGE: Left Image | Right Details */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">

                  {/* LEFT SIDE: Certificate Document Preview */}
                  <div className="md:col-span-7 w-full flex items-center justify-center">
                    <motion.div
                      layoutId={prefersReducedMotion ? undefined : `${deckId}-image-${selectedCert.id}`}
                      transition={{ layout: expandPreview }}
                      style={{ borderRadius: 16 }}
                      className="relative w-full overflow-hidden border border-black/15 dark:border-white/15 shadow-xl bg-black/40 flex items-center justify-center p-1.5 sm:p-2"
                    >
                      <img
                        src={selectedCert.image}
                        alt={selectedCert.title}
                        className="w-full h-auto max-h-[340px] sm:max-h-[380px] lg:max-h-[420px] object-contain rounded-xl mx-auto"
                      />
                    </motion.div>
                  </div>

                  {/* RIGHT SIDE: Concise Metadata & Verification Details */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: prefersReducedMotion ? 0 : 0.36, delay: prefersReducedMotion ? 0 : 0.2 } }}
                    exit={{ opacity: 0, transition: { duration: prefersReducedMotion ? 0 : 0.16 } }}
                    className="md:col-span-5 w-full flex flex-col justify-center space-y-4"
                  >

                    {/* Issuer & Date */}
                    <div className="font-mono text-xs text-gray-400">
                      {selectedCert.issuer} · {selectedCert.date}
                    </div>

                    {/* Title */}
                    <h3 id={`${deckId}-title`} className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
                      {selectedCert.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                      {selectedCert.summary}
                    </p>

                    {/* Validated Skills */}
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCert.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Credential ID & Action Button */}
                    <div className="pt-3 border-t border-black/10 dark:border-white/10 flex flex-col gap-3">
                      <div className="font-mono text-[11px] text-gray-400 truncate">
                        ID: <span className="font-bold text-gray-600 dark:text-gray-200">{selectedCert.credentialId}</span>
                      </div>

                      <a
                        href={selectedCert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-[#ff5e1a] text-white hover:bg-[#e0480a] transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span>Verify with {selectedCert.issuerShort}</span>
                      </a>
                    </div>
                  </motion.div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default StickyCertificates;
