import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/personnel/entretien')({
  component: EntretienPage,
})

function EntretienPage() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Personnel d'entretien</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          Personnel d'entretien
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          (À compléter) Gardiens et agent d'entretien du college.
        </p>
      </section>
    </main>
  )
}
