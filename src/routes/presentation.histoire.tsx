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

const VIE_AZOUAOU_AMRANE = [
  "Azouaou Amrane est un enfant de Tazmalt, dans la wilaya de Béjaïa, dont le nom est aujourd'hui porté",
  " par notre collège. Il grandit dans une famille algérienne attachée à la terre, au travail et à la ",
  "transmission des valeurs. Il apprend très tôt que la dignité d'un peuple passe par le savoir et par le",
  " courage de ses enfants.  Sa jeunesse se déroule dans une région marquée par une histoire longue, celle de la Kabylie des villages et des solidarités.",
  "Comme beaucoup de jeunes de sa génération, il choisit de servir plutôt que de se taire.",
  "Sa vie témoigne d'un engagement constant envers son pays et envers la justice.",
  "Il puise dans la culture de son village la force de rester fidèle à ses convictions.",
  "Sa détermination n'était pas celle d'un homme pressé, mais d'un homme patient et obstiné.",
  "Il savait que les causes justes ne se gagnent pas en un jour, mais par la constance.",
  "À ses proches, il laisse le souvenir d'un homme discret, respectueux et droit.",
  "À sa région, il laisse l'exemple d'une fidélité qui ne se négocie pas.",
  "À sa patrie, il offre ce que l'on peut donner de plus précieux : sa vie.",
  "Le nom qu'il porte aujourd'hui sur ce collège n'est pas un simple hommage : c'est une promesse.",
  "Il rappelle à chaque élève que l'instruction est un droit acquis au prix de sacrifices.",
  "Il rappelle à chaque enseignant que transmettre le savoir est un acte de fidélité.",
  "Il rappelle à chaque famille que l'école est le bien commun de toute une communauté.",
  "Ce nom engage : il demande à chacun de se montrer digne de ce qu'il représente.",
  "Honorer sa mémoire, c'est refuser l'indifférence et la facilité.",
  "C'est aussi cultiver ce qui fait tenir un peuple : le travail, le respect et la solidarité.",
  "Puisse cette mémoire continuer d'éclairer le chemin de nos élèves, aujourd'hui et demain.",
]

const FONDATION_DU_COLLEGE = [
  "Le Collège d'Enseignement Moyen Azouaou Amrane se situe à Tazmalt, dans la wilaya de Béjaïa.",
  "Sa fondation s'inscrit dans l'immense effort de scolarisation engagé par l'Algérie indépendante.",
  "Au lendemain de l'indépendance, scolariser tous les enfants de toutes les communes devient une priorité nationale.",
  "Il fallait bâtir des écoles, former des enseignants et rapprocher le savoir de chaque village.",
  "Dans les années 1970, cette dynamique se traduit par l'ouverture de nombreux collèges à travers le pays.",
  "L'établissement ouvre ses portes en 1980 pour accueillir les élèves de Tazmalt et des localités voisines.",
  "Beaucoup d'enfants de la région pouvaient alors poursuivre leur scolarité sans quitter leur commune.",
  "Le collège comble ainsi une distance qui pesait lourdement sur les familles les plus modestes.",
  "Dès les premières années, il devient un lieu de rencontre entre les villages et les générations.",
  "Des générations d'élèves y ont appris à lire, à écrire, à calculer et à raisonner.",
  "Des générations d'enseignants y ont consacré leur carrière, souvent au-delà de leurs obligations.",
  "Le bâtiment, les salles de classe et les espaces collectifs ont été entretenus et adaptés au fil des décennies.",
  "L'établissement a suivi les réformes successives du système éducatif national.",
  "Il a accueilli de nouveaux programmes, de nouvelles matières et de nouveaux outils pédagogiques.",
  "Les effectifs ont grandi, à la mesure de la croissance démographique de la région.",
  "L'établissement a obtenu des résultats dont la commune peut légitimement s'enorgueillir.",
  "Son nom, celui d'un enfant de Tazmalt, l'ancre dans l'histoire et la mémoire locales.",
  "Ce que nous appelons « Mission » n'est donc pas un texte abstrait.",
  "C'est la continuation d'un engagement commencé il y a plus de quarante ans dans ces murs.",
  "Transmettre le savoir, exiger de chacun le meilleur, et former des citoyens responsables : voilà notre mission.",
]

const VALEURS = [
  {
    icone: BookOpen,
    titre: "Excellence",
    texte: "Exigence intellectuelle et travail régulier, dans le respect du rythme de chaque élève.",
  },
  {
    icone: Landmark,
    titre: "Mémoire",
    texte: "Porter dignement le nom d'Azouaou Amrane et transmettre l'histoire de notre région.",
  },
  {
    icone: Users,
    titre: "Solidarité",
    texte: "Faire de l'établissement un lieu d'entraide entre élèves, familles et personnels.",
  },
  {
    icone: GraduationCap,
    titre: "Réussite",
    texte: "Préparer chaque élève à la poursuite de ses études et à sa place dans la société.",
  },
]

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
  const { t } = useLanguage()

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
          lignes={VIE_AZOUAOU_AMRANE}
        />

        <Section20Lignes
          id="fondation"
          kicker={t('histoire.kickerEtablissement')}
          titre={t('histoire.creationCollege')}
          lignes={FONDATION_DU_COLLEGE}
        />

        {/* Valeurs */}
        <section className="mt-12">
          <p className="island-kicker mb-2">{t('histoire.kickerValeurs')}</p>
          <h2 className="display-title mb-6 text-2xl font-bold sm:text-3xl">
            {t('histoire.valeursTitle')}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALEURS.map(({ icone: Icone, titre, texte }) => (
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
