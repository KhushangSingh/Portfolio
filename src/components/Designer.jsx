import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { designData } from '../constants/data';
import BrandMark from './BrandMark';
import { useTheme } from '../context/ThemeContext';
import SelectedWorksShowcase from './SelectedWorksShowcase';
import ProjectMockup from './ProjectMockup';
import ProjectPreview from './ProjectPreview';
import { playSoundEffect } from '../utils/soundEffects';
import MoodBoardSection from './MoodBoardSection';
import StudioSection from './StudioSection';
import { GymBadgeCase } from './GymBadgeCase';
import { StickyCertificates } from './StickyCertificates';
import { ScrollWordReveal } from './ScrollWordReveal';
import LiquidPortraitReveal from './LiquidPortraitReveal';
import { VinylPlayer } from './VinylPlayer';
import ContactSection from './ContactSection';

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
                    className={`absolute top-4 right-4 z-30 p-2 rounded-lg transition-colors border ${
                      isDark ? 'bg-black/50 hover:bg-white/10 text-white border-white/10' : 'bg-black/5 hover:bg-black/10 text-neutral-800 border-black/10'
                    }`}
                >
                    <span className="px-2 text-xs font-semibold">Close</span>
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
                                <span key={skill} className={`px-2.5 py-1 border rounded-md text-xs ${
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
                                Verify Credential
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// --- PROJECT DETAIL MODAL ---
const projectToolBrands = {
  Figma: 'figma',
  React: 'react',
  'Tailwind CSS': 'tailwind',
  'Framer Motion': 'motion',
  'Next.js': 'nextjs',
  Storybook: 'storybook',
  Express: 'express',
};

const ProjectModal = ({ project, onClose }) => {
  const { isDark } = useTheme();

  useEffect(() => {
    if (!project) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [project]);

  if (!project) return null;

  const gallery = project.gallery?.length ? project.gallery : [project.image].filter(Boolean);
  const tools = project.tools?.split(', ') ?? [];
  const study = project.study;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
      />
      <motion.div
        role="dialog" aria-modal="true" aria-labelledby="project-detail-title"
        onKeyDown={(event) => { if (event.key === 'Escape') onClose(); }}
        variants={modalVariants} initial="hidden" animate="visible" exit="exit"
        style={{ '--project-accent': project.accent, '--project-base': isDark ? '#0a0a0a' : '#fafafa' }}
        className={'project-detail-scroll relative z-10 h-full w-full overflow-y-auto [background-color:color-mix(in_srgb,var(--project-accent,transparent)_6%,var(--project-base))] ' + (isDark ? 'text-white' : 'text-neutral-900')}
        data-lenis-prevent
      >
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-10 sm:py-12">
          <header className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-2">
            <h2 id="project-detail-title" className="text-3xl font-bold tracking-tight sm:text-5xl">{project.title}</h2>
            <button type="button" autoFocus onClick={onClose} className="min-h-10 rounded-md border border-current px-3 text-sm font-semibold hover:underline">Back</button>
            {!study && project.role && <p className="col-span-full text-sm text-neutral-500 dark:text-neutral-400">{project.role}</p>}
          </header>
          {study && (
            <section className="mb-8 grid gap-5" aria-labelledby="project-flow-title">
              <div className="grid items-start gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,0.55fr)]">
                <p className="max-w-[58ch] leading-relaxed text-neutral-700 dark:text-neutral-300">{study.context}</p>
                <dl className="grid gap-3 rounded-md bg-black/[.03] p-4 text-sm dark:bg-white/[.06]">
                  <div><dt className="text-neutral-500 dark:text-neutral-400">My role</dt><dd className="font-semibold">{project.role}</dd></div>
                  <div><dt className="text-neutral-500 dark:text-neutral-400">Timeline</dt><dd className="font-semibold">{project.timeline}</dd></div>
                </dl>
              </div>
              <div>
                <h3 id="project-flow-title" className="mb-2 text-lg font-bold">{study.flow}</h3>
                <ol className="grid overflow-hidden rounded-md border border-black/10 bg-black/[.02] dark:border-white/10 dark:bg-white/[.04] sm:grid-cols-3">
                  {study.steps.map(([label, detail]) => (
                    <li key={label} className="border-t border-black/10 px-4 py-3 first:border-t-0 dark:border-white/10 sm:border-s sm:border-t-0 sm:first:border-s-0">
                      <strong>{label}</strong>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{detail}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          )}
          {project.previewVideo && (
            <ProjectPreview
              src={project.image}
              alt={`${project.title} website walkthrough`}
              videoSrc={project.previewVideo}
              className="mb-5 aspect-video w-full overflow-hidden rounded-lg border border-black/10 dark:border-white/10"
              loading="eager"
            />
          )}
          <div className="grid gap-5">
            {gallery.map((asset, index) => {
              const source = '/' + asset.replace(/^\/+/, '');
              const isDocument = source.toLowerCase().endsWith('.pdf');
              return (
                <a key={asset} href={source} target="_blank" rel="noreferrer"
                  className={isDocument ? 'w-fit rounded-md border border-current px-4 py-3 text-sm font-semibold hover:underline' : 'block overflow-hidden rounded-lg border border-black/10 dark:border-white/10'}
                >
                  {isDocument ? 'Read the research report (PDF)' : (
                    <img src={source} alt={project.title + ' preview ' + (index + 1)} className="block aspect-[16/10] w-full object-contain" loading={index ? 'lazy' : 'eager'} />
                  )}
                </a>
              );
            })}
          </div>
          {study && (
            <dl className="mt-7 grid gap-4 border-y border-black/10 py-5 text-sm dark:border-white/10 sm:grid-cols-3">
              <div><dt className="font-bold">Design decision</dt><dd className="mt-1 leading-relaxed text-neutral-700 dark:text-neutral-300">{study.decision}</dd></div>
              <div><dt className="font-bold">Recovery</dt><dd className="mt-1 leading-relaxed text-neutral-700 dark:text-neutral-300">{study.recovery}</dd></div>
              <div><dt className="font-bold">What I’d test next</dt><dd className="mt-1 leading-relaxed text-neutral-700 dark:text-neutral-300">{study.nextTest}</dd></div>
            </dl>
          )}
          {(tools.length > 0 || project.live || project.github) && (
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
              {tools.map((tool) => (
                <span key={tool} className="inline-flex items-center gap-1.5">
                  {projectToolBrands[tool] && <BrandMark brand={projectToolBrands[tool]} className="h-5 w-5 rounded-sm bg-neutral-100 p-0.5" />}
                  {tool}
                </span>
              ))}
              {project.live && <a href={project.live} className="font-semibold underline underline-offset-4 [text-decoration-color:var(--project-accent,currentColor)]" target="_blank" rel="noreferrer">Open {project.title}</a>}
              {project.github && <a href={project.github} className="font-semibold underline underline-offset-4 [text-decoration-color:var(--project-accent,currentColor)]" target="_blank" rel="noreferrer">View on GitHub</a>}
            </div>
          )}
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
            {/* Top Right: Quick 5-min link for fast evaluators and busy recruiters */}
            <div className="absolute top-6 sm:top-8 right-6 md:right-12 z-20">
                <Link
                    to="/summary"
                    data-cursor="SUMMARY"
                    className={`group relative inline-flex items-center gap-2.5 px-3.5 py-2 sm:px-4.5 sm:py-2.5 rounded-2xl border text-xs sm:text-sm font-sans font-bold tracking-tight transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-md select-none overflow-hidden ${
                        isDark
                            ? 'bg-[#0e0f14]/85 hover:bg-[#151722] border-white/15 hover:border-[#ff5e1a] text-white shadow-black/40'
                            : 'bg-white/90 hover:bg-white border-black/15 hover:border-[#ff5e1a] text-neutral-900 shadow-black/8'
                    } backdrop-blur-xl`}
                    title="Quick executive summary for visitors short on time"
                >
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-sans font-black bg-[#ff5e1a] text-white uppercase tracking-wider shrink-0 shadow-xs">
                        Quick
                    </span>
                    <span className="font-sans font-extrabold tracking-tight">
                        Short on Time?
                    </span>
                    <span className="text-[#ff5e1a] text-xs font-bold transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">
                        →
                    </span>
                </Link>
            </div>

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
                        , specializing in problem-driven UX solutions and end-to-end application development.
                    </motion.p>
                </div>
            </div>

            {/* Interactive Vinyl Music Disc Player physically anchored inside Hero Section */}
            <VinylPlayer />
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
                const rect = entry.boundingClientRect;
                const isHalfway = (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.2) || entry.intersectionRatio >= 0.5;
                setIsSectionInView(isHalfway);
            },
            { threshold: [0, 0.25, 0.5, 0.75, 1.0] }
        );

        observer.observe(el);

        return () => {
            observer.disconnect();
        };
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
                <div className="lg:col-span-5 pl-4 sm:pl-8 md:pl-14 lg:pl-20">
                    <motion.h2 
                        initial={{ opacity: 0, y: 35, filter: 'blur(12px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] will-change-[transform,opacity,filter] ${
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

                {/* Right Col: The Interactive Vertical Progress Stepper (Starts ONLY when >= 50% visible) */}
                <motion.div 
                    initial={{ opacity: 0, x: 35, filter: 'blur(10px)' }}
                    animate={isSectionInView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : { opacity: 0, x: 35, filter: 'blur(10px)' }}
                    transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
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
                        className="flex flex-col md:flex-row md:items-end justify-between pb-2 sm:pb-3 will-change-[transform,opacity,filter]"
                    >
                        <div className="pl-4 sm:pl-8 md:pl-14 lg:pl-20">
                            <h3 className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] ${
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
                            <div className="flex flex-col justify-between h-full pl-4 sm:pl-8 md:pl-14 lg:pl-20">
                                <div className="mb-2 sm:mb-4">
                                    {designData.about.title && (
                                        <motion.h2 
                                            initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
                                            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                            viewport={{ once: true, margin: '-60px' }}
                                            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                                            className={`text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.95] will-change-[transform,opacity,filter] ${
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
                            <div className="flex flex-col justify-start h-full pt-4 sm:pt-6 md:pt-10 lg:pt-14 xl:pt-16 pb-2 sm:pb-4">
                                <div className="space-y-4">
                                    <ScrollWordReveal 
                                        text={designData.about.description}
                                        isDark={isDark}
                                        className="text-base sm:text-lg lg:text-[18px] xl:text-[19px] font-normal sm:font-medium tracking-normal leading-[1.62]"
                                    />
                                </div>
                                
                                <div className={`grid grid-cols-2 gap-8 pt-6 sm:pt-7 pb-1 border-t ${isDark ? 'border-white/10' : 'border-black/10'} mt-10 sm:mt-12 lg:mt-14`}>
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
                                                className="group inline-flex items-center gap-1.5 text-[#ff5e1a] hover:text-[#ff783b] transition-colors cursor-pointer"
                                            >
                                                <span className="text-sm font-bold uppercase tracking-widest underline decoration-[#ff5e1a]/70 underline-offset-4 group-hover:decoration-[#ff5e1a] transition-colors">Resume</span>
                                                <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <line x1="7" y1="17" x2="17" y2="7" />
                                                    <polyline points="7 7 17 7 17 17" />
                                                </svg>
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
    const resumeUrl = designData.about?.resumeUrl || "/images/designResume.pdf";

    const scrollToTop = () => {
        if (window.__lenis) {
            window.__lenis.scrollTo(0, { duration: 1.1 });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <footer className={`relative z-20 py-14 sm:py-16 md:py-20 px-6 md:px-12 border-t overflow-hidden transition-colors duration-500 ${
          isDark ? 'bg-black text-white border-white/10' : 'bg-[#EAEAE5] text-neutral-900 border-black/10'
        }`}>
            <div className="max-w-[1400px] w-full mx-auto space-y-10 sm:space-y-12">
                {/* Contact, Socials, Links 4-column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true, margin: '-30px' }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="md:col-span-2 will-change-[transform,opacity,filter]"
                    >
                        {designData?.footer?.email && (
                            <>
                                <h4 className={`font-bold text-base sm:text-lg mb-2 sm:mb-3 ${
                                  isDark ? 'text-white' : 'text-neutral-900'
                                }`}>Contact</h4>
                                <div>
                                    <a 
                                        href={`mailto:${designData.footer.email}`} 
                                        className={`text-xl sm:text-2xl lg:text-3xl transition-colors inline-block w-fit mb-2 font-light ${
                                          isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-neutral-950'
                                        }`}
                                    >
                                        {designData.footer.email}
                                    </a>
                                </div>
                                <p className={`text-xs sm:text-sm max-w-sm leading-relaxed mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Open for freelance projects and internships. Based in India, working globally.
                                </p>

                                {/* Action Buttons: Visual Summary Brief & PDF Resume */}
                                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                                    <Link
                                        to="/summary"
                                        className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                                            isDark 
                                                ? 'border-white/15 bg-white/5 text-neutral-200 hover:border-[#ff5e1a] hover:text-[#ff5e1a]' 
                                                : 'border-black/15 bg-black/5 text-neutral-800 hover:border-[#ff5e1a] hover:text-[#ff5e1a]'
                                        }`}
                                        title="Quick executive summary for visitors short on time"
                                    >
                                        <span>Short on Time?</span>
                                    </Link>

                                    <a
                                        href={resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                                            isDark 
                                                ? 'border-white/15 bg-white/5 text-neutral-200 hover:border-[#ff5e1a] hover:text-[#ff5e1a]' 
                                                : 'border-black/15 bg-black/5 text-neutral-800 hover:border-[#ff5e1a] hover:text-[#ff5e1a]'
                                        }`}
                                        title="Download PDF resume"
                                    >
                                        <span>Resume</span>
                                    </a>
                                </div>
                            </>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true, margin: '-30px' }}
                        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="will-change-[transform,opacity,filter]"
                    >
                        <h4 className={`font-bold text-base sm:text-lg mb-2 sm:mb-3 ${
                          isDark ? 'text-white' : 'text-neutral-900'
                        }`}>Socials</h4>
                        <ul className="space-y-2.5">
                            {designData.footer?.socials?.map((link) => (
                                <li key={link.label}>
                                    <a 
                                        href={link.url} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        data-social={link.label.toLowerCase()}
                                        className={`inline-flex w-fit items-center gap-2 transition-colors uppercase tracking-widest text-xs sm:text-sm font-medium ${
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
                        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true, margin: '-30px' }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="will-change-[transform,opacity,filter]"
                    >
                        <h4 className={`font-bold text-base sm:text-lg mb-2 sm:mb-3 ${
                          isDark ? 'text-white' : 'text-neutral-900'
                        }`}>Links</h4>
                        <ul className="space-y-2.5">
                            <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className={`inline-block w-fit text-xs sm:text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-neutral-950'}`}>Home</a></li>
                            <li><a href="#projects" className={`inline-block w-fit text-xs sm:text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-neutral-950'}`}>Projects</a></li>
                            <li><a href="#about" className={`inline-block w-fit text-xs sm:text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-neutral-950'}`}>About</a></li>
                            <li><a href="#contact" className={`inline-block w-fit text-xs sm:text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-neutral-950'}`}>Contact Form</a></li>
                        </ul>
                    </motion.div>
                </div>

                {/* 3. BOTTOM ROW: Sentence-case Copyright & Back to Top */}
                <div className="pt-4 sm:pt-6 pb-2 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 text-xs normal-case text-neutral-500 dark:text-neutral-400">
                        <span>&copy;</span>
                        <span>2026 Khushang Singh. Designed and developed.</span>
                    </div>

                    <button
                        onClick={scrollToTop}
                        aria-label="Back to top of page"
                        title="Back to top"
                        className={`group w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
                            isDark 
                                ? 'border-white/15 bg-white/5 text-neutral-300 hover:border-[#ff5e1a] hover:text-[#ff5e1a] hover:bg-[#ff5e1a]/10' 
                                : 'border-black/15 bg-black/5 text-neutral-800 hover:border-[#ff5e1a] hover:text-[#ff5e1a] hover:bg-[#ff5e1a]/10'
                        }`}
                    >
                        <svg 
                            className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            aria-hidden="true"
                        >
                            <line x1="12" y1="19" x2="12" y2="5" />
                            <polyline points="5 12 12 5 19 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </footer>
    );
};

const Designer = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const [activeSection, setActiveSection] = useState(designData.sections?.[0] || null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [showSecondaryCatalog, setShowSecondaryCatalog] = useState(false);

  const openProject = (project) => {
    playSoundEffect('open');
    if (project.caseStudy) navigate(project.caseStudy);
    else setSelectedProject(project);
  };

  useLayoutEffect(() => {
    if (hash !== '#project-showcase') return;
    const showcase = document.getElementById('project-showcase');
    if (!showcase) return;

    if (window.__lenis) window.__lenis.scrollTo(showcase, { immediate: true, force: true });
    else showcase.scrollIntoView();
  }, [hash]);
  
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
      
      {/* 1. CINEMATIC GRAIN OVERLAY */}
      <div className={`fixed inset-0 pointer-events-none z-0 mix-blend-overlay ${isDark ? 'opacity-[0.07]' : 'opacity-[0.03]'}`} 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <HeroSection />

      <ProcessSection />
      
      {/* MAIN SELECTED WORKS SHOWCASE SECTION */}
      <SelectedWorksShowcase onProjectClick={openProject} previewsEnabled={!selectedProject} />

      {/* PROJECTS SECTION: Default design with button to view secondary layout */}
      <div className="relative z-10 pt-16 md:pt-24 pb-24" id="projects">
        
        {!showSecondaryCatalog ? (
          /* ==============================================================
             DEFAULT DESIGN OF PROJECTS SECTION
             (Clean hub / placeholder with button to view secondary layout)
             ============================================================== */
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className={`relative overflow-hidden rounded-[28px] sm:rounded-[36px] p-8 sm:p-12 md:p-16 border transition-all duration-500 text-center flex flex-col items-center justify-center ${
              isDark 
                ? 'bg-[#0a0a0c]/80 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
                : 'bg-[#F8F8F5] border-black/10 shadow-sm'
            }`}>
              <div 
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, #ff5e1a 0%, transparent 65%)'
                }}
              />

              <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                <span className="text-[11px] font-mono uppercase tracking-[0.22em] font-bold text-[#ff5e1a] mb-3 px-3 py-1 rounded-md bg-[#ff5e1a]/10 border border-[#ff5e1a]/20">
                  Project Archive
                </span>

                <h3 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}>
                  Explore All Projects
                </h3>

                <p className={`text-sm sm:text-base leading-relaxed mb-8 max-w-lg ${
                  isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  Browse the complete archive of shipped design systems, full-stack applications and interaction experiments.
                </p>

                {/* Button that reveals secondary design */}
                <button
                  onClick={() => { playSoundEffect('open'); setShowSecondaryCatalog(true); }}
                  className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-xl text-xs sm:text-sm font-mono font-bold uppercase tracking-wider bg-[#ff5e1a] text-white hover:bg-[#e0480a] shadow-lg hover:shadow-[#ff5e1a]/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>View All Projects</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ==============================================================
             SECONDARY DESIGN & LAYOUT
             (Current layout: Sticky Tabs, Sticky Filter Bar & Project Cards)
             ============================================================== */
          <div>
            {/* Top Bar with button to collapse secondary view */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-8 flex justify-between items-center">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                All Projects / Archive Catalog
              </span>
              <button
                onClick={() => { playSoundEffect('close'); setShowSecondaryCatalog(false); }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border border-black/10 dark:border-white/10 hover:border-[#ff5e1a] text-neutral-600 dark:text-neutral-300 hover:text-[#ff5e1a] transition-colors cursor-pointer"
              >
                <span>Collapse</span>
              </button>
            </div>

            {/* 4. GROUNDED EDITORIAL ARCHIVE HEADER & FILTERS */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/10 dark:border-white/10">
                {/* Discipline Navigation */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {designData?.sections?.map((section) => {
                    const isActive = activeSection?.id === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => {
                          setActiveSection(section);
                          setActiveFilter("All");
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-[#ff5e1a] text-white shadow-sm'
                            : isDark
                              ? 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                              : 'bg-black/5 hover:bg-black/10 text-neutral-700 border border-black/10'
                        }`}
                      >
                        <span>{section.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Sub-category Filter Bar */}
                {activeSection?.filters?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mr-1">
                      Filter:
                    </span>
                    {activeSection.filters.map((filter) => {
                      const isFilterActive = activeFilter === filter;
                      return (
                        <button
                          key={filter}
                          onClick={() => setActiveFilter(filter)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                            isFilterActive
                              ? isDark
                                ? 'bg-white/15 text-white border border-white/20'
                                : 'bg-black/10 text-black border border-black/15'
                              : isDark
                                ? 'text-neutral-400 hover:text-white'
                                : 'text-neutral-500 hover:text-black'
                          }`}
                        >
                          {filter}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

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
                            onClick={() => openProject(project)}
                        >
                            <div className={`flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-sm border transition-all duration-500 ${
                              isDark ? 'bg-[#111] border-white/10' : 'bg-white border-black/10 shadow-sm'
                            }`}>
                                {project.image && (
                                    <ProjectMockup
                                        src={project.image}
                                        alt={`${project.title} project preview`}
                                        videoSrc={project.previewVideo}
                                        active={!selectedProject}
                                        className="w-[min(62%,24rem)] motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]"
                                    />
                                )}
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
                                    {project.subCat && (
                                        <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{project.subCat}</p>
                                    )}
                                    {project.desc && (
                                        <p className={`text-md transition-colors duration-300 max-w-xl ${
                                          isDark ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                            {project.desc}
                                        </p>
                                    )}
                                </div>
                                <div className={`min-h-10 shrink-0 px-3 rounded-lg border flex items-center justify-center bg-transparent group-hover:bg-[#ff4d00] group-hover:border-[#ff4d00] transition-all duration-300 ${
                                  isDark ? 'border-white/10' : 'border-black/10'
                                }`}>
                                    <span className="text-xs font-semibold group-hover:text-white">View project</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
                <div className="w-full py-40 flex flex-col items-center justify-center text-gray-400">
                    <p className="uppercase tracking-[0.5em] text-xs font-bold opacity-40">Work in progress</p>
                </div>
            )}
          </div>
        </div>
      )}
      </div>

      {/* NEW INFO SECTIONS (Non-Sticky Area) */}
      <InfoSection onCertClick={setSelectedCert} />

      {/* STUDIO WORKSPACE SECTION */}
      <StudioSection />

      {/* DIRECT CONTACT FORM SECTION */}
      <ContactSection />

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
