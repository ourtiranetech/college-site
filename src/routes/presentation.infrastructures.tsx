import { createFileRoute, Link } from '@tanstack/react-router'
const INFRA_ITEMS = [
  {
    title: 'Salles de classe',
    desc: '24 salles équipées de tableaux interactifs, ventilées et lumineuses pour un apprentissage optimal.',
  },
  {
    title: 'Laboratoires',
    desc: 'Laboratoires de sciences (physique, chimie, SVT) avec matériel adapté au programme du cycle moyen.',
  },
  {
    title: 'Bibliothèque',
    desc: 'Espace de lecture et de recherche accueillant livres scolaires, ouvrages de référence et ressources numériques.',
  },
  {
    title: 'Cour de récréation',
    desc: 'Espace extérieur sécurisé pour les pauses et les activités sportives.',
  },
  {
    title: "Salle d'informatique",
    desc: 'Postes connectés pour l\'initiation au numérique et les travaux pratiques.',
  },
  {
    title: 'Terrain de sport',
    desc: 'Installations pour l\'EPS : football, athlétisme et jeux collectifs.',
  },
]

export const Route = createFileRoute('/presentation/infrastructures')({
  component: InfrastructuresPage,
})

function InfrastructuresPage() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell  bg-[url(../media/cem.jpg)] bg-size-[auto_200px] rounded-2xl p-6 sm:p-8">
        <p className="island-kicker text-center mb-2">Présentation</p>
        <h1 className="display-title mb-3 text-center text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          Infrastructures
        </h1>
        <p className="m-0  text-center text-base leading-8 text-(--sea-ink-soft)">
          Découvrez les installations du CEM Azouaou Amrane : salles,
          laboratoires, bibliothèque et espaces sportifs.
        </p>
      </section>

      <section className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {INFRA_ITEMS.map((item) => (
          <article
            key={item.title}
            className="island-shell rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            <h3 className="mb-2 text-base font-bold text-(--sea-ink)">
              {item.title}
            </h3>
            <p className="m-0 text-sm leading-7 text-slate-600">
              {item.desc}
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
