import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/presentation/infrastructures')({
  component: InfrastructuresPage,
})

function InfrastructuresPage() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Infrastructures</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          CEM AZOUAOU TAZMAL
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-(--sea-ink-soft)">
          CEM Azouaou Tazmalt — Avril 2017
        </p>
        <div className="mt-6">
          <video
            src="/videos/cem-azouaou-tazmal.mp4"
            controls
            className="w-full rounded-lg bg-black aspect-video"
          />
        </div>
      </section>
    </main>
  )
}
