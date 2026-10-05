import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/parents-eleves/ressources')({
  component: RessourcesPage,
})

function RessourcesPage() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker text-center mb-2">Ressources/examdz</p>
        <h1 className="display-title text-center mb-3 text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          Ressources pédagogiques
        </h1>
        <p className="m-0 text-center text-base leading-8 text=[var(--sea-ink-soft)]">
          (À compléter) Documents et ressources pour les élèves.
        </p>
        <section className="mt-6">
          <a
            href="https://www.examdz.com/moyen/"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-slate-200 p-5 shadow-sm transition hover:shadow-md hover:border-blue-300"
          >
            <p className="text-sm text-center font-semibold text-slate-800">ExamDZ — Archives BEM</p>
            <p className="mt-1 text-center text-xs text-slate-500">
              Froups, examens et archive BEM 2008–2027 — ouvre dans un nouvel onglet
            </p>
          </a>
        </section>
      </section>
    </main>
  )
}
