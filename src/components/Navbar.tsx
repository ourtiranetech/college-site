  import { Link, useRouterState } from '@tanstack/react-router'
  import { useEffect, useState } from 'react'
  import { LoginButton } from './LoginButton'
  import { PanelLeft } from 'lucide-react'

const NAV_LINKS = [
  {
    label: 'Présentation',
    href: '/presentation',
    children: [
      { label: 'Histoire & Mission', href: '/presentation/histoire' },
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
  { label: 'Map', href: '/map' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [navVisible, setNavVisible] = useState(true)
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
      {navVisible && (
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
              {/* Logo retiré du header : il apparaît dans la barre minimale quand le menu est caché */}

              {/* ── Toggle menu ── */}
              <button
                onClick={() => setNavVisible(v => !v)}
                className="hidden lg:inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                aria-label={navVisible ? 'Masquer le menu' : 'Afficher le menu'}
              >
                <PanelLeft size={16} />
                {navVisible ? 'Masquer' : 'Menu'}
              </button>

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
                              className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-600 hover:text-primary hover:bg-blue-100"
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

              {/* ── Bouton espace élève supprimé : Parents & Élèves est déjà dans la nav ── */}
              <div className="hidden lg:flex items-center gap-3">
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
          className={[
            'lg:hidden overflow-hidden transition-all duration-300 ease-in-out',
            mobileOpen && navVisible ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0',
          ].join(' ')}
          aria-hidden={!mobileOpen || !navVisible}
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
                        className="block px-2 py-2 text-[13px] text-slate-500 hover:text-primary transition-colors rounded-md hover:bg--50"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Espace élève retiré du menu mobile : déjà couvert par Parents & Élèves */}
            <div className="pt-3 border-t border-slate-100" />
          </nav>
        </div>
      </header>
      )}

      {/* Barre minimale quand le menu est masqué */}
      {!navVisible && (
        <div className="sticky top-0 z-50 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-10 flex items-center justify-center">
            <Link
              to="/"
              className="w-full text-center text-sm font-bold text-primary tracking-tight uppercase"
              aria-label="Accueil du collège"
            >
              CEM Azouaou Amrane
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
