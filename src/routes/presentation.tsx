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
        <h1 className="display-title mb-3 text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          CEM AZOUAOU AMRANE
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-(--sea-ink-soft)">
          Le CEM Azouaou Amrane, situé à Tazmalt en Algérie, forme ses élèves
          depuis 1980 dans un cadre d'excellence éducative et d'épanouissement
          de chaque élève.
        </p>
      </section>

      {/* Vidéos */}
      <section className="mt-10">
        <h2 className="mb-4 font-serif text-2xl font-bold text-(--sea-ink)">
          Vidéos
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-2 text-sm font-medium text-slate-700">
              CEM Azouaou Tazmalt — Avril 2017
            </p>
            <video
              src="/videos/cem-azouaou-tazmal.mp4"
              controls
              className="w-full rounded-lg bg-black aspect-video"
            />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-2 text-sm font-medium text-slate-700">
              Hommage à nos héros
            </p>
            <video
              src="/videos/homage.mp4"
              controls
              className="w-full rounded-lg bg-black aspect-video"
            />
          </div>
        </div>
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
