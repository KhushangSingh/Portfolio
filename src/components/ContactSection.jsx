import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import ContactForm from './ContactForm';
import HangingSpiderman from './HangingSpiderman';
import { designData } from '../constants/data';

function SocialPlatformLogo({ brand }) {
  switch (brand) {
    case 'behance':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#0057ff]" aria-hidden="true">
          <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.171 3-4.148 0-6.555-2.618-6.555-6.983 0-4.496 2.766-7.017 6.641-7.017 4.148 0 6.183 2.871 5.86 6.983h-9.529c.119 2.22 1.487 3.518 3.585 3.518 1.488 0 2.502-.693 2.913-1.501h2.256zm-7.23-4.5c.084-1.748.983-2.83 2.545-2.83 1.564 0 2.378 1.082 2.463 2.83h-5.008zM4.97 19.5H0V3.5h5.539c3.072 0 4.961 1.341 4.961 3.86 0 1.644-.949 2.793-2.28 3.328 1.777.498 2.78 1.838 2.78 3.738 0 3.018-2.296 5.074-6.001 5.074zm-2.062-9.404h2.723c1.373 0 2.28-.584 2.28-1.879 0-1.168-.79-1.72-2.128-1.72H2.908v3.599zm0 6.404h2.951c1.564 0 2.518-.68 2.518-2.068 0-1.422-.983-2.068-2.584-2.068H2.908v4.136z" />
        </svg>
      );
    case 'dribbble':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#ea4c89]" aria-hidden="true">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm10.117 10.353c-.347-.113-3.17-.948-6.386-.441 1.341 3.676 1.885 6.678 1.988 7.301 2.308-1.547 3.948-4.004 4.398-6.86zm-6.115 7.804c-.15-.9-.75-4.032-2.185-7.766l-.066.019c-5.787 2.016-7.86 6.02-8.047 6.396 1.735 1.35 3.92 2.157 6.296 2.157 1.417 0 2.776-.282 4.002-.806zm-11.43-2.673c.234-.394 3.048-5.045 8.337-6.761.131-.047.271-.084.403-.122-.253-.581-.534-1.163-.834-1.735-5.12 1.529-10.091 1.463-10.541 1.454 0 .103-.009.206-.009.31 0 2.635 1.004 5.037 2.644 6.854zm-2.419-8.948c.46.009 4.68.028 9.482-1.247-1.106-2.503-2.944-5.035-3.206-5.401-2.88 1.35-5.016 3.994-5.676 7.148zm7.634-7.859c.281.375 2.147 2.906 3.826 5.992 3.647-1.37 5.185-3.432 5.373-3.694-1.81-1.603-4.192-2.578-6.799-2.578-.825 0-1.632.103-2.4.28zm10.334 3.479c-.216.291-1.932 2.494-5.72 4.041.234.487.469.984.684 1.481.075.178.15.356.225.525 3.413-.431 6.8-.263 7.135-.197-.028-2.409-.891-4.631-2.324-6.35z" />
        </svg>
      );
    case 'medium':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#00ab6c]" aria-hidden="true">
          <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#0a66c2]" aria-hidden="true">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      );
    case 'github':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#24292e] dark:fill-white" aria-hidden="true">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ContactSection() {
  const { isDark } = useTheme();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isContactVisible, setIsContactVisible] = useState(false);
  const sectionRef = useRef(null);

  const email = designData?.footer?.email || 'khushang8508@gmail.com';

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const checkVisibility = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top <= vh * 0.75) {
        setIsContactVisible(true);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsContactVisible(true);
      }
    }, { threshold: 0.15 });

    observer.observe(el);
    window.addEventListener('scroll', checkVisibility, { passive: true });
    checkVisibility();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', checkVisibility);
    };
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className={`relative z-10 py-20 sm:py-24 lg:py-28 px-6 sm:px-10 md:px-14 lg:px-16 border-t transition-colors duration-500 overflow-hidden ${
        isDark ? 'bg-[#08080a] text-white border-white/10' : 'bg-[#F4F4F0] text-neutral-900 border-black/10'
      }`}
    >
      <div className="max-w-[1180px] xl:max-w-[1240px] w-full mx-auto">
        
        {/* 1. TOP ROW: "Let's Connect." heading with Spider-Man anchor circle */}
        <div className="mb-12 sm:mb-16 relative pt-2 sm:pt-4">
          <div className="pr-4 md:pr-40">
            <motion.h2 
              id="contact-heading"
              initial={{ opacity: 0, y: 35, filter: 'blur(14px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="z-10 relative pb-1 sm:pb-2 will-change-[transform,opacity,filter]"
            >
              <span className={`block text-4xl sm:text-5xl md:text-6xl font-bold sm:font-black leading-[0.96] tracking-tight font-sans ${
                isDark ? 'text-white/90' : 'text-neutral-900'
              }`}>
                Let's
              </span>
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.88] tracking-tighter text-[#ff5e1a] -mt-0.5 sm:-mt-1 font-sans">
                Connect.
              </span>
            </motion.h2>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-4 max-w-xl leading-relaxed font-sans">
              Send a direct message through the form below or reach out via official email. Inquiries route directly to Khushang's studio inbox.
            </p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.6, rotate: -25, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.9, delay: 0.15, type: 'spring', stiffness: 200, damping: 20 }}
            className="absolute right-6 sm:right-10 lg:right-16 top-2 sm:top-4 lg:top-6 z-30 hidden md:block will-change-[transform,opacity,filter]"
          >
            <div className="relative group">
              {/* Tactile orange anchor disc with restored original dimensions */}
              <div 
                className="relative z-10 w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-[#ff5e1a] to-[#d9480f] shadow-[0_0_28px_rgba(255,94,26,0.45)] border border-white/25 flex items-center justify-center select-none"
                aria-hidden="true"
              >
                <div className="w-16 h-16 lg:w-18 lg:h-18 rounded-full border border-white/30 opacity-60" />
              </div>

              {/* Spider-Man hanging upside down and descending to gracefully overlap the form border */}
              <HangingSpiderman isDark={isDark} shouldDescend={isContactVisible} />
            </div>
          </motion.div>
        </div>

        {/* 2-Column Split: Context & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Direct Info & Guidelines (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Work & Collaboration Focus */}
            <div className={`p-6 rounded-2xl border ${
              isDark ? 'bg-black/30 border-white/10' : 'bg-white border-black/10 shadow-xs'
            }`}>
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                Work & Scope
              </span>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight font-sans">
                Services & Collaboration
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed font-sans">
                Product Design, Design System Architecture, Frontend Engineering and High-Performance Web Applications.
              </p>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed font-sans">
                Open to discuss project scope and technical details after connecting.
              </p>

              <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 flex flex-col gap-2 text-xs font-sans">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Based In:</span>
                  <span className="font-bold">India (Working Globally)</span>
                </div>
              </div>
            </div>

            {/* Email Action Card */}
            <div className={`p-6 rounded-2xl border ${
              isDark ? 'bg-black/30 border-white/10' : 'bg-white border-black/10 shadow-xs'
            }`}>
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                Email
              </span>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <a
                  href={`mailto:${email}`}
                  className="text-base sm:text-lg font-sans font-bold text-[#ff5e1a] hover:underline break-all"
                >
                  {email}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label={copiedEmail ? 'Email copied' : 'Copy email address'}
                  title={copiedEmail ? 'Copied to clipboard' : 'Copy email address'}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer border ${
                    copiedEmail
                      ? 'bg-green-500/15 border-green-500/30 text-green-500'
                      : isDark
                        ? 'border-white/15 bg-white/5 text-neutral-300 hover:border-[#ff5e1a] hover:text-[#ff5e1a]'
                        : 'border-black/15 bg-black/5 text-neutral-800 hover:border-[#ff5e1a] hover:text-[#ff5e1a]'
                  }`}
                >
                  {copiedEmail ? (
                    <>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Social Platforms */}
            <div className={`p-6 rounded-2xl border ${
              isDark ? 'bg-black/30 border-white/10' : 'bg-white border-black/10 shadow-xs'
            }`}>
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-neutral-400 block mb-3">
                Socials
              </span>
              <div className="flex items-center gap-3 flex-wrap">
                {designData?.footer?.socials?.map((social) => {
                  const brandKey = social.label.toLowerCase();
                  return (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      title={social.label}
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs ${
                        isDark
                          ? 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                          : 'border-black/10 bg-black/5 hover:border-black/25 hover:bg-black/10'
                      }`}
                    >
                      <SocialPlatformLogo brand={brandKey} />
                    </a>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Direct Form (7 cols) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>

      </div>
    </section>
  );
}
