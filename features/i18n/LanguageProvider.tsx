"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { getTranslations, type Translations } from "./translations"

export type Language = "es" | "en"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es")

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("language") as Language | null
    const initialLanguage = savedLanguage === "en" || savedLanguage === "es" ? savedLanguage : "es"
    setLanguageState(initialLanguage)
    document.documentElement.lang = initialLanguage
  }, [])

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage)
    window.localStorage.setItem("language", nextLanguage)
    document.documentElement.lang = nextLanguage
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage(language === "es" ? "en" : "es"),
      t: getTranslations(language),
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
