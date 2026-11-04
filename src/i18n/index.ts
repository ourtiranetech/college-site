export const SUPPORTED_LANGUAGES = ['fr', 'ar'] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: Language = 'fr'
export const LANGUAGE_STORAGE_KEY = 'college-language'

export function isValidLanguage(lang: string): lang is Language {
  return SUPPORTED_LANGUAGES.includes(lang as Language)
}

export function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (stored && isValidLanguage(stored)) return stored
  } catch {
    // storage unavailable
  }
  return DEFAULT_LANGUAGE
}

export function setStoredLanguage(lang: Language) {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
  } catch {
    // storage unavailable
  }
}
