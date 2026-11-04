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
      let text = dict[key as keyof typeof dict] ?? key
      if (variables) {
        for (const [k, v] of Object.entries(variables)) {
          text = text.replace(`{${k}}`, String(v))
        }
      }
      return text
    },
    [language],
  )

  return useMemo(
    () => ({
      language,
      changeLanguage,
      toggleLanguage,
      t,
      isRTL: language === 'ar',
    }),
    [language, changeLanguage, toggleLanguage, t],
  )
}
