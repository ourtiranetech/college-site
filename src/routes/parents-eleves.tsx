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

export const Route = createFileRoute('/parents-eleves')({
  component: ParentsElevesPage,
})

const LINKS = [
  { label: 'Emploi du temps', href: '/parents-eleves/emploi-du-temps', Icon: CalendarDays, chip: 'Planning', chipColor: 'info' as const },
  { label: 'Notes & Résultats', href: 'https://awlyaa.education.dz/login', external: true, Icon: ChartBar, chip: 'Scolaire', chipColor: 'success' as const },
  { label: 'Suivi des absences', href: 'https://awlyaa.education.dz/login', external: true, Icon: UserCheck, chip: 'Scolaire', chipColor: 'success' as const },
  { label: 'Actualités', href: '/parents-eleves/actualites', Icon: Newspaper, chip: 'Info', chipColor: 'info' as const },
  { label: 'Calendrier', href: '/parents-eleves/calendrier', Icon: CalendarDays, chip: 'Planning', chipColor: 'warning' as const },
  { label: 'Ressources', href: '/parents-eleves/ressources', Icon: BookOpen, chip: 'Pédagogie', chipColor: 'info' as const },
  { label: 'Inscriptions', href: '/parents-eleves/inscriptions', Icon: FileText, chip: 'Admin', chipColor: 'danger' as const },
  { label: 'Nous contacter', href: '/parents-eleves/contact', Icon: Phone, chip: 'Contact', chipColor: 'success' as const },
]

function ParentsElevesPage() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8 mb-8">
        <p className="island-kicker mb-2">Parents & Élèves</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          Espace parents et élèves
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-(--sea-ink-soft)">
          Accédez aux services dédiés aux familles et aux élèves : emploi du
          temps, notes, absences, actualités, calendrier et ressources.
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
                title={l.label}
                chip={l.chip}
                chipColor={l.chipColor}
                icon={<l.Icon size={18} className="text-[#0F2147]" />}
              />
            </a>
          ) : (
            <Link key={l.href} to={l.href}>
              <SchoolCard
                title={l.label}
                chip={l.chip}
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
