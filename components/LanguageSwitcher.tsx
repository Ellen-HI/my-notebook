"use client";

import { useSettingsStore } from "@/lib/store/settingsStore";

export default function LanguageSwitcher() {
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);

  return (
    <div>
      <button
        type="button"
        onClick={() => setLanguage("uk")}
        disabled={language === "uk"}
      >
        UA
      </button>

      <button
        type="button"
        onClick={() => setLanguage("en")}
        disabled={language === "en"}
      >
        EN
      </button>
    </div>
  );
}
