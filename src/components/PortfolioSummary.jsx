import React, { useEffect } from 'react';
import BrandMark from './BrandMark';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { designData } from '../constants/data';
import { OTAKU_CIRCLE_CASE_STUDY } from '../constants/otakuCircle';
import { CERTIFICATES_DATA } from '../constants/credentialsData';

/**
 * PortfolioSummary Component
 * 
 * A bespoke visual summary & executive resume page:
 * - Clear, high-contrast editorial hierarchy
 * - All portfolio details condensed with premium design and typography
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

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 font-sans ${
      isDark ? 'bg-[#08080a] text-white' : 'bg-[#F8F8F5] text-neutral-900'
    }`}>
      
      {/* 1. TOP STICKY NAVIGATION BAR */}
      <header className={`sticky top-0 z-50 w-full backdrop-blur-xl border-b transition-colors duration-500 ${
        isDark ? 'bg-[#08080a]/85 border-white/10' : 'bg-[#F8F8F5]/85 border-black/10'
      }`}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-[#ff5e1a] dark:hover:text-[#ff5e1a] transition-colors"
          >
            <span>Interactive Portfolio</span>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#ff5e1a] text-white hover:bg-[#e0480a] transition-all duration-300 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Download PDF</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. MAIN RESUME CONTENT CONTAINER */}
      <main className="max-w-[1200px] mx-auto px-6 md:px-12 py-12 sm:py-16 md:py-20 flex flex-col gap-16 md:gap-20">
        
        {/* HEADER / IDENTITY SECTION */}
        <section className="flex flex-col gap-6 border-b pb-12 sm:pb-16 border-black/10 dark:border-white/10">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.02]">
              Khushang Singh
            </h1>
            <p className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-600 dark:text-neutral-300">
              Product Designer & UX Engineer
            </p>
          </div>

          <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-3xl font-normal">
            B.Tech in Computer Science & Engineering at Vellore Institute of Technology (VIT). 
            Bridging user empathy and technical execution by designing scalable design token architectures, 
            crafting complex SaaS interaction workflows, and writing production-ready React code with obsessive physical craft.
          </p>

          {/* Key Facts Strip */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs font-mono pt-2 text-neutral-600 dark:text-neutral-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Open for Internships & Full-Time Roles
            </span>
            <span>·</span>
            <span>India (Working Globally)</span>
            <span>·</span>
            <a href={`mailto:${email}`} className="text-[#ff5e1a] hover:underline font-bold">
              {email}
            </a>
            <span>·</span>
            <a href={linkedInUrl} target="_blank" rel="noreferrer" className="hover:text-[#ff5e1a] transition-colors">
              LinkedIn
            </a>
          </div>
        </section>

        {/* 3. CORE COMPETENCIES / PILLARS */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            01 / Core Competencies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {designData.hero.steps.map((step) => (
              <div
                key={step.id}
                className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                  isDark 
                    ? 'bg-[#101115] border-white/10 hover:border-white/20' 
                    : 'bg-white border-black/10 hover:border-black/20 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold text-[#ff5e1a]">
                    {step.number}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    {step.tagline}
                  </span>
                </div>
                <h3 className="text-base font-bold tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. FLAGSHIP SHIPPED PROJECTS */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              02 / Flagship Shipped Works
            </h2>
            <Link to="/" className="text-xs font-mono text-[#ff5e1a] hover:underline flex items-center gap-1">
              <span>View interactive showcase</span>
            </Link>
          </div>

          <div className="flex flex-col gap-6">
            {/* Project 1: OtakuCircle */}
            <div className={`p-6 sm:p-8 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 ${
              isDark ? 'bg-[#101115] border-white/10' : 'bg-white border-black/10 shadow-xs'
            }`}>
              <div className="flex flex-col gap-2 max-w-2xl">
                <h3 className="text-2xl font-bold tracking-tight">OtakuCircle</h3>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    SaaS Platform
                  </span>
                  <span className="text-xs font-mono text-neutral-500">2024</span>
                </div>
                <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                  Product Designer & Full Stack Developer
                </p>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  A comprehensive anime community & tracking discovery platform. Designed an immersive obsidian dark UI with frosted glassmorphism, smart search by scenario, and AI vibe-based recommendation architecture. Built responsive frontend tokens and cataloging flows.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['Figma', 'React 19', 'Tailwind CSS', 'Design Tokens', 'SaaS Architecture'].map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-neutral-100 dark:bg-white/5 border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300">
                      {projectTagBrands[tag] && <BrandMark brand={projectTagBrands[tag]} className="h-3 w-3" />}
                      {tag}
                    </span>
                  ))}
                </div>
                <Link to={OTAKU_CIRCLE_CASE_STUDY} className="self-start min-h-12 flex items-center text-sm font-semibold text-[#ae3600] dark:text-[#ff8b56] hover:underline">
                  Read the OtakuCircle case study
                </Link>
              </div>

              <div className="w-full md:w-56 shrink-0 aspect-[16/10] rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-neutral-900 shadow-md">
                <img
                  src="/images/otakucircle/landing.webp"
                  alt="OtakuCircle Preview"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Project 2: SquadSync */}
            <div className={`p-6 sm:p-8 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 ${
              isDark ? 'bg-[#101115] border-white/10' : 'bg-white border-black/10 shadow-xs'
            }`}>
              <div className="flex flex-col gap-2 max-w-2xl">
                <h3 className="text-2xl font-bold tracking-tight">SquadSync</h3>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-pink-500/15 text-pink-600 dark:text-pink-400 border border-pink-500/30">
                    Product Suite
                  </span>
                  <span className="text-xs font-mono text-neutral-500">2024</span>
                </div>
                <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                  Product Designer & Interaction Architect
                </p>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Merit-based collaboration platform connecting university students based on competency with a structured 'Request & Approval' workflow. Replaced chaotic social groups with verified skill matching, workspaces, and applicant review dashboards.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['Product Design', 'Figma Systems', 'Applicant Dashboards', 'Workflow Logic'].map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-neutral-100 dark:bg-white/5 border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300">
                      {projectTagBrands[tag] && <BrandMark brand={projectTagBrands[tag]} className="h-3 w-3" />}
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-56 shrink-0 aspect-[16/10] rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-neutral-900 shadow-md">
                <img
                  src="/images/squadsync_cover.jpg"
                  alt="SquadSync Preview"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Project 3: Ledgerly */}
            <div className={`p-6 sm:p-8 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 ${
              isDark ? 'bg-[#101115] border-white/10' : 'bg-white border-black/10 shadow-xs'
            }`}>
              <div className="flex flex-col gap-2 max-w-2xl">
                <h3 className="text-2xl font-bold tracking-tight">Ledgerly</h3>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30">
                    Design Engineering
                  </span>
                  <span className="text-xs font-mono text-neutral-500">2024</span>
                </div>
                <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                  Design Engineer & Architect
                </p>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  A centralized high-speed digital vault built to eliminate bookmark clutter. Provides a structured environment where developers and designers discover domain-specific resources and maintain personal interactive repositories with instant retrieval.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['React Architecture', 'High-Speed Vaults', 'Tailwind CSS', 'Design Tokens'].map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-neutral-100 dark:bg-white/5 border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300">
                      {projectTagBrands[tag] && <BrandMark brand={projectTagBrands[tag]} className="h-3 w-3" />}
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-56 shrink-0 aspect-[16/10] rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-neutral-900 shadow-md">
                <img
                  src="/images/ledgerly_cover.jpg"
                  alt="Ledgerly Preview"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 5. VERIFIED CERTIFICATIONS */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            03 / Verified Certifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CERTIFICATES_DATA.map((cert) => (
              <div
                key={cert.id}
                className={`p-6 rounded-2xl border flex flex-col justify-between gap-4 ${
                  isDark ? 'bg-[#101115] border-white/10' : 'bg-white border-black/10 shadow-xs'
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ff5e1a]">
                      {cert.badgeText}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500">
                      {cert.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {cert.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-500">
                    Issuer: <strong className="text-neutral-800 dark:text-neutral-200">{cert.issuer}</strong>
                  </span>
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#ff5e1a] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Verify</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. TECHNICAL TOOLKIT & SKILLS */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            04 / Technical Toolkit & Capabilities
          </h2>

          <div className={`p-6 sm:p-8 rounded-2xl border grid grid-cols-1 md:grid-cols-3 gap-8 ${
            isDark ? 'bg-[#101115] border-white/10' : 'bg-white border-black/10 shadow-xs'
          }`}>
            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#ff5e1a] mb-3">
                Product & Systems Design
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                <li>• Design Systems & Multi-Brand Libraries</li>
                <li>• High-Fidelity Interactive Prototyping (Figma)</li>
                <li>• Heuristic Evaluation & Usability Audits</li>
                <li>• User Journey Mapping & Information Architecture</li>
                <li>• Responsive Breakpoints & WCAG AA Accessibility</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#ff5e1a] mb-3">
                Frontend Engineering
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                <li>• React 19 & Next.js Architecture</li>
                <li>• Tailwind CSS & Token Architecture</li>
                <li>• Framer Motion & Interactive Physics</li>
                <li>• Three.js & WebGL 3D Math / Shaders</li>
                <li>• State Management & Clean Component Governance</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#ff5e1a] mb-3">
                Creative Tech & Tools
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                <li>• Spline 3D & Blender Modeling</li>
                <li>• Adobe Creative Cloud (Illustrator, Photoshop)</li>
                <li>• DaVinci Resolve & Motion Asset Pipelines</li>
                <li>• Git, GitHub & CI/CD Deployment</li>
                <li>• LLM Integration & Agentic Product Flows</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 7. EDUCATION */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            05 / Education
          </h2>

          <div className={`p-6 sm:p-8 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
            isDark ? 'bg-[#101115] border-white/10' : 'bg-white border-black/10 shadow-xs'
          }`}>
            <div>
              <h3 className="text-lg font-bold tracking-tight">
                {designData.about.education.degree}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {designData.about.education.college}
              </p>
            </div>
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold border border-[#ff5e1a]/30 text-[#ff5e1a] bg-[#ff5e1a]/10 shrink-0">
              {designData.about.education.year}
            </span>
          </div>
        </section>

        {/* 8. FOOTER CALL-TO-ACTION */}
        <section className={`p-8 sm:p-12 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left ${
          isDark 
            ? 'bg-gradient-to-br from-[#151518] to-[#0a0a0c] border-white/15' 
            : 'bg-gradient-to-br from-white to-[#F2F2ED] border-black/15 shadow-md'
        }`}>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to create together?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Available for design engineering internships, product design contracts, and ambitious software builds.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#ff5e1a] text-white hover:bg-[#e0480a] transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Get In Touch</span>
            </a>

            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider border border-black/15 dark:border-white/15 hover:border-[#ff5e1a] text-neutral-800 dark:text-neutral-200 hover:text-[#ff5e1a] transition-all"
            >
              <span>Back to Portfolio</span>
            </Link>
          </div>
        </section>

      </main>

      {/* 9. BOTTOM BAR */}
      <footer className={`border-t py-6 transition-colors duration-500 ${
        isDark ? 'border-white/10 bg-black/40' : 'border-black/10 bg-black/5'
      }`}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p className="normal-case">
            © 2026 Khushang Singh. Designed and developed with care.
          </p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 hover:text-[#ff5e1a] transition-colors cursor-pointer font-mono font-bold uppercase text-[11px]"
          >
            <span>Back to Top</span>
          </button>
        </div>
      </footer>

    </div>
  );
}

