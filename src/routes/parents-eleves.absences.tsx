import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/parents-eleves/absences')({
  component: AbsencesPage,
})

function AbsencesPage() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker text-center mb-2">Absences</p>
        <h1 className="display-title text-center mb-3 text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          Suivi des absences
        </h1>
        <p className="m-0 text-center text-base leading-8 text-(--sea-ink-soft)">
          (À compléter) Historique et suivi des absences.
        </p>
      </section>
    </main>
  )
}
