---
name: impeccable
description: "Design system and craft skill by Paul Bakaus. Enforces intentional frontend aesthetics, eliminating generic AI defaults across typography, color palettes, spacing, micro-interactions, accessibility (WCAG AA), and responsive layouts. Use when the user asks to polish, critique, or audit frontend UI according to Impeccable standards."
version: 1.0.0
---

# Impeccable Design Language & Craft Skill

A design skill for AI coding agents created by Paul Bakaus. Transforms generic AI frontend outputs into intentional, human-crafted interfaces.

---

## Core Tenets

1. **Eliminate Pure Grays:** Never use dead neutral `#808080` or `#000000` with pure white. Tint all neutrals with the brand's primary color temperature (warm stone, cool slate, or deep bronze).
2. **Intentional Typographic Contrast:** Establish clear hierarchy. Pair a strong display font (grotesk, serif, or geometric) with high-legibility body type. Never use uniform font-size jumps.
3. **True Depth & Elevation:** Replace heavy blurry drop-shadows with layered ambient occlusion (tight dark border + subtle 1px inner highlight + subtle multi-layer blur).
4. **Physical Touch & Responsiveness:** Interactive elements must have satisfying active states (slight downward compression, spring rebound, tactile feedback).
5. **No AI Clichés:**
   - ❌ No pulsing status dot pills
   - ❌ No gradient text on headings
   - ❌ No single-word colored or italic accents
   - ❌ No repetitive 3-card feature grids with icons in boxes
   - ❌ No fake macOS browser chrome or floating blobs

---

## Commands & Workflows

| Command | Action |
| --- | --- |
| `audit` | Evaluates the UI against accessibility (contrast, hit targets), responsive breakpoints (320px to 1440px), and design consistency. |
| `polish` | Refines micro-interactions, borders, spacing rhythms, and active states on existing components. |
| `critique` | Provides structured heuristic feedback on UX, hierarchy, and visual weight. |
| `extract` | Extracts ad-hoc inline styles into reusable design system tokens. |
