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
      toSignUp: "Зареєструватися",
      toSignIn: "Вхід",
      signIn: "Вхід",
      signUp: "Зареєструватися",
      logout: "Вийти",
      email: "Email",
      password: "Пароль",
      signInWithGoogle: "Вхід через Google",
      registrationSuccess: "Реєстрація успішна! Перевір свою електронну пошту.",
      oauthFailed: "Не вдалося увійти через Google. Спробуйте ще раз.",
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
      toSignUp: "Sign up",
      toSignIn: "Sign in",
      signIn: "Sign in",
      signUp: "Sign up",
      logout: "Log out",
      email: "Email",
      password: "Password",
      signInWithGoogle: "Continue with Google",
      registrationSuccess: "Registration successful! Check your email.",
      oauthFailed: "Google sign-in failed. Please try again.",
    },
  },
} as const;
