"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { translations } from "@/lib/i18n";
import { useSettingsStore } from "@/lib/store/settingsStore";
import Link from "next/link";

import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function SignInPage() {
  const language = useSettingsStore((state) => state.language);
  const t = translations[language].auth;
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(() =>
    searchParams.get("error") === "oauth_failed" ? t.oauthFailed : "",
  );

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();

    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    router.replace("/");
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
    }
  };
  return (
    <main className="auth-page">
      <LanguageSwitcher />
      <h1>{t.signIn}</h1>

      <form onSubmit={handleSignIn} className="auth-form">
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
        />
        <button className="auth-button" type="submit">
          {t.signIn}
        </button>
        <button
          className="auth-button google-button"
          type="button"
          onClick={handleGoogleSignIn}
        >
          {t.signInWithGoogle}
        </button>
      </form>
      <p className="auth-switch">
        {language === "uk" ? "Немає акаунта?" : "Don't have an account?"}{" "}
        <Link href="/sign-up">{t.toSignUp}</Link>
      </p>
      {message && <p>{message}</p>}
    </main>
  );
}
