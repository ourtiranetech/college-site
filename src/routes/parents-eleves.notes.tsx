import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageProvider'

export const Route = createFileRoute('/parents-eleves/notes')({
  component: NotesPage,
})

function NotesPage() {
  const { t } = useLanguage()

  useEffect(() => {
    window.location.href = 'https://awlyaa.education.dz/login'
  }, [])

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">{t('parents.kicker')}</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          {t('parents.notes')}
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-(--sea-ink-soft)">
          {t('parents.notesRedirect').split('awlyaa.education.dz')[0]}
          <a href="https://awlyaa.education.dz/login" className="text-(--sea-accent) underline">awlyaa.education.dz</a>
          {t('parents.notesRedirect').split('awlyaa.education.dz')[1] || '…'}
        </p>
      </section>
    </main>
  )
}
