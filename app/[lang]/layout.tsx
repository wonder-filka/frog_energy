import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { i18n } from "@/i18n-config";
import { getLocale } from "@/get-dictionary";
import { getSessionUserId } from "@/lib/session";
import { getUserBasicSettings } from "./settings/_actions";
import { ThemeProvider } from "./components/theme-provider";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { ProtectedHeader } from "./components/navigation-bar-protect";
import { ScrollToTopButton } from "./components/scroll-to-top";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Frog Energy",
  description: "It’s an online board whose cells are charged to fulfill specific intentions.",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}


export default async function Root(props: LayoutProps<"/[lang]">) {

  const locale = await getLocale();
  const userId = await getSessionUserId();
  const userBasicSettings = userId ? await getUserBasicSettings(userId) : null;

  const { children } = props;


  return (
    <html
      lang={locale}
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={false}>
            <AppSidebar className="hidden md:flex" data={userBasicSettings} userId={userId} />
            <SidebarInset>
              <ProtectedHeader data={userBasicSettings} userId={userId} />
              <main className="flex-1 pt-0">
                {children}
                <ScrollToTopButton />
              </main>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
