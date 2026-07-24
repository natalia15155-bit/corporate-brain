"use client";

import { useState } from "react";
import { ArrowIcon, CheckIcon, DatabaseIcon } from "@/components/icons";
import type { DemoUser } from "@/lib/access-control";
import type { DecisionCard } from "@/lib/decision/types";
import { copy, type Locale } from "@/lib/i18n";

interface BriefScreenProps {
  decision: DecisionCard;
  locale: Locale;
  user: DemoUser;
  onAskAgain: () => void;
  onSave: () => void;
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
  const visibleEvidence = decision.evidence;
  const sufficient = decision.status === "recommendation";
  const roleView = t.roleViews[user.role];

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

      <section className="decision-grid">
        <article className="structured-evidence">
          <header>
            <h2>{t.structuredEvidence}</h2>
            <span>{visibleEvidence.length} {t.dataPoints}</span>
          </header>
          <div className="evidence-rows">
            {visibleEvidence.map((asset) => (
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
                    <span>{asset.owner}</span>
                    <span>{asset.freshness}</span>
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
            <span>{t.projectedOutcome}</span>
            <div>
              <strong>{decision.outcome ?? "—"}</strong>
              <p>{sufficient ? t.pipelineGrowth : t.outcomeUnavailable}</p>
            </div>
            <small>{sufficient ? t.outcomeDescription : t.outcomeLimited}</small>
          </article>

          <article className="risk-card">
            <h2>
              <span>◇</span>
              {t.riskAssessment}
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
          <span>{sufficient ? t.readyToFinalize : t.reviewBeforeDecision}</span>
        </div>
        <div>
          <button className="secondary-button" type="button" onClick={onAskAgain}>
            {t.askAnother}
          </button>
          <button
            className="primary-button"
            type="button"
            disabled={!sufficient}
            onClick={() => setShowConfirmation(true)}
          >
            {t.approveDecision}
          </button>
        </div>
      </section>

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

      {showConfirmation && (
        <section className="confirmation-panel" aria-live="polite">
          <div className="confirmation-icon">
            <DatabaseIcon />
          </div>
          <div>
            <h2>{t.confirmationTitle}</h2>
            <p>{t.confirmationDescription}</p>
          </div>
          <div className="confirmation-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={() => setShowConfirmation(false)}
            >
              {t.cancel}
            </button>
            <button className="primary-button" type="button" onClick={onSave}>
              {t.confirmSave}
              <ArrowIcon />
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
