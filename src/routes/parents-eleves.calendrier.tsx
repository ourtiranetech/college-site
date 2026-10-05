import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/parents-eleves/calendrier')({
  component: CalendrierPage,
})

function CalendrierPage() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker text-center mb-2">Calendrier</p>
        <h1 className="display-title text-center mb-3 text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          Calendrier scolaire
        </h1>
        <p className="m-0 text-center text-base leading-8 text-(--sea-ink-soft)">
          (À compléter) Calendrier académique et événements.
        </p>
      </section>
    </main>
  )
}
