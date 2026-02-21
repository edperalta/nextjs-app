"use client"

import * as React from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    
    const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }

    // Set initial theme
    updateTheme(mediaQuery)

    // Listen for changes
    mediaQuery.addEventListener("change", updateTheme)

    return () => mediaQuery.removeEventListener("change", updateTheme)
  }, [])

  return <>{children}</>
}
