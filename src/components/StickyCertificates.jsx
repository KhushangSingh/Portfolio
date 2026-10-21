import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { CERTIFICATES_DATA } from '../constants/credentialsData';
import { ArrowUpRight, CheckCircle2, ExternalLink, X, ShieldCheck } from 'lucide-react';

/**
 * StickyCertificates Component
 * Tactile physical Post-it sticky notes matching user reference screenshot:
 * - Real pastel paper tones: Sunshine Yellow, Warm Peach/Coral, Sky Powder Blue
 * - Translucent frosted Scotch tape strip at top
 * - Real physical drag-and-drop physics (drag anywhere on stage)
 * - Click to open horizontal landscape credential verification modal
 */
export const StickyCertificates = () => {
  const { isDark } = useTheme();
  const [selectedCert, setSelectedCert] = useState(null);
  const containerRef = useRef(null);

  // Keyboard accessibility: Escape closes modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedCert(null);
    };
    if (selectedCert) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedCert]);

  return (
    <div 
      ref={containerRef} 
      className="w-full flex flex-col items-center relative select-none"
    >
      {/* REAL TACTILE STICKY POST-IT NOTES */}
      <div className="w-full max-w-[320px] sm:max-w-[340px] flex flex-col gap-6 sm:gap-8 relative pt-2 items-center mx-auto">
        {CERTIFICATES_DATA.map((cert, idx) => {
          const isYellow = idx === 0;
          const isPeach = idx === 1;
          const isBlue = idx === 2;

          return (
            <motion.div
              key={cert.id}
              drag
              dragConstraints={containerRef}
              dragElastic={0.15}
              whileDrag={{ 
                scale: 1.05, 
                rotate: 0, 
                zIndex: 50, 
                cursor: 'grabbing',
                boxShadow: '0 28px 56px -10px rgba(0,0,0,0.32), 0 12px 24px -6px rgba(0,0,0,0.18)'
              }}
              initial={{ opacity: 0, y: 25, rotate: cert.rotation }}
              whileInView={{ opacity: 1, y: 0, rotate: cert.rotation }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.03, 
                rotate: 0, 
                y: -4,
                zIndex: 40,
                transition: { type: 'spring', damping: 15, stiffness: 280 } 
              }}
              onClick={() => setSelectedCert(cert)}
              data-cursor="DRAG"
              className={`relative p-5 sm:p-6 rounded-[6px] cursor-grab active:cursor-grabbing transition-shadow duration-300 group select-none w-full max-w-[320px] sm:max-w-[340px] ${
                isYellow ? 'rotate-[2deg]' : isPeach ? 'rotate-[-1.8deg]' : 'rotate-[1.5deg]'
              }`}
              style={{
                backgroundColor: cert.noteColor,
                color: '#1C1917',
                boxShadow: '0 16px 32px -6px rgba(15, 23, 42, 0.16), 0 6px 14px -3px rgba(15, 23, 42, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.7)',
                transformOrigin: 'top center'
              }}
            >
              {/* REALISTIC FROSTED SCOTCH TAPE STRIP AT TOP CENTER */}
              <div 
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-6 rounded-[2px] bg-white/75 backdrop-blur-[2px] border-t border-b border-white/80 shadow-[0_1px_3px_rgba(0,0,0,0.12)] pointer-events-none z-20"
                style={{
                  transform: `translateX(-50%) rotate(${idx === 0 ? '-1deg' : idx === 1 ? '1deg' : '-0.5deg'})`
                }}
              />

              {/* Note Headline (Crisp 2-Line Conversational Copy - Zero Clutter) */}
              <div className="space-y-0.5">
                <h4 className="text-[17px] sm:text-[18px] font-semibold tracking-tight leading-[1.3] text-[#1C1917]">
                  {cert.line1}
                </h4>
                {cert.line2 && (
                  <h4 className="text-[17px] sm:text-[18px] font-semibold tracking-tight leading-[1.3] text-[#1C1917]">
                    {cert.line2}
                  </h4>
                )}
              </div>

              {/* Blue Note: Real Tactile Brand Logo Square Tiles */}
              {isBlue && (
                <div className="mt-3.5">
                  <div className="flex items-center gap-2.5">
                    {/* Google Tile */}
                    <div 
                      className="w-11 h-11 rounded-xl bg-white shadow-[0_3px_10px_rgba(0,0,0,0.12)] border border-black/5 flex items-center justify-center p-2 transition-transform hover:scale-105"
                      title="Google Certified"
                    >
                      <svg className="w-full h-full" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                    </div>

                    {/* Accenture Tile */}
                    <div 
                      className="w-11 h-11 rounded-xl bg-[#A100FF] shadow-[0_3px_10px_rgba(161,0,255,0.25)] flex items-center justify-center transition-transform hover:scale-105"
                      title="Accenture Product Design"
                    >
                      <span className="text-white font-black text-2xl tracking-tighter leading-none select-none pb-0.5">&gt;</span>
                    </div>

                    {/* freeCodeCamp Tile */}
                    <div 
                      className="w-11 h-11 rounded-xl bg-[#0A0A23] shadow-[0_3px_10px_rgba(10,10,35,0.3)] flex items-center justify-center text-lg transition-transform hover:scale-105"
                      title="freeCodeCamp Responsive Developer"
                    >
                      <span className="select-none">🔥</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ==============================================================
          3. HORIZONTAL CREDENTIAL INSPECTION MODAL (No Scrolling on Desktop)
          ============================================================== */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Horizontal Modal Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className={`relative max-w-4xl lg:max-w-5xl w-full rounded-3xl p-5 sm:p-7 shadow-2xl z-10 border ${
                isDark 
                  ? 'bg-[#111114] text-white border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.9)]' 
                  : 'bg-white text-neutral-900 border-black/15 shadow-2xl'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCert(null)}
                aria-label="Close credential preview"
                data-cursor="CLOSE"
                className="absolute top-4 right-4 p-2 rounded-full bg-black/10 dark:bg-white/10 hover:bg-[#ff5e1a] hover:text-white transition-colors z-20"
              >
                <X size={18} />
              </button>

              {/* HORIZONTAL SPLIT STAGE: Left Image | Right Details */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
                
                {/* LEFT SIDE: Certificate Document Preview */}
                <div className="md:col-span-7 w-full flex items-center justify-center">
                  <div className="relative w-full rounded-2xl overflow-hidden border border-black/15 dark:border-white/15 shadow-xl bg-black/40 flex items-center justify-center p-1.5 sm:p-2">
                    <img
                      src={selectedCert.image}
                      alt={selectedCert.title}
                      className="w-full h-auto max-h-[340px] sm:max-h-[380px] lg:max-h-[420px] object-contain rounded-xl mx-auto"
                    />
                  </div>
                </div>

                {/* RIGHT SIDE: Concise Metadata & Verification Details */}
                <div className="md:col-span-5 w-full flex flex-col justify-center space-y-4">
                  
                  {/* Verified Header Pill & Date */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-[#ff5e1a]/15 text-[#ff5e1a] border border-[#ff5e1a]/30 flex items-center gap-1.5">
                      <CheckCircle2 size={12} />
                      Verified
                    </span>
                    <span className="font-mono text-xs text-gray-400">
                      {selectedCert.issuer} · {selectedCert.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
                    {selectedCert.title}
                  </h3>

                  {/* Summary / Curriculum Scope */}
                  <div>
                    <h5 className="font-mono text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                      Curriculum & Scope
                    </h5>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                      {selectedCert.summary}
                    </p>
                  </div>

                  {/* Skills Validated */}
                  <div>
                    <h5 className="font-mono text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">
                      Validated Skills
                    </h5>
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
                      data-cursor="VERIFY"
                      className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-[#ff5e1a] text-white hover:bg-[#e0480a] transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>Verify with {selectedCert.issuerShort}</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StickyCertificates;
