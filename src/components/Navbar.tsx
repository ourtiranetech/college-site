import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { LoginButton } from './LoginButton'

const NAV_LINKS = [
  {
    label: 'Présentation',
    href: '/presentation',
    children: [
      { label: 'Histoire & Mission', href: '/presentation' },
      { label: 'Infrastructures', href: '/presentation/infrastructures' },
      { label: 'Galerie photos', href: '/presentation/galerie' },
    ],
  },
  {
    label: 'Personnel',
    href: '/personnel',
    children: [
      { label: 'Équipe pédagogique', href: '/personnel/pedagogique' },
      { label: 'Personnel d\'entretien', href: '/personnel/entretien' },
    ],
  },
  {
    label: 'Parents & Élèves',
    href: '/parents-eleves',
    children: [
      { label: 'Emploi du temps', href: '/parents-eleves/emploi-du-temps' },
      { label: 'Notes & Résultats', href: '/parents-eleves/notes' },
      { label: 'Absences', href: '/parents-eleves/absences' },
      { label: 'Actualités', href: '/parents-eleves/actualites' },
      { label: 'Calendrier', href: '/parents-eleves/calendrier' },
      { label: 'Ressources', href: '/parents-eleves/ressources' },
      { label: 'Inscriptions', href: '/parents-eleves/inscriptions' },
      { label: 'Nous contacter', href: '/parents-eleves/contact' },
    ],
  },
  { label: 'Chat en direct', href: '/chat' },
  { label: 'Forum', href: '/forum' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const routerState = useRouterState()

  // Ombre navbar au scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fermer le menu mobile lors d'un changement de route
  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }, [routerState.location.pathname])

  const isActive = (href: string) =>
    routerState.location.pathname.startsWith(href) && href !== '/'

  return (
    <>
      <header
        className={[
          'sticky top-0 z-50 bg-white transition-shadow duration-300',
          scrolled ? 'shadow-[0_2px_20px_rgba(15,74,46,0.12)]' : 'border-b border-slate-100',
        ].join(' ')}
      >
        {/* Barre supérieure accent */}
        <div className="h-1 bg-linear-to-r from-primary via-[#2563EB] to-accent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link
              to="/"
              className="flex items-center gap-3 group shrink-0"
              aria-label="Accueil du collège"
            >
              {/* Icône abstraite — livre ouvert stylisé */}
              <div className="relative w-9 h-9 shrink-0">
                <div className="absolute inset-0 rounded-lg bg-primary flex items-center justify-center">
                  <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    aria-hidden="true"
                  >
                    <path
                      d="M16 6C12 3 6 4 4 6v18c2-2 8-3 12 0 4-3 10-2 12 0V6c-2-2-8-3-12 0Z"
                      fill="white"
                      fillOpacity="0.15"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <line x1="16" y1="6" x2="16" y2="24" stroke="#E8A020" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>

              <div className="leading-tight">
                <p className="text-[13px] font-semibold text-primary tracking-tight">
                  Collège Azouaou Amrane
                </p>
                <p className="text-[11px] text-slate-400 font-normal">
                  TAZMALT — Algérie
                </p>
              </div>
            </Link>

            {/* ── Navigation desktop ── */}
            <nav
              className="hidden lg:flex items-center gap-1"
              aria-label="Navigation principale"
            >
              {NAV_LINKS.map((link) => (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => link.children && setOpenDropdown(link.href)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    to={link.href}
                    className={[
                      'flex items-center gap-1 px-3 py-2 rounded-md text-[13.5px] font-medium transition-colors duration-150',
                      isActive(link.href)
                        ? 'text-primary bg-[#EDFAF3]'
                        : 'text-slate-600 hover:text-primary hover:bg-slate-50',
                    ].join(' ')}
                  >
                    {link.label}
                    {link.children && (
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === link.href ? 'rotate-180' : ''}`}
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 6l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </Link>

                  {/* Dropdown */}
                  {link.children && openDropdown === link.href && (
                    <div className="absolute top-full left-0 pt-1 z-50">
                      <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(15,74,46,0.14)] border border-slate-100 py-1.5 min-w-52.5 overflow-hidden">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-600 hover:text-primary hover:bg-surface transition-colors duration-100"
                          >
                            <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* ── Bouton espace élève ── */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/parents-eleves"
                className="px-4 py-2 rounded-lg bg-primary text-white text-[13px] font-medium hover:bg-[#0a3321] transition-colors duration-150 shadow-sm"
              >
                Espace élève
              </Link>
              <div className="flex justify-center w-full">
    <LoginButton />
  </div>
            </div>

            {/* ── Burger mobile ── */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-md hover:bg-slate-100 transition-colors"
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileOpen}
            >
              <span
                className={`block h-0.5 w-5 bg-slate-700 rounded transition-transform duration-300 origin-center ${
                  mobileOpen ? 'translate-y-2 rotate-45' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-slate-700 rounded transition-opacity duration-300 ${
                  mobileOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-slate-700 rounded transition-transform duration-300 origin-center ${
                  mobileOpen ? '-translate-y-2 -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* ── Menu mobile ── */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
          }`}
          aria-hidden={!mobileOpen}
        >
          <nav className="border-t border-slate-100 px-4 py-4 space-y-1 overflow-y-auto max-h-[75vh]">
            {NAV_LINKS.map((link) => (
              <div key={link.href}>
                <Link
                  to={link.href}
                  className={[
                    'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'text-primary bg-[#EDFAF3]'
                      : 'text-slate-700 hover:bg-slate-50',
                  ].join(' ')}
                >
                  {link.label}
                </Link>

                {link.children && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-slate-100 pl-3">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className="block px-2 py-2 text-[13px] text-slate-500 hover:text-primary transition-colors rounded-md hover:bg-slate-50"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-3 border-t border-slate-100">
              <Link
                to="/parents-eleves"
                className="flex justify-center px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-[#0a3321] transition-colors"
              >
                Espace élève
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}
