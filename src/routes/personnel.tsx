import { createFileRoute,Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/personnel')({
  component: PersonnelPage,
})


const SECTIONS = [
  {
    label: 'personnel d\'entretien',
    href: '/personnel/entretien',
    resume: 'personnel d\'entretien  du collège.',
  },
  {
    label: 'personnel pedagogique',
    href: '/personnel/pedagogique',
    resume: 'personnel pedagogique  du collège.',
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
          <Link
            key={s.href}
            to={s.href}
            className="block rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md"
          >
            <span className="block text-sm font-semibold text-slate-800">{s.label}</span>
            <span className="mt-1 block text-xs text-slate-500">{s.resume}</span>
          </Link>
        ))}
      </section>
      <Outlet />
    </main>
  )
}
