import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/personnel/pedagogique')({
  component: PedagogiquePage,
})

function PedagogiquePage() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker text-center mb-2">Personnel pédagogique</p>
        <h1 className="display-title text-center mb-3 text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          Équipe pédagogique
        </h1>
        <p className="m-0 text-centerFondé en 1980 au cœur de la commune de Tazmalt, en Algérie, le Collège d'Enseignement Moyen (CEM) Azouaou Amrane s’affirme depuis plus de quatre décennies comme une institution pivot de la carte scolaire locale. S'inscrivant dans une démarche constante de rigueur pédagogique, l’établissement s'assigne pour mission fondamentale la transmission dispensée selon les plus hauts standards d'exigence disciplinaire et méthodologique.

Au-delà de l'assimilation des savoirs académiques fondamentaux, la vision éducative du collège repose sur un engagement global envers le développement intellectuel, moral et social de la jeunesse. En favorisant un environnement d'apprentissage structuré et inclusif, le CEM Azouaou Amrane s'attache à valoriser le potentiel individuel de chaque apprenant, préparant ainsi avec méthode les générations successives aux transitions scolaires supérieures et aux responsabilités citoyennes. text-base leading-8 text-(--sea-ink-soft)">
          (À compléter) Professeurs et discs de la section pedagogique.
        </p>
      </section>
    </main>
  )
}
