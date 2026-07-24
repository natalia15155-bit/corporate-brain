"use client";

import { useState } from "react";
import { copy, type Locale } from "@/lib/i18n";
import {
  ArrowIcon,
  CheckIcon,
  DatabaseIcon,
  SparkIcon,
} from "@/components/icons";

interface AskScreenProps {
  locale: Locale;
  loading: boolean;
  error: string | null;
  onGenerate: (question: string) => Promise<void>;
}

export function AskScreen({
  locale,
  loading,
  error,
  onGenerate,
}: AskScreenProps) {
  const t = copy[locale];
  const [question, setQuestion] = useState("");
  const suggestions = [t.suggestionOne, t.suggestionTwo, t.suggestionThree];

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
        </div>

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
          <p>{t.suggestionLabel}</p>
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
            <p>{t.evidenceReadyDescription}</p>
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
