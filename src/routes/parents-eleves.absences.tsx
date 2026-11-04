import { createFileRoute } from '@tanstack/react-router'
import { useLanguage } from '../i18n/LanguageProvider'

export const Route = createFileRoute('/parents-eleves/absences')({
  component: AbsencesPage,
})

function AbsencesPage() {
  const { t } = useLanguage()

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">{t('parents.kicker')}</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          {t('parents.absences')}
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          (À compléter) Historique et suivi des absences.
        </p>
      </section>
    </main>
  )
}
