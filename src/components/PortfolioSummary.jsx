import React, { useState, useEffect } from 'react';
import BrandMark from './BrandMark';
import AppleBrowserMockup from './AppleBrowserMockup';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { designData } from '../constants/data';
import { OTAKU_CIRCLE_CASE_STUDY } from '../constants/otakuCircle';
import { CERTIFICATES_DATA } from '../constants/credentialsData';

/**
 * PortfolioSummary Component
 * 
 * A compact visual summary & executive resume page:
 * - High density layout optimized for fast skimming with minimal scrolling
 * - Interactive tabbed project showcase with full-width unclipped browser previews
 * - Direct links to download PDF resume and return to the interactive portfolio
 */
const projectTagBrands = {
  Figma: 'figma',
  'Figma Systems': 'figma',
  'React 19': 'react',
  'React Architecture': 'react',
  'Tailwind CSS': 'tailwind',
};

export default function PortfolioSummary() {
  const { isDark } = useTheme();
  const [activeProjectTab, setActiveProjectTab] = useState('otakucircle');
  const [showAllProjects, setShowAllProjects] = useState(false);

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resumeUrl = designData.about?.resumeUrl || "/images/designResume.pdf";
  const linkedInUrl = "https://www.linkedin.com/in/khushangsingh2004";
  const email = designData.footer?.email || "designwithkhushang@gmail.com";

  // Flagship projects definition
  const projects = [
    {
      id: 'otakucircle',
      title: 'OtakuCircle',
      badge: 'SaaS Platform',
      badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      year: '2024',
      role: 'Product Designer & Full Stack Developer',
      desc: 'A comprehensive anime community & tracking discovery platform. Designed an immersive obsidian dark UI with frosted glassmorphism, smart search by scenario and AI vibe-based recommendation architecture. Built responsive frontend tokens and cataloging flows.',
      tags: ['Figma', 'React 19', 'Tailwind CSS', 'Design Tokens', 'SaaS Architecture'],
      image: '/images/otakucircle/landing.webp',
      alt: 'OtakuCircle desktop experience',
      link: OTAKU_CIRCLE_CASE_STUDY,
      linkText: 'Read the OtakuCircle case study',
    },
    {
      id: 'squadsync',
      title: 'SquadSync',
      badge: 'Product Suite',
      badgeColor: 'bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/30',
      year: '2024',
      role: 'Product Designer & Interaction Architect',
      desc: 'Merit-based collaboration platform connecting university students based on competency with a structured Request & Approval workflow. Replaced chaotic social groups with verified skill matching, workspaces and applicant review dashboards.',
      tags: ['Product Design', 'Figma Systems', 'Applicant Dashboards', 'Workflow Logic'],
      image: '/images/squadsync_cover.jpg',
      alt: 'SquadSync desktop experience',
    },
    {
      id: 'ledgerly',
      title: 'Ledgerly',
      badge: 'Design Engineering',
      badgeColor: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
      year: '2024',
      role: 'Design Engineer & Architect',
      desc: 'A centralized high-speed digital vault built to eliminate bookmark clutter. Provides a structured environment where developers and designers discover domain-specific resources and maintain personal interactive repositories with instant retrieval.',
      tags: ['React Architecture', 'High-Speed Vaults', 'Tailwind CSS', 'Design Tokens'],
      image: '/images/ledgerly_cover.jpg',
      alt: 'Ledgerly desktop experience',
    },
  ];

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 font-sans ${
      isDark ? 'bg-[#08080a] text-white' : 'bg-[#F8F8F5] text-neutral-900'
    }`}>
      
      {/* MAIN EXECUTIVE RESUME CONTAINER (COMPACT PADDING & TIGHTER SPACING) */}
      <main className="max-w-[1200px] xl:max-w-[1260px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pt-20 sm:pt-24 pb-12 sm:pb-16 flex flex-col gap-8 sm:gap-10 md:gap-12">
        
        {/* Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/10 dark:border-white/10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-[#ff5e1a] dark:hover:text-[#ff5e1a] transition-colors"
          >
            <span>← Back to Interactive Portfolio</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-sans font-bold uppercase tracking-wider bg-[#ff5e1a] text-white hover:bg-[#e0480a] transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Download PDF Resume</span>
            </a>
          </div>
        </div>
        
        {/* COMPACT IDENTITY & EXECUTIVE PROFILE */}
        <section className="flex flex-col gap-3.5 border-b pb-6 sm:pb-8 border-black/10 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Khushang Singh
              </h1>
              <p className="text-lg sm:text-xl font-bold tracking-tight text-neutral-600 dark:text-neutral-300">
                Product Designer & UX Engineer
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>Available for Full-Time Roles</span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-3xl font-normal">
            B.Tech in Computer Science & Engineering at Vellore Institute of Technology (VIT). 
            Bridging user empathy and technical execution by designing scalable design token architectures, 
            crafting complex SaaS interaction workflows and writing production-ready React code with obsessive physical craft.
          </p>

          {/* Quick Contact & Fact Strip */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-neutral-600 dark:text-neutral-400 pt-1">
            <span>India (Working Globally)</span>
            <span>·</span>
            <a href={`mailto:${email}`} className="text-[#ff5e1a] hover:underline font-bold">
              {email}
            </a>
            <span>·</span>
            <a href={linkedInUrl} target="_blank" rel="noreferrer" className="hover:text-[#ff5e1a] transition-colors">
              LinkedIn
            </a>
            <span>·</span>
            <Link to="/" className="hover:text-[#ff5e1a] transition-colors">
              Interactive 3D Battlestation
            </Link>
          </div>
        </section>

        {/* 1. FLAGSHIP SHIPPED WORKS (TABBED QUICK PREVIEW TO MINIMIZE SCROLL) */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                01 / Flagship Shipped Works
              </h2>
              <span className="text-[10px] font-mono opacity-50">· 3 Flagship Projects</span>
            </div>

            {/* Quick Interactive Project Switcher (Allows Viewing All 3 in 1 Viewport) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center p-1 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                {projects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      setActiveProjectTab(proj.id);
                      setShowAllProjects(false);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      !showAllProjects && activeProjectTab === proj.id
                        ? 'bg-[#ff5e1a] text-white shadow-xs'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {proj.title}
                  </button>
                ))}
              </div>

              {/* View All Toggle */}
              <button
                onClick={() => setShowAllProjects(!showAllProjects)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-colors border cursor-pointer ${
                  showAllProjects 
                    ? 'bg-[#ff5e1a] text-white border-transparent' 
                    : 'border-black/10 dark:border-white/10 opacity-70 hover:opacity-100'
                }`}
                title="Toggle between compact tabbed view and stacked list"
              >
                {showAllProjects ? 'Compact Tabs' : 'View All (3)'}
              </button>
            </div>
          </div>

          {/* Project Cards (Filtered by tab in Compact Mode or stacked when View All is toggled) */}
          <div className="flex flex-col gap-5">
            {projects
              .filter((proj) => showAllProjects || proj.id === activeProjectTab)
              .map((proj) => (
                <div
                  key={proj.id}
                  className={`group p-5 sm:p-6 lg:p-7 rounded-2xl border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8 lg:gap-10 transition-all ${
                    isDark ? 'bg-[#101115] border-white/10' : 'bg-white border-black/10 shadow-xs'
                  }`}
                >
                  {/* Left Column: Project Details */}
                  <div className="flex flex-col gap-2.5 w-full lg:w-[38%] xl:w-[36%] shrink-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight">{proj.title}</h3>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${proj.badgeColor}`}>
                        {proj.badge}
                      </span>
                      <span className="text-xs font-mono text-neutral-500">{proj.year}</span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                      {proj.role}
                    </p>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {proj.desc}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.tags.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-100 dark:bg-white/5 border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300">
                          {projectTagBrands[tag] && <BrandMark brand={projectTagBrands[tag]} className="h-3 w-3" />}
                          {tag}
                        </span>
                      ))}
                    </div>

                    {proj.link && (
                      <Link to={proj.link} className="self-start mt-1 text-xs font-semibold text-[#ae3600] dark:text-[#ff8b56] hover:underline">
                        {proj.linkText}
                      </Link>
                    )}
                  </div>

                  {/* Right Column: Full-Width Unclipped Browser Mockup */}
                  <div className="w-full lg:w-[62%] xl:w-[64%]">
                    <AppleBrowserMockup
                      src={proj.image}
                      alt={proj.alt}
                      className="transition-transform duration-300 ease-out group-hover:scale-[1.015]"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* 2. CORE COMPETENCIES (COMPACT 4-COLUMN STRIP) */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            02 / Core Competencies
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {designData.hero.steps.map((step) => (
              <div
                key={step.id}
                className={`p-4 rounded-xl border transition-all ${
                  isDark 
                    ? 'bg-[#101115] border-white/10 hover:border-white/20' 
                    : 'bg-white border-black/10 hover:border-black/20 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-[#ff5e1a]">
                    {step.number}
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-500">
                    {step.tagline}
                  </span>
                </div>
                <h3 className="text-sm font-bold tracking-tight mb-1">
                  {step.title}
                </h3>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-2">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. TECHNICAL TOOLKIT & SKILLS (COMPACT 3-COLUMN PANEL) */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            03 / Technical Toolkit & Capabilities
          </h2>

          <div className={`p-5 sm:p-6 rounded-2xl border grid grid-cols-1 md:grid-cols-3 gap-6 ${
            isDark ? 'bg-[#101115] border-white/10' : 'bg-white border-black/10 shadow-xs'
          }`}>
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff5e1a] mb-2.5">
                Product & Systems Design
              </h3>
              <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                <li>• Design Systems & Multi-Brand Libraries</li>
                <li>• High-Fidelity Interactive Prototyping (Figma)</li>
                <li>• Heuristic Evaluation & Usability Audits</li>
                <li>• User Journey Mapping & Information Architecture</li>
                <li>• Responsive Breakpoints & WCAG AA Accessibility</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff5e1a] mb-2.5">
                Frontend Engineering
              </h3>
              <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                <li>• React 19 & Next.js Architecture</li>
                <li>• Tailwind CSS & Token Architecture</li>
                <li>• Framer Motion & Interactive Physics</li>
                <li>• Three.js & WebGL 3D Math / Shaders</li>
                <li>• State Management & Clean Component Governance</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff5e1a] mb-2.5">
                Creative Tech & Tools
              </h3>
              <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                <li>• Sketch & Inkscape Vector Tooling</li>
                <li>• Adobe Creative Cloud (Illustrator, Photoshop)</li>
                <li>• Git, GitHub & CI/CD Deployment</li>
                <li>• LLM Integration & Agentic Product Flows</li>
                <li>• Performance Auditing & Zero-Latency Pipelines</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. VERIFIED CERTIFICATIONS & EDUCATION (COMPACT SIDE-BY-SIDE GRID) */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            04 / Credentials & Education
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
            {/* Certifications (3 cards) */}
            {CERTIFICATES_DATA.map((cert) => (
              <div
                key={cert.id}
                className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                  isDark ? 'bg-[#101115] border-white/10' : 'bg-white border-black/10 shadow-xs'
                }`}
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#ff5e1a]">
                      {cert.badgeText}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {cert.date}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold tracking-tight">
                    {cert.title}
                  </h3>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {cert.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-500 truncate mr-2">
                    {cert.issuer}
                  </span>
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#ff5e1a] hover:underline font-bold shrink-0"
                  >
                    Verify
                  </a>
                </div>
              </div>
            ))}

            {/* Education Card (4th card in grid) */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
              isDark ? 'bg-[#101115] border-white/10' : 'bg-white border-black/10 shadow-xs'
            }`}>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-500">
                    Degree
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    {designData.about.education.year}
                  </span>
                </div>
                <h3 className="text-xs font-bold tracking-tight">
                  {designData.about.education.degree}
                </h3>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                  {designData.about.education.college}
                </p>
              </div>

              <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span>Computer Science</span>
                <span className="text-emerald-500 font-bold">In Progress</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. COMPACT FOOTER CALL-TO-ACTION */}
        <section className={`p-6 sm:p-8 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left ${
          isDark 
            ? 'bg-gradient-to-br from-[#151518] to-[#0a0a0c] border-white/15' 
            : 'bg-gradient-to-br from-white to-[#F2F2ED] border-black/15 shadow-sm'
        }`}>
          <div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Ready to create together?
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
              Available for design engineering internships, product design contracts and ambitious software builds.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
            <Link
              to="/#contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-[#ff5e1a] text-white hover:bg-[#e0480a] transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Send Message</span>
            </Link>

            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border border-black/15 dark:border-white/15 hover:border-[#ff5e1a] text-neutral-800 dark:text-neutral-200 hover:text-[#ff5e1a] transition-all"
            >
              <span>Email Directly</span>
            </a>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border border-black/10 dark:border-white/10 opacity-75 hover:opacity-100 transition-opacity"
            >
              <span>Back to Studio</span>
            </Link>
          </div>
        </section>

      </main>

      {/* BOTTOM COPYRIGHT STRIP */}
      <footer className={`border-t py-4 transition-colors duration-500 ${
        isDark ? 'border-white/10 bg-black/40' : 'border-black/10 bg-black/5'
      }`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
          <p className="normal-case text-[11px]">
            © 2026 Khushang Singh. Designed and developed.
          </p>

          <button
            onClick={scrollToTop}
            aria-label="Back to top of page"
            title="Back to top"
            className={`group w-8 h-8 rounded-lg border flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
              isDark
                ? 'border-white/15 bg-white/5 text-neutral-300 hover:border-[#ff5e1a] hover:text-[#ff5e1a]'
                : 'border-black/15 bg-black/5 text-neutral-700 hover:border-[#ff5e1a] hover:text-[#ff5e1a]'
            }`}
          >
            <svg 
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" 
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
      </footer>

    </div>
  );
}
