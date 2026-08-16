"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useSettingsStore } from "@/lib/store/settingsStore";
import { translations } from "@/lib/i18n";
import { clearUserIdCache } from "@/lib/api/notesApi";

export default function LogoutButton() {
  const language = useSettingsStore((state) => state.language);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearUserIdCache();
    router.replace("/sign-in");
    router.refresh();
  };

  return (
    <button
      type="button"
      className="auth-button logout-button"
      onClick={handleLogout}
    >
      {translations[language].auth.logout}
    </button>
  );
}
