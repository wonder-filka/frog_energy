import type { MetadataRoute } from "next";
import { i18n } from "@/i18n-config";
import { SITE_URL } from "@/lib/constants";

// Public pages only, without the leading slash ("" is the landing)
const publicPages = ["", "money", "love", "luck", "soul", "dream", "contact", "home"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return publicPages.flatMap((page) => {
    const path = page ? `/${page}` : "";
    const languages = Object.fromEntries(
      i18n.locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`]),
    );
    const isBase = page === "" || page === "contact";

    return i18n.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency: isBase ? "weekly" : "daily",
      priority: isBase ? 1 : 0.9,
      alternates: { languages },
    }));
  });
}
