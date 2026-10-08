"use client"

import Script from "next/script"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import type { Consent } from "@/lib/consent"

// Public ids (they end up in the HTML anyway). Unset = the tracker never loads,
// so local development does not send hits.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

const consentState = ({ analytics, marketing }: Consent) => {
  const value = (granted: boolean) => (granted ? "granted" : "denied")
  return {
    analytics_storage: value(analytics),
    ad_storage: value(marketing),
    ad_user_data: value(marketing),
    ad_personalization: value(marketing),
  }
}

// Mounted once the visitor has chosen. A later change of the choice reloads
// the page (see CookieConsentProvider), so the scripts never need re-configuring.
export const Analytics = ({ consent }: { consent: Consent }) => {
  const pathname = usePathname()
  const firstPathname = useRef(pathname)

  // The pixel's init script tracks the first page; client navigations need their own PageView
  useEffect(() => {
    if (pathname === firstPathname.current) return
    firstPathname.current = pathname
    if (consent.marketing) window.fbq?.("track", "PageView")
  }, [pathname, consent.marketing])

  const useGoogle = (consent.analytics && GTM_ID) || (consent.marketing && GOOGLE_ADS_ID)

  return (
    <>
      {useGoogle && (
        // Consent Mode defaults must be in dataLayer before GTM / gtag.js start
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments)}
          window.gtag = gtag;
          gtag('consent', 'default', ${JSON.stringify(consentState(consent))});
          gtag('js', new Date());
          ${consent.marketing && GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ""}
        `}</Script>
      )}

      {consent.analytics && GTM_ID && (
        <Script id="gtm" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}</Script>
      )}

      {consent.marketing && GOOGLE_ADS_ID && (
        <Script
          id="google-ads"
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
      )}

      {consent.marketing && META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){
            if(f.fbq) return; n=f.fbq=function(){ n.callMethod ?
              n.callMethod.apply(n,arguments) : n.queue.push(arguments) };
            if(!f._fbq) f._fbq=n; n.push=n; n.loaded=!0; n.version='2.0';
            n.queue=[]; t=b.createElement(e); t.async=!0;
            t.src=v; s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)
          }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}</Script>
      )}
    </>
  )
}
