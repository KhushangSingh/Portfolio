# Anti-AI Slop & Bespoke Design Directives (Always-On Rule)

This project strictly adheres to handcrafted, intentional frontend design standards. Never default to generic AI coding assistant patterns, overused templates, or synthetic placeholders.

---

## 1. Strict Negative Constraints (Zero-Tolerance Banned Tells)

### Visual Clichés & Anti-Patterns
1. **NO Pulsing Status Badges / Pills:** Never generate "Available for work", "v1.0 is here", or green pulsing dot (`animate-ping`) pill badges.
2. **NO Text Gradients on Headlines:** Never use `bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500` or similar rainbow gradients on primary headings. Use solid, high-contrast, confident typography.
3. **NO Single-Word Colored Accents:** Never pick one random word in a headline to color differently or italicize (e.g. `Built to <span className="text-purple-500">scale</span>`).
4. **NO Predictable 3-Card Feature Grids:** Never default to the generic 3 identical rounded cards with a top-left Lucide icon in a rounded square. Use varied macrostructures (editorial asymmetry, list-details, split stages, physical layouts).
5. **NO Default "AI Purple / Cyan on Black":** Avoid `#0f172a` or `#09090b` grounds paired with `#8b5cf6` or `#06b6d4` glowing borders. Use tailored brand palettes (warm stone, rich parchment, obsidian, bespoke terracotta/amber).
6. **NO Generic Pill Buttons:** Never use standard `rounded-full` buttons with slight hover glow. Buttons must possess authentic physical affordance, crisp editorial borders, or tangible tactile feedback.
7. **NO Redrawn UI Chrome:** Never construct fake browser chrome (URL pills with 3 traffic-light macOS dots) or fake phone frames.
8. **NO System Font Soup:** Never default to unconfigured `system-ui` or generic Inter. Pair intentional typography (distinct display grotesk or editorial serif paired with high-legibility sans or monospaced technical accents).

### Content & Logic Clichés
9. **NO Fabricated Proof or Superlatives:** Never invent fake stats (*"Trusted by 50,000+ teams"*, *"10x faster"*, *"Elevate your workflow"*). Use honest, concise, grounded copy.
10. **NO Floating Background Blobs:** Avoid arbitrary blurred colored circles (`blur-3xl opacity-30 rounded-full`) drifting aimlessly behind content.
11. **NO Over-Engineered Tooltips / Popups (The 'Dot & Techno-Babble' Slop):** Never add indicator dots (status pips, pulsing LEDs), multi-line pseudo-tech jargon (e.g., `// CLICK TAB`, `DECK ACTIVE`), or redundant meta-descriptions to hover cards, tooltips, or action popups. Keep hover cues and action tips clean, simple, and elegant (like the Appearance rope hover box): single-line text (e.g. `Pull for Light`, `Push to Tuck`), compact padding (`px-3 py-1.5 rounded-lg`), theme-aware surface, crisp triangular beak, zero decorative dot clutter, zero extra text.

---

## 2. Positive Craft & Physicality Directives

1. **Physical Affordance & Tactility:** Every interactive element should feel like a real object with authentic mechanical feedback (e.g. realistic spring damping, real-time angular drag, authentic sound synthesis, mechanical switch snap).
2. **Deliberate Typography Hierarchy:** Anchor headings with substantial weight contrast, tight line-heights, and expressive character.
3. **Intentional Spacing & Rhythms:** Establish generous vertical pacing and responsive fluid scaling rather than repetitive uniform paddings.
4. **Mobile Integrity:** Ensure every layout adapts seamlessly across small mobile (320px, 375px), tablet, and desktop viewports without clipping or awkward overflows.
5. **Pre-Emit Quality Gate:** Before outputting any component or layout, critique it against the 67 AI design tells in `.agents/skills/avoid-ai-design/` and the Hallmark slop gates.

---

## 3. Practical Portfolio Craft Directives (Learned from Real-World Builds)

1. **The Recruiter Clarity Gate:** Every section, layout, and interaction must clearly answer: *What will a recruiter/evaluator understand here within 5 seconds?* Avoid ambiguous metaphors; if using conceptual/physical motifs (e.g. vinyl deck, journey map), anchor them with a concise one-line key and direct story cues.
2. **Anti-"AI-Pills" Case Studies:** Never reduce projects to a formulaic stack of tag pills, generic metrics, and Lucide bullet points. Use fewer headings, grounded conversational copy, authentic imagery, and **one focused interactive mechanic per core idea**.
3. **Execution Over Ambition ("Kill Bad Ideas Early"):** A concept you can execute to bespoke perfection beats a grander concept that falls apart in implementation. Scrapping an awkward premise early saves weeks of polishing flawed foundations.
4. **Specific Reference Directives:** Never execute vague instructions like "make it interactive". Give every transition and animation a specific mechanical job (e.g. physical hinge drag with spring damping, inward cylindrical card perspective, alpha-masked text truncation).
5. **Button & Visual Hierarchy:** Plain glass / subtle frosted blur for secondary navigation and utility controls; solidly filled, high-contrast styling for the primary conversion action (`Resume` / Contact) so it stands out immediately.
6. **Small Device & Mobile Rigor:**
   - Enforce 16px minimum screen gutters on mobile.
   - Maintain minimum 48px touch targets for all interactive controls.
   - Prefer tap-through or split stages over endless exhausting mobile scrolls.
   - Zero horizontal overflow under any viewport width (320px, 375px, 768px, desktop).
7. **Small Laptop & Collision Guard:** Fluidly scale headlines (`clamp(...)`) so hero typography never covers or collides with location pins, badges, or interactive controls on 13" laptops (1366x768).
8. **Theme Integrity & Palette Consistency:** Keep brand accent colors (e.g., `#ff5e1a`) 100% consistent across both light and dark themes. Switch grounds cleanly between off-white/warm stone and obsidian/black; never introduce muddy or brownish tints to the accent in light mode.
9. **Interaction-First Sound & Restraint:** Sound effects and audio must load/play ONLY after an explicit user tap or drag gesture, never autoplay unprompted, and must always provide immediate, visible mute/stop controls.
10. **Authentic Human Voice:** Use real facts, grounded language, and personal quirks (e.g. mood boards, real musical taste, behind-the-scenes honesty). Make the portfolio feel like a real person crafted it with obsessive care.
11. **External Benchmark & Animation Grounding (ThreeUI & GSAP Directives):** Whenever designing or implementing complex animations, 3D elements, WebGL shaders, camera trajectories, or motion physics, reference and learn from state-of-the-art benchmarks on [ThreeUI](https://threeui.com/) and [GSAP](https://gsap.com/). Extract their physical affordances, mathematical easing curves, shader math, and scrubbed scroll mechanics, then adapt them into the portfolio's bespoke design system.
12. **No Unprompted Browser Simulation / Screenshots:** NEVER launch browser simulation (`browser_subagent`) or capture screenshots after code edits without the user's explicit permission. Verify code strictly through static checks and terminal builds (`npm run build`), leaving visual review in the live browser directly to the user.


