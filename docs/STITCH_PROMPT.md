# Prompt for Google Stitch

Paste the prompt below into Stitch as a new design project.

---

Design exactly three comparable high-fidelity visual directions for a responsive web application called **Corporate Brain**.

Corporate Brain is a decision-memory agent for organizations. It helps non-technical business users understand what was decided, why it was decided, which evidence supported it, and whether that evidence is still trustworthy.

The application uses DataHub behind the scenes to verify datasets, dashboards, metrics, ownership, lineage, freshness, quality signals, and business definitions. Do not expose technical terms such as MCP, RAG, embeddings, or metadata infrastructure in the primary interface.

The product promise is:

**Understand, decide, and remember — using evidence you can verify.**

Create the same three-screen product flow in each visual direction:

## Screen 1: Ask

- Corporate Brain wordmark and minimal navigation
- One prominent natural-language question input
- Primary button labeled “Analyze evidence”
- Example question: “Should we increase the marketing budget next quarter?”
- Three suggested questions
- Recent decisions
- A small review-alert area

## Screen 2: Decision Brief

Show a realistic completed example for:

“Should we increase the marketing budget next quarter?”

The content should include:

- Recommendation: “Increase with caution”
- Trust level: “Medium”
- Short evidence-backed rationale
- Main warning: conversion data is 48 hours behind
- Evidence cards showing source name, owner, freshness, and status
- Risks
- Assumptions
- Recommended next action
- Primary button: “Save decision”
- Secondary buttons: “Request review” and “View evidence”

Clearly distinguish:

- Verified evidence
- System assessment
- AI-generated explanation

Do not use a numerical confidence percentage.

## Screen 3: Corporate Memory

- Decisions grouped into Current, Needs review, and Superseded
- Decision owner and review date
- A visible alert showing that a supporting data source changed
- An optional relationship graph accessible as a secondary view, not the default
- A clear path back to the Decision Brief

## Visual principles

The product should feel calm, intelligent, trustworthy, focused, editorial, and premium without feeling luxurious.

Use:

- Generous spacing
- Strong information hierarchy
- Subtle borders and surfaces
- Warm or cool neutral backgrounds
- Ink, slate, or deep navy text
- One restrained accent color
- Amber for caution
- Red only for actionable risk
- Green sparingly for verified states
- Clear status chips
- Accessible typography
- Visible keyboard focus states
- WCAG AA contrast

Avoid:

- Generic chatbot layouts
- Neon gradients
- Dark sci-fi dashboards
- Decorative brain illustrations
- Dense BI dashboards
- Excessive glassmorphism
- Overwhelming knowledge graphs
- Copying any existing product layout or brand

The three directions should be meaningfully different but equally complete:

1. **Editorial Calm** — warm, thoughtful, document-like, excellent for executive reading.
2. **Operational Clarity** — crisp, structured, efficient, excellent for frequent daily use.
3. **Connected Memory** — subtle relationship cues inspired by connected knowledge, without making a graph the main interface.

Design desktop-first at 1440px and include one mobile adaptation of the Decision Brief for each direction.

Keep all visible interface copy in English for the hackathon.

After generating the designs, provide:

- A short rationale for each direction
- Color tokens
- Typography recommendations
- Spacing and radius tokens
- Reusable component list
- Recommended direction for trust, usability, and visual differentiation
- A DESIGN.md that can be handed to a coding agent

---

## What to return to Codex

After Stitch finishes, share one of the following:

- The Stitch project link, or
- Screenshots of the three directions, or
- The exported `DESIGN.md`

Do not export production code yet. The first goal is to select the experience and design system.
