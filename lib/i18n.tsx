"use client";

import { createContext, useContext, useState } from "react";

type Lang = "ja" | "en";

const dictionaries: Record<Lang, Record<string, string>> = {
  ja: {
    newWorks: "新着の作品",
    purpose: "目的",
    target: "対象",
    focus: "注力点",
    tech: "技術",
    auto: "自動解析",
    links: "リンク",
    viewWork: "作品を見る",
    github: "GitHub",
  },
  en: {
    newWorks: "New Works",
    purpose: "Purpose",
    target: "Target",
    focus: "Focus",
    tech: "Tech",
    auto: "Auto Metrics",
    links: "Links",
    viewWork: "View Work",
    github: "GitHub",
  },
};

const I18nContext = createContext<{
  lang: Lang;
  t: (key: string) => string;
  setLang: (l: Lang) => void;
} | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("ja");

  const t = (key: string) => dictionaries[lang][key] ?? key;

  return (
    <I18nContext.Provider value={{ lang, t, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("I18nProvider が必要です");
  return ctx;
}
