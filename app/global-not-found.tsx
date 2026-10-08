import "./[lang]/globals.css"
import { headers } from 'next/headers'
import { Geist, Geist_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import { getDictionary } from '@/get-dictionary'
import { hasLocale, i18n } from '@/i18n-config'
import { cn } from '@/lib/utils'
import { NotFoundContent } from './[lang]/components/not-found-content'
import { ThemeProvider } from './[lang]/components/theme-provider'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: 'Not Found',
  description: 'The page you are looking for does not exist.',
}

export default async function GlobalNotFound() {
  const lang = (await headers()).get('x-lang') ?? ''
  const locale = hasLocale(lang) ? lang : i18n.defaultLocale
  const t = await getDictionary(locale)

  return (
    <html
      lang={locale}
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans")}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NotFoundContent t={t.notfound} locale={locale} />
        </ThemeProvider>
      </body>
    </html>
  )
}
