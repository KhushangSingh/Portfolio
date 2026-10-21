---
name: avoid-ai-design
description: "Audit and rewrite frontend UI to remove generic AI design patterns ('AI slop'), both first-order defaults (purple gradients, Inter, centered hero over three cards) and second-order defaults (cream with terracotta, near-black with acid green, all-caps mono labels, one accented headline word). Use when asked to 'de-slop a UI', 'audit for AI design tells', or 'scan frontend for AI patterns'."
license: MIT
metadata:
  version: "0.4.0"
  agentskills_spec: "1.0"
---

# Avoid AI Design: Audit & Rewrite

You are reviewing frontend code to find the patterns that make a UI look AI-generated ("AI slop"), then rewriting it around an intentional, bespoke design direction.

Targets: **HTML/CSS/JS** and **React + Tailwind + CSS**.

---

## The Two Orders of AI Defaults

- **First-Order (The Median):**
  - Purple-to-blue gradient headlines (`bg-clip-text text-transparent`)
  - Generic Inter or unstyled `sans-serif`
  - Predictable 3-card feature grids with top-left icons in rounded squares
  - Floating green/amber pulsing status pill badges ("Available for work")
  - Dark gray (`#0f172a`) grounds with purple glowing borders
- **Second-Order (The "Tasteful" AI Median):**
  - Cream ground with clay/terracotta accent (#F4F1EA / #D97757)
  - Near-black ground with single acid-green or vermilion accent
  - Monospaced all-caps micro labels on everything (`tracking-widest uppercase`)
  - Single word colored or italicized in a headline
  - Decorative `01 / 02 / 03` markers standing in for real hierarchy

---

## Operating Modes

1. **`rewrite` (Default):** Audit the code, identify the anti-pattern tells, commit to a unified direction, and rewrite.
2. **`detect`:** Audit and score only without modifying code. Runs the AST scanner `scripts/detect.mjs` and outputs a prioritized report of P0/P1/P2 tells.

---

## Running the AST Scanner

When Node 18+ is available:

```bash
node .agents/skills/avoid-ai-design/scripts/detect.mjs src/
```

Run with `--json` for structured data:
```bash
node .agents/skills/avoid-ai-design/scripts/detect.mjs --json src/
```

Exit codes:
- `0`: No P0/P1 tells found (clean handcrafted code).
- `2`: P0/P1 AI slop tells detected.
