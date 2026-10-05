import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/presentation/histoire')({
  component: HistoirePage,
})

function HistoirePage() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2 text-center">Présentation</p>
        <h1 className="display-title text-center mb-3 text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          Histoire
        </h1>
        <p className="m-0   text-center text-xl leading-8 text-(--sea-ink-soft)">
          Le CEM Azouaou Amrane, situé à Tazmalt en Algérie, forme ses élèves
          depuis 1980 dans un cadre d'excellence éducative et d'épanouissement
          de chaque élève.
        </p>

        <div className="mt-6 space-y-4 text-xl text-center text-slate-600 leading-8">
          <p>
            Fondé en 1980, le collège porte le nom d'Azouaou Amrane, figure
            emblématique de la revolution dans la région. Au fil des décennies,
            l'établissement a grandi pour accueillir des centaines d'élèves des
            cycles moyens, formant des générations de citoyens engagés et
            cultivés.
          </p>
          <p>
            Notre histoire est celle d'une communauté — élèves, enseignants et
            personnel — unis autour d'un même objectif : transmettre le savoir
            et développer l'esprit critique dans le respect des valeurs
            républicaines et de la langue arabe.
          </p>
          <p>
            De ses débuts modestes à nos jours, le CEM Azouaou Amrane reste
            fidèle à sa mission : offrir à chaque élève les moyens de
            réussir son entrée dans le second cycle et au-delà.
          </p>
        </div>
      </section>

      <nav className="mt-6">
        <Link
          to="/presentation"
          className="inline-block rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50"
        >
          ← Retour à l'accueil
        </Link>
      </nav>
    </main>
  )
}
