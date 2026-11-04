import { createFileRoute } from '@tanstack/react-router'
import { useLanguage } from '../i18n/LanguageProvider'

export const Route = createFileRoute('/personnel/administratif')({
  component: AdministratifPage,
})

// Données de test : 9 personnels administratif
const ADMINISTRATIF = [
  { nom: 'Cherif', prenom: 'Mohamed', fonction: 'Directeur' },
  { nom: 'Messaoud', prenom: 'Ali', fonction: 'Secrétaire général' },
  { nom: 'Zeroual', prenom: 'Hamid', fonction: 'Comptable' },
  { nom: 'Bentobal', prenom: 'Saïd', fonction: 'Responsable administratif' },
  { nom: 'Djebali', prenom: 'Fethi', fonction: 'Agent de scolarité' },
  { nom: 'Lakhdar', prenom: 'Rachid', fonction: 'Surveillant général' },
  { nom: 'Meslem', prenom: 'Ahmed', fonction: 'Responsable du budget' },
  { nom: 'Boudjellal', prenom: 'Mourad', fonction: "Agent d'accueil" },
  { nom: 'Bezzaouache', prenom: 'Hamza', fonction: 'Documentaliste' },
]

type Personnel = { nom: string; prenom: string; fonction: string }

function AdministratifPage() {
  const { t } = useLanguage()

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">{t('personnel.kicker')}</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          {t('personnel.administratif')}
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-(--sea-ink-soft)">
          {t('personnel.listeAdministratif', { count: ADMINISTRATIF.length })}
        </p>

        {/* Tableau moderne */}
        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <h2 className="text-lg font-bold text-(--sea-ink)">
              {t('personnel.membresAdministratifs', { count: ADMINISTRATIF.length })}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-(--sea-ink) text-white">
                  <th className="px-6 py-4 text-left font-semibold text-sm">
                    {t('personnel.prenom')}
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">
                    {t('personnel.nom')}
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">
                    {t('personnel.fonction')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {ADMINISTRATIF.map((personne: Personnel, idx: number) => (
                  <tr
                    key={idx}
                    className="group transition-all duration-200 cursor-pointer
                      border-b border-slate-100
                      bg-slate-50/30
                    "
                  >
                    <td className="px-6 py-4 font-semibold text-(--sea-ink) transition-colors duration-150 group-hover:text-white">
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
