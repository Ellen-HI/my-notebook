"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/lib/store/settingsStore";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useSettingsStore((state) => state.theme);

  // NOTE: Theme is now applied via inline script in layout.tsx before hydration.
  // This effect handles theme changes after the initial page load (when user switches themes).
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return children;
}
