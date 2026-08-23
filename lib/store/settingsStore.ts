import { create } from "zustand";
import { persist } from "zustand/middleware";

type Language = "uk" | "en";
type Theme = "light" | "dark";

type SettingsState = {
  language: Language;
  theme: Theme;

  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: "uk",
      theme: "light",

      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "notebook-settings",
    },
  ),
);
