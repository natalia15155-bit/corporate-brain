# Corporate Brain — Devpost submission draft

## Primary category

**Agents That Do Real Work**

## Tagline

Turn governed company metadata into decisions people can verify, approve, and
remember.

## Inspiration

Companies do not usually lose a decision because nobody wrote a note. They lose
the connection between the decision, the evidence that supported it, the people
who approved it, and the changes that later made it unsafe.

Corporate Brain was created to make that connection visible and useful to
non-technical teams.

## What it does

Corporate Brain is a role-aware decision-memory agent powered by DataHub.

It helps a user:

1. Discover which governed datasets, dashboards, metrics, pipelines, and
   documents they are allowed to use.
2. Understand ownership, freshness, quality, sensitivity, schema, and lineage
   without learning a metadata tool.
3. Check whether the available evidence is sufficient for a business task.
4. Produce an evidence-backed Decision Card or abstain when support is
   insufficient.
5. Configure proposed operational actions, such as stockout and product-quality
   alerts.
6. Save an approved decision back to DataHub only after explicit human
   confirmation.

The complete demonstration uses an Ecommerce Control scenario. A data analyst
must determine whether the company has the assets required for a control
dashboard, trace how those assets connect, and configure two actionable alerts:

- stockout risk for star products;
- critically complained-about products routed to CX and Product.

The architecture is reusable for Finance, Operations, CX, Product, or another
business area by adding a role profile, governed DataHub assets, and a capability
pack. It does not require a separate hard-coded application per department.

## How we built it

- Next.js and TypeScript for the bilingual web experience
- DataHub Open Source as the governed evidence and context layer
- Official DataHub MCP tools for search, entity metadata, schema, lineage, and
  confirmed document write-back
- A deterministic evidence evaluator that runs before AI synthesis
- A provider-neutral structured Decision Card contract
- OpenRouter free models as an optional synthesis layer
- Vercel for the public demonstration

## Eligibility and development disclosure

Corporate Brain was created from scratch during the hackathon submission
period. Development began on July 23, 2026. Codex was used as an AI coding
assistant, which the official rules permit. No pre-existing product code was
incorporated. The public demonstration uses synthetic hackathon data only.

The public deployment uses an authenticated live DataHub MCP connection to a
dedicated synthetic catalog. A deliberately labeled snapshot mode remains
available for deterministic local development; cached evidence is never
presented as live.

## How DataHub is essential

DataHub is not a decorative datasource in Corporate Brain. It provides the
governed context needed to make a decision defensible:

- asset discovery and business definitions;
- owners and domains;
- schema fields;
- freshness and quality signals;
- sensitivity context;
- upstream lineage;
- stable entity URNs used as evidence references;
- a write-back destination for the approved decision and its related assets.

Without DataHub, Corporate Brain cannot establish what evidence exists, who is
responsible for it, whether it is trustworthy, or which future changes should
trigger a review.

## Trust and safety

- Unknown roles and domains are denied by default.
- The server filters evidence before it reaches the AI provider and filters it
  again before returning a response.
- DataHub content is treated as untrusted input.
- Prompt-override patterns, oversized payloads, and excessive requests are
  rejected.
- Paid AI fallback cannot be enabled by accident.
- Every recommendation cites authorized evidence or abstains.
- Shared writes require explicit confirmation and server-side recomputation.
- The hackathon catalog contains synthetic data only.

## Challenges

The main challenge was making rich metadata useful to a business user without
turning the product into another technical catalog. We separated the experience
into three clear questions:

1. What data can I use?
2. Is it sufficient for my business outcome?
3. What decision or action can I safely preserve?

The second challenge was preventing a polished demo from overstating trust. The
application exposes whether evidence is live or a snapshot, shows gaps and
warnings, and abstains rather than inventing support.

## Accomplishments

- A complete role-filtered catalog and decision workflow
- An explainable readiness matrix for a real Ecommerce operating scenario
- Visible ownership, quality, freshness, sensitivity, and lineage
- Human-confirmed DataHub document write-back
- Bilingual English and Spanish experience
- Deterministic demo behavior that remains usable when a free model is
  unavailable
- Automated tests for access control, evidence evaluation, request security,
  DataHub normalization, structured AI output, and write-back validation

## What we learned

Agents become more useful when metadata is not only retrieval context but also a
control surface. Ownership, lineage, and quality can constrain what an agent is
allowed to recommend and explain why a human should trust or reject it.

## What's next

- Identity-bound DataHub access instead of synthetic personas
- Review triggers when supporting assets change
- Additional capability packs for Finance, CX, Product, and Operations
- Collaboration workflows for owners and approvers
- Enterprise SSO, audit retention, and policy-managed write scopes

## Links

- Live demo: https://corporate-brain-delta.vercel.app
- Source code: https://github.com/natalia15155-bit/corporate-brain
- Sample output: https://github.com/natalia15155-bit/corporate-brain/tree/main/examples

## Suggested screenshots

1. Data Analyst role scope and governed catalog (English UI)
2. Ecommerce readiness result with seven of seven capabilities (English UI)
3. Human-confirmed operational plan in Corporate Memory (English UI)

## Testing instructions for judges

1. Open the live demo and select the Data Analyst profile.
2. Review the authorized Data Catalog before asking a question.
3. Choose the Ecommerce dashboard readiness starter question.
4. Confirm that all seven capabilities are classified as Ready, Missing, or
   Blocked and that every result links to evidence.
5. Inspect the lineage connections and the two proposed alert configurations.
6. Save the confirmed result to Corporate Memory.
7. In the live DataHub demonstration, verify the saved document and its related
   DataHub URNs.

No real customer or employee data is used.
