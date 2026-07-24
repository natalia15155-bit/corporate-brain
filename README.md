# Corporate Brain

Corporate Brain is a decision-memory agent for organizations.

It helps a business user answer four questions:

1. What did we decide?
2. Why did we decide it?
3. Which evidence supported the decision?
4. Is that evidence still trustworthy today?

Corporate Brain uses DataHub as its evidence and context layer. It connects decisions to datasets, dashboards, metrics, owners, lineage, quality signals, and business documentation. When an underlying source changes, Corporate Brain can identify decisions that may need review.

## Hackathon

This project is being created for **Build with DataHub: The Agent Hackathon**.

- Submission deadline: August 10, 2026
- Intended category: Agents That Do Real Work
- Required foundation: DataHub Open Source and DataHub MCP
- License: Apache 2.0

## Product promise

> Understand, decide, and remember — using evidence you can verify.

## MVP experience

1. Ask a business question.
2. Retrieve relevant evidence from DataHub.
3. Generate a concise Decision Card.
4. Show evidence, limitations, and a trust level.
5. Ask a human to confirm before saving.
6. Write the approved context back to DataHub.
7. Flag the decision when its supporting evidence changes.

## Product principles

- **Useful:** every interaction should help complete a real decision workflow.
- **Simple:** users do not need to understand metadata, lineage, MCP, or LLMs.
- **Trustworthy:** every conclusion is supported by evidence or the system abstains.
- **Calm and visual:** the interface prioritizes clarity over dashboards and technical detail.
- **Human-controlled:** consequential writes require explicit confirmation.
- **Zero-cost MVP:** no paid API or infrastructure may be enabled for the hackathon.

## Planned technology

- Next.js
- TypeScript
- DataHub Open Source
- DataHub MCP Server
- Groq Free Tier with `openai/gpt-oss-120b`
- Gemini API Free Tier as a disabled fallback
- Vercel Hobby for the experimental public demo

No paid OpenAI API and no Supabase database are planned for the hackathon MVP.

## Documentation

- [Product requirements](./PRD.md)
- [Architecture](./ARCHITECTURE.md)
- [Roadmap](./ROADMAP.md)
- [Architecture decisions](./docs/DECISIONS.md)
- [Design brief](./docs/DESIGN_BRIEF.md)
- [Stitch prompt](./docs/STITCH_PROMPT.md)
- [Submission checklist](./docs/SUBMISSION_CHECKLIST.md)

## Current status

Phase 0 — product definition and architecture. No functional application code has been written yet.
