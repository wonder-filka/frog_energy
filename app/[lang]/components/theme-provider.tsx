"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export const ThemeProvider = ({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) => {
  return (
    <NextThemesProvider
      // The theme script runs during SSR only; on the client React would warn about
      // rendering a <script>, so it's marked inert there (see Next "Preventing Flash" guide)
      scriptProps={{ type: typeof window === "undefined" ? "text/javascript" : "text/plain" }}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
