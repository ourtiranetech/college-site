import { createFileRoute, Link } from '@tanstack/react-router'

const MISSIONS = [
  {
    title: 'Transmettre le savoir',
    desc: 'Assurer un enseignement de qualité dans toutes les disciplines du cycle moyen, en adaptant les méthodes aux besoins de chaque élève.',
  },
  {
    title: "Cultiver l'esprit critique",
    desc: 'Former des élèves autonomes, capables de raisonner, de questionner et de s\'orienter dans un monde en mutation.',
  },
  {
    title: 'Promouvoir les valeurs républicaines',
    desc: 'Inculquer le respect, la laïcité, l\'égalité et la fraternité au cœur du quotidien scolaire.',
  },
  {
    title: 'Bilinguisme arabe-français',
    desc: "Développer la maîtrise des deux langues officielles pour préparer les élèves à la poursuite d'études supérieures.",
  },
  {
    title: 'Épanouissement personnel',
    desc: 'Encourager la créativité, le sport et la culture aux côtés de la réussite académique.',
  },
  {
    title: 'Ouvrir sur le monde',
    desc: 'Connecter les élèves aux ressources numériques et aux portals éducatifs pour élargir leurs horizons.',
  },
]

export const Route = createFileRoute('/presentation/missions')({
  component: MissionsPage,
})

function MissionsPage() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker text-center mb-2">Présentation</p>
        <h1 className="display-title mb-3 text-center text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          Nos missions
        </h1>
        <p className="m-0  text-center text-base leading-8 text-(--sea-ink-soft)">
          Le CEM Azouaou Amrane s'engage à offrir une formation complète,
          rigoureuse et humaine à chaque élève du cycle moyen.
        </p>
      </section>

      <section className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MISSIONS.map((m) => (
          <article
            key={m.title}
            className="island-shell bg-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            <h3 className="mb-2 text-base font-bold text-(--sea-ink)">
              {m.title}
            </h3>
            <p className="m-0 text-sm leading-7 text-slate-600">
              {m.desc}
            </p>
          </article>
        ))}
      </section>

      <nav className="mt-8">
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
