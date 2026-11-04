import { createContext, useContext } from 'react'
import { useTranslation } from './useTranslation'

const LanguageContext = createContext<ReturnType<typeof useTranslation> | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const translation = useTranslation()
  return <LanguageContext.Provider value={translation}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    // Fallback: create a translation hook directly if used outside provider
    const { useTranslation } = require('./useTranslation')
    return useTranslation()
  }
  return ctx
}
