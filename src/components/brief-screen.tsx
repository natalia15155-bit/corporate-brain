"use client";

import { useState } from "react";
import { copy, type Locale } from "@/lib/i18n";
import {
  ArrowIcon,
  CheckIcon,
  DatabaseIcon,
  SparkIcon,
} from "@/components/icons";

const evidenceAssets = [
  {
    name: "customer_360",
    type: "Snowflake · Dataset",
    owner: "Customer Data",
    freshness: "18 min",
    quality: "98.4%",
    tone: "verified",
  },
  {
    name: "retention_executive",
    type: "Looker · Dashboard",
    owner: "Growth Analytics",
    freshness: "2 hr",
    quality: "96.1%",
    tone: "verified",
  },
  {
    name: "finance_customer_feed",
    type: "Airflow · Data flow",
    owner: "Unassigned",
    freshness: "31 hr",
    quality: "Warning",
    tone: "warning",
  },
] as const;

interface BriefScreenProps {
  locale: Locale;
  onAskAgain: () => void;
  onSave: () => void;
}

export function BriefScreen({
  locale,
  onAskAgain,
  onSave,
}: BriefScreenProps) {
  const t = copy[locale];
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <main className="page-shell brief-shell">
      <section className="brief-heading">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-mark">
              <SparkIcon />
            </span>
            {t.briefEyebrow}
          </p>
          <h1>{t.briefTitle}</h1>
        </div>
        <div className="trust-badge">
          <span>{t.trustBand}</span>
          <strong>{t.medium}</strong>
          <small>{t.mediumReason}</small>
        </div>
      </section>

      <section className="brief-layout">
        <div className="brief-main">
          <article className="recommendation-card">
            <div className="recommendation-mark">
              <SparkIcon />
            </div>
            <p>{t.recommendation}</p>
          </article>

          <article className="reasons-card">
            <h2>{t.keyReasons}</h2>
            <ol>
              {[t.reasonOne, t.reasonTwo, t.reasonThree].map((reason) => (
                <li key={reason}>
                  <span>
                    <CheckIcon />
                  </span>
                  <p>{reason}</p>
                </li>
              ))}
            </ol>
          </article>

          <article className="change-card">
            <div className="change-symbol">↗</div>
            <div>
              <h2>{t.whatChanged}</h2>
              <p>{t.changeDescription}</p>
            </div>
          </article>
        </div>

        <aside className="relationship-card">
          <div className="relationship-heading">
            <span>{t.evidenceTrail}</span>
            <strong>12</strong>
          </div>
          <div className="mini-graph" aria-hidden="true">
            <span className="graph-line one" />
            <span className="graph-line two" />
            <span className="graph-line three" />
            <span className="graph-node center">CB</span>
            <span className="graph-node node-a">360</span>
            <span className="graph-node node-b">R</span>
            <span className="graph-node node-c">F</span>
          </div>
          <p>{t.evidenceTrailDescription}</p>
        </aside>
      </section>

      <section className="evidence-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">DataHub</p>
            <h2>{t.evidenceTrail}</h2>
          </div>
          <p>{t.evidenceTrailDescription}</p>
        </div>

        <div className="evidence-list">
          {evidenceAssets.map((asset) => (
            <article className="evidence-card" key={asset.name}>
              <div className={`asset-icon ${asset.tone}`}>
                <DatabaseIcon />
              </div>
              <div className="asset-identity">
                <h3>{asset.name}</h3>
                <p>{asset.type}</p>
              </div>
              <dl>
                <div>
                  <dt>{t.owner}</dt>
                  <dd>{asset.owner}</dd>
                </div>
                <div>
                  <dt>{t.freshness}</dt>
                  <dd>{asset.freshness}</dd>
                </div>
                <div>
                  <dt>{t.quality}</dt>
                  <dd className={asset.tone}>
                    {asset.quality === "Warning" ? t.warning : asset.quality}
                  </dd>
                </div>
              </dl>
              <button type="button" className="text-button">
                {t.viewInDataHub}
                <ArrowIcon />
              </button>
            </article>
          ))}
        </div>
      </section>

      {showConfirmation ? (
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
              <CheckIcon />
            </button>
          </div>
        </section>
      ) : (
        <section className="brief-actions">
          <button className="secondary-button" type="button" onClick={onAskAgain}>
            {t.askAnother}
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() => setShowConfirmation(true)}
          >
            {t.saveMemory}
            <ArrowIcon />
          </button>
        </section>
      )}
    </main>
  );
}
