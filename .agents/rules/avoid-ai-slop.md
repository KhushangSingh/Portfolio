# Anti-AI Slop & Bespoke Design Rules

Always enforce handcrafted, intentional, and physical UI design across this repository.

## Negative Constraints
- ❌ **No Pulsing Dots / Status Pills:** No `animate-ping` green dots or generic "Available for work" pills.
- ❌ **No Gradient Headlines:** No `bg-clip-text text-transparent bg-gradient-to-r`.
- ❌ **No Single-Word Headline Accents:** No coloring or italicizing a single word inside a header.
- ❌ **No Cliché 3-Card Feature Grids:** No uniform 3-column cards with icons in rounded boxes.
- ❌ **No Purple-on-Dark AI Defaults:** Use bespoke, grounded color palettes.
- ❌ **No Hand-Built macOS Dots / Fake Windows:** No mock browser chrome or fake traffic light dots.
- ❌ **No Generic Buttons:** Ensure buttons have physical borders, tactile press states, and clear affordance.
- ❌ **No Over-Engineered Tooltips / Popups (The 'Dot & Techno-Babble' Slop):** No artificial indicator dots, pulsing status pips, multi-line techno-babble (`// CLICK TAB`, `DECK ACTIVE`), or redundant extra text. Keep hover cues clean, simple, and elegant like the Appearance rope hover box (`px-3 py-1.5 rounded-lg`, theme-aware, single-line text, crisp triangular beak, zero decorative dot clutter).

## Positive Guidelines
- ✅ Implement physical micro-interactions (e.g. spring physics, drag-and-drop, tactile toggles).
- ✅ Maintain intentional editorial typography hierarchy.
- ✅ Support all interactive states: default, hover, focus-visible, active, disabled.
- ✅ Ensure zero horizontal overflow and responsive scaling down to 320px.
