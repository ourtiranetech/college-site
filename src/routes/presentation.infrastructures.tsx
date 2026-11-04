import { createFileRoute } from '@tanstack/react-router'
import { SchoolCard } from '../components/SchoolCard'
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

const PRESENTATION = [
  "Le CEM Azouaou Amrane est un collège d'enseignement moyen implanté au cœur de Tazmalt.",
  "L'établissement accueille les élèves des quatre niveaux du cycle moyen, de la première à la quatrième année.",
  "Il reçoit les enfants de la commune et des localités voisines, ce qui en fait un équipement structurant du territoire.",
  "Ses bâtiments s'organisent autour de salles de classe affectées à chaque niveau et à chaque division.",
  "Chaque salle est équipée d'un tableau, de tables-bancs et de l'éclairage nécessaire au travail scolaire.",
  "Les salles de sciences permettent de mener les travaux pratiques de physique, de chimie et de biologie.",
  "Une salle d'informatique initie les élèves à l'usage de l'outil numérique et aux logiciels de base.",
  "La bibliothèque offre un fonds documentaire et un espace calme propice à la lecture et à la recherche.",
  "Une salle polyvalente accueille les réunions, les exposés et les activités culturelles de l'établissement.",
  "L'éducation physique et sportive dispose d'aires extérieures aménagées pour les sports collectifs et l'athlétisme.",
  "Une salle couverte permet de maintenir les activités physiques en cas d'intempéries.",
  "La cantine assure la restauration des élèves demi-pensionnaires dans le respect des règles d'hygiène.",
  "L'infirmerie permet d'accueillir et de prendre en charge les élèves souffrants pendant la journée.",
  "Les bureaux de l'administration, de la direction et du secrétariat assurent le fonctionnement quotidien.",
  "Une salle des professeurs et un espace de travail sont réservés aux équipes pédagogiques.",
  "Les installations sanitaires et les points d'eau desservent l'ensemble des bâtiments.",
  "L'ensemble du site est clos et surveillé afin d'assurer la sécurité des élèves et du personnel.",
  "L'entretien des locaux est assuré quotidiennement par le personnel dédié de l'établissement.",
  "Au fil des années, l'établissement a été entretenu, rénové et adapté aux évolutions des programmes.",
  "Ces espaces ne sont pas de simples murs : ce sont les conditions matérielles de la réussite de nos élèves.",
]

const ESPACES = [
  { icone: DoorOpen, titre: "Salles de classe", texte: "Une salle par division et par niveau, pour les quatre années du cycle moyen." },
  { icone: FlaskConical, titre: "Laboratoire de sciences", texte: "Travaux pratiques de physique, de chimie et de biologie." },
  { icone: Monitor, titre: "Salle d'informatique", texte: "Initiation au numérique et aux logiciels de base." },
  { icone: BookMarked, titre: "Bibliothèque", texte: "Fonds documentaire et espace de lecture au calme." },
  { icone: Dumbbell, titre: "Installations sportives", texte: "Aires extérieures et salle couverte pour l'EPS." },
  { icone: UtensilsCrossed, titre: "Cantine", texte: "Restauration des élèves demi-pensionnaires." },
  { icone: HeartPulse, titre: "Infirmerie", texte: "Prise en charge des élèves pendant la journée." },
  { icone: Building2, titre: "Administration", texte: "Direction, secrétariat, salle des professeurs." },
]

function InfrastructuresPage() {
  const { t } = useLanguage()

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
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
          <div className="max-w-3xl space-y-3">
            {PRESENTATION.map((ligne, i) => (
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
            {ESPACES.map(({ icone: Icone, titre, texte }) => (
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
