import { createFileRoute } from '@tanstack/react-router'
import { useLanguage } from '../i18n/LanguageProvider'

export const Route = createFileRoute('/parents-eleves/actualites')({
  component: ActualitesPage,
})

function ActualitesPage() {
  const { t } = useLanguage()

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">{t('parents.kicker')}</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          {t('parents.actualites')}
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-(--sea-ink-soft)">
          (À compléter) Dernières actualités et annonces.
        </p>
      </section>
    </main>
  )
}
