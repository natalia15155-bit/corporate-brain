# Corporate Brain — Design Brief

## Objective

Design a trustworthy decision workspace for non-technical business users.

The experience should help a person move from a question to a verifiable Decision Card without understanding DataHub, metadata, lineage, MCP, or AI infrastructure.

## Desired feeling

- Calm
- Intelligent
- Trustworthy
- Focused
- Editorial
- Premium but not luxurious
- Human, not futuristic

## Product personality

Corporate Brain is a thoughtful analyst and institutional memory. It does not pretend to know what it cannot verify.

## Primary audience

- Business manager
- Team lead
- Operations lead
- Analyst
- Chief of Staff

The user is comfortable with business metrics but may have no technical data knowledge.

## Core design principles

### One obvious next action

Every screen should have a clear primary action.

### Progressive disclosure

Show the recommendation and key warning first. Reveal lineage, metadata, and detailed evidence on demand.

### Evidence before decoration

Visual hierarchy must make source status, freshness, ownership, and warnings easy to understand.

### Calm density

The interface may contain rich information, but it should use spacing, typography, grouping, and summaries to avoid feeling like a dashboard.

### No false precision

Use explainable trust bands, not percentage confidence scores.

## Required screens

### Screen 1 — Ask

Purpose: start or revisit a decision.

Contents:

- Corporate Brain wordmark
- A prominent natural-language question field
- Primary action: Analyze evidence
- Three example business questions
- Recent decisions
- Review alerts
- Minimal navigation

### Screen 2 — Decision Brief

Purpose: understand and verify a recommendation.

Contents:

- Business question
- Recommendation or abstention
- Trust band
- Short rationale
- Most important warning
- Evidence cards with source, owner, freshness, and status
- Risks and assumptions
- Recommended next action
- Primary action: Save decision
- Secondary actions: Request review and View evidence

### Screen 3 — Corporate Memory

Purpose: revisit decisions and identify what needs attention.

Contents:

- Decision list grouped by status
- Filters: Current, Needs review, Superseded
- Decision owner and review date
- Evidence-change alert
- Optional relationship graph as a secondary view

## Visual direction

Avoid:

- Neon gradients
- Dark sci-fi dashboards
- Chat bubbles as the main experience
- Dense analytics dashboards
- Decorative brain imagery
- Overwhelming node graphs
- Excessive glassmorphism

Explore:

- Warm neutral or cool neutral canvas
- Ink, slate, or deep navy text
- One restrained accent color
- Amber for caution and red only for actionable risk
- Green used sparingly for verified states
- Editorial typography and generous spacing
- Subtle borders and surfaces
- Clear source and status chips

## Inspiration without copying

- Obsidian: connected knowledge and depth
- Engram: persistent memory
- Linear: clarity and interaction discipline
- Notion: editorial calm
- Financial products: evidence and trust

Do not reproduce any third-party layout, logo, or branded visual asset.

## Accessibility

- WCAG AA contrast target
- Keyboard-operable controls
- Do not communicate status through color alone
- Minimum readable body size
- Visible focus states
- Responsive down to a mobile viewport

## Evaluation questions

For each visual direction:

1. Can a new user identify the primary action in five seconds?
2. Does the Decision Brief feel trustworthy?
3. Can the user distinguish evidence from AI inference?
4. Are warnings visible without making the product feel alarming?
5. Does the screen remain useful without the graph?
6. Would a manager use this before an important meeting?
