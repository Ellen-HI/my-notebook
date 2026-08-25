"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { translations } from "@/lib/i18n";
import { useSettingsStore } from "@/lib/store/settingsStore";
import toast from "react-hot-toast";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getAuthErrorMessage } from "@/lib/authErrors";
import Loader from "@/components/Loader";
import PasswordInput from "@/components/PasswordInput";

export default function ResetPasswordPage() {
  const language = useSettingsStore((state) => state.language);
  const t = translations[language].auth;
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error(t.passwordsDoNotMatch);
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setIsLoading(false);

    if (error) {
      toast.error(getAuthErrorMessage(error, language));
      return;
    }

    toast.success(t.passwordUpdated);
    await supabase.auth.signOut();
    router.replace("/sign-in");
  };

  return (
    <main className="auth-page">
      <LanguageSwitcher />
      <h1>{t.resetPasswordTitle}</h1>

      <form onSubmit={handleSubmit} className="auth-form">
        <PasswordInput
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={t.newPassword}
          required
          disabled={isLoading}
        />
        <PasswordInput
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder={t.confirmPassword}
          required
          disabled={isLoading}
        />
        <button className="auth-button" type="submit" disabled={isLoading}>
          {isLoading ? <Loader /> : t.updatePassword}
        </button>
      </form>
    </main>
  );
}
