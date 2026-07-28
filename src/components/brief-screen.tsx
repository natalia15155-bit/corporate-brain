"use client";

import { useState } from "react";
import { ArrowIcon, CheckIcon, DatabaseIcon } from "@/components/icons";
import { AlertConfigurator } from "@/components/alert-configurator";
import type { DemoUser } from "@/lib/access-control";
import type { AlertRule } from "@/lib/capabilities/types";
import type { DecisionCard } from "@/lib/decision/types";
import { copy, type Locale } from "@/lib/i18n";
import type { MemoryItemKind } from "@/lib/memory/types";

interface BriefScreenProps {
  decision: DecisionCard;
  locale: Locale;
  user: DemoUser;
  onAskAgain: () => void;
  onSave: (
    kind: MemoryItemKind,
    alertRules: readonly AlertRule[],
  ) => Promise<void>;
}

export function BriefScreen({
  decision,
  locale,
  user,
  onAskAgain,
  onSave,
}: BriefScreenProps) {
  const t = copy[locale];
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [memoryKind, setMemoryKind] = useState<MemoryItemKind>(
    decision.intent === "readiness"
      ? decision.readiness?.status === "ready"
        ? "alert-plan"
        : "action"
      : "decision",
  );
  const [configuredAlerts, setConfiguredAlerts] = useState<readonly AlertRule[]>(
    decision.readiness?.proposedAlerts ?? [],
  );
  const [showAllEvidence, setShowAllEvidence] = useState(false);
  const visibleEvidence = decision.evidence;
  const displayedEvidence =
    decision.intent === "readiness" && !showAllEvidence
      ? visibleEvidence.slice(0, 6)
      : visibleEvidence;
  const sufficient = decision.status === "recommendation";
  const isDataDiscovery = decision.intent === "data-discovery";
  const readiness = decision.readiness;
  const isReadiness = decision.intent === "readiness" && readiness !== null;
  const roleView = t.roleViews[user.role];
  const evidenceNames = new Map(
    visibleEvidence.map((asset) => [asset.id, asset.name]),
  );

  return (
    <main className="page-shell brief-shell">
      <section className="brief-topline">
        <div>
          <p className="section-kicker">
            {t.briefEyebrow} · {decision.id}
          </p>
          <p className="decision-question">{decision.question}</p>
          <h1>{decision.recommendation}</h1>
        </div>
        <div className={`access-state ${sufficient ? "allowed" : "limited"}`}>
          <CheckIcon />
          <span>
            <strong>{sufficient ? t.scopeComplete : t.scopeLimited}</strong>
            <small>{t.scopeFor} {user.name}</small>
          </span>
        </div>
      </section>

      {isReadiness && (
        <section className="readiness-panel" aria-labelledby="readiness-title">
          <header>
            <div>
              <p className="section-kicker">{readiness.area}</p>
              <h2 id="readiness-title">{t.capabilityCoverage}</h2>
              <p>{t.capabilityCoverageDescription}</p>
            </div>
            <strong className={`readiness-score ${readiness.status}`}>
              {readiness.readyCount}/{readiness.totalCount} {t.ready}
            </strong>
          </header>

          <div className="requirement-grid">
            {readiness.requirements.map((requirement) => (
              <article
                className={`requirement-card ${requirement.status}`}
                key={requirement.id}
              >
                <span>
                  {requirement.status === "ready" ? "✓" : "!"}
                </span>
                <div>
                  <strong>{requirement.label}</strong>
                  <p>{requirement.description}</p>
                  <small>
                    {requirement.status === "ready"
                      ? requirement.evidenceIds
                          .map((id) => evidenceNames.get(id))
                          .filter(Boolean)
                          .join(" · ")
                      : t.missing}
                  </small>
                </div>
              </article>
            ))}
          </div>

          <div className="lineage-panel">
            <h3>{t.sourceConnections}</h3>
            {readiness.lineage.length === 0 ? (
              <p>{t.noVisibleConnections}</p>
            ) : (
              <div className="lineage-list">
                {readiness.lineage.map((connection) => (
                  <div
                    className="lineage-edge"
                    key={`${connection.fromId}-${connection.toId}`}
                  >
                    <span>{connection.fromName}</span>
                    <strong>→</strong>
                    <span>{connection.toName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {isReadiness && (
        <AlertConfigurator
          alerts={configuredAlerts}
          locale={locale}
          onChange={setConfiguredAlerts}
        />
      )}

      <section className="decision-grid">
        <article className="structured-evidence">
          <header>
            <h2>{t.structuredEvidence}</h2>
            <div className="evidence-header-actions">
              <span>{visibleEvidence.length} {t.dataPoints}</span>
              {decision.intent === "readiness" &&
                visibleEvidence.length > displayedEvidence.length && (
                  <button
                    type="button"
                    onClick={() => setShowAllEvidence(true)}
                  >
                    {t.showAllData}
                  </button>
                )}
              {decision.intent === "readiness" &&
                showAllEvidence &&
                visibleEvidence.length > 6 && (
                  <button
                    type="button"
                    onClick={() => setShowAllEvidence(false)}
                  >
                    {t.showLessData}
                  </button>
                )}
            </div>
          </header>
          <div className="evidence-rows">
            {displayedEvidence.map((asset) => (
              <article className="evidence-row" key={asset.id}>
                <span className={`asset-icon ${asset.tone}`}>
                  <DatabaseIcon />
                </span>
                <div className="evidence-copy">
                  <div className="evidence-title">
                    <h3>{asset.name}</h3>
                    <code>ID: {asset.id}</code>
                  </div>
                  <p>{asset.description}</p>
                  <div className="evidence-meta">
                    <span>{asset.type}</span>
                    <span>{asset.owner}</span>
                    <span>{asset.freshness}</span>
                    <span>{asset.quality}</span>
                    <span>{t.sensitivity[asset.sensitivity]}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!sufficient && (
            <div className="abstention" role="status">
              <CheckIcon />
              <div>
                <strong>{t.insufficientTitle}</strong>
                <p>{t.insufficientAuthorizedEvidence}</p>
              </div>
            </div>
          )}
        </article>

        <aside className="decision-aside">
          <article className="outcome-card">
            <span>
              {isReadiness
                ? t.readinessResult
                : isDataDiscovery
                  ? t.catalogResult
                  : t.projectedOutcome}
            </span>
            <div>
              <strong>{decision.outcome ?? "—"}</strong>
              <p>
                {sufficient
                  ? isDataDiscovery
                    ? t.authorizedEvidence
                    : isReadiness
                      ? t.capabilityCoverage
                    : t.pipelineGrowth
                  : t.outcomeUnavailable}
              </p>
            </div>
            <small>
              {sufficient
                ? isDataDiscovery
                  ? t.discoveryOutcomeDescription
                  : isReadiness
                    ? t.capabilityCoverageDescription
                  : t.outcomeDescription
                : t.outcomeLimited}
            </small>
          </article>

          <article className="risk-card">
            <h2>
              <span>◇</span>
              {isReadiness
                ? t.operationalConsiderations
                : isDataDiscovery
                  ? t.dataConsiderations
                  : t.riskAssessment}
            </h2>
            <ul>
              {decision.risks.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
          </article>
        </aside>
      </section>

      <section className="role-view">
        <span>{t.personalizedFor} {t.roles[user.role]}</span>
        <strong>{roleView.title}</strong>
        <p>{decision.roleInsight || (sufficient ? roleView.complete : roleView.limited)}</p>
      </section>

      <section className="approval-bar">
        <div>
          <CheckIcon />
          <span>
            {isDataDiscovery
              ? t.discoveryNextStep
              : isReadiness
                ? readiness.status === "ready"
                  ? t.readinessNextStep
                  : t.readinessGapNextStep
              : sufficient
                ? t.readyToFinalize
                : t.reviewBeforeDecision}
          </span>
        </div>
        <div>
          <button className="secondary-button" type="button" onClick={onAskAgain}>
            {isDataDiscovery ? t.returnToCatalog : t.askAnother}
          </button>
          {!isDataDiscovery && (
            <button
              className="primary-button"
              type="button"
              disabled={!sufficient && !isReadiness}
              onClick={() => setShowConfirmation(true)}
            >
              {isReadiness
                ? readiness.status === "ready"
                  ? t.saveOperationalPlan
                  : t.saveGapPlan
                : t.approveDecision}
            </button>
          )}
        </div>
      </section>

      {!isDataDiscovery && !isReadiness && (
        <section className="anchor-section">
          <h2>{t.contextualAnchors}</h2>
          <div className="anchor-grid">
            {t.anchors.map((anchor, index) => (
              <article key={anchor.title}>
                {index === 1 ? <CheckIcon /> : <DatabaseIcon />}
                <div>
                  <strong>{anchor.title}</strong>
                  <small>{anchor.meta}</small>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {showConfirmation && (
        <section className="confirmation-panel" aria-live="polite">
          <div className="confirmation-icon">
            <DatabaseIcon />
          </div>
          <div>
            <h2>{t.confirmationTitle}</h2>
            <p>{t.confirmationDescription}</p>
            <label className="memory-kind-picker">
              <span>{t.memoryKind}</span>
              <select
                value={memoryKind}
                onChange={(event) =>
                  setMemoryKind(event.target.value as MemoryItemKind)
                }
              >
                {(
                  [
                    "decision",
                    "action",
                    "knowledge",
                    "alert-plan",
                  ] as const
                ).map((kind) => (
                  <option key={kind} value={kind}>
                    {t.memoryKinds[kind]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="confirmation-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={() => setShowConfirmation(false)}
            >
              {t.cancel}
            </button>
            <button
              className="primary-button"
              type="button"
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                await onSave(memoryKind, configuredAlerts);
              }}
            >
              {saving
                ? locale === "es"
                  ? "Guardando..."
                  : "Saving..."
                : t.confirmSave}
              <ArrowIcon />
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
