"use client"

import Link from "next/link"
import { X } from "lucide-react"
import { createContext, use, useState, type ReactNode } from "react"
import type { Dictionary } from "@/get-dictionary"
import type { Locale } from "@/i18n-config"
import { deleteTrackerCookies, writeConsentCookie, type Consent } from "@/lib/consent"
import { Analytics } from "./analytics"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"

type T = Dictionary["cookieConsent"]

const CookieConsentContext = createContext<{ openSettings: () => void } | null>(null)

type ProviderProps = {
  initialConsent: Consent | null
  t: T
  locale: Locale
  children: ReactNode
}

export const CookieConsentProvider = ({ initialConsent, t, locale, children }: ProviderProps) => {
  const [consent, setConsent] = useState(initialConsent)
  const [open, setOpen] = useState(initialConsent === null)
  const [customizing, setCustomizing] = useState(false)

  const save = (next: Consent) => {
    writeConsentCookie(next)

    if (consent) {
      const changed = consent.analytics !== next.analytics || consent.marketing !== next.marketing
      if (changed) {
        // Loaded trackers can't be unloaded: drop their cookies and start clean
        if ((consent.analytics && !next.analytics) || (consent.marketing && !next.marketing)) {
          deleteTrackerCookies()
        }
        location.reload()
        return
      }
    }

    setConsent(next)
    setOpen(false)
  }

  const openSettings = () => {
    setCustomizing(true)
    setOpen(true)
  }

  return (
    <CookieConsentContext value={{ openSettings }}>
      {children}
      {consent && <Analytics consent={consent} />}
      {open && (
        <CookieBanner
          t={t}
          locale={locale}
          current={consent}
          customizing={customizing}
          onCustomize={() => setCustomizing(true)}
          onClose={consent ? () => setOpen(false) : undefined}
          onSave={save}
        />
      )}
    </CookieConsentContext>
  )
}

// For the footer: reopen the banner and change the choice
export const CookieSettingsButton = ({ label }: { label: string }) => {
  const ctx = use(CookieConsentContext)
  return (
    <button
      type="button"
      onClick={ctx?.openSettings}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      {label}
    </button>
  )
}

type BannerProps = {
  t: T
  locale: Locale
  current: Consent | null
  customizing: boolean
  onCustomize: () => void
  onClose?: () => void
  onSave: (consent: Consent) => void
}

const CookieBanner = ({ t, locale, current, customizing, onCustomize, onClose, onSave }: BannerProps) => {
  const [analytics, setAnalytics] = useState(current?.analytics ?? false)
  const [marketing, setMarketing] = useState(current?.marketing ?? false)

  const categories = [
    { id: "necessary", title: t.necessaryTitle, desc: t.necessaryDesc, checked: true, disabled: true },
    { id: "analytics", title: t.analyticsTitle, desc: t.analyticsDesc, checked: analytics, onChange: setAnalytics },
    { id: "marketing", title: t.marketingTitle, desc: t.marketingDesc, checked: marketing, onChange: setMarketing },
  ]

  return (
    <section
      role="dialog"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-4 bottom-4 z-50 border bg-background p-4 shadow-lg sm:left-auto sm:max-w-md"
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}

      <h2 id="cookie-consent-title" className="pr-6 font-semibold">{t.title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {t.text}{" "}
        <Link href={`/${locale}/cookies`} className="underline underline-offset-4 hover:text-foreground">
          {t.policy}
        </Link>
      </p>

      {customizing && (
        <ul className="mt-4 space-y-3">
          {categories.map((c) => (
            <li key={c.id} className="flex gap-3">
              <Checkbox
                id={`cookie-${c.id}`}
                checked={c.checked}
                disabled={c.disabled}
                onCheckedChange={c.onChange}
                className="mt-0.5"
              />
              <label htmlFor={`cookie-${c.id}`} className="text-sm">
                <span className="font-medium">{c.title}</span>
                <span className="block text-muted-foreground">{c.desc}</span>
              </label>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={() => onSave({ analytics: true, marketing: true })}>{t.accept}</Button>
        {customizing ? (
          <Button variant="secondary" onClick={() => onSave({ analytics, marketing })}>{t.save}</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={() => onSave({ analytics: false, marketing: false })}>{t.decline}</Button>
            <Button variant="ghost" onClick={onCustomize}>{t.customize}</Button>
          </>
        )}
      </div>
    </section>
  )
}
