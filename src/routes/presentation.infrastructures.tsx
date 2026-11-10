import { createFileRoute } from '@tanstack/react-router'
import { SchoolCard } from '../components/SchoolCard'
import mosart  from '../../public/font/mosart.ttf'
import {
  Building2,
  FlaskConical,
  Monitor,
  BookMarked,
  Dumbbell,
  UtensilsCrossed,
  HeartPulse,
  DoorOpen,
} from 'lucide-react'
import { useLanguage } from '../i18n/LanguageProvider'

export const Route = createFileRoute('/presentation/infrastructures')({
  component: InfrastructuresPage,
})

/* ─────────────────────────────────────────────────────────────────────────────
   À VÉRIFIER PAR L'ADMINISTRATION
   Le détail des locaux (nombre exact de salles, capacités, équipements) doit
   être confirmé par la direction. Le texte décrit l'organisation type d'un CEM
   et les espaces que l'on attend dans un établissement de ce niveau.
   ───────────────────────────────────────────────────────────────────────────── */

function getEspaces(t: (key: string) => string) {
  return [
    { icone: DoorOpen, titre: t('infra.espaces.salles.titre'), texte: t('infra.espaces.salles.texte') },
    { icone: FlaskConical, titre: t('infra.espaces.labo.titre'), texte: t('infra.espaces.labo.texte') },
    { icone: Monitor, titre: t('infra.espaces.info.titre'), texte: t('infra.espaces.info.texte') },
    { icone: BookMarked, titre: t('infra.espaces.biblio.titre'), texte: t('infra.espaces.biblio.texte') },
    { icone: Dumbbell, titre: t('infra.espaces.sport.titre'), texte: t('infra.espaces.sport.texte') },
    { icone: UtensilsCrossed, titre: t('infra.espaces.cantine.titre'), texte: t('infra.espaces.cantine.texte') },
    { icone: HeartPulse, titre: t('infra.espaces.infirmerie.titre'), texte: t('infra.espaces.infirmerie.texte') },
    { icone: Building2, titre: t('infra.espaces.admin.titre'), texte: t('infra.espaces.admin.texte') },
  ]
}

function InfrastructuresPage() {
  const { t, tList } = useLanguage()
  const presentation = tList('infra.pres')
  const espaces = getEspaces(t)

  return (
    <main className="page-wrap px-4 py-12">
      <section className="text-center island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">{t('infra.kicker')}</p>
        <h1 className="display-title mb-3 text-4xl font-bold sm:text-5xl">
          {t('infra.title')}
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          {t('infra.subtitle')}
        </p>

        <hr className="island-rule my-8" />

        {/* Présentation en 20 lignes */}
        <section>
          <h2 className="display-title mb-4 text-2xl font-bold sm:text-3xl">
            {t('infra.presentationTitle')}
          </h2>
          <div className="p-5 m-auto border border-black shadow-md shadow-blue-800/20 rounded-2xl  font-bold font-[mosart] text-3xl text-center bg-blue-50 max-w-5xl space-y-3">
            {presentation.map((ligne, i) => (
              <p key={i} className="m-0 text-base leading-8 text-[var(--sea-ink-soft)]">
                {ligne}
              </p>
            ))}
          </div>
        </section>

        {/* Espaces */}
        <section className="mt-12">
          <p className="island-kicker mb-2">{t('infra.kickerEspaces')}</p>
          <h2 className="display-title mb-6 text-2xl font-bold sm:text-3xl">
            {t('infra.equipementsTitle')}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {espaces.map(({ icone: Icone, titre, texte }) => (
              <SchoolCard
                key={titre}
                title={titre}
                description={texte}
                chipColor="success"
                icon={<Icone size={18} className="text-[#0F2147]" />}
              />
            ))}
          </div>
        </section>

        {/* Vidéo */}
        <section className="mt-12">
          <p className="island-kicker mb-2">{t('infra.kickerImages')}</p>
          <h2 className="display-title mb-2 text-2xl font-bold sm:text-3xl">
            {t('infra.visiteTitle')}
          </h2>
          <p className="mb-5 max-w-3xl text-sm leading-7 text-[var(--sea-ink-soft)]">
            {t('infra.visiteDesc')}
          </p>          <div className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <video
              src="/videos/cem-azouaou-tazmal.mp4"
              controls
              preload="metadata"
              playsInline
              className="w-full rounded-lg bg-black aspect-video"
            >
              {t('infra.videoNoSupport')}
            </video>
          </div>
        </section>
      </section>
    </main>
  )
}
