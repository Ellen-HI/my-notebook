"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { translations } from "@/lib/i18n";
import { useSettingsStore } from "@/lib/store/settingsStore";
import Link from "next/link";
import toast from "react-hot-toast";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getAuthErrorMessage } from "@/lib/authErrors";
import Loader from "@/components/Loader";
import PasswordInput from "@/components/PasswordInput";
export default function SignInForm() {
  const language = useSettingsStore((state) => state.language);
  const t = translations[language].auth;
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  useState(() => {
    if (searchParams.get("error") === "oauth_failed") {
      toast.error(t.oauthFailed);
    }
  });

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);
    if (error) {
      toast.error(getAuthErrorMessage(error, language));
      return;
    }

    router.replace("/");
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setIsGoogleLoading(false);
      toast.error(getAuthErrorMessage(error, language));
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
          disabled={isLoading || isGoogleLoading}
        />

        <PasswordInput
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={t.password}
          required
          disabled={isLoading || isGoogleLoading}
        />
        <button
          className="auth-button"
          type="submit"
          disabled={isLoading || isGoogleLoading}
        >
          {isLoading ? <Loader /> : t.signIn}
        </button>
        <button
          className="auth-button google-button"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
        >
          {isGoogleLoading ? <Loader /> : t.signInWithGoogle}
        </button>
      </form>
      <p className="auth-switch">
        {language === "uk" ? "Немає акаунта?" : "Don't have an account?"}{" "}
        <Link href="/sign-up">{t.toSignUp}</Link>
      </p>
    </main>
  );
}
