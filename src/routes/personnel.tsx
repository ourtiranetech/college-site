import { createFileRoute,Link, Outlet } from '@tanstack/react-router'
import { SchoolCard } from '../components/SchoolCard'
import { SprayCan, GraduationCap } from 'lucide-react'

export const Route = createFileRoute('/personnel')({
  component: PersonnelPage,
})


const SECTIONS = [
  {
    label: "personnel d'entretien",
    href: '/personnel/entretien',
    resume: "personnel d'entretien  du collège.",
    chip: 'Entretien',
    chipColor: 'warning' as const,
    Icon: SprayCan,
  },
  {
    label: 'personnel pedagogique',
    href: '/personnel/pedagogique',
    resume: 'personnel pedagogique  du collège.',
    chip: 'Pédagogique',
    chipColor: 'info' as const,
    Icon: GraduationCap,
  },  {
    label: "personnel administratif",
    href: '/personnel/administratif',
    resume: "personnel administratif  du collège.",
    chip: 'Administration',
    chipColor: 'warning' as const,
    Icon: SprayCan,
  },
]

function PersonnelPage() {
  return (
    <main className="page-wrap px-4 py-12">
      {/* <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Personnel</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          Équipe pédagogique et d'entretien 
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-(--sea-ink-soft)">
          Accédez aux différents services de l'équipe de l'établissement.
        </p>
      </section> */}
       <section className="mt-10 grid gap-6 sm:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link key={s.href} to={s.href}>
            <SchoolCard
              title={s.label}
              description={s.resume}
              chip={s.chip}
              chipColor={s.chipColor}
              icon={<s.Icon size={18} className="text-[#0F2147]" />}
            />
          </Link>
        ))}
      </section>
      <Outlet />
    </main>
  )
}
