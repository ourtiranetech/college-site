import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { SchoolCard } from '../components/SchoolCard'
import { BookOpen, Building2, Image as ImageIcon } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageProvider'

export const Route = createFileRoute('/presentation')({
  component: PresentationPage,
})

const SECTIONS = [
  {
    labelKey: 'about.histoire',
    href: '/presentation/histoire',
    resumeKey: 'about.histoireResume',
    chipKey: 'about.chipHeritage',
    chipColor: 'info' as const,
    Icon: BookOpen,
  },
  {
    labelKey: 'about.infrastructures',
    href: '/presentation/infrastructures',
    resumeKey: 'about.infrastructuresResume',
    chipKey: 'about.chipEquipements',
    chipColor: 'success' as const,
    Icon: Building2,
  },
  {
    labelKey: 'about.galerie',
    href: '/presentation/galerie',
    resumeKey: 'about.galerieResume',
    chipKey: 'about.chipPhotos',
    chipColor: 'warning' as const,
    Icon: ImageIcon,
  },
]

function PresentationPage() {
  const { t } = useLanguage()

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">{t('about.title')}</p>
        <h1 className="display-title mb-3 text-4xl font-bold sm:text-5xl">
          CEM Azouaou Amrane
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-(--sea-ink-soft)">
          {t('about.description')}
        </p>
      </section>

      {/* Les vidéos sont présentées dans leurs pages dédiées :
          « Hommage à nos héros » dans Histoire & Mission,
          la visite de l'établissement dans Infrastructures. */}
      <section className="mt-10 grid gap-6 sm:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link key={s.href} to={s.href}>
            <SchoolCard
              title={t(s.labelKey)}
              description={t(s.resumeKey)}
              chip={t(s.chipKey)}
              chipColor={s.chipColor}
              icon={<s.Icon size={18} className="text-[#0F2147]" />}
            />
          </Link>
        ))}
      </section>

      {/* Routes enfants : histoire, infrastructures, galerie.
          Sans cet <Outlet />, /presentation/histoire affichait le contenu du
          parent et jamais la page enfant. */}
      <Outlet />
    </main>
  )
}
