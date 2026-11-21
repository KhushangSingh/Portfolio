import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { GymBadgeCase } from './GymBadgeCase';
import { StickyCertificates } from './StickyCertificates';

export const CredentialsSection = () => {
  const { isDark } = useTheme();

  return (
    <section
      id="credentials-and-stack"
      className={`relative w-full py-24 sm:py-32 px-6 md:px-12 border-t transition-colors duration-500 overflow-hidden ${
        isDark ? 'bg-[#060608] text-white border-white/5' : 'bg-[#f4f4ef] text-neutral-900 border-black/5'
      }`}
    >
      <div className="max-w-[1400px] w-full mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between pb-4 mb-10 will-change-[transform,opacity,filter]"
        >
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#ff5e1a] font-bold block mb-2">
              Hard Skills · Tool Stack · Verified Learning
            </span>
            <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-[0.95]">
              Arsenal & Credentials
            </h3>
          </div>

          <p className="font-mono text-xs text-gray-500 max-w-sm mt-4 md:mt-0 text-left md:text-right">
            // PHYSICAL GYM BADGE CASE WITH TACTILE ENAMEL PINS & INTERACTIVE CREDENTIAL DECK
          </p>
        </motion.div>

        {/* Split Stage: Left (Gym Badge Case) + Right (Horizontal Credential Deck) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* Left Column (60%): The Collector's Metal Badge Case */}
          <div className="lg:col-span-7 w-full flex flex-col">
            <div className="mb-4">
              <span className="font-mono text-xs uppercase font-bold text-gray-400 tracking-wider">
                [SECTION A] · THE COLLECTOR'S PIN CASE
              </span>
              <p className="text-xs text-gray-500 font-light mt-0.5">
                Hover any enameled badge to lift it from its velvet socket and inspect architectural competencies.
              </p>
            </div>
            <GymBadgeCase />
          </div>

          {/* Right Column (40%): The Interactive Horizontal Credential Deck */}
          <div className="lg:col-span-5 w-full flex flex-col">
            <div className="mb-4">
              <span className="font-mono text-xs uppercase font-bold text-gray-400 tracking-wider">
                [SECTION B] · VERIFIED CREDENTIAL STATION
              </span>
              <p className="text-xs text-gray-500 font-light mt-0.5">
                Archival post-it notes fastened with washi tape. Click any note to inspect full certification and verify.
              </p>
            </div>
            <StickyCertificates />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CredentialsSection;
