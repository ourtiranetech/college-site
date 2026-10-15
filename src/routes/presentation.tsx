import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/presentation')({
  component: PresentationPage,
})

const SECTIONS = [
  {
    label: 'Histoire & Mission',
    href: '/presentation/histoire',
    resume: 'La vie d\'Azouaou Amrane et la création du collège.',
  },
  {
    label: 'Infrastructures',
    href: '/presentation/infrastructures',
    resume: 'Présentation de l\'établissement et de ses équipements.',
  },
  {
    label: 'Galerie photos',
    href: '/presentation/galerie',
    resume: 'Mosaïque des activités et de la vie du collège.',
  },
]

function PresentationPage() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Présentation</p>
        <h1 className="display-title mb-3 text-4xl font-bold sm:text-5xl">
          CEM Azouaou Amrane
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-(--sea-ink-soft)">
          Le CEM Azouaou Amrane, situé à Tazmalt en Algérie, forme ses élèves
          depuis 1980 dans un cadre d'excellence éducative et d'épanouissement
          de chaque élève.
        </p>
      </section>

      {/* Les vidéos sont présentées dans leurs pages dédiées :
          « Hommage à nos héros » dans Histoire & Mission,
          la visite de l'établissement dans Infrastructures. */}
      <section className="mt-10 grid gap-6 sm:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            to={s.href}
            className="block rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md"
          >
            <span className="block text-sm font-semibold text-slate-800">{s.label}</span>
            <span className="mt-1 block text-xs text-slate-500">{s.resume}</span>
          </Link>
        ))}
      </section>

      {/* Routes enfants : histoire, infrastructures, galerie.
          Sans cet <Outlet />, /presentation/histoire affichait le contenu du
          parent et jamais la page enfant. */}
      <Outlet />
    </main>
  )
}
