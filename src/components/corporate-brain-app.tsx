"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AskScreen } from "@/components/ask-screen";
import { BriefScreen } from "@/components/brief-screen";
import {
  CheckIcon,
  DatabaseIcon,
  MarkIcon,
  SparkIcon,
} from "@/components/icons";
import { MemoryScreen } from "@/components/memory-screen";
import { demoUsers } from "@/lib/access-control";
import { copy, type Locale } from "@/lib/i18n";

type Screen = "ask" | "brief" | "memory";

const localeStorageKey = "corporate-brain-locale";
const localeChangeEvent = "corporate-brain-locale-change";

function subscribeToLocale(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(localeChangeEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(localeChangeEvent, onStoreChange);
  };
}

function getLocaleSnapshot(): Locale {
  return window.localStorage.getItem(localeStorageKey) === "es" ? "es" : "en";
}

function persistLocale(locale: Locale) {
  window.localStorage.setItem(localeStorageKey, locale);
  window.dispatchEvent(new Event(localeChangeEvent));
}

function getServerLocaleSnapshot(): Locale {
  return "en";
}

export function CorporateBrainApp() {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getLocaleSnapshot,
    getServerLocaleSnapshot,
  );
  const [screen, setScreen] = useState<Screen>("ask");
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState(demoUsers[0].id);
  const t = copy[locale];
  const activeUser =
    demoUsers.find((candidate) => candidate.id === userId) ?? demoUsers[0];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function saveDecision() {
    setSaved(true);
    setScreen("memory");
  }

  const navItems = [
    { id: "ask" as const, label: t.navAsk, icon: <SparkIcon /> },
    { id: "brief" as const, label: t.navBrief, icon: <CheckIcon /> },
    { id: "memory" as const, label: t.navMemory, icon: <DatabaseIcon /> },
  ];

  return (
    <div className="app-frame">
      <aside className="app-sidebar">
        <button
          className="brand"
          type="button"
          onClick={() => setScreen("ask")}
          aria-label="Corporate Brain"
        >
          <span className="brand-mark">
            <MarkIcon />
          </span>
          <span>
            <strong>Corporate Brain</strong>
            <small>{t.brandDescriptor}</small>
          </span>
        </button>

        <button
          className="new-inquiry"
          type="button"
          onClick={() => setScreen("ask")}
        >
          <span>+</span>
          {t.newInquiry}
        </button>

        <nav className="primary-nav" aria-label={t.navLabel}>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={screen === item.id ? "active" : ""}
              onClick={() => setScreen(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.id === "memory" && saved && (
                <span className="nav-notification" />
              )}
            </button>
          ))}
        </nav>

        <section className="workspace-scope" aria-label={t.activeWorkspace}>
          <span className="scope-label">{t.activeWorkspace}</span>
          <strong>{activeUser.team}</strong>
          <small>
            {activeUser.allowedDomains.length} {t.authorizedDomains}
          </small>
        </section>

        <div className="sidebar-bottom">
          <div className="sidebar-link">
            <CheckIcon />
            <span>{t.security}</span>
            <small>{t.defaultDeny}</small>
          </div>

          <label className="persona-picker">
            <span className="scope-label">{t.demoPersona}</span>
            <span className="persona-control">
              <span className="avatar">{activeUser.initials}</span>
              <span className="persona-copy">
                <strong>{activeUser.name}</strong>
                <small>
                  {t.roles[activeUser.role]} · {activeUser.team}
                </small>
              </span>
              <select
                value={activeUser.id}
                onChange={(event) => setUserId(event.target.value)}
                aria-label={t.demoPersona}
              >
                {demoUsers.map((user) => (
                  <option value={user.id} key={user.id}>
                    {user.name} — {t.roles[user.role]}
                  </option>
                ))}
              </select>
            </span>
          </label>

          <div className="language-switch" aria-label={t.languageLabel}>
            {(["en", "es"] as const).map((language) => (
              <button
                key={language}
                type="button"
                aria-pressed={locale === language}
                className={locale === language ? "active" : ""}
                onClick={() => persistLocale(language)}
              >
                {language.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="app-workspace">
        <header className="workspace-header">
          <div>
            <span className="status-dot" />
            {t.demoConnected}
          </div>
          <span>{t.syntheticPersonaNotice}</span>
        </header>

        {screen === "ask" && (
          <AskScreen locale={locale} onGenerate={() => setScreen("brief")} />
        )}
        {screen === "brief" && (
          <BriefScreen
            locale={locale}
            user={activeUser}
            onAskAgain={() => setScreen("ask")}
            onSave={saveDecision}
          />
        )}
        {screen === "memory" && (
          <MemoryScreen
            locale={locale}
            saved={saved}
            onOpen={() => setScreen("brief")}
          />
        )}

        <footer className="app-footer">
          <span>{t.footer}</span>
          <span>{t.demoMode}</span>
        </footer>
      </div>
    </div>
  );
}
