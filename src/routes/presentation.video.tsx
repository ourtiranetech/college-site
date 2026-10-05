import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/presentation/video')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
     {/* Vidéos — liens cliquables */}
     <section className="mt-10">
        <h2 className="mb-4 font-serif text-2xl font-bold text-(--sea-ink)">
          Vidéos
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <a
            href="/videos/cem-azouaou-tazmal.mp4"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
          >
            <p className="mb-2 text-sm font-medium text-slate-700">
              CEM Azouaou Tazmalt — Avril 2017
            </p>
            <video
              src="/videos/cem-azouaou-tazmal.mp4"
              controls
              className="w-full rounded-lg bg-black aspect-video"
            />
          </a>
          <a
            href="/videos/homage.mp4"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
          >
            <p className="mb-2 text-sm font-medium text-slate-700">
              Hommage à nos héros
            </p>
            <video
              src="/videos/homage.mp4"
              controls
              className="w-full rounded-lg bg-black aspect-video"
            />
          </a>
        </div>
      </section>

      {/* Présentation */}
      <section className="mt-10">
        <p className="m-0 max-w-3xl text-base leading-8 text-(--sea-ink-soft)">
          Le CEM Azouaou Amrane, situé à Tazmalt en Algérie, forme ses élèves
          depuis 1980 dans un cadre d'excellence éducative et d'épanouissement
          de chaque élève.
        </p>
      </section>

  </div>
}
