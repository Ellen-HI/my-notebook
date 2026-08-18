"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { translations } from "@/lib/i18n";
import { useSettingsStore } from "@/lib/store/settingsStore";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getAuthErrorMessage } from "@/lib/authErrors";

export default function SignUpPage() {
  const language = useSettingsStore((state) => state.language);
  const t = translations[language].auth;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();

    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(getAuthErrorMessage(error, language));
      return;
    }

    setMessage(t.registrationSuccess);
  };

  return (
    <main className="auth-page">
      <LanguageSwitcher />
      <h1>{t.signUp}</h1>

      <form onSubmit={handleSignUp} className="auth-form">
        <input
          type="email"
          placeholder={t.email}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          type="password"
          placeholder={t.password}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
        />

        <button className="auth-button" type="submit">
          {t.signUp}
        </button>
      </form>
      <p className="auth-switch">
        {language === "uk" ? "Вже маєте акаунт?" : "Already have an account?"}{" "}
        <Link href="/sign-in">{t.toSignIn}</Link>
      </p>
      {message && <p>{message}</p>}
    </main>
  );
}
