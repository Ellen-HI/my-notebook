"use client";

import { useSettingsStore } from "@/lib/store/settingsStore";
import Image from "next/image";
export default function ThemeSwitcher() {
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);

  return (
    <div className="theme-switcher">
      <button
        type="button"
        onClick={() => setTheme("light")}
        disabled={theme === "light"}
      >
        <Image
          src="/sun.svg"
          alt="Світла тема"
          width={40}
          height={40}
          loading="eager"
        />
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        disabled={theme === "dark"}
      >
        <Image
          src="/moon.svg"
          alt="Темна тема"
          width={40}
          height={40}
          loading="eager"
        />
      </button>
    </div>
  );
}
