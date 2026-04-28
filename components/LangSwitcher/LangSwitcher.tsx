"use client";

import { useI18n } from "@/lib/i18n";

export default function LangSwitcher() {
  const { lang, setLang } = useI18n();

  return (
    <button
      onClick={() => setLang(lang === "ja" ? "en" : "ja")}
      className="text-gray-600 text-sm hover:text-gray-900 transition-colors"
      aria-label="言語切り替え"
    >
      {lang.toUpperCase()}
    </button>
  );
}
