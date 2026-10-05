import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/presentation')({
  component: PresentationPage,
})

// const SECTIONS = [
//   { label: 'Histoire', to: '/presentation/histoire' },
//   { label: 'Missions', to: '/presentation/missions' },
//   { label: 'Infrastructures', to: '/presentation/infrastructures' },
//   { label: 'Galerie photos', to: '/presentation/galerie' },
//   { label: 'videos', to: '/presentation/video' },
// ]

function PresentationPage() {
  return (
    <main className="page-wrap  px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker text-center mb-2">Présentation</p>
        <h1 className="display-title mb-3 text-center text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          CEM AZOUAOU AMRANE
        </h1>
        <p className="m-0   text-center text-base leading-8 text-(--sea-ink-soft)">
        Fondé en 1980 au cœur de la commune de Tazmalt, en Algérie, le Collège d'Enseignement Moyen (CEM) Azouaou Amrane s’affirme depuis plus de quatre décennies comme une institution pivot de la carte scolaire locale. S'inscrivant dans une démarche constante de rigueur pédagogique, l’établissement s'assigne pour mission fondamentale la transmission dispensée selon les plus hauts standards d'exigence disciplinaire et méthodologique.

Au-delà de l'assimilation des savoirs académiques fondamentaux, la vision éducative du collège repose sur un engagement global envers le développement intellectuel, moral et social de la jeunesse. En favorisant un environnement d'apprentissage structuré et inclusif, le CEM Azouaou Amrane s'attache à valoriser le potentiel individuel de chaque apprenant, préparant ainsi avec méthode les générations successives aux transitions scolaires supérieures et aux responsabilités citoyennes.
        </p>
      </section>

     
      {/* Liens
      <section className="mt-6 grid gap-6 sm:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="block bg-gray-200 rounded-xl border border-slate-400 p-6 text-center shadow-sm transition hover:shadow-md"
          >
            {s.label}
          </Link>
        ))}
      </section> */}

      {/* Child routes render here */}
      <Outlet />
    </main>
  )
}
