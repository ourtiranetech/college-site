import { createFileRoute } from '@tanstack/react-router'
import { SchoolCard } from '../components/SchoolCard'
import { BookOpen, Landmark, Users, GraduationCap } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageProvider'

export const Route = createFileRoute('/presentation/histoire')({
  component: HistoirePage,
})

/* ─────────────────────────────────────────────────────────────────────────────
   À VÉRIFIER PAR L'ADMINISTRATION AVANT PUBLICATION

   Le contenu ci-dessous a été rédigé sans source documentaire : le dépôt ne
   contient aucune archive sur Azouaou Amrane ni sur la fondation de
   l'établissement. Les éléments factuels précis (dates, lieu de naissance,
   parcours, premier nom de l'établissement, année exacte d'ouverture) doivent
   être relus et corrigés par la direction, qui détient les archives.
   L'année retenue est 1980, cohérente avec les autres pages du site.
   ───────────────────────────────────────────────────────────────────────────── */

function getValeurs(t: (key: string) => string) {
  return [
    {
      icone: BookOpen,
      titre: t('histoire.valeurs.excellence.titre'),
      texte: t('histoire.valeurs.excellence.texte'),
    },
    {
      icone: Landmark,
      titre: t('histoire.valeurs.memoire.titre'),
      texte: t('histoire.valeurs.memoire.texte'),
    },
    {
      icone: Users,
      titre: t('histoire.valeurs.solidarite.titre'),
      texte: t('histoire.valeurs.solidarite.texte'),
    },
    {
      icone: GraduationCap,
      titre: t('histoire.valeurs.reussite.titre'),
      texte: t('histoire.valeurs.reussite.texte'),
    },
  ]
}

function Section20Lignes({
  id,
  kicker,
  titre,
  lignes,
}: {
  id: string
  kicker: string
  titre: string
  lignes: string[]
}) {
  return (
    <section id={id} className="mt-10 scroll-mt-24">
      <p className="island-kicker mb-2">{kicker}</p>
      <h2 className=" display-title mb-4 text-2xl font-bold sm:text-3xl">{titre}</h2>
      <div className="p-5 border border-black shadow-md shadow-blue-800/20 rounded-2xl text-center bg-blue-50 max-w-3xl space-y-3">
        {lignes.map((ligne, i) => (
          <p key={i} className="m-0 text-base leading-8 text-[var(--sea-ink-soft)]">
            {ligne}
          </p>
        ))}
      </div>
    </section>
  )
}

function HistoirePage() {
  const { t, tList } = useLanguage()
  const vieAzouaou = tList('histoire.vie')
  const fondation = tList('histoire.fondation')
  const valeurs = getValeurs(t)

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">{t('histoire.kicker')}</p>
        <h1 className="display-title mb-3 text-4xl font-bold sm:text-5xl">
          {t('histoire.title')}
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          {t('histoire.subtitle')}
        </p>

        {/* Sommaire */}
        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Sommaire">
          <a href="#azouaou-amrane" className="sea-link rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-medium no-underline">
            {t('histoire.quiAzouaou')}
          </a>
          <a href="#fondation" className="sea-link rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-medium no-underline">
            {t('histoire.creation')}
          </a>
          <a href="#hommage" className="sea-link rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-medium no-underline">
            {t('histoire.videoHommage')}
          </a>
        </nav>

        <hr className="island-rule my-8" />

        <Section20Lignes
          id="azouaou-amrane"
          kicker={t('histoire.kickerMemoire')}
          titre={t('histoire.vieAzouaou')}
          lignes={vieAzouaou}
        />

        <Section20Lignes
          id="fondation"
          kicker={t('histoire.kickerEtablissement')}
          titre={t('histoire.creationCollege')}
          lignes={fondation}
        />

        {/* Valeurs */}
        <section className="mt-12">
          <p className="island-kicker mb-2">{t('histoire.kickerValeurs')}</p>
          <h2 className="display-title mb-6 text-2xl font-bold sm:text-3xl">
            {t('histoire.valeursTitle')}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {valeurs.map(({ icone: Icone, titre, texte }) => (
              <SchoolCard
                key={titre}
                title={titre}
                description={texte}
                chipColor="info"
                icon={<Icone size={18} className="text-[#0F2147]" />}
              />
            ))}
          </div>
        </section>

        {/* Vidéo hommage */}
        <section id="hommage" className="mt-12 scroll-mt-24">
          <p className="island-kicker mb-2">{t('histoire.kickerHommage')}</p>
          <h2 className="display-title mb-2 text-2xl font-bold sm:text-3xl">
            {t('histoire.videoTitle')}
          </h2>
          <p className="mb-5 max-w-3xl text-sm leading-7 text-[var(--sea-ink-soft)]">
            {t('histoire.videoDesc')}
          </p>
          <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <video
              src="/videos/homage.mp4"
              controls
              preload="metadata"
              playsInline
              className="w-full rounded-lg bg-black aspect-video"
            >
              {t('histoire.videoNoSupport')}
            </video>
          </div>
        </section>
      </section>
    </main>
  )
}
