import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/personnel/entretien')({
  component: EntretienPage,
})

// Données de test : 15 personnels d'entretien
const ENTRETIEN = [
  { nom: 'Cherif', prenom: 'Mohamed', fonction: 'Garde du jour' },
  { nom: 'Messaoud', prenom: 'Ali', fonction: 'Garde du jour' },
  { nom: 'Zeroual', prenom: 'Hamid', fonction: 'Gardien de nuit' },
  { nom: 'Bentobal', prenom: 'Saïd', fonction: 'Gardien de nuit' },
  { nom: 'Djebali', prenom: 'Fethi', fonction: 'Agent de sécurité' },
  { nom: 'Lakhdar', prenom: 'Rachid', fonction: 'Agent de sécurité' },
  { nom: 'Meslem', prenom: 'Ahmed', fonction: 'Agent de ménage' },
  { nom: 'Boudjellal', prenom: 'Mourad', fonction: 'Agent de ménage' },
  { nom: 'Bezzaouache', prenom: 'Hamza', fonction: 'Contrôleur de salle' },
  { nom: 'Kebir', prenom: 'Oussama', fonction: 'Contrôleur de salle' },
  { nom: 'Lapasseur', prenom: 'Farid', fonction: 'Agent de maintenance' },
  { nom: 'Benslimane', prenom: 'Azzeddine', fonction: 'Maintenance de la piscine' },
  { nom: 'Liamrani', prenom: 'Djamel', fonction: 'Jardinier' },
  { nom: 'Kebir', prenom: 'Elias', fonction: 'Agent de nettoyage cour' },
  { nom: 'Bensafia', prenom: 'Walid', fonction: 'Agent de sécurité extérieure' },
]

function EntretienPage() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Personnel d'entretien</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          Personnel d'entretien
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-(--sea-ink-soft)">
          Voici la liste des 15 personnels d'entretien de l'établissement.
        </p>

        {/* Tableau moderne */}
        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <h2 className="text-lg font-bold text-(--sea-ink)">
              15 membres de l'équipe d'entretien
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-(--sea-ink) text-white">
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
                {ENTRETIEN.map((personne, idx) => (
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
