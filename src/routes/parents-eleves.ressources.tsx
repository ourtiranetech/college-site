import { createFileRoute, Link } from '@tanstack/react-router'
import { useLanguage } from '../i18n/LanguageProvider'

export const Route = createFileRoute('/parents-eleves/ressources')({
  component: RessourcesPage,
})

function RessourcesPage() {
  const { t } = useLanguage()

  return (
    <main className="page-wrap px-4 py-12">
     <section className="bg-orange-100 shadow-2xl mb-20 island-shell m-auto border w-1/2 text-center rounded-2xl p-6 sm:p-8">
        <p className="island-kicker text-center mb-2">{t('parents.kicker')}</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          {t('parents.ressourcesTitle')}
        </h1>
        <p className="m-0  text-center leading-8 text-(--sea-ink-soft)">
          {t('parents.ressourcesDesc')}
        </p>
      </section>
      <section className="mx-auto max-w-2xl space-y-4">
        <a
          href="https://www.examdz.com/moyen/"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-xl bg-[#0F2147] px-6 py-4 text-center text-lg font-semibold text-white shadow-[0_8px_30px_-10px_rgba(15,33,71,0.25)] hover:bg-[#0F2147]/90 hover:shadow-[0_12px_40px_-10px_rgba(15,33,71,0.35)]"
        >
          {t('parents.ressourcesAcces')}
        </a>

        <Link
          to="/parents-eleves"
          className="block w-full rounded-xl border-2 border-dashed border-slate-300 px-6 py-4 text-center text-sm font-medium text-slate-600 hover:border-slate-500 hover:text-slate-800 hover:shadow-sm"
        >
          {t('parents.ressourcesRetour')}
        </Link>
      </section>
    </main>
  )
}
