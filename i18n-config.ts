export const i18n = {
  defaultLocale: "en",
  locales: ["en", "de", "es", "fr", "pt", "ru", "ua"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

export const hasLocale = (locale: string): locale is Locale =>
  (i18n.locales as readonly string[]).includes(locale);
