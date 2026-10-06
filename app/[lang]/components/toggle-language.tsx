'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import type { Locale } from '@/i18n-config'

const LANGUAGES: { locale: Locale, name: string }[] = [
  { locale: 'en', name: 'English' },
  { locale: 'es', name: 'Español' },
  { locale: 'pt', name: 'Português' },
  { locale: 'fr', name: 'French' },
  { locale: 'de', name: 'Deutsch' },
  { locale: 'ua', name: 'Українська' },
  { locale: 'ru', name: 'Русский' },
]

export const LangToggle = ({ locale }: { locale: Locale }) => {
  const pathname = usePathname()

  // Swap the first path segment (/ua/buy -> /en/buy)
  const pathFor = (target: Locale) => {
    const segments = (pathname ?? '/').split('/')
    segments[1] = target
    return segments.join('/')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon" className='rounded' />}>
        {locale}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem key={lang.locale} render={<Link href={pathFor(lang.locale)} />}>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
