"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { translations } from "@/lib/i18n";
import { useSettingsStore } from "@/lib/store/settingsStore";
import Link from "next/link";
import toast from "react-hot-toast";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getAuthErrorMessage } from "@/lib/authErrors";
import Loader from "@/components/Loader";

export default function ForgotPasswordPage() {
  const language = useSettingsStore((state) => state.language);
  const t = translations[language].auth;
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    setIsLoading(false);

    if (error) {
      toast.error(getAuthErrorMessage(error, language));
      return;
    }

    setIsSent(true);
    toast.success(t.resetEmailSent);
  };

  return (
    <main className="auth-page">
      <LanguageSwitcher />
      <h1>{t.resetPasswordTitle}</h1>

      {isSent ? (
        <p>{t.resetEmailSent}</p>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder={t.email}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={isLoading}
          />
          <button className="auth-button" type="submit" disabled={isLoading}>
            {isLoading ? <Loader /> : t.sendResetLink}
          </button>
        </form>
      )}

      <p className="auth-switch">
        <Link href="/sign-in">{t.backToSignIn}</Link>
      </p>
    </main>
  );
}
