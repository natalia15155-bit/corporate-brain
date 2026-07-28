"use client";

import { useState } from "react";
import { copy, type Locale } from "@/lib/i18n";
import type { DemoUser } from "@/lib/access-control";
import type { RoleCatalog } from "@/lib/catalog/types";
import {
  ArrowIcon,
  CheckIcon,
  DatabaseIcon,
  SparkIcon,
} from "@/components/icons";

interface AskScreenProps {
  locale: Locale;
  user: DemoUser;
  catalog: RoleCatalog | null;
  catalogLoading: boolean;
  catalogError: string | null;
  loading: boolean;
  error: string | null;
  onGenerate: (question: string) => Promise<void>;
}

export function AskScreen({
  locale,
  user,
  catalog,
  catalogLoading,
  catalogError,
  loading,
  error,
  onGenerate,
}: AskScreenProps) {
  const t = copy[locale];
  const [question, setQuestion] = useState("");
  const [showAllData, setShowAllData] = useState(false);
  const suggestions = t.roleSuggestions[user.role];
  const visibleAssets = catalog?.assets.slice(
    0,
    showAllData ? catalog.assets.length : 4,
  );
  const catalogNames = new Map(
    (catalog?.assets ?? []).map((asset) => [asset.id, asset.name]),
  );

  return (
    <main className="page-shell">
      <section className="ask-hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-mark">
              <SparkIcon />
            </span>
            {t.eyebrow}
          </p>
          <h1>{t.askTitle}</h1>
          <p className="hero-description">{t.askDescription}</p>
          <div className="product-purpose">
            <strong>{t.productPurposeTitle}</strong>
            <span>{t.productPurposeDescription}</span>
          </div>
        </div>

        <section className="role-data-panel" aria-labelledby="role-data-title">
          <header className="role-data-header">
            <div>
              <p className="section-kicker">{t.roleWorkspaceLabel}</p>
              <h2 id="role-data-title">
                {t.roleWorkspaceTitle} {t.roles[user.role]}
              </h2>
              <p>{t.roleWorkspaceDescriptions[user.role]}</p>
            </div>
            <span className="role-team-badge">{user.team}</span>
          </header>

          <div className="role-profile-context">
            <div>
              <strong>{t.rolePurpose}</strong>
              <p>{user.profile.purpose[locale]}</p>
            </div>
            <div>
              <strong>{t.roleResponsibilities}</strong>
              <ul>
                {user.profile.responsibilities.map((responsibility) => (
                  <li key={responsibility.en}>{responsibility[locale]}</li>
                ))}
              </ul>
            </div>
          </div>

          {catalogLoading && !catalog && (
            <p className="catalog-state" role="status">
              {t.catalogLoading}
            </p>
          )}
          {catalogError && (
            <p className="request-error" role="alert">
              {catalogError}
            </p>
          )}
          {catalog && (
            <>
              <div className="catalog-stats" aria-label={t.catalogSummary}>
                <span>
                  <strong>{catalog.stats.assets}</strong>
                  {t.assetsLabel}
                </span>
                <span>
                  <strong>{catalog.stats.owners}</strong>
                  {t.ownersLabel}
                </span>
                <span className={catalog.stats.warnings > 0 ? "warning" : ""}>
                  <strong>{catalog.stats.warnings}</strong>
                  {t.warningsLabel}
                </span>
                <span className="catalog-domains">
                  {catalog.domains
                    .map((domain) => t.domainLabels[domain])
                    .join(" · ")}
                </span>
              </div>

              <div className="catalog-heading">
                <div>
                  <h3>{t.availableData}</h3>
                  <p>{t.availableDataDescription}</p>
                </div>
                {catalog.assets.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setShowAllData((current) => !current)}
                  >
                    {showAllData ? t.showLessData : t.showAllData}
                  </button>
                )}
              </div>

              <div className="catalog-grid">
                {visibleAssets?.map((asset) => (
                  <article className="catalog-card" key={asset.id}>
                    <div className="catalog-card-title">
                      <span className={`catalog-status ${asset.tone}`} />
                      <div>
                        <h4>{asset.name}</h4>
                        <small>{asset.type}</small>
                      </div>
                    </div>
                    <p>{asset.description}</p>
                    <div className="catalog-card-meta">
                      <span>{asset.owner}</span>
                      <span>{asset.freshness}</span>
                      <span>{asset.quality}</span>
                    </div>
                    {(asset.upstream?.length ?? 0) > 0 && (
                      <p className="catalog-connection">
                        <strong>{t.connectedFrom}:</strong>{" "}
                        {asset.upstream
                          ?.map((id) => catalogNames.get(id))
                          .filter(Boolean)
                          .join(" · ") || t.noVisibleConnections}
                      </p>
                    )}
                    {(asset.fields?.length ?? 0) > 0 && (
                      <p className="catalog-fields">
                        <strong>{t.fieldsAvailable}:</strong>{" "}
                        {asset.fields?.slice(0, 4).join(", ")}
                      </p>
                    )}
                    <footer>
                      <span>{t.domainLabels[asset.domain]}</span>
                      <span>{t.sensitivity[asset.sensitivity]}</span>
                    </footer>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        <div className="question-card">
          <label htmlFor="decision-question">{t.questionLabel}</label>
          <textarea
            id="decision-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={t.questionPlaceholder}
            rows={4}
          />
          <div className="question-actions">
            <span className="privacy-note">
              <span className="status-dot" />
              {t.sourceData}
            </span>
            <button
              className="primary-button"
              type="button"
              disabled={!question.trim() || loading}
              onClick={() => void onGenerate(question)}
            >
              {loading ? t.generating : t.generate}
              <ArrowIcon />
            </button>
          </div>
          {error && (
            <p className="request-error" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="suggestion-block">
          <p>{t.roleSuggestionLabel}</p>
          <div className="suggestion-list">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setQuestion(suggestion)}
              >
                <SparkIcon />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="assurance-grid" aria-label={t.trustFramework}>
        <article>
          <span className="assurance-icon green">
            <DatabaseIcon />
          </span>
          <div>
            <h2>{t.evidenceReady}</h2>
            <p>
              {catalog
                ? t.evidenceReadySummary(
                    catalog.stats.assets,
                    catalog.stats.owners,
                  )
                : t.evidenceReadyDescription}
            </p>
          </div>
        </article>
        <article>
          <span className="assurance-icon violet">
            <SparkIcon />
          </span>
          <div>
            <h2>{t.trustFramework}</h2>
            <p>{t.trustFrameworkDescription}</p>
          </div>
        </article>
        <article>
          <span className="assurance-icon amber">
            <CheckIcon />
          </span>
          <div>
            <h2>{t.sourceData}</h2>
            <p>{t.sourceDataDescription}</p>
          </div>
        </article>
      </section>
    </main>
  );
}
