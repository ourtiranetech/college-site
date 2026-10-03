import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/parents-eleves')({
  component: ParentsElevesPage,
})

const LINKS = [
  { label: 'Emploi du temps', href: '/parents-eleves/emploi-du-temps' },
  { label: 'Notes & Résultats', href: '/parents-eleves/notes' },
  { label: 'Suivi des absences', href: '/parents-eleves/absences' },
  { label: 'Actualités', href: '/parents-eleves/actualites' },
  { label: 'Calendrier', href: '/parents-eleves/calendrier' },
  { label: 'Ressources', href: '/parents-eleves/ressources' },
  { label: 'Inscriptions', href: '/parents-eleves/inscriptions' },
  { label: 'Nous contacter', href: '/parents-eleves/contact' },
]

function ParentsElevesPage() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8 mb-8">
        <p className="island-kicker mb-2">Parents & Élèves</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          Espace parents et élèves
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          Accédez aux services dédiés aux familles et aux élèves : emploi du
          temps, notes, absences, actualités, calendrier et ressources.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            to={l.href}
            className="block rounded-xl border border-slate-200 p-5 text-center shadow-sm transition hover:shadow-md"
          >
            {l.label}
          </Link>
        ))}
      </section>
    </main>
  )
}
