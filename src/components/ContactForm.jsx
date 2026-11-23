import React, { useState } from 'react';
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
            <div className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider bg-[#ff5e1a]/15 text-[#ff5e1a] border border-[#ff5e1a]/30">
              Dispatched to Khushang
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Message Delivered
            </h3>

            <p className={`text-sm leading-relaxed max-w-lg ${
              isDark ? 'text-neutral-300' : 'text-neutral-700'
            }`}>
              Thank you {submittedReceipt.name}. Your inquiry has been routed straight to Khushang's inbox. An email confirmation has been logged under reference <span className="font-mono font-bold text-[#ff5e1a]">#{submittedReceipt.id.slice(-6).toUpperCase()}</span>.
            </p>

            <div className={`w-full p-4 rounded-xl border text-xs font-mono space-y-1.5 ${
              isDark ? 'bg-black/40 border-white/10 text-neutral-400' : 'bg-neutral-50 border-black/10 text-neutral-600'
            }`}>
              <div className="flex justify-between">
                <span>Sender:</span>
                <span className="text-neutral-200 dark:text-neutral-200">{submittedReceipt.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="text-[#ff5e1a] font-bold">{submittedReceipt.inquiryType}</span>
              </div>
              <div className="flex justify-between">
                <span>Expected Turnaround:</span>
                <span className="text-neutral-200 dark:text-neutral-200">Within 24 hours</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border border-black/15 dark:border-white/15 hover:border-[#ff5e1a] text-neutral-800 dark:text-neutral-200 hover:text-[#ff5e1a] transition-all cursor-pointer"
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
              <div className="inline-block px-3 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-[#ff5e1a] bg-[#ff5e1a]/10 border border-[#ff5e1a]/25 mb-2">
                Direct Contact
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                Send a Message
              </h3>
              <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Reach Khushang directly without leaving the website. Messages go straight to his personal studio inbox.
              </p>
            </div>

            {errors.form && (
              <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-medium">
                {errors.form}
              </div>
            )}

            {/* Name and Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label 
                  htmlFor="contact-name" 
                  className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
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
                  className={`px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-colors ${
                    errors.name 
                      ? 'border-red-500 bg-red-500/5' 
                      : isDark 
                        ? 'border-white/15 bg-black/30 focus:border-[#ff5e1a]' 
                        : 'border-black/15 bg-neutral-50 focus:border-[#ff5e1a]'
                  }`}
                />
                {errors.name && (
                  <span className="text-xs text-red-500 font-medium">{errors.name}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label 
                  htmlFor="contact-email" 
                  className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
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
                  className={`px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-colors ${
                    errors.email 
                      ? 'border-red-500 bg-red-500/5' 
                      : isDark 
                        ? 'border-white/15 bg-black/30 focus:border-[#ff5e1a]' 
                        : 'border-black/15 bg-neutral-50 focus:border-[#ff5e1a]'
                  }`}
                />
                {errors.email && (
                  <span className="text-xs text-red-500 font-medium">{errors.email}</span>
                )}
              </div>
            </div>

            {/* Social Account & Inquiry Type Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label 
                  htmlFor="contact-social" 
                  className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
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
                  className={`px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-colors ${
                    isDark 
                      ? 'border-white/15 bg-black/30 focus:border-[#ff5e1a]' 
                      : 'border-black/15 bg-neutral-50 focus:border-[#ff5e1a]'
                  }`}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label 
                  htmlFor="contact-inquiry-type" 
                  className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
                >
                  Inquiry Nature
                </label>
                <select
                  id="contact-inquiry-type"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  className={`px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-colors cursor-pointer ${
                    isDark 
                      ? 'border-white/15 bg-[#121317] text-white focus:border-[#ff5e1a]' 
                      : 'border-black/15 bg-neutral-50 text-neutral-900 focus:border-[#ff5e1a]'
                  }`}
                >
                  {INQUIRY_TYPES.map((type) => (
                    <option key={type} value={type} className={isDark ? 'bg-[#121317] text-white' : 'bg-white text-neutral-900'}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subject Line */}
            <div className="flex flex-col gap-1.5">
              <label 
                htmlFor="contact-subject" 
                className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
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
                className={`px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-colors ${
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
                  className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
                >
                  Message <span className="text-[#ff5e1a]">*</span>
                </label>
                <span className="text-[11px] font-mono text-neutral-400">
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
                className={`px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-colors resize-y min-h-[110px] ${
                  errors.message 
                    ? 'border-red-500 bg-red-500/5' 
                    : isDark 
                      ? 'border-white/15 bg-black/30 focus:border-[#ff5e1a]' 
                      : 'border-black/15 bg-neutral-50 focus:border-[#ff5e1a]'
                }`}
              />
              {errors.message && (
                <span className="text-xs text-red-500 font-medium">{errors.message}</span>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[#ff5e1a] text-white hover:bg-[#e0480a] transition-all duration-300 shadow-md hover:shadow-[#ff5e1a]/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                <span>{isSubmitting ? 'Dispatching Message...' : 'Send Message Directly'}</span>
              </button>

              <span className="text-[11px] text-neutral-500 font-mono">
                No third-party login needed
              </span>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
