import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Meaningful Industry Tool Logos (Figma, React)
 * Clean, instantly recognizable SVGs so visitors immediately recognize the tools at a glance.
 * All decorative sparkles, stars and symbols removed per professional craft directives.
 */
const RenderIcon = ({ name, isDark }) => {
  switch (name) {
    case 'figma':
      return (
        <span
          className={`inline-flex items-center justify-center w-5 h-5 rounded-[4px] border align-middle mx-1 select-none shadow-sm transition-transform hover:scale-110 ${
            isDark ? 'bg-purple-500/15 border-purple-500/30' : 'bg-purple-500/10 border-purple-500/25'
          }`}
          title="Figma UI/UX Design"
        >
          <svg className="w-3 h-3" viewBox="0 0 38 57" fill="none">
            <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
            <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
            <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
            <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
            <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
          </svg>
        </span>
      );

    case 'react':
    case 'code':
      return (
        <span
          className={`inline-flex items-center justify-center w-5 h-5 rounded-[4px] border align-middle mx-1 select-none shadow-sm transition-transform hover:scale-110 ${
            isDark ? 'bg-[#00d8ff]/15 border-[#00d8ff]/35' : 'bg-[#00d8ff]/10 border-[#00d8ff]/30'
          }`}
          title="React Frontend Engineering"
        >
          <svg viewBox="-11.5 -10.232 23 20.463" className="w-3.5 h-3.5" fill="none">
            <circle cx="0" cy="0" r="2.05" fill="#00d8ff" />
            <g stroke="#00d8ff" strokeWidth="1">
              <ellipse rx="11" ry="4.2" />
              <ellipse rx="11" ry="4.2" transform="rotate(60)" />
              <ellipse rx="11" ry="4.2" transform="rotate(120)" />
            </g>
          </svg>
        </span>
      );

    default:
      return null;
  }
};

/**
 * Regular Word Component
 * Individual word with scroll-driven progressive unblur and illumination.
 */
const RegularWord = ({ word, progress, range, isDark }) => {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const blurVal = useTransform(progress, range, [6, 0]);
  const filter = useTransform(blurVal, (v) => `blur(${v}px)`);

  return (
    <span className="relative inline-block mr-[0.28em] my-[0.06em]">
      <motion.span
        style={{ opacity, filter }}
        className={`inline-block will-change-[opacity,filter] ${
          isDark ? 'text-white/90' : 'text-neutral-800'
        }`}
      >
        {word}
      </motion.span>
    </span>
  );
};

/**
 * HighlightPhrase Component
 * Encloses single or consecutive highlighted words in one continuous lengthy highlight box.
 * Hugs the exact text width without bleeding into left/right whitespace,
 * with tightened vertical height.
 */
const HighlightPhrase = ({ phrase, punct, progress, range, isDark }) => {
  const [start, end] = range;

  // Progressive unblur and illumination across the phrase
  const opacity = useTransform(progress, range, [0.18, 1]);
  const blurVal = useTransform(progress, range, [6, 0]);
  const filter = useTransform(blurVal, (v) => `blur(${v}px)`);

  // Scroll-driven animated highlighter effect across the entire phrase
  const highlightStart = start;
  const highlightEnd = Math.min(1, start + (end - start) * 0.85);
  const highlightScaleX = useTransform(progress, [highlightStart, highlightEnd], [0, 1]);
  const highlightOpacity = useTransform(progress, [start, highlightEnd], [0.4, 1]);

  return (
    <span className="relative inline-block mr-[0.28em] my-[0.06em]">
      {/* Wrapped phrase container with isolated stacking context */}
      <span className="relative inline-block isolate px-1.5 py-0.5">
        {/* Solid continuous orange box highlight in both light and dark themes */}
        <motion.span
          style={{
            scaleX: highlightScaleX,
            opacity: highlightOpacity,
            transformOrigin: 'left center',
          }}
          className={`absolute inset-0 top-[0.06em] bottom-[0.04em] rounded-none pointer-events-none will-change-transform z-0 bg-[#ff5e1a] ${
            isDark
              ? 'shadow-[0_0_14px_rgba(255,94,26,0.45)]'
              : 'shadow-[0_2px_8px_rgba(255,94,26,0.35)]'
          }`}
        />

        {/* Primary Typography for Highlighted Words: Bold White on Orange */}
        <motion.span
          style={{ opacity, filter }}
          className="relative z-10 inline-block will-change-[opacity,filter] text-white font-bold"
        >
          {phrase}
        </motion.span>
      </span>

      {/* Trailing punctuation sits immediately outside the highlight box */}
      {punct && (
        <motion.span
          style={{ opacity, filter }}
          className={`inline-block will-change-[opacity,filter] ${
            isDark ? 'text-white/90' : 'text-neutral-900'
          }`}
        >
          {punct}
        </motion.span>
      )}
    </span>
  );
};

/**
 * Inline Visual Component
 * Progressively scales and unblurs alongside surrounding words during scroll.
 */
const InlineVisual = ({ icon, progress, range, isDark }) => {
  const iconElement = RenderIcon({ name: icon, isDark });
  if (!iconElement) return null;

  const opacity = useTransform(progress, range, [0.15, 1]);
  const scale = useTransform(progress, range, [0.65, 1]);
  const blurVal = useTransform(progress, range, [4, 0]);
  const filter = useTransform(blurVal, (v) => `blur(${v}px)`);

  return (
    <motion.span
      style={{ opacity, scale, filter }}
      className="inline-flex items-center justify-center align-middle my-[0.06em] select-none will-change-[transform,opacity,filter]"
    >
      {iconElement}
    </motion.span>
  );
};

/**
 * Core Craft Keywords for Automatic Highlighting
 * Fallback detection when plain unformatted text is provided.
 */
const FALLBACK_HIGHLIGHTS = [
  'thoughtful',
  'fast',
  'real craft',
  'Figma frames',
  'problem-driven UX solutions',
  'scalable design systems',
  'user friction',
  'production React code',
];

/**
 * Text Tokenizer
 * Parses paragraphs into regular words, unified highlight phrases and visual tool tokens.
 */
const tokenizeParagraph = (rawPara) => {
  let para = rawPara;

  // Auto-enrich plain text if no markdown bold formatting is present
  if (!para.includes('**')) {
    FALLBACK_HIGHLIGHTS.forEach((phrase) => {
      const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
      para = para.replace(regex, `**${phrase}**`);
    });
  }

  const tokens = [];
  // Token matching:
  // 1: **...** optionally followed by trailing punctuation (, . ! ? ; :)
  // 2: {[a-zA-Z0-9_-]+} (inline visual tool logo tag)
  // 3: [^\s]+ (regular words)
  const regex = /(\*\*[^*]+\*\*([.,!?;:]*))|(\{[a-zA-Z0-9_-]+\})|([^\s]+)/g;
  let match;

  while ((match = regex.exec(para)) !== null) {
    const [, boldWithPunct, punct, iconMatch, wordMatch] = match;

    if (boldWithPunct) {
      const phrase = boldWithPunct.slice(2, boldWithPunct.indexOf('**', 2));
      tokens.push({
        type: 'highlight',
        phrase: phrase,
        punct: punct || '',
      });
    } else if (iconMatch) {
      tokens.push({
        type: 'icon',
        name: iconMatch.slice(1, -1).toLowerCase(),
      });
    } else if (wordMatch) {
      tokens.push({
        type: 'word',
        text: wordMatch,
      });
    }
  }

  return tokens;
};

/**
 * ScrollWordReveal
 * Progressive scroll-driven text unblur and illumination effect
 * with animated tactile keyword highlighter sweeps and inline aesthetic visual symbols.
 */
export const ScrollWordReveal = ({
  text,
  className = '',
  isDark = true,
  offset = ['start 0.88', 'start 0.22'],
}) => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: offset,
  });

  // Split multi-paragraph copy
  const paragraphs = useMemo(() => {
    if (!text) return [];
    if (Array.isArray(text)) return text;
    return text.split(/\n\s*\n/).filter(Boolean);
  }, [text]);

  // Tokenize each paragraph and assign sequential indices for unified wave lighting
  const tokenizedParagraphs = useMemo(() => {
    let globalIndex = 0;
    return paragraphs.map((p) => {
      const tokens = tokenizeParagraph(p);
      return tokens.map((token) => ({
        ...token,
        index: globalIndex++,
      }));
    });
  }, [paragraphs]);

  const totalTokens = useMemo(() => {
    return tokenizedParagraphs.reduce((acc, p) => acc + p.length, 0);
  }, [tokenizedParagraphs]);

  // Organic lighting window across tokens
  const windowSize = 0.2;
  const step = totalTokens > 1 ? (1 - windowSize) / (totalTokens - 1) : 0;

  return (
    <div ref={containerRef} className={`space-y-6 ${className}`}>
      {tokenizedParagraphs.map((paraTokens, pIdx) => (
        <p key={pIdx} className="leading-[1.48] overflow-visible">
          {paraTokens.map((item) => {
            const start = item.index * step;
            const end = Math.min(1, start + windowSize);
            const range = [start, end];

            if (item.type === 'icon') {
              return (
                <InlineVisual
                  key={`icon-${item.index}-${item.name}`}
                  icon={item.name}
                  progress={scrollYProgress}
                  range={range}
                  isDark={isDark}
                />
              );
            }

            if (item.type === 'highlight') {
              return (
                <HighlightPhrase
                  key={`highlight-${item.index}-${item.phrase}`}
                  phrase={item.phrase}
                  punct={item.punct}
                  progress={scrollYProgress}
                  range={range}
                  isDark={isDark}
                />
              );
            }

            return (
              <RegularWord
                key={`word-${item.index}-${item.text}`}
                word={item.text}
                progress={scrollYProgress}
                range={range}
                isDark={isDark}
              />
            );
          })}
        </p>
      ))}
    </div>
  );
};

export default ScrollWordReveal;
