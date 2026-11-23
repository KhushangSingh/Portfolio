import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import ContactForm from './ContactForm';
import { designData } from '../constants/data';
import BrandMark from './BrandMark';

export default function ContactSection() {
  const { isDark } = useTheme();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const email = designData?.footer?.email || 'khushang8508@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section 
      id="contact" 
      aria-labelledby="contact-heading"
      className={`relative z-10 py-20 sm:py-24 lg:py-28 px-6 md:px-12 border-t transition-colors duration-500 ${
        isDark ? 'bg-[#08080a] text-white border-white/10' : 'bg-[#F4F4F0] text-neutral-900 border-black/10'
      }`}
    >
      <div className="max-w-[1400px] w-full mx-auto">
        
        {/* Section Heading & Introductory Copy */}
        <div className="mb-10 sm:mb-14">
          <div className="inline-block px-3 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-[#ff5e1a] bg-[#ff5e1a]/10 border border-[#ff5e1a]/25 mb-3">
            Direct Communication Channel
          </div>
          <h2 id="contact-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Initiate Conversation
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-xl leading-relaxed">
            Send a direct message through the form below or reach out via official email. Inquiries route directly to Khushang's studio inbox without third-party platform sign-ins.
          </p>
        </div>

        {/* 2-Column Split: Context & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Direct Info & Guidelines (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Availability Box */}
            <div className={`p-6 rounded-2xl border ${
              isDark ? 'bg-black/30 border-white/10' : 'bg-white border-black/10 shadow-xs'
            }`}>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                Current Availability
              </span>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                Internships & Select Contracts
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                Open for Summer 2026 product design engineering internships, design system architecture contracts and ambitious web application builds.
              </p>

              <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 flex flex-col gap-2 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Based In:</span>
                  <span className="font-bold">India (Working Globally)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Typical Turnaround:</span>
                  <span className="font-bold text-[#ff5e1a]">Within 24 Hours</span>
                </div>
              </div>
            </div>

            {/* Email Quick Action Card */}
            <div className={`p-6 rounded-2xl border ${
              isDark ? 'bg-black/30 border-white/10' : 'bg-white border-black/10 shadow-xs'
            }`}>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                Direct Email
              </span>
              <a
                href={`mailto:${email}`}
                className="text-base sm:text-lg font-mono font-bold text-[#ff5e1a] hover:underline break-all block"
              >
                {email}
              </a>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                    copiedEmail
                      ? 'bg-green-500/15 border-green-500/30 text-green-500'
                      : isDark
                        ? 'border-white/15 bg-white/5 text-neutral-300 hover:border-[#ff5e1a]'
                        : 'border-black/15 bg-black/5 text-neutral-800 hover:border-[#ff5e1a]'
                  }`}
                >
                  {copiedEmail ? 'Copied to Clipboard' : 'Copy Email Address'}
                </button>

                <a
                  href={`mailto:${email}`}
                  className="text-xs font-mono text-neutral-500 hover:text-[#ff5e1a] underline"
                >
                  Open in Mail Client
                </a>
              </div>
            </div>

            {/* Social Network Platforms */}
            <div className={`p-6 rounded-2xl border ${
              isDark ? 'bg-black/30 border-white/10' : 'bg-white border-black/10 shadow-xs'
            }`}>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 block mb-3">
                Professional Networks
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {designData?.footer?.socials?.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                      isDark
                        ? 'border-white/10 bg-white/5 hover:border-[#ff5e1a] hover:text-[#ff5e1a]'
                        : 'border-black/10 bg-black/5 hover:border-[#ff5e1a] hover:text-[#ff5e1a]'
                    }`}
                  >
                    <BrandMark name={social.label.toLowerCase()} className="w-4 h-4 shrink-0" />
                    <span className="truncate">{social.label}</span>
                  </a>
                ))}
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
