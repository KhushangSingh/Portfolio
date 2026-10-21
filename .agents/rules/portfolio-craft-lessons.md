# Portfolio Craft & Behind-the-Build Lessons (James Chugh Directives)

This rule codifies the practical design, engineering, and product lessons learned from the "Behind the Build" case study of *jameschugh.com* (built by James Chugh). These guidelines must be applied pragmatically across portfolio design and development whenever relevant.

---

## 1. Core Philosophy: The 7 Build Tenets

1. **Kill a Bad Idea Early:**
   - If an idea (e.g., hand-coded illustration, overly complex scroll-driven 2.5D staircase) is coming out weak or clumsy, scrape it immediately.
   - *Rule:* Scrapping early costs one session. Polishing a bad foundation costs weeks.
2. **Match the Idea to What Can Actually Be Produced:**
   - A concept you can cleanly produce and polish beats a grander one you cannot execute well.
   - When 3D/bespoke illustrators are unavailable, pivot to accessible high-craft mediums: high-resolution matte paintings, depth maps, notebook tactile textures, highlighter strokes, and curated typography.
3. **Give References a Job:**
   - Never say "make it interactive" or "make it cool."
   - State specific mechanical functions: *"the scroll effect from clouds to portfolio"*, *"the tactile spring drag of a vinyl tonearm"*, or *"auto-centering snap on horizontal carousel"*.
4. **Ask for Advice / Clarity, Then Build:**
   - Clarify *why* visitors would understand a section before writing pixels.
   - Validate the mental model first; code follows clarity.
5. **Work in Small Steps:**
   - One section, one transition, then evaluate. Big all-at-once builds hide compounding bugs and interaction clashes.
6. **Test on Real Devices:**
   - Test on real phones and small laptops (e.g. 1366x768 / 13" screens). Real screens catch overlapping headlines, misplaced pins, and touch-target collisions that synthetic windows miss.
7. **Ship Every Change:**
   - Build, commit, verify. Keep nothing trapped in long-running unverified drafts.
+ **Keep the Voice Yours:**
   - Real facts, grounded words, and authentic personal details. Zero corporate jargon, zero superlatives.

---

## 2. Layout, Typography & Viewport Discipline

- **The Recruiter Clarity Gate:**
  - Every screen, card, and interaction must answer: *What will a recruiter understand here within 5 seconds?*
  - If a conceptual or physical motif is used (journey map, vinyl player, drawing desk), anchor it with an unambiguous one-line key and clear story cards.
- **Small Laptop & Responsive Guard:**
  - Headlines must fluidly scale (`clamp(...)`) so they never collide with or cover location pins, badges, or controls on compact laptop screens (1366px or 13" laptops).
- **Mobile Phone Pass:**
  - Never just shrink a desktop layout down to mobile.
  - Enforce minimum **16px side gutters** across mobile screens.
  - Ensure all touch targets are **at least 48px**.
  - Prefer tap-through stages or segmented card views over endless, exhausting scrolls.
  - **Zero horizontal scroll/overflow** across any screen size (320px, 375px, 768px, 1024px+).

---

## 3. UI Aesthetics & Component Patterns

- **Anti-"AI-Pill" Case Studies:**
  - Case studies must not look like generic AI templates (cookie-cutter tag pills, identical Lucide icons, uniform metrics).
  - Use fewer headings, authentic conversational copy, bespoke imagery, and **one signature interaction per project concept**.
- **Button & CTA Hierarchy:**
  - Use plain glass / subtle backdrop-blur buttons for secondary navigation and utility controls.
  - Reserve solid, high-contrast filled styling for the primary conversion action (e.g., `Resume` / Contact) so it stands out immediately.
- **Theme Switching Integrity:**
  - Keep brand accent colors (e.g., `#ff5e1a`) 100% consistent across both light and dark modes.
  - Toggling themes should strictly shift surfaces between off-white/warm stone and obsidian/black, never mutating the accent into muddy or brownish variants.
- **Delight & Tactility ("Small things that make it feel alive"):**
  - Parallax with depth maps (near objects move more than far objects on tilt/drag).
  - Bespoke custom cursor with theme awareness.
  - Living community/personal touchpoints (visitor notes wall, visitor counter, Easter eggs).
  - Interaction-gated audio: sounds/music must only load and play after an explicit user tap, never autoplay, with visible top-bar controls.
