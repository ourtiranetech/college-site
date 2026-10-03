import { Link } from '@tanstack/react-router'

const FOOTER_SECTIONS = [
  {
    title: 'Établissement',
    links: [
      { label: 'Histoire & Mission', href: '/presentation' },
      { label: 'Infrastructures', href: '/presentation/infrastructures' },
      { label: 'Galerie photos', href: '/presentation/galerie' },
      { label: 'Équipe pédagogique', href: '/personnel/pedagogique' },
      { label: 'Personnel d\'entretien', href: '/personnel/entretien' },
    ],
  },
  {
    title: 'Parents & Élèves',
    links: [
      { label: 'Espace élève', href: '/parents-eleves' },
      { label: 'Emploi du temps', href: '/parents-eleves/emploi-du-temps' },
      { label: 'Notes & Résultats', href: '/parents-eleves/notes' },
      { label: 'Suivi des absences', href: '/parents-eleves/absences' },
      { label: 'Ressources pédagogiques', href: '/parents-eleves/ressources' },
      { label: 'Inscriptions', href: '/parents-eleves/inscriptions' },
    ],
  },
  {
    title: 'Communauté',
    links: [
      { label: 'Actualités', href: '/parents-eleves/actualites' },
      { label: 'Calendrier scolaire', href: '/parents-eleves/calendrier' },
      { label: 'Chat en direct', href: '/chat' },
      { label: 'Forum', href: '/forum' },
      { label: 'Nous contacter', href: '/parents-eleves/contact' },
    ],
  },
]

const CONTACT_INFO = [
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 shrink-0" aria-hidden="true">
        <path
          d="M10 2a6 6 0 0 0-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 0 0-6-6Z"
          stroke="#E8A020"
          strokeWidth="1.5"
        />
        <circle cx="10" cy="8" r="2" stroke="#E8A020" strokeWidth="1.5" />
      </svg>
    ),
    text: 'Rue Ibn Khaldoun, Sétif 19000, Algérie',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 shrink-0" aria-hidden="true">
        <path
          d="M3 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Z"
          stroke="#E8A020"
          strokeWidth="1.5"
        />
        <path
          d="M3 7l7 5 7-5"
          stroke="#E8A020"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    text: 'contact@college-ibnkhaldoun.dz',
    href: 'mailto:contact@college-ibnkhaldoun.dz',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 shrink-0" aria-hidden="true">
        <path
          d="M3 5.5C3 4.67 3.67 4 4.5 4c.28 0 .55.08.77.23l2.5 1.67c.45.3.6.9.35 1.36L6.6 9.1a9.3 9.3 0 0 0 4.3 4.3l1.84-1.52c.46-.25 1.06-.1 1.36.35l1.67 2.5c.15.22.23.49.23.77 0 .83-.67 1.5-1.5 1.5C7.6 17 3 12.4 3 5.5Z"
          stroke="#E8A020"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
    text: '+213 36 XX XX XX',
    href: 'tel:+21336000000',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 shrink-0" aria-hidden="true">
        <circle cx="10" cy="10" r="7" stroke="#E8A020" strokeWidth="1.5" />
        <path
          d="M10 6v4.5l3 1.5"
          stroke="#E8A020"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    text: 'Dim – Jeu : 8h00 – 16h30',
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white">
      {/* Séparateur décoratif */}
      <div className="h-px bg-linear-to-r from-transparent via-accent to-transparent opacity-40" />

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Colonne identité ── */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
              <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
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
                    fillOpacity="0.12"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <line x1="16" y1="6" x2="16" y2="24" stroke="#E8A020" strokeWidth="1.5" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">
                  Collège Ibn Khaldoun
                </p>
                <p className="text-xs text-blue-200/70">Sétif — Algérie</p>
              </div>
            </Link>

            <p className="text-[13px] text-blue-100/70 leading-relaxed max-w-57.5">
              Un établissement engagé pour l'excellence éducative et l'épanouissement
              de chaque élève depuis 1975.
            </p>

            {/* Informations de contact */}
            <ul className="mt-6 space-y-3">
              {CONTACT_INFO.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-[13px] text-blue-100/70 hover:text-accent transition-colors duration-150"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-[13px] text-blue-100/70">{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Colonnes de liens ── */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-[11px] font-semibold text-accent uppercase tracking-widest mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-[13px] text-blue-100/70 hover:text-white transition-colors duration-150 hover:translate-x-0.5 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bande inférieure ── */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-blue-200/50 text-center sm:text-left">
            © {currentYear} Collège Ibn Khaldoun — Sétif.
            Tous droits réservés.
          </p>

          <div className="flex items-center gap-5">
            <Link
              to="/parents-eleves/contact"
              className="text-[12px] text-blue-200/50 hover:text-blue-200/80 transition-colors"
            >
              Mentions légales
            </Link>
            <span className="text-blue-200/20">·</span>
            <Link
              to="/parents-eleves/contact"
              className="text-[12px] text-blue-200/50 hover:text-blue-200/80 transition-colors"
            >
              Politique de confidentialité
            </Link>
            <span className="text-blue-200/20">·</span>
            <Link
              to="/parents-eleves/contact"
              className="text-[12px] text-blue-200/50 hover:text-blue-200/80 transition-colors"
            >
              Accessibilité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
