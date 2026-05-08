import type { Language } from "./LanguageProvider"
import en from "./locales/En.json"
import es from "./locales/Es.json"

export const translations = { es, en } as const

export type Translations = typeof es

export function getTranslations(language: Language): Translations {
  return translations[language] as Translations
}
