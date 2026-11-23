import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { addMessage } from '../utils/messageService';
import { playSoundEffect } from '../utils/soundEffects';

const INQUIRY_TYPES = [
  'Internship / Full-time',
  'Freelance Project',
  'Design Consultation',
  'Collaboration',
  'General Inquiry'
];

export default function ContactForm({ className = '', onSubmitted }) {
  const { isDark } = useTheme();
  const formRef = useRef(null);
  const dropdownRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const thumbsUpTimeoutRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    socialUrl: '',
    inquiryType: 'Internship / Full-time',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showThumbsUp, setShowThumbsUp] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Click-outside and Escape key listener for custom dropdown menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (thumbsUpTimeoutRef.current) clearTimeout(thumbsUpTimeoutRef.current);
    };
  }, []);

  // Trigger peeking Spider-Man when user focuses or types into any field
  const handleFieldFocus = () => {
    setIsTyping(true);
    if (showThumbsUp) {
      setShowThumbsUp(false);
      setIsSuccess(false);
    }
  };

  const handleFieldBlur = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      const active = document.activeElement;
      if (!formRef.current || !formRef.current.contains(active)) {
        setIsTyping(false);
      }
    }, 1400);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    setIsTyping(true);
    if (showThumbsUp) {
      setShowThumbsUp(false);
      setIsSuccess(false);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    // Keep peeking while typing; tucks back after 3 seconds of idle if focus is lost
    typingTimeoutRef.current = setTimeout(() => {
      const active = document.activeElement;
      if (!formRef.current || !formRef.current.contains(active)) {
        setIsTyping(false);
      }
    }, 3200);
  };

  const handleSelectInquiry = (type) => {
    setFormData((prev) => ({ ...prev, inquiryType: type }));
    setIsDropdownOpen(false);
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      const active = document.activeElement;
      if (!formRef.current || !formRef.current.contains(active)) {
        setIsTyping(false);
      }
    }, 2800);
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Please provide your name';
    }
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please provide a brief message';
    } else if (formData.message.trim().length < 15) {
      errs.message = 'Please share a bit more detail (minimum 15 characters)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      try {
        playSoundEffect('switch');
      } catch {
        // audio fallback
      }
      return;
    }

    setIsSubmitting(true);
    setIsTyping(false);
    try {
      playSoundEffect('click');
    } catch {
      // audio fallback
    }

    try {
      const saved = await addMessage(formData);
      setIsSuccess(true);
      setShowThumbsUp(true);

      // Reset form fields cleanly so it remains available
      setFormData({
        name: '',
        email: '',
        socialUrl: '',
        inquiryType: 'Internship / Full-time',
        subject: '',
        message: ''
      });

      if (onSubmitted) {
        onSubmitted(saved);
      }

      // Automatically hide thumbs-up spiderman after 10 seconds
      if (thumbsUpTimeoutRef.current) {
        clearTimeout(thumbsUpTimeoutRef.current);
      }
      thumbsUpTimeoutRef.current = setTimeout(() => {
        setShowThumbsUp(false);
        setIsSuccess(false);
      }, 10000);

    } catch (err) {
      console.error('Failed to dispatch message:', err);
      setErrors({ form: 'An unexpected issue occurred while sending. Please try again or email directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      ref={formRef}
      className={`relative p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
        isDark 
          ? 'bg-[#0f1013] border-white/10 text-white shadow-xl shadow-black/40' 
          : 'bg-white border-black/10 text-neutral-900 shadow-lg shadow-neutral-200/50'
      } ${className}`}
    >
      {/* 1. PEEKING SPIDER-MAN: Appears outside the side border when user types in any form field */}
      <AnimatePresence>
        {isTyping && !showThumbsUp && (
          <motion.div
            key="peeking-spiderman"
            initial={{ x: -140, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -140, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 105,
              damping: 14,
              mass: 0.85
            }}
            className="absolute left-full top-20 sm:top-24 md:top-28 z-20 pointer-events-none select-none -ml-2 sm:-ml-3"
            style={{
              clipPath: 'inset(-40px -280px -40px 0px)'
            }}
          >
            <img
              src="/images/spiderman_peeking.svg"
              alt="Spider-Man peeking from side border"
              className="w-32 sm:w-40 md:w-52 lg:w-60 h-auto object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. THE FORM (Remains visible and interactive at all times) */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-5"
      >
        <div>
          <div className="inline-block px-3 py-1 rounded-md text-[11px] font-sans font-bold uppercase tracking-wider text-[#ff5e1a] bg-[#ff5e1a]/10 border border-[#ff5e1a]/25 mb-2">
            Direct Contact
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight font-sans">
            Send a Message
          </h3>
          <p className={`text-xs sm:text-sm mt-1 leading-relaxed font-sans ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            Reach Khushang directly without leaving the website. Messages go straight to his personal studio inbox.
          </p>
        </div>

        {errors.form && (
          <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-sans font-medium">
            {errors.form}
          </div>
        )}

        {/* Name and Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label 
              htmlFor="contact-name" 
              className="text-xs font-sans font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
            >
              Your Name <span className="text-[#ff5e1a]">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFieldChange}
              onFocus={handleFieldFocus}
              onBlur={handleFieldBlur}
              placeholder="e.g. Alex Chen"
              className={`px-3.5 py-2.5 rounded-xl text-sm font-sans border outline-none transition-colors ${
                errors.name 
                  ? 'border-red-500 bg-red-500/5' 
                  : isDark 
                    ? 'border-white/15 bg-black/30 focus:border-[#ff5e1a]' 
                    : 'border-black/15 bg-neutral-50 focus:border-[#ff5e1a]'
              }`}
            />
            {errors.name && (
              <span className="text-xs text-red-500 font-sans font-medium">{errors.name}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label 
              htmlFor="contact-email" 
              className="text-xs font-sans font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
            >
              Email Address <span className="text-[#ff5e1a]">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFieldChange}
              onFocus={handleFieldFocus}
              onBlur={handleFieldBlur}
              placeholder="e.g. alex@company.com"
              className={`px-3.5 py-2.5 rounded-xl text-sm font-sans border outline-none transition-colors ${
                errors.email 
                  ? 'border-red-500 bg-red-500/5' 
                  : isDark 
                    ? 'border-white/15 bg-black/30 focus:border-[#ff5e1a]' 
                    : 'border-black/15 bg-neutral-50 focus:border-[#ff5e1a]'
              }`}
            />
            {errors.email && (
              <span className="text-xs text-red-500 font-sans font-medium">{errors.email}</span>
            )}
          </div>
        </div>

        {/* Social Account & Custom Inquiry Type Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label 
              htmlFor="contact-social" 
              className="text-xs font-sans font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
            >
              Social Profile or Handle
            </label>
            <input
              id="contact-social"
              type="text"
              name="socialUrl"
              value={formData.socialUrl}
              onChange={handleFieldChange}
              onFocus={handleFieldFocus}
              onBlur={handleFieldBlur}
              placeholder="e.g. linkedin.com/in/... or @github"
              className={`px-3.5 py-2.5 rounded-xl text-sm font-sans border outline-none transition-colors ${
                isDark 
                  ? 'border-white/15 bg-black/30 focus:border-[#ff5e1a]' 
                  : 'border-black/15 bg-neutral-50 focus:border-[#ff5e1a]'
              }`}
            />
          </div>

          {/* Bespoke Custom Dropdown for Inquiry Nature */}
          <div className="flex flex-col gap-1.5 relative" ref={dropdownRef}>
            <label 
              id="inquiry-type-label"
              className="text-xs font-sans font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
            >
              Inquiry Nature
            </label>

            <button
              type="button"
              id="contact-inquiry-type"
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              aria-labelledby="inquiry-type-label contact-inquiry-type"
              onClick={() => {
                setIsDropdownOpen((prev) => !prev);
                handleFieldFocus();
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-sans flex items-center justify-between border outline-none transition-colors cursor-pointer text-left ${
                isDark 
                  ? 'border-white/15 bg-black/30 text-white focus:border-[#ff5e1a]' 
                  : 'border-black/15 bg-neutral-50 text-neutral-900 focus:border-[#ff5e1a]'
              } ${isDropdownOpen ? 'border-[#ff5e1a]' : ''}`}
            >
              <span className="font-medium truncate">{formData.inquiryType}</span>
              <motion.span 
                animate={{ rotate: isDropdownOpen ? 180 : 0 }} 
                transition={{ duration: 0.2 }}
                className="text-neutral-400 ml-2 shrink-0 pointer-events-none"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </motion.span>
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.ul
                  role="listbox"
                  aria-labelledby="inquiry-type-label"
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className={`absolute top-full left-0 right-0 mt-1.5 z-50 p-1.5 rounded-xl border backdrop-blur-md shadow-2xl overflow-hidden font-sans ${
                    isDark 
                      ? 'bg-[#15161b]/98 border-white/15 text-white shadow-black/80' 
                      : 'bg-white/98 border-black/15 text-neutral-900 shadow-neutral-300/60'
                  }`}
                >
                  {INQUIRY_TYPES.map((type) => {
                    const isSelected = formData.inquiryType === type;
                    return (
                      <li
                        key={type}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelectInquiry(type)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-[#ff5e1a]/15 text-[#ff5e1a] font-semibold' 
                            : isDark 
                              ? 'hover:bg-white/10 text-neutral-300 hover:text-white' 
                              : 'hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950'
                        }`}
                      >
                        <span>{type}</span>
                        {isSelected && (
                          <svg className="w-4 h-4 text-[#ff5e1a] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </li>
                    );
                  })}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Subject Line */}
        <div className="flex flex-col gap-1.5">
          <label 
            htmlFor="contact-subject" 
            className="text-xs font-sans font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
          >
            Subject
          </label>
          <input
            id="contact-subject"
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleFieldChange}
            onFocus={handleFieldFocus}
            onBlur={handleFieldBlur}
            placeholder="e.g. Design engineering internship or contract inquiry"
            className={`px-3.5 py-2.5 rounded-xl text-sm font-sans border outline-none transition-colors ${
              isDark 
                ? 'border-white/15 bg-black/30 focus:border-[#ff5e1a]' 
                : 'border-black/15 bg-neutral-50 focus:border-[#ff5e1a]'
            }`}
          />
        </div>

        {/* Message Body */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label 
              htmlFor="contact-message" 
              className="text-xs font-sans font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
            >
              Message <span className="text-[#ff5e1a]">*</span>
            </label>
            <span className="text-[11px] font-sans text-neutral-400">
              {formData.message.length} chars
            </span>
          </div>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleFieldChange}
            onFocus={handleFieldFocus}
            onBlur={handleFieldBlur}
            placeholder="Share project goals, role requirements or what you would like to create together..."
            className={`px-3.5 py-2.5 rounded-xl text-sm font-sans border outline-none transition-colors resize-y min-h-[110px] ${
              errors.message 
                ? 'border-red-500 bg-red-500/5' 
                : isDark 
                  ? 'border-white/15 bg-black/30 focus:border-[#ff5e1a]' 
                  : 'border-black/15 bg-neutral-50 focus:border-[#ff5e1a]'
            }`}
          />
          {errors.message && (
            <span className="text-xs text-red-500 font-sans font-medium">{errors.message}</span>
          )}
        </div>

        {/* Submit Action Row */}
        <div className="pt-2 min-h-[56px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer ${
              isSuccess
                ? 'bg-green-600 text-white shadow-green-600/25'
                : 'bg-[#ff5e1a] text-white hover:bg-[#e0480a] shadow-[#ff5e1a]/25 hover:scale-[1.02] active:scale-[0.98]'
            } disabled:opacity-50`}
          >
            {isSubmitting ? (
              <span>Dispatching Message...</span>
            ) : isSuccess ? (
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Message Sent
              </span>
            ) : (
              <span>Send Message Directly</span>
            )}
          </button>
        </div>
      </form>

      {/* 3. THUMBS UP SPIDER-MAN: Moves smoothly upwards from bottom border on right side of send button */}
      <AnimatePresence>
        {showThumbsUp && (
          <div 
            className="absolute right-2 sm:right-6 md:right-8 bottom-0 z-30 pointer-events-auto select-none flex flex-col items-end"
            style={{
              clipPath: 'inset(-260px -80px 0px -80px)'
            }}
          >
            {/* Dialogue Cloud saying "Congrats, message sent!" */}
            <motion.div
              initial={{ opacity: 0, scale: 0.65, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.65, y: 20 }}
              transition={{ delay: 0.22, type: 'spring', stiffness: 220, damping: 18 }}
              onClick={() => {
                setShowThumbsUp(false);
                setIsSuccess(false);
              }}
              title="Click to dismiss"
              className={`relative mb-3 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl border shadow-2xl font-sans text-xs sm:text-sm md:text-base font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform ${
                isDark 
                  ? 'bg-[#18191f] text-white border-white/20 shadow-black/80' 
                  : 'bg-white text-neutral-900 border-black/15 shadow-neutral-300/70'
              }`}
            >
              <span>Congrats, message sent!</span>
              {/* Dialogue Cloud Beak */}
              <div 
                className={`absolute -bottom-2 right-12 sm:right-20 md:right-24 w-3.5 h-3.5 rotate-45 border-r border-b ${
                  isDark ? 'bg-[#18191f] border-white/20' : 'bg-white border-black/15'
                }`} 
              />
            </motion.div>

            {/* Spider-Man rising smoothly upwards from the form bottom border */}
            <motion.div
              initial={{ y: 260, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 260, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 85,
                damping: 14,
                mass: 0.85
              }}
              className="relative cursor-pointer"
              onClick={() => {
                setShowThumbsUp(false);
                setIsSuccess(false);
              }}
            >
              <img
                src="/images/spiderman_thumbsup.svg"
                alt="Spider-Man giving thumbs up"
                className="h-40 sm:h-48 md:h-56 lg:h-64 w-auto object-contain drop-shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
