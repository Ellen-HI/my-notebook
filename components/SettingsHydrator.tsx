// "use client";

// import { useRef } from "react";
// import { useSettingsStore } from "@/lib/store/settingsStore";

// export default function SettingsHydrator({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const hasInitialized = useRef(false);

//   // Synchronous initialization before render
//   if (!hasInitialized.current && typeof window !== "undefined") {
//     try {
//       const settings = localStorage.getItem("notebook-settings");
//       if (settings) {
//         const parsed = JSON.parse(settings);
//         if (parsed.state) {
//           useSettingsStore.setState(parsed.state);
//         }
//       }
//     } catch (e) {
//       // Silently ignore parsing errors, use defaults
//     }
//     hasInitialized.current = true;
//   }

//   return children;
// }
