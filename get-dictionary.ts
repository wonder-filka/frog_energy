import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "./i18n-config";

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
    en: () => import("./dictionaries/en.json").then((module) => module.default),
    de: () => import("./dictionaries/de.json").then((module) => module.default),
    es: () => import("./dictionaries/es.json").then((module) => module.default),
    fr: () => import("./dictionaries/fr.json").then((module) => module.default),
    pt: () => import("./dictionaries/pt.json").then((module) => module.default),
    ru: () => import("./dictionaries/ru.json").then((module) => module.default),
    ua: () => import("./dictionaries/ua.json").then((module) => module.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["en"]>>;

export { hasLocale };

// Current locale from the [lang] root segment (Server Components only)
export const getLocale = async (): Promise<Locale> => {
    const locale = await lang();
    if (!hasLocale(locale)) notFound();
    return locale;
};

export const getDictionary = async (locale?: Locale): Promise<Dictionary> =>
    dictionaries[locale ?? (await getLocale())]();
