import type { EvidenceAsset } from "../access-control.ts";
import type {
  AlertRule,
  EvaluateCapabilityPackInput,
  LineageConnection,
  ReadinessAssessment,
} from "./types.ts";

function assetsForCapability(
  evidence: readonly EvidenceAsset[],
  capability: string,
): readonly EvidenceAsset[] {
  return evidence.filter((asset) =>
    asset.capabilities?.includes(capability),
  );
}

function buildLineage(
  evidence: readonly EvidenceAsset[],
  relevantCapabilities: ReadonlySet<string>,
): readonly LineageConnection[] {
  const visibleById = new Map(evidence.map((asset) => [asset.id, asset]));
  const relevantIds = new Set(
    evidence
      .filter(
        (asset) =>
          asset.capabilities?.some((capability) =>
            relevantCapabilities.has(capability),
          ) || asset.capabilities?.includes("commerce.control-dashboard"),
      )
      .map((asset) => asset.id),
  );
  let expanded = true;

  while (expanded) {
    expanded = false;
    for (const id of Array.from(relevantIds)) {
      const asset = visibleById.get(id);
      for (const upstreamId of asset?.upstream ?? []) {
        if (visibleById.has(upstreamId) && !relevantIds.has(upstreamId)) {
          relevantIds.add(upstreamId);
          expanded = true;
        }
      }
    }
  }

  const connections: LineageConnection[] = [];

  for (const asset of evidence) {
    if (!relevantIds.has(asset.id)) continue;
    for (const upstreamId of asset.upstream ?? []) {
      const upstream = visibleById.get(upstreamId);
      if (!upstream || !relevantIds.has(upstreamId)) continue;

      connections.push({
        fromId: upstream.id,
        fromName: upstream.name,
        toId: asset.id,
        toName: asset.name,
      });
    }
  }

  return connections;
}

function buildAlertRule(
  input: EvaluateCapabilityPackInput,
  template: EvaluateCapabilityPackInput["pack"]["alertRules"][number],
): AlertRule {
  const evidenceIds = Array.from(
    new Set(
      template.evidenceCapabilities.flatMap((capability) =>
        assetsForCapability(input.evidence, capability).map((asset) => asset.id),
      ),
    ),
  );

  return {
    id: template.id,
    name: template.name[input.locale],
    description: template.description[input.locale],
    metric: template.metric,
    operator: template.operator,
    threshold: template.threshold,
    unit: template.unit,
    severity: template.severity,
    recipients: template.recipients,
    evidenceIds,
    enabled:
      evidenceIds.length > 0 &&
      template.evidenceCapabilities.every(
        (capability) =>
          assetsForCapability(input.evidence, capability).length > 0,
      ),
  };
}

export function evaluateCapabilityPack(
  input: EvaluateCapabilityPackInput,
): ReadinessAssessment {
  const requirements = input.pack.requirements.map((requirement) => {
    const matchingEvidence = assetsForCapability(
      input.evidence,
      requirement.capability,
    );

    return {
      id: requirement.id,
      label: requirement.label[input.locale],
      description: requirement.description[input.locale],
      status: matchingEvidence.length > 0 ? ("ready" as const) : ("missing" as const),
      critical: requirement.critical,
      evidenceIds: matchingEvidence.map((asset) => asset.id),
    };
  });
  const readyCount = requirements.filter(
    (requirement) => requirement.status === "ready",
  ).length;
  const missingCritical = requirements.filter(
    (requirement) =>
      requirement.critical && requirement.status === "missing",
  ).length;

  return {
    packId: input.pack.id,
    area: input.pack.area,
    title: input.pack.title[input.locale],
    status:
      missingCritical === 0
        ? "ready"
        : readyCount === 0
          ? "blocked"
          : "partial",
    readyCount,
    totalCount: requirements.length,
    requirements,
    lineage: buildLineage(
      input.evidence,
      new Set(
        input.pack.requirements.map((requirement) => requirement.capability),
      ),
    ),
    proposedAlerts: input.pack.alertRules.map((template) =>
      buildAlertRule(input, template),
    ),
  };
}
