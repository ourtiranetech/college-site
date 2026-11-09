import { useCallback, useEffect, useMemo, useState } from 'react'
import { translations } from './translations'
import {
  DEFAULT_LANGUAGE,
  type Language,
  getStoredLanguage,
  setStoredLanguage,
} from './index'

export type { Language }

export function useTranslation() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return DEFAULT_LANGUAGE
    return getStoredLanguage()
  })

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  const changeLanguage = useCallback(
    (lang: Language) => {
      setLanguage(lang)
      setStoredLanguage(lang)
    },
    [],
  )

  const toggleLanguage = useCallback(() => {
    const next = language === 'fr' ? 'ar' : 'fr'
    changeLanguage(next)
  }, [language, changeLanguage])

  const t = useCallback(
    (key: string, variables?: Record<string, string | number>) => {
      const dict = translations[language] ?? translations.fr
      const raw = dict[key as keyof typeof dict]
      let text = typeof raw === 'string' ? raw : key
      if (variables) {
        for (const [k, v] of Object.entries(variables)) {
          text = text.replace(`{${k}}`, String(v))
        }
      }
      return text
    },
    [language],
  )

  /**
   * Récupère un bloc de texte (tableau de lignes) dans la langue courante.
   * Retourne un tableau vide si la clé est absente ou ne pointe pas un tableau.
   */
  const tList = useCallback(
    (key: string): string[] => {
      const dict = translations[language] ?? translations.fr
      const raw = dict[key as keyof typeof dict]
      return Array.isArray(raw) ? raw : []
    },
    [language],
  )

  return useMemo(
    () => ({
      language,
      changeLanguage,
      toggleLanguage,
      t,
      tList,
      isRTL: language === 'ar',
    }),
    [language, changeLanguage, toggleLanguage, t, tList],
  )
}
