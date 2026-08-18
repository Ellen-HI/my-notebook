import { translations } from "@/lib/i18n";

type Language = keyof typeof translations;

export function getAuthErrorMessage(
  error: { message: string },
  language: Language,
): string {
  const errors = translations[language].errors;
  const raw = error.message.toLowerCase();

  if (raw.includes("invalid login credentials")) {
    return errors.invalidCredentials;
  }

  if (raw.includes("user already registered")) {
    return errors.userAlreadyRegistered;
  }

  if (raw.includes("email not confirmed")) {
    return errors.emailNotConfirmed;
  }

  if (raw.includes("password") && raw.includes("weak")) {
    return errors.weakPassword;
  }

  if (raw.includes("rate limit") || raw.includes("too many requests")) {
    return errors.tooManyRequests;
  }

  console.error("Непереведена помилка Supabase auth:", error.message);
  return errors.generic;
}
