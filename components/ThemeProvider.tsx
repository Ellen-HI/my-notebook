"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/lib/store/settingsStore";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useSettingsStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return children;
}
