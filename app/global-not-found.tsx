import "./[lang]/globals.css"
import Link from 'next/link'
import { headers } from 'next/headers'
import { Geist, Geist_Mono } from 'next/font/google'
import { Ghost, Home, Grid3X3 } from 'lucide-react'
import type { Metadata } from 'next'
import { getDictionary } from '@/get-dictionary'
import { hasLocale, i18n } from '@/i18n-config'
import { cn } from '@/lib/utils'
import { Button } from './[lang]/components/ui/button'
import { BackButton } from './[lang]/components/back-button'
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
          <main className="relative mx-auto max-w-screen-sm px-6 py-16">
            {/* мягкое сияние */}
            <div
              aria-hidden
              className={cn(
                'pointer-events-none absolute -inset-24 -z-10 opacity-25 blur-3xl',
                'bg-gradient-to-tr from-amber-400/40 via-rose-400/30 to-emerald-400/30'
              )}
            />
            <div className="rounded-2xl border bg-background/60 backdrop-blur p-6 md:p-8">
              <div className="mb-4 flex items-center gap-3">
                <Ghost className="h-6 w-6 text-amber-400" />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  404
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {t.notfound.title}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {t.notfound.lead}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <BackButton label={t.notfound.actions.back} />

                <Button className="bg-amber-400 text-black hover:opacity-90" nativeButton={false} render={<Link href={`/${locale}`} />}>
                  <Home className="mr-2 h-4 w-4" />
                  {t.notfound.actions.home}
                </Button>

                <Button variant="outline" nativeButton={false} render={<Link href={`/${locale}/home`} />}>
                  <Grid3X3 className="mr-2 h-4 w-4" />
                  {t.notfound.actions.slots}
                </Button>
              </div>

              <p className="mt-6 text-xs text-muted-foreground">
                {t.notfound.hint}
              </p>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
