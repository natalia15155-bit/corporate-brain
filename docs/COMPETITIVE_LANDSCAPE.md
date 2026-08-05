# Competitive landscape and product wedge

Last reviewed: 2026-08-05

Corporate Brain is not positioned as another enterprise search box, data
catalog, BI tool, or autonomous agent platform. Those categories already have
strong products. Its role is to connect them through a clear, governed path
from a question to an approved and reusable company decision.

## What companies use today

| Category | Representative products | Strength | Gap Corporate Brain can fill |
| --- | --- | --- | --- |
| Enterprise knowledge | Glean, Microsoft 365 Copilot, Notion AI, Sana, Dust | Finds and summarizes documents, messages and company knowledge with permission-aware retrieval | Usually does not calculate governed business metrics or distinguish an insight from an approved decision |
| Data context and governance | DataHub, Atlan, Collibra, Alation | Catalog, ownership, glossary, quality, lineage and policy context | Explains what data exists, but is not the transactional analytics engine or the complete decision workflow |
| Conversational analytics | ThoughtSpot Spotter, Power BI Copilot, Tableau Agent | Answers quantitative questions, generates visual analysis and supports follow-up exploration | The conversation is centered on analytics; cross-functional rationale, approval and durable decision memory remain separate work |
| Agents and actions | Salesforce Agentforce, Microsoft Copilot Studio, Dust | Specialized agents can retrieve context and execute workflows | Agent configuration can become fragmented by tool or department; a shared decision contract is not guaranteed |
| Operational decision platforms | Palantir AIP/Ontology, IBM Decision Intelligence, Nakisa | Unifies data, logic, simulations, approvals and operational actions | Broad and powerful, but typically a major enterprise platform adoption rather than a simple layer over an existing stack |
| Decision records | DecisionX, Decise, Logre and decision-log tools | Captures rationale, approvals, outcomes and lessons | Often starts after analysis or depends on users manually supplying the evidence |

## The defensible product gap

The gap is not a missing feature. It is the handoff between categories:

1. Knowledge search finds context but does not prove a metric.
2. A catalog proves where data comes from but does not calculate the answer.
3. BI calculates an answer but does not always preserve why a cross-functional
   decision was approved.
4. Agents can act, but action without an explicit approval contract is unsafe.
5. Decision logs preserve a conclusion, but often lose the live link to the
   evidence and its quality state.

Corporate Brain should own that handoff:

`Question -> Direct answer -> Analysis -> Proposal -> Human decision -> Action -> Outcome review -> Corporate memory`

Every transition is explicit. A user can save an insight without pretending it
is a decision, and the product cannot offer an approval action until the
required decision fields are complete.

## Product boundary

Corporate Brain complements existing systems through adapters:

- DataHub supplies authorized metadata, glossary, ownership, quality and lineage.
- A warehouse, database, semantic layer or BI adapter supplies actual metric values.
- Knowledge connectors supply documents, conversations, policies and prior context.
- Workflow connectors execute approved alerts, tickets and updates.
- Corporate Memory stores the decision, evidence snapshot, assumptions, owner,
  review date and later outcome.

This boundary is important for trust: metadata must never be presented as if it
were transactional data, and an LLM must never invent a calculation that the
analytical source cannot perform.

## Department Packs

The product stays horizontal through reusable Department Packs rather than a
separate application for every business area. Each pack defines:

- roles and permissions;
- business vocabulary and approved metrics;
- authorized data and knowledge sources;
- analytical capabilities and tools;
- common questions and response formats;
- decision templates and mandatory approval fields;
- alert and action policies;
- owners, escalation paths and review intervals.

Initial pack: Ecommerce. Candidate packs after the demo: Executive, Finance,
Customer Experience, Product, Operations, People and Sales.

## Demo differentiation

The hackathon demo should prove one complete story, not a catalog of promises:

1. A Data Analyst asks what sales data is available and sees a concise map.
2. The analyst asks which product is most profitable.
3. Corporate Brain either calculates it from an authorized metric source or
   clearly states which missing field prevents the calculation, while showing
   the closest valid answer.
4. The analyst follows up in the same thread.
5. An insight can be saved, but cannot be approved as a decision.
6. After alternatives, owner, risks, metric and review date are complete, a
   human can approve the decision and write it to Corporate Memory.
7. A change in source quality or a monitored metric reopens the decision.

## Strategic conclusion

The strongest position is **the role-aware decision layer over the tools a
company already uses**. Simplicity is part of the moat: users see one direct
answer and the next valid action, while governance, lineage and orchestration
remain inspectable underneath.
