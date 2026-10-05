import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/personnel')({
  component: PersonnelLayout,
})

function PersonnelLayout() {
  return (
    <main className="page-wrap px-4 py-12">
      {/* En-tête générique pour toute la section personnel */}
      <section className="island-shell rounded-2xl p-6 sm:p-8 mb-6">
        <p className="island-kicker text-center mb-2">Personnel</p>
        <h1 className="display-title text-center mb-3 text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          Notre Équipe
        </h1>
        <p className="m-0 text-center text-base leading-8 text-(--sea-ink-soft)">
          Découvrez le personnel pédagogique et d'entretien du collège Azouaou Amrane.
        </p>
      </section>

      {/* C'est ici que les sous-pages (pedagogique.tsx et entretien.tsx) vont s'afficher */}
      <Outlet />
    </main>
  )
}