import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Layers, X, ExternalLink, ArrowDownLeft, Copyright, ArrowUpRight } from 'lucide-react';
import { designData } from '../constants/data';
import { useTheme } from '../context/ThemeContext';
import ReelRingShowcase from './ReelRingShowcase';
import MoodBoardSection from './MoodBoardSection';
import StudioSection from './StudioSection';
import { GymBadgeCase } from './GymBadgeCase';
import { StickyCertificates } from './StickyCertificates';
import { ScrollWordReveal } from './ScrollWordReveal';
import LiquidPortraitReveal from './LiquidPortraitReveal';

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 35, opacity: 0, scale: 0.96, filter: 'blur(10px)' },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1, 
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { 
    y: -25, 
    opacity: 0, 
    scale: 0.96, 
    filter: 'blur(10px)', 
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } 
  }
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 300, damping: 30 } 
    },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15 } }
};

// --- CERTIFICATE MODAL ---
const CertModal = ({ cert, onClose }) => {
    const { isDark } = useTheme();
    if (!cert) return null;

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className={`absolute inset-0 ${isDark ? 'bg-black/90' : 'bg-black/60'} backdrop-blur-xl cursor-pointer`}
            />
            <motion.div 
                variants={modalVariants}
                initial="hidden" animate="visible" exit="exit"
                className={`w-full max-w-3xl rounded-2xl relative z-10 shadow-2xl overflow-hidden border flex flex-col max-h-[90vh] ${
                  isDark ? 'bg-[#0A0A0A] border-white/10 text-white' : 'bg-white border-black/10 text-neutral-900'
                }`}
            >
                <button 
                    onClick={onClose} 
                    className={`absolute top-4 right-4 z-30 p-2 rounded-full transition-colors border ${
                      isDark ? 'bg-black/50 hover:bg-white/10 text-white border-white/10' : 'bg-black/5 hover:bg-black/10 text-neutral-800 border-black/10'
                    }`}
                >
                    <X size={20} />
                </button>

                {cert.image && (
                    <div className={`p-1 ${isDark ? 'bg-white/5' : 'bg-neutral-100'}`}>
                        <img src={cert.image} alt={cert.title} className="w-full h-auto object-contain rounded-t-xl max-h-[50vh] bg-white" />
                    </div>
                )}

                <div className="p-8 overflow-y-auto">
                    {cert.issuer && <span className="text-[#ff4d00] text-xs font-bold uppercase tracking-widest mb-2 block">{cert.issuer}</span>}
                    {cert.title && <h3 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>{cert.title}</h3>}
                    {cert.desc && <p className={`mb-6 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{cert.desc}</p>}
                    
                    {cert.skills && cert.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {cert.skills.map(skill => (
                                <span key={skill} className={`px-3 py-1 border rounded-full text-xs ${
                                  isDark ? 'border-white/10 text-gray-300' : 'border-black/10 text-gray-700 bg-black/5'
                                }`}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className={`flex justify-between items-center border-t pt-6 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                        {cert.date && <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Issued: {cert.date}</span>}
                        {cert.credentialLink && (
                            <a href={cert.credentialLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#ff4d00] hover:underline font-bold text-sm uppercase tracking-wider">
                                Verify Credential <ExternalLink size={16} />
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// --- PROJECT DETAIL MODAL ---
const ProjectModal = ({ project, onClose }) => {
    const { isDark } = useTheme();
    if (!project) return null;
  
    useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = 'unset'; };
    }, []);
  
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className={`absolute inset-0 ${isDark ? 'bg-black/90' : 'bg-black/60'} backdrop-blur-xl cursor-pointer`}
        />
  
        <motion.div 
          variants={modalVariants}
          initial="hidden" animate="visible" exit="exit"
          className={`w-full h-full relative z-10 flex flex-col overflow-hidden ${
            isDark ? 'bg-[#0A0A0A]' : 'bg-[#FAFAFA]'
          }`}
        >
          <button 
            onClick={onClose} 
            className={`absolute top-6 right-6 z-30 p-2 rounded-full transition-colors border ${
              isDark ? 'bg-black/50 hover:bg-white/10 text-white border-white/10' : 'bg-white/80 hover:bg-white text-neutral-800 border-black/10 shadow-sm'
            }`}
          >
            <X size={20} />
          </button>
  
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
             {/* Full Width Gallery Section with Gap */}
             <div className={`pb-20 ${isDark ? 'bg-[#0A0A0A]' : 'bg-[#FAFAFA]'}`}>
                 {project.gallery && project.gallery.length > 0 ? (
                     <div className="w-full space-y-4">
                         {project.gallery.map((img, index) => (
                             <div key={index} className="w-full">
                                 <img 
                                     src={img} 
                                     alt={`${project.title} gallery ${index + 1}`} 
                                     className="w-full h-auto object-cover block" 
                                 />
                             </div>
                         ))}
                     </div>
                 ) : (
                     <div className="text-center py-10 text-gray-500">No additional images available.</div>
                 )}
             </div>
          </div>
        </motion.div>
      </div>
    );
};

// --- VERTICAL PROCESS STEPPER ---
const ProcessStepper = ({ steps, isInView = true }) => {
  const { isDark } = useTheme();
  const [illuminatedStep, setIlluminatedStep] = useState(0);
  const [animatingLine, setAnimatingLine] = useState(null);
  const wasOutOfViewRef = useRef(false);

  // Constants for snappy, responsive progression
  const HOLD_DURATION_MS = 620; // Brisk hold on illuminated circle (~0.6s)
  const LINE_DURATION_MS = 260;  // Synchronized to trigger exact moment line touches circle
  const LINE_DURATION_SEC = 0.26;

  // Detect when section was completely scrolled out of view and has re-entered view
  useEffect(() => {
    if (!isInView) {
      wasOutOfViewRef.current = true;
    } else if (isInView && wasOutOfViewRef.current) {
      wasOutOfViewRef.current = false;
      setIlluminatedStep(0);
      setAnimatingLine(null);
    }
  }, [isInView]);

  // Step advancement sequence:
  // 1. Hold on illuminatedStep for 1000ms
  // 2. Animate connecting line towards illuminatedStep + 1
  // 3. The exact moment line reaches circle, illuminate next step with zero delay
  // 4. Repeat until final step is reached, then lock in place
  useEffect(() => {
    if (!steps || steps.length === 0 || !isInView) return;

    // Once the final step is illuminated and no line is animating, hold indefinitely
    if (illuminatedStep >= steps.length - 1 && animatingLine === null) {
      return;
    }

    let timer;

    if (animatingLine === null) {
      // HOLD PHASE: Wait for 1000ms before drawing line to next step
      timer = setTimeout(() => {
        if (illuminatedStep < steps.length - 1) {
          setAnimatingLine(illuminatedStep);
        }
      }, HOLD_DURATION_MS);
    } else {
      // DRAW PHASE: The instant the line touches the circle, immediately illuminate next step
      timer = setTimeout(() => {
        setIlluminatedStep(animatingLine + 1);
        setAnimatingLine(null);
      }, LINE_DURATION_MS);
    }

    return () => clearTimeout(timer);
  }, [steps, isInView, illuminatedStep, animatingLine]);

  if (!steps || steps.length === 0) return null;

  return (
    <div className="w-full max-w-md relative select-none pointer-events-none cursor-default">
      {/* Steps list placed directly on the canvas - strictly automatic progression, non-interactive */}
      <div className="space-y-0">
        {steps.map((step, idx) => {
          const isReached = idx <= illuminatedStep;
          const isLast = idx === steps.length - 1;
          const isLineCompleted = idx < illuminatedStep;
          const isLineAnimating = idx === animatingLine;

          return (
            <div 
              key={step.id || idx}
              className={`relative flex items-start gap-4 sm:gap-5 transition-opacity duration-300 ${
                isReached ? 'opacity-100' : 'opacity-35'
              }`}
            >
              {/* Left Column: Circle node + direct connecting line to next circle */}
              <div className="flex flex-col items-center flex-shrink-0 self-stretch">
                {/* Node Indicator: Clean matte terracotta */}
                <motion.div 
                  initial={false}
                  animate={{ scale: isReached ? 1.02 : 1 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold font-mono transition-colors duration-150 z-10 border ${
                    isReached 
                      ? 'bg-[#ff5e1a] text-white border-[#ff5e1a]' 
                      : (isDark ? 'bg-[#0d0d0d] text-gray-500 border-white/15' : 'bg-white text-gray-400 border-black/10 shadow-sm')
                  }`}
                >
                  {step.number}
                </motion.div>

                {/* Connector Line to Next Step: Solid clean matte line */}
                {!isLast && (
                  <div className={`w-[2px] flex-1 my-1 relative overflow-hidden min-h-[38px] sm:min-h-[44px] rounded-full ${
                    isDark ? 'bg-white/10' : 'bg-black/10'
                  }`}>
                    <motion.div 
                      className="w-full bg-[#ff5e1a]"
                      initial={false}
                      animate={{ 
                        height: isLineCompleted ? "100%" : isLineAnimating ? "100%" : "0%" 
                      }}
                      transition={
                        isLineAnimating 
                          ? { duration: LINE_DURATION_SEC, ease: [0.25, 0.1, 0.25, 1.0] } 
                          : { duration: 0 }
                      }
                    />
                  </div>
                )}
              </div>

              {/* Step Content */}
              <div className={`text-left pt-0.5 ${isLast ? 'pb-2' : 'pb-6'}`}>
                <h4 className={`text-base sm:text-lg font-bold tracking-tight transition-colors duration-150 ${
                  isReached ? (isDark ? 'text-white' : 'text-neutral-900') : (isDark ? 'text-gray-400' : 'text-gray-500')
                }`}>
                  {step.title}
                </h4>

                <p className={`text-xs sm:text-sm transition-colors duration-150 mt-0.5 ${
                  isReached ? 'text-[#ff5e1a] font-semibold' : 'text-gray-500 font-light'
                }`}>
                  {step.tagline}
                </p>

                {step.desc && (
                  <p className={`text-xs leading-relaxed font-light mt-1.5 max-w-sm transition-colors duration-150 ${
                    isReached ? (isDark ? 'text-gray-300' : 'text-gray-700') : (isDark ? 'text-gray-600' : 'text-gray-400')
                  }`}>
                    {step.desc}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- HERO SECTION ---
const HeroSection = () => {
    const { isDark } = useTheme();
    const { hero } = designData;

    if (!hero) return null;

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div id="hero-page" className="relative pt-36 md:pt-48 pb-28 md:pb-40 px-6 md:px-12 z-10 min-h-[85vh] md:min-h-[90vh] flex flex-col justify-center items-center text-center overflow-visible">
            <div className="max-w-[1400px] w-full mx-auto flex flex-col items-center overflow-visible">
                <div className="max-w-6xl w-full mx-auto flex flex-col items-center text-center overflow-visible">
                    {/* Headline with Staggered Directional Blur Clearance & Generous Right Margin for 'R' */}
                    <h1 className="text-[13vw] sm:text-[10vw] lg:text-[7.6vw] xl:text-[8vw] leading-[0.9] font-black tracking-tighter uppercase text-center overflow-visible px-2 sm:px-4">
                      <motion.span 
                        initial={{ opacity: 0, y: 40, filter: 'blur(14px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                        className={`block overflow-visible pr-3 sm:pr-5 will-change-[transform,opacity,filter] ${
                          isDark ? 'text-white' : 'text-neutral-900'
                        }`}
                      >
                        {hero.titlePrefix || "Product Designer"}
                      </motion.span>
                      <motion.span 
                        initial={{ opacity: 0, y: 35, filter: 'blur(12px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 1.0, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap mt-2 sm:mt-4 overflow-visible pr-2 will-change-[transform,opacity,filter]"
                      >
                          <span className={`font-serif italic lowercase font-light ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>&</span>
                          <span className="text-[#ff5e1a] font-black tracking-tighter uppercase overflow-visible pr-2">{hero.titleSuffix || "UX Engineer"}</span>
                      </motion.span>
                    </h1>

                    {/* Bio with Highlighted Main Focus Words: Exact Character Hug (Zero Blank Space) */}
                    <motion.p 
                        initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ delay: 0.38, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className={`mt-10 max-w-4xl text-lg sm:text-2xl lg:text-[28px] font-light leading-relaxed tracking-normal mx-auto will-change-[transform,opacity,filter] ${
                          isDark ? 'text-gray-300' : 'text-neutral-800'
                        }`}
                    >
                        I am a Product Designer who bridges the gap between{' '}
                        <span className="inline px-0 py-0.5 bg-[#ff5e1a] text-white font-medium whitespace-nowrap">
                            user empathy
                        </span>{' '}
                        and{' '}
                        <span className="inline px-0 py-0.5 bg-[#ff5e1a] text-white font-medium whitespace-nowrap">
                            technical execution
                        </span>
                        , specializing in scalable design systems and end-to-end application development.
                    </motion.p>
                </div>
            </div>
        </div>
    );
};

// --- DESIGN PROCESS SECTION ---
const ProcessSection = () => {
    const { isDark } = useTheme();
    const { hero } = designData;
    const sectionRef = useRef(null);
    const [isSectionInView, setIsSectionInView] = useState(false);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsSectionInView(entry.isIntersecting);
            },
            { threshold: 0.15 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    if (!hero?.steps || hero.steps.length === 0) return null;

    return (
        <section 
            ref={sectionRef} 
            id="process" 
            className={`relative z-20 py-24 sm:py-32 px-6 md:px-12 border-t transition-colors duration-500 ${
                isDark ? 'bg-[#080808] border-white/5' : 'bg-[#F2F2ED] border-black/5'
            }`}
        >
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                
                {/* Left Col: Section Heading & Philosophy (Flows naturally together with right column) */}
                <div className="lg:col-span-5">
                    <motion.h2 
                        initial={{ opacity: 0, y: 35, filter: 'blur(12px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight uppercase leading-[0.95] will-change-[transform,opacity,filter] ${
                            isDark ? 'text-white' : 'text-neutral-900'
                        }`}
                    >
                        How I Bring <br />
                        Ideas To Life.
                    </motion.h2>

                    <motion.p 
                        initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className={`mt-6 text-base sm:text-lg leading-relaxed max-w-md will-change-[transform,opacity,filter] ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                    >
                        A disciplined, iterative design process connecting user empathy, robust interface architectures and high-performance frontend code.
                    </motion.p>

                    <div className={`mt-8 pt-8 border-t space-y-4 max-w-md ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                        {[
                            "Research & Evidence Driven",
                            "Scalable Design Token Architecture",
                            "Production-Ready Component Systems"
                        ].map((item, idx) => (
                            <motion.div 
                                key={item}
                                initial={{ opacity: 0, x: -24, filter: 'blur(6px)' }}
                                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ duration: 0.65, delay: 0.3 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="flex items-center gap-3 will-change-[transform,opacity,filter]"
                            >
                                <span className="w-2 h-2 rounded-full bg-[#ff5e1a]" />
                                <span className={`text-xs font-mono uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {item}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Col: The Interactive Vertical Progress Stepper */}
                <motion.div 
                    initial={{ opacity: 0, x: 35, filter: 'blur(10px)' }}
                    whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="lg:col-span-7 flex justify-start lg:justify-end will-change-[transform,opacity,filter]"
                >
                    <ProcessStepper steps={hero.steps} isInView={isSectionInView} />
                </motion.div>
            </div>
        </section>
    );
};

// --- INFO SECTION (Services, Certs, About) ---
const InfoSection = ({ onCertClick }) => {
    const { isDark } = useTheme();

    return (
        <div id="credentials-and-about" className={`relative z-20 pt-20 sm:pt-24 lg:pt-28 pb-20 sm:pb-28 px-6 md:px-12 border-t transition-colors duration-500 ${
          isDark ? 'bg-[#0A0A0A] border-white/5' : 'bg-white border-black/5'
        }`}>
            <div className="max-w-[1400px] mx-auto space-y-24 sm:space-y-28">
                


                {/* 2. ARSENAL & CREDENTIALS: THE COLLECTOR'S GYM BADGE CASE & PINNED CREDENTIAL STATION */}
                <div id="credentials-and-stack" className="space-y-6 sm:space-y-8 scroll-mt-24 sm:scroll-mt-28">
                    <motion.div 
                        initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className={`flex flex-col md:flex-row md:items-end justify-between border-b pb-4 sm:pb-5 will-change-[transform,opacity,filter] ${
                          isDark ? 'border-white/10' : 'border-black/10'
                        }`}
                    >
                        <div>
                            <h3 className={`text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-[0.95] ${
                              isDark ? 'text-white' : 'text-neutral-900'
                            }`}>
                                Arsenal & Credentials
                            </h3>
                        </div>
                    </motion.div>

                    {/* Split Stage: 60% Left Metal Badge Case | 40% Right Sticky Note Credentials */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                        <div className="lg:col-span-7 w-full flex flex-col items-center lg:items-start">
                            <GymBadgeCase />
                        </div>
                        <div className="lg:col-span-5 w-full flex flex-col items-center justify-center pt-4 sm:pt-8 lg:pt-12">
                            <StickyCertificates />
                        </div>
                    </div>
                </div>

                {/* 3. ABOUT ME */}
                {designData?.about && (
                    <div id="about" className="space-y-12 pt-14 sm:pt-18 lg:pt-20 scroll-mt-20 sm:scroll-mt-24">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
                            {/* Left Column: Section Title & Liquid Portrait (Pinned to Bottom, Expands Upward) */}
                            <div className="flex flex-col justify-between h-full lg:pl-12 xl:pl-20">
                                <div className="mb-2 sm:mb-4">
                                    {designData.about.title && (
                                        <motion.h2 
                                            initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
                                            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                            viewport={{ once: true, margin: '-60px' }}
                                            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                                            className={`text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.95] uppercase will-change-[transform,opacity,filter] ${
                                              isDark ? 'text-white' : 'text-neutral-900'
                                            }`}
                                        >
                                            {designData.about.title}
                                        </motion.h2>
                                    )}
                                </div>

                                {/* INTERACTIVE LIQUID CLOUDY X-RAY PORTRAIT REVEAL (Anchored to bottom baseline, grows upwards) */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    viewport={{ once: true, margin: '-60px' }}
                                    transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                                    className="relative w-full max-w-[350px] sm:max-w-[380px] lg:max-w-[420px] xl:max-w-[450px] mt-4 sm:mt-6 lg:mt-auto self-start will-change-[transform,opacity,filter]"
                                >
                                    <LiquidPortraitReveal isDark={isDark} />
                                </motion.div>
                            </div>
                            
                            {/* Right Column: Refined Description & Education/Resume Baseline */}
                            <div className="flex flex-col justify-start h-full pt-1 sm:pt-2 pb-2 sm:pb-4">
                                <div className="space-y-4">
                                    <ScrollWordReveal 
                                        text={designData.about.description}
                                        isDark={isDark}
                                        className="text-lg sm:text-xl lg:text-[24px] xl:text-[26px] font-medium tracking-tight leading-[1.48]"
                                    />
                                </div>
                                
                                <div className={`grid grid-cols-2 gap-8 pt-6 pb-1 border-t ${isDark ? 'border-white/10' : 'border-black/10'} mt-8 sm:mt-10 lg:mt-12`}>
                                    {designData.about?.education && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
                                            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                            viewport={{ once: true, margin: '-40px' }}
                                            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                            className="will-change-[transform,opacity,filter]"
                                        >
                                            <h4 className={`font-mono text-xs font-bold uppercase tracking-widest mb-2.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Education</h4>
                                            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-neutral-700'}`}>
                                                <strong className={`font-semibold block ${isDark ? 'text-white' : 'text-neutral-900'}`}>{designData.about.education.degree}</strong>
                                                <span>{designData.about.education.college}</span><br/>
                                                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{designData.about.education.year}</span>
                                            </p>
                                        </motion.div>
                                    )}
                                    
                                    {designData.about.resumeUrl && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
                                            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                            viewport={{ once: true, margin: '-40px' }}
                                            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                            className="flex flex-col justify-start items-start will-change-[transform,opacity,filter]"
                                        >
                                            <h4 className={`font-mono text-xs font-bold uppercase tracking-widest mb-2.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Resume</h4>
                                            <a 
                                                href={designData.about.resumeUrl} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                data-cursor="RESUME"
                                                className={`group inline-flex items-center gap-3 transition-colors ${
                                                  isDark ? 'text-gray-300 hover:text-[#ff4d00]' : 'text-neutral-700 hover:text-[#ff4d00]'
                                                }`}
                                            >
                                                <span className="text-sm font-bold uppercase tracking-widest border-b pb-0.5 transition-colors border-current">Download CV</span>
                                                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </a>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* SUBSECTION: BEYOND DESIGNING */}
                        <div className="pt-6">
                            <MoodBoardSection />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

const Footer = () => {
    const { isDark } = useTheme();
    const linkedInUrl = "https://www.linkedin.com/in/khushangsingh2004";

    return (
        <footer className={`relative z-20 pt-16 pb-12 px-6 md:px-12 border-t overflow-hidden transition-colors duration-500 ${
          isDark ? 'bg-black text-white border-white/10' : 'bg-[#EAEAE5] text-neutral-900 border-black/10'
        }`}>
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-12 relative">
                    <motion.h2 
                        initial={{ opacity: 0, y: 45, filter: 'blur(16px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                        className={`text-[8vw] font-black leading-[0.9] tracking-tighter uppercase z-10 relative pb-6 pr-4 will-change-[transform,opacity,filter] ${
                          isDark ? 'text-white' : 'text-neutral-900'
                        }`}
                    >
                        Let's <br />
                        Create.
                    </motion.h2>
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.6, rotate: -45, filter: 'blur(10px)' }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.9, delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block will-change-[transform,opacity,filter]"
                    >
                        <a 
                            href={linkedInUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            data-cursor="CONNECT"
                            className="group w-32 h-32 rounded-full bg-[#ff4d00] flex items-center justify-center text-black transition-all duration-500 hover:scale-125 shadow-[0_0_30px_rgba(255,77,0,0.5)]"
                        >
                            <ArrowUpRight size={48} className="group-hover:rotate-45 transition-transform duration-500 scale-90 group-hover:scale-110" />
                        </a>
                    </motion.div>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-4 gap-12 border-t pt-12 ${
                  isDark ? 'border-white/10' : 'border-black/10'
                }`}>
                    <motion.div 
                        initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true, margin: '-30px' }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="md:col-span-2 will-change-[transform,opacity,filter]"
                    >
                        {designData?.footer?.email && (
                            <>
                                <h4 className={`font-bold text-lg mb-6 ${
                                  isDark ? 'text-white' : 'text-neutral-900'
                                }`}>Contact</h4>
                                <div>
                                    <a 
                                        href={`mailto:${designData.footer.email}`} 
                                        className={`text-2xl md:text-4xl transition-colors inline-block w-fit mb-4 font-light ${
                                          isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-neutral-950'
                                        }`}
                                    >
                                        {designData.footer.email}
                                    </a>
                                </div>
                                <p className={`max-w-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                                    Open for freelance projects and internships. Based in India, working globally.
                                </p>
                            </>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true, margin: '-30px' }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="will-change-[transform,opacity,filter]"
                    >
                        <h4 className={`font-bold text-lg mb-6 ${
                          isDark ? 'text-white' : 'text-neutral-900'
                        }`}>Socials</h4>
                        <ul className="space-y-4">
                            {designData.footer?.socials?.map((link) => (
                                <li key={link.label}>
                                    <a 
                                        href={link.url} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        data-social={link.label.toLowerCase()}
                                        className={`inline-flex w-fit items-center gap-2 transition-colors uppercase tracking-widest text-sm ${
                                          isDark ? 'text-gray-400 hover:text-[#ff4d00]' : 'text-gray-600 hover:text-[#ff4d00]'
                                        }`}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true, margin: '-30px' }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="will-change-[transform,opacity,filter]"
                    >
                        <h4 className={`font-bold text-lg mb-6 ${
                          isDark ? 'text-white' : 'text-neutral-900'
                        }`}>Links</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className={`inline-block w-fit transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-neutral-950'}`}>Home</a></li>
                            <li><a href="#projects" className={`inline-block w-fit transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-neutral-950'}`}>Projects</a></li>
                            <li><a href="#about" className={`inline-block w-fit transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-neutral-950'}`}>About</a></li>
                        </ul>
                    </motion.div>
                </div>

                <div className={`mt-16 flex flex-col items-center justify-center text-xs uppercase tracking-widest text-center ${
                  isDark ? 'text-gray-500' : 'text-gray-500'
                }`}>
                    <div className="flex items-center gap-2">
                        <Copyright size={14} /> 2026 Khushang Singh - Designed & Developed
                    </div>
                </div>
            </div>
        </footer>
    );
};

const Designer = () => {
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState(designData.sections?.[0] || null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  
  useEffect(() => {
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", isDark ? "#050505" : "#F8F8F5");
    }
  }, [isDark]);

  // Safe Filter Logic (matches subCat or tags)
  const filteredProjects = activeSection?.projects?.filter(project => 
    activeFilter === "All" ? true : (project.subCat === activeFilter || project.tags?.includes(activeFilter))
  ) || [];

  return (
    <div className={`min-h-screen w-full font-sans relative selection:bg-[#ff4d00] selection:text-white cursor-crosshair overflow-x-clip transition-colors duration-500 ${
      isDark ? 'bg-[#050505] text-white' : 'bg-[#F8F8F5] text-[#121212]'
    }`}>
      
      {/* GLOBAL SCROLLBAR STYLE */}
      <style>{`
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${isDark ? '#050505' : '#F8F8F5'}; }
        ::-webkit-scrollbar-thumb { background: #ff4d00; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #cc3d00; }
      `}</style>

      {/* 1. CINEMATIC GRAIN OVERLAY */}
      <div className={`fixed inset-0 pointer-events-none z-0 mix-blend-overlay ${isDark ? 'opacity-[0.07]' : 'opacity-[0.03]'}`} 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <HeroSection />

      <ProcessSection />
      
      {/* MAIN 3D SHOWCASE SECTION (Deals cards into ring, then expands into full 3D carousel) */}
      <ReelRingShowcase onProjectClick={setSelectedProject} />

      {/* WRAPPER FOR STICKY BEHAVIOR: Generous top spacing so category buttons never touch the section top */}
      <div className="relative z-10 pt-20 md:pt-32 pb-24" id="projects">
          
           {/* 4. STICKY FLOATING TAB NAVIGATION */}
           {designData?.sections?.length > 0 && (
              <div className="sticky top-6 sm:top-8 z-50 flex justify-center px-4 mb-8 pointer-events-none">
                <div className={`backdrop-blur-xl border rounded-full p-1.5 md:p-2 flex gap-1 md:gap-2 pointer-events-auto shadow-2xl ring-1 transition-all duration-300 max-w-full overflow-x-auto scrollbar-hide ${
                  isDark ? 'bg-[#0f0f0f]/80 border-white/10 ring-white/5' : 'bg-white/80 border-black/10 ring-black/5 shadow-md'
                }`}>
                    {designData.sections.map((section) => {
                        const isActive = activeSection?.id === section.id;
                        return (
                            <button
                                key={section.id}
                                onClick={() => {
                                    setActiveSection(section);
                                    setActiveFilter("All");
                                }}
                                className={`relative px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-wider md:tracking-widest whitespace-nowrap transition-all duration-300 ${
                                  isActive 
                                    ? (isDark ? 'text-black' : 'text-white') 
                                    : (isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black')
                                }`}
                            >
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeTab"
                                        className={`absolute inset-0 backdrop-blur-md rounded-full ${
                                          isDark ? 'bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.2)]'
                                        }`}
                                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                    />
                                )}
                                <span className="relative z-10">{section.label}</span>
                            </button>
                        );
                    })}
                </div>
              </div>
          )}

          {/* 5. STICKY FILTER BAR */}
          {activeSection?.filters?.length > 0 && (
              <div className="sticky top-20 sm:top-24 z-40 flex justify-center w-full mb-16 pointer-events-none">
                 <div className={`backdrop-blur-xl px-8 py-2 rounded-full pointer-events-auto border shadow-lg ${
                   isDark ? 'bg-[#050505]/40 border-white/5' : 'bg-white/70 border-black/5 shadow-sm'
                 }`}>
                    <div className="flex justify-center flex-wrap gap-6">
                        {activeSection.filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                data-cursor="FILTER"
                                className={`text-[10px] tracking-[0.2em] uppercase font-bold transition-all duration-300 relative py-1 group ${
                                    activeFilter === filter 
                                      ? 'text-[#ff4d00]' 
                                      : (isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-black')
                                }`}
                            >
                                {filter}
                                {activeFilter === filter && (
                                    <motion.div layoutId="filterDot" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#ff4d00] rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                 </div>
              </div>
          )}

          {/* 6. DYNAMIC CONTENT AREA */}
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div 
                layout
                variants={containerVariants}
                initial="visible"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
            >
                <AnimatePresence mode='popLayout'>
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            layout
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            key={project.id}
                            data-cursor="VIEW"
                            className={`group relative cursor-pointer ${index % 2 === 1 ? 'lg:translate-y-16' : ''}`}
                            onClick={() => setSelectedProject(project)}
                        >
                            {/* 1. THE IMAGE CARD */}
                            <div 
                                className={`relative aspect-[16/10] w-full overflow-hidden rounded-sm border transition-all duration-500 ${
                                  isDark ? 'bg-[#111] border-white/10' : 'bg-white border-black/10 shadow-sm'
                                }`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black via-transparent to-transparent opacity-60' : 'from-black/40 via-transparent to-transparent opacity-40'} z-10 group-hover:opacity-20 transition-opacity duration-500`} />
                                {project.image && (
                                    <img 
                                        src={project.image} 
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[0.22,1,0.36,1] scale-100 group-hover:scale-105"
                                    />
                                )}
                                <div className="absolute top-4 left-4 z-20">
                                    <div className={`backdrop-blur-md border px-3 py-1 flex items-center gap-2 ${
                                      isDark ? 'bg-black/50 border-white/10 text-gray-300' : 'bg-white/90 border-black/10 text-neutral-800 shadow-sm'
                                    }`}>
                                        <Layers size={10} className="text-[#ff4d00]" />
                                        <span className="text-[9px] font-sans uppercase tracking-widest font-bold">{project.subCat}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 2. TYPOGRAPHY & BUTTON BELOW */}
                            <div className="mt-6 flex justify-between items-end pl-2">
                                <div className="flex flex-col gap-1">
                                    {project.title && (
                                        <h3 className={`text-3xl font-bold transition-colors duration-300 ${
                                          isDark ? 'text-white' : 'text-neutral-900'
                                        }`}>
                                            {project.title}
                                        </h3>
                                    )}
                                    {project.desc && (
                                        <p className={`text-md transition-colors duration-300 max-w-xl ${
                                          isDark ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                            {project.desc}
                                        </p>
                                    )}
                                </div>
                                <div className={`w-12 h-12 rounded-full border flex items-center justify-center bg-transparent group-hover:bg-[#ff4d00] group-hover:border-[#ff4d00] transition-all duration-300 ${
                                  isDark ? 'border-white/10' : 'border-black/10'
                                }`}>
                                    <ArrowRight size={20} className="text-[#ff4d00] group-hover:text-white transform rotate-0 group-hover:-rotate-45 transition-all duration-300" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
                <div className="w-full py-40 flex flex-col items-center justify-center text-gray-400">
                    <Sparkles size={64} className="mb-6 opacity-20 animate-pulse" />
                    <p className="uppercase tracking-[0.5em] text-xs font-bold opacity-40">Work in progress</p>
                </div>
            )}
          </div>
      </div>

      {/* NEW INFO SECTIONS (Non-Sticky Area) */}
      <InfoSection onCertClick={setSelectedCert} />

      {/* STUDIO WORKSPACE SECTION */}
      <StudioSection />

      {/* FOOTER */}
      <Footer />

      {/* GLOBAL MODALS */}
      <AnimatePresence>
        {selectedProject && (
            <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
        {selectedCert && (
            <CertModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
        )}
      </AnimatePresence>

    </div>
  );
};

export default Designer;