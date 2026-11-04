import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { SchoolCard } from '../components/SchoolCard'
import {
  CalendarDays,
  ChartBar,
  UserCheck,
  Newspaper,
  BookOpen,
  FileText,
  Phone,
} from 'lucide-react'
import { useLanguage } from '../i18n/LanguageProvider'

export const Route = createFileRoute('/parents-eleves')({
  component: ParentsElevesPage,
})

const LINKS = [
  { labelKey: 'parents.emploi', href: '/parents-eleves/emploi-du-temps', Icon: CalendarDays, chipKey: 'parents.chipPlanning', chipColor: 'info' as const },
  { labelKey: 'parents.notes', href: 'https://awlyaa.education.dz/login', external: true, Icon: ChartBar, chipKey: 'parents.chipScolaire', chipColor: 'success' as const },
  { labelKey: 'parents.absences', href: 'https://awlyaa.education.dz/login', external: true, Icon: UserCheck, chipKey: 'parents.chipScolaire', chipColor: 'success' as const },
  { labelKey: 'parents.actualites', href: '/parents-eleves/actualites', Icon: Newspaper, chipKey: 'parents.chipInfo', chipColor: 'info' as const },
  { labelKey: 'parents.calendrier', href: '/parents-eleves/calendrier', Icon: CalendarDays, chipKey: 'parents.chipPlanning', chipColor: 'warning' as const },
  { labelKey: 'parents.ressources', href: '/parents-eleves/ressources', Icon: BookOpen, chipKey: 'parents.chipPedagogie', chipColor: 'info' as const },
  { labelKey: 'parents.inscriptions', href: '/parents-eleves/inscriptions', Icon: FileText, chipKey: 'parents.chipAdmin', chipColor: 'danger' as const },
  { labelKey: 'parents.contact', href: '/parents-eleves/contact', Icon: Phone, chipKey: 'parents.chipContact', chipColor: 'success' as const },
]

function ParentsElevesPage() {
  const { t } = useLanguage()

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8 mb-8">
        <p className="island-kicker mb-2">{t('parents.kicker')}</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          {t('parents.title')}
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-(--sea-ink-soft)">
          {t('parents.subtitle')}
        </p>
      </section>

      <Outlet />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LINKS.map((l) =>
          l.external ? (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <SchoolCard
                title={t(l.labelKey)}
                chip={t(l.chipKey)}
                chipColor={l.chipColor}
                icon={<l.Icon size={18} className="text-[#0F2147]" />}
              />
            </a>
          ) : (
            <Link key={l.href} to={l.href}>
              <SchoolCard
                title={t(l.labelKey)}
                chip={t(l.chipKey)}
                chipColor={l.chipColor}
                icon={<l.Icon size={18} className="text-[#0F2147]" />}
              />
            </Link>
          ),
        )}
      </section>
    </main>
  )
}
