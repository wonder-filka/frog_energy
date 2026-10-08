import Link from 'next/link'
import { Ghost, Home, Grid3X3 } from 'lucide-react'
import type { Dictionary } from '@/get-dictionary'
import type { Locale } from '@/i18n-config'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { BackButton } from './back-button'

// Shared by app/global-not-found.tsx and the admin page (shown to non-admins)
export const NotFoundContent = ({ t, locale }: { t: Dictionary['notfound'], locale: Locale }) => (
  <div className="relative mx-auto max-w-screen-sm px-6 py-16">
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
        {t.title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t.lead}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <BackButton label={t.actions.back} />

        <Button className="bg-amber-400 text-black hover:opacity-90" nativeButton={false} render={<Link href={`/${locale}`} />}>
          <Home className="mr-2 h-4 w-4" />
          {t.actions.home}
        </Button>

        <Button variant="outline" nativeButton={false} render={<Link href={`/${locale}/home`} />}>
          <Grid3X3 className="mr-2 h-4 w-4" />
          {t.actions.slots}
        </Button>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        {t.hint}
      </p>
    </div>
  </div>
)
