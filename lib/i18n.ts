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
      registrationSuccess: "В тебе вийшло! Перевір свою пошту.",
      oauthFailed: "Не вдалося увійти через Google. Давай ще раз.",
    },
    errors: {
      invalidCredentials: "Невірний email або пароль",
      userAlreadyRegistered: "Користувач із такою поштою вже існує",
      emailNotConfirmed: "Підтвердіть email перед входом",
      weakPassword: "Пароль занадто простий",
      tooManyRequests: "Забагато спроб. Спробуйте пізніше",
      generic: "Йоой... Спробуйте ще раз",
    },
    notes: {
      loadFailed: "Не вдалося завантажити записи",
      saveFailed: "Не вдалося зберегти запис",
      deleteFailed: "Не вдалося видалити запис",
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
      registrationSuccess: "You did it! Check your email.",
      oauthFailed: "Google sign-in failed. Please try again.",
    },
    errors: {
      invalidCredentials: "Invalid email or password",
      userAlreadyRegistered: "A user with this email already exists",
      emailNotConfirmed: "Please confirm your email before signing in",
      weakPassword: "Password is too weak",
      tooManyRequests: "Too many attempts. Please try again later",
      generic: "Oops... Please try again",
    },
    notes: {
      loadFailed: "Failed to load notes",
      saveFailed: "Failed to save note",
      deleteFailed: "Failed to delete note",
    },
  },
} as const;
