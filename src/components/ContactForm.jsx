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
  const [submittedReceipt, setSubmittedReceipt] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSelectInquiry = (type) => {
    setFormData((prev) => ({ ...prev, inquiryType: type }));
    setIsDropdownOpen(false);
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
    try {
      playSoundEffect('click');
    } catch {
      // audio fallback
    }

    try {
      const saved = await addMessage(formData);
      setSubmittedReceipt(saved);
      if (onSubmitted) {
        onSubmitted(saved);
      }
    } catch (err) {
      console.error('Failed to dispatch message:', err);
      setErrors({ form: 'An unexpected issue occurred while sending. Please try again or email directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      socialUrl: '',
      inquiryType: 'Internship / Full-time',
      subject: '',
      message: ''
    });
    setSubmittedReceipt(null);
    setErrors({});
    setIsDropdownOpen(false);
  };

  return (
    <div className={`relative p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
      isDark 
        ? 'bg-[#0f1013] border-white/10 text-white shadow-xl shadow-black/40' 
        : 'bg-white border-black/10 text-neutral-900 shadow-lg shadow-neutral-200/50'
    } ${className}`}>

      <AnimatePresence mode="wait">
        {submittedReceipt ? (
          <motion.div
            key="receipt"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start gap-4 py-4"
          >
            <div className="inline-block px-3 py-1 rounded-md text-xs font-sans font-bold uppercase tracking-wider bg-[#ff5e1a]/15 text-[#ff5e1a] border border-[#ff5e1a]/30">
              Dispatched to Khushang
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight font-sans">
              Message Delivered
            </h3>

            <p className={`text-sm leading-relaxed max-w-lg font-sans ${
              isDark ? 'text-neutral-300' : 'text-neutral-700'
            }`}>
              Thank you {submittedReceipt.name}. Your inquiry has been routed straight to Khushang's inbox. An email confirmation has been logged under reference <span className="font-sans font-bold text-[#ff5e1a]">#{submittedReceipt.id.slice(-6).toUpperCase()}</span>.
            </p>

            <div className={`w-full p-4 rounded-xl border text-xs font-sans space-y-1.5 ${
              isDark ? 'bg-black/40 border-white/10 text-neutral-400' : 'bg-neutral-50 border-black/10 text-neutral-600'
            }`}>
              <div className="flex justify-between">
                <span>Sender:</span>
                <span className="text-neutral-200 dark:text-neutral-200 font-medium">{submittedReceipt.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="text-[#ff5e1a] font-bold">{submittedReceipt.inquiryType}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider border border-black/15 dark:border-white/15 hover:border-[#ff5e1a] text-neutral-800 dark:text-neutral-200 hover:text-[#ff5e1a] transition-all cursor-pointer"
            >
              <span>Send Another Note</span>
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
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
                onChange={handleChange}
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
                onChange={handleChange}
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

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-sans font-bold uppercase tracking-wider bg-[#ff5e1a] text-white hover:bg-[#e0480a] transition-all duration-300 shadow-md hover:shadow-[#ff5e1a]/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                <span>{isSubmitting ? 'Dispatching Message...' : 'Send Message Directly'}</span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
