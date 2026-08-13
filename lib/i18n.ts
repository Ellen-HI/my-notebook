export const translations = {
  uk: {
    days: [
      "ПОНЕДІЛОК",
      "ВІВТОРОК",
      "СЕРЕДА",
      "ЧЕТВЕР",
      "П'ЯТНИЦЯ",
      "СУБОТА",
      "НЕДІЛЯ",
    ],

    auth: {
      signIn: "Увійти",
      signUp: "Зареєструватися",
      logout: "Вийти",
      email: "Email",
      password: "Пароль",
      signInWithGoogle: "Увійти через Google",
      registrationSuccess: "Реєстрація успішна! Перевір свою електронну пошту.",
    },
  },

  en: {
    days: [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ],

    auth: {
      signIn: "Sign in",
      signUp: "Sign up",
      logout: "Log out",
      email: "Email",
      password: "Password",
      signInWithGoogle: "Continue with Google",
      registrationSuccess: "Registration successful! Check your email.",
    },
  },
} as const;
