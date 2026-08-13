"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
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

    setMessage("Реєстрація успішна! Перевір свою електронну пошту.");
  };

  return (
    <main>
      <h1>Реєстрація</h1>

      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
        />

        <button type="submit">Зареєструватися</button>
      </form>

      {message && <p>{message}</p>}
    </main>
  );
}
