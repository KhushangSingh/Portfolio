---
name: hallmark
description: "Anti-AI-slop design skill for greenfield pages, audits, redesigns, and design extraction from URLs or screenshots. Use when the user asks to build a new app or landing page, wants to redesign something, invokes Hallmark by name, or uses audit/redesign/study."
version: 1.1.0
---

# Hallmark

A design skill for AI coding assistants. Makes the UIs they generate look made, not generated.

Hallmark encodes a tight set of rules — drawn from the consensus of the anti-AI-slop design movement — and refuses to let the model fall back to the defaults every LLM was trained on.

Hallmark insists on **structural variety**, not just visual variety. Two pages by Hallmark for two different briefs should not share the same hero → 3-feature → CTA → footer rhythm. They should feel like different sites, not different colour-swaps of the same template.

---

## Verbs & Capabilities

| Invocation | What it does |
| --- | --- |
| *(default / build)* | Design or build something new adhering to Hallmark's strict macrostructure catalog and themes. |
| `hallmark audit <target>` | Read the target, score it against the anti-pattern list, return a ranked punch list. **Do not edit.** |
| `hallmark redesign <target> [--mood <name>]` | Take the target's content and intent, then redesign the visual structure inside existing implementation boundaries. |
| `hallmark study <screenshot \| URL>` | Extract the design DNA (macrostructure, archetypes, type-pairing, color anchor) from a reference image or live URL. |

---

## Core Disciplines Across Every Verb

1. **Pre-emit Self-Critique:** Before returning any output, score it 1–5 on six axes: *Philosophy, Hierarchy, Execution, Specificity, Restraint, Variety*. Any score < 3 triggers a revision pass. Stamp: `/* Hallmark · pre-emit critique: P5 H4 E5 S4 R5 V5 */`.
2. **Honest Copy — No Fabricated Content:** If the user did not supply a metric, do not invent one. No fake numbers like *"+47% conversion"* or *"trusted by 50,000+ teams"*.
3. **Locked Tokens — No Mid-Render Improvisation:** Every color and font must reference a named token. Inline hex or arbitrary colors bypassing design tokens are forbidden.
4. **Re-drawn Chrome Forbidden:** Never construct fake browser chrome (URL pill + traffic-light dots) or fake phone frames.
5. **Mobile Responsiveness Verified:** Every emit must be verified at 320px, 375px, 414px, and 768px. No horizontal scroll, root `overflow-x: clip`, no two-line clickable buttons.
6. **Typography Purity — No Italic Headers:** Headings and display type are always roman (`font-style: normal`). Never italicize a single word inside an upright heading.

---

## The 8-State Component Discipline
Every interactive component MUST ship code for all 8 states:
1. `default`
2. `hover`
3. `:focus-visible`
4. `:active`
5. `disabled`
6. `loading`
7. `error`
8. `success`
