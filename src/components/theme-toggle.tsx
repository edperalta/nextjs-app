"use client"

import { Button } from "@/components/ui/button"
import * as React from "react"

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark" | "auto">("auto")
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("theme") as "light" | "dark" | "auto"
    if (stored) {
      setTheme(stored)
      applyTheme(stored)
    }
  }, [])

  const applyTheme = (newTheme: "light" | "dark" | "auto") => {
    if (newTheme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      document.documentElement.classList.toggle("dark", mediaQuery.matches)
    } else {
      document.documentElement.classList.toggle("dark", newTheme === "dark")
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : theme === "dark" ? "auto" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    applyTheme(newTheme)
  }

  if (!mounted) {
    return <div className="w-[88px] h-9" />
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="gap-2 h-9 px-3"
      title={`Current theme: ${theme}`}
    >
      {theme === "light" && <span className="text-lg">☀️</span>}
      {theme === "dark" && <span className="text-lg">🌙</span>}
      {theme === "auto" && <span className="text-lg">💻</span>}
    </Button>
  )
}
