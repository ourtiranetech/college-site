import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/presentation')({
  component: PresentationPage,
})

const SECTIONS = [
  { label: 'Histoire & Mission', href: '/presentation' },
  { label: 'Infrastructures', href: '/presentation/infrastructures' },
  { label: 'Galerie photos', href: '/presentation/galerie' },
]

function PresentationPage() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Présentation</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          Collège Ibn Khaldoun
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          Le collège Ibn Khaldoun, situé à Sétif en Algérie, forme ses élèves
          depuis 1975 dans un cadre d'excellence éducative et d'épanouissement
          de chaque élève.
        </p>
      </section>

      <section className="mt-10 grid gap-6 sm:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            to={s.href}
            className="block rounded-xl border border-slate-200 p-6 text-center shadow-sm transition hover:shadow-md"
          >
            {s.label}
          </Link>
        ))}
      </section>
    </main>
  )
}
