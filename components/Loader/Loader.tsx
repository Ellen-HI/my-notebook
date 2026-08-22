"use client";

import { useSettingsStore } from "@/lib/store/settingsStore";
import { FallingLines } from "react-loader-spinner";

export default function Loader({
  size = "small",
}: {
  size?: "small" | "large";
}) {
  const theme = useSettingsStore((state) => state.theme);
  console.warn("Loader theme:", theme);
  const width = size === "large" ? "80" : "40";
  const color = theme === "dark" ? "#f7f1e3" : "#2c2316";

  return (
    <span role="status" aria-label="Завантаження">
      <FallingLines color={color} width={width} visible={true} />
    </span>
  );
}
