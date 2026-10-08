import { Separator } from "./ui/separator";
import { getDictionary, getLocale, type Dictionary } from "@/get-dictionary";
import Image from "next/image";
import Link from "next/link";
import { CookieSettingsButton } from "./cookie-consent";

type FooterLinks = Dictionary["footer"]["links"];

const buildSections = (t: Dictionary, locale: string) => [
  {
    title: t.footer.sections.boards.title,
    links: [
      { title: t.footer.links.board_money, href: `/${locale}/money` },
      { title: t.footer.links.board_love, href: `/${locale}/love` },
      { title: t.footer.links.board_luck, href: `/${locale}/luck` },
      { title: t.footer.links.board_soul, href: `/${locale}/soul` },
      { title: t.footer.links.board_dream, href: `/${locale}/dream` },
    ],
  },
  {
    title: t.footer.sections.social.title,
    links: [
      { title: t.footer.links.tiktok, href: 'https://www.tiktok.com/@frog.energyy' },
      { title: t.footer.links.instagram, href: 'https://www.instagram.com/frog.energyy' },
      { title: t.footer.links.telegram, href: 'https://t.me/frog_energyy' },
      { title: 'support@frog-energy.com', href: 'mailto:support@frog-energy.com' },
    ],
  },
  {
    title: t.footer.sections.legal.title,
    links: (['terms', 'privacy', 'cookies'] as const satisfies (keyof FooterLinks)[]).map((key) => ({
      title: t.footer.links[key],
      href: `/${locale}/${key}`,
    })),
  },
  {
    title: t.footer.sections.company.title,
    links: [
      { title: t.footer.links.contact, href: `/${locale}/contact` },
    ],
  },
];

export const Footer = async () => {
  const t = await getDictionary();
  const locale = await getLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 xs:mt-20 dark bg-background border-t">
      <div className="max-w-screen-xl mx-auto py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-x-4 gap-y-10 px-6">
        {/* Logo and Brand */}
        <div className="col-span-full xl:col-span-2 flex items-start">
          <Image
            src="/footer.png"
            alt="Frog Energy logo"
            width={36}
            height={24}
          />
          <span className="ml-2 text-xl text-amber-400 font-bold">
            Frog Energy
          </span>
        </div>

        {/* Navigation Sections */}
        {buildSections(t, locale).map((section) => (
          <nav
            key={section.title}
            className="xl:justify-self-end"
            aria-label={section.title}
          >
            <h3 className="font-semibold text-foreground">
              {section.title}
            </h3>
            <ul className="mt-6 space-y-4">
              {section.links.map(({ title, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    {...(href.startsWith('http') && {
                      target: '_blank',
                      rel: 'noopener noreferrer'
                    })}
                  >
                    {title}
                  </Link>
                </li>
              ))}
              {section.title === t.footer.sections.legal.title && (
                <li>
                  <CookieSettingsButton label={t.cookieConsent.footerLink} />
                </li>
              )}
            </ul>
          </nav>
        ))}
      </div>

      <Separator />

      {/* Copyright Section */}
      <div className="max-w-screen-xl mx-auto py-2 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6">
        <p className="text-xs text-muted-foreground text-center xs:text-start">
          &copy; {year} Frog Energy. {t.footer.rights} {t.company.location}
        </p>
      </div>
    </footer>
  );
};
