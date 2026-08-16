"use client";

import { useSettingsStore } from "@/lib/store/settingsStore";

export default function LanguageSwitcher() {
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);

  return (
    <div className="wrapp-btn-lang-switch">
      <button
        className="btn-lang-switch"
        type="button"
        onClick={() => setLanguage("uk")}
        disabled={language === "uk"}
      >
        UA
      </button>

      <button
        className="btn-lang-switch"
        type="button"
        onClick={() => setLanguage("en")}
        disabled={language === "en"}
      >
        EN
      </button>
    </div>
  );
}
