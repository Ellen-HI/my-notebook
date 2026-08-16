"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { translations } from "@/lib/i18n";
import { useSettingsStore } from "@/lib/store/settingsStore";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";

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
      setMessage(error.message);
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

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { createClient } from "@/lib/supabase/client";
// import { translations } from "@/lib/i18n";
// import { useSettingsStore } from "@/lib/store/settingsStore";
// import Link from "next/link";

// export default function SignUpPage() {
//   const language = useSettingsStore((state) => state.language);
//   const t = translations[language].auth;
//   const router = useRouter();
//   const supabase = createClient();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSignUp = async (event: React.FormEvent) => {
//     event.preventDefault();

//     setMessage("");
//     setIsLoading(true);

//     const { error } = await supabase.auth.signUp({
//       email,
//       password,
//     });

//     setIsLoading(false);

//     if (error) {
//       setMessage(error.message);
//       return;
//     }

//     // Confirm email выключен в проекте — signUp сразу возвращает сессию,
//     // так что пользователя можно вести прямо в приложение,
//     // а не оставлять его на форме регистрации.
//     router.replace("/");
//     router.refresh();
//   };

//   return (
//     <main className="auth-page">
//       <h1>{t.signUp}</h1>

//       <form onSubmit={handleSignUp} className="auth-form">
//         <input
//           type="email"
//           placeholder={t.email}
//           value={email}
//           onChange={(event) => setEmail(event.target.value)}
//           required
//           disabled={isLoading}
//         />

//         <input
//           type="password"
//           placeholder={t.password}
//           value={password}
//           onChange={(event) => setPassword(event.target.value)}
//           required
//           minLength={6}
//           disabled={isLoading}
//         />

//         <button className="auth-button" type="submit" disabled={isLoading}>
//           {isLoading ? "..." : t.signUp}
//         </button>
//       </form>
//       <p className="auth-switch">
//         {language === "uk" ? "Вже маєте акаунт?" : "Already have an account?"}{" "}
//         <Link href="/sign-in">{t.toSignIn}</Link>
//       </p>
//       {message && <p>{message}</p>}
//     </main>
//   );
// }
