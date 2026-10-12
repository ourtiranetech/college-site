import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/personnel/pedagogique')({
  component: PedagogiquePage,
})

// Données de test : 15 professeurs pour l'équipe pédagogique
const PEDAGOGIQUES = [
  { nom: 'Benali', prenom: 'Karim', fonction: 'Chef d\'établissement' },
  { nom: 'Cherif', prenom: 'Samira', fonction: 'Directrice d\'établissement' },
  { nom: 'Kaci', prenom: 'Mohamed', fonction: 'Professeur d\'arithmétique' },
  { nom: 'Tlemçani', prenom: 'Fatima', fonction: 'Professeur de français' },
  { nom: 'Ghanem', prenom: 'Ahmed', fonction: 'Professeur d\'EPS' },
  { nom: 'Berkani', prenom: 'Nadia', fonction: 'Professeur d\'histoire-géo' },
  { nom: 'Zaidi', prenom: 'Yacine', fonction: 'Professeur de SVT' },
  { nom: 'Belaïli', prenom: 'Lina', fonction: 'Professeur d\'anglais' },
  { nom: 'Gharbi', prenom: 'Rafik', fonction: 'Professeur d\'art' },
  { nom: 'Mekdache', prenom: 'Sonia', fonction: 'Professeur de musique' },
  { nom: 'Djenali', prenom: 'Bilal', fonction: 'Professeur d\'éducation physique' },
  { nom: 'Hadjadj', prenom: 'Imène', fonction: 'Professeur de TEC' },
  { nom: 'Boudiaf', prenom: 'Noureddine', fonction: 'Inspecteur d\'académie' },
  { nom: 'Zitouni', prenom: 'Amina', fonction: 'Bibliothécaire' },
  { nom: 'Lamri', prenom: 'Olivier', fonction: 'Psychologue scolaire' },
]

function PedagogiquePage() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Personnel pédagogique</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          Équipe pédagogique
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-(--sea-ink-soft)">
          Voici la liste des 15 professeurs et personnels éducatifs de l'établissement.
        </p>

        {/* Tableau moderne */}
        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <h2 className="text-lg font-bold text-(--sea-ink)">
              15 membres de l'équipe pédagogique
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[var(--sea-ink)] text-white">
                  <th className="px-6 py-4 text-left font-semibold text-sm">
                    Prénom
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">
                    Nom
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">
                    Fonction
                  </th>
                </tr>
              </thead>
              <tbody>
                {PEDAGOGIQUES.map((personne, idx) => (
                  <tr
                    key={idx}
                    className="group transition-all duration-200 cursor-pointer
                      border-b border-slate-100
                      bg-slate-50/30
                    "
                  >
                    <td className="px-6 py-4 font-semibold text-[var(--sea-ink)] transition-colors duration-150 group-hover:text-white">
                      {personne.prenom}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600 transition-colors duration-150 group-hover:text-slate-300">
                      {personne.nom}
                    </td>
                    <td className="px-6 py-4 text-slate-500 transition-colors duration-150 group-hover:text-slate-300">
                      {personne.fonction}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  )
}
