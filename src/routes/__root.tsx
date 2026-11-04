import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  Outlet,
  Link,
} from '@tanstack/react-router'
import { ConvexAuthProvider } from '@convex-dev/auth/react'
import { ConvexReactClient } from 'convex/react'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

// Import de l'URL du fichier CSS pour la balise <link> dans HeadContent
import appCss from '../styles/globals.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { LanguageProvider } from '../i18n/LanguageProvider'
import { useLanguage } from '../i18n/LanguageProvider'

interface MyRouterContext {
  queryClient: QueryClient
}

// Initialisation du client Convex avec la variable d'environnement
const convex = new ConvexReactClient(
  (import.meta.env.VITE_CONVEX_URL as string) || ''
)

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

function NotFoundComponent() {
  const { t } = useLanguage()
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
      <h1 className="text-4xl font-bold text-primary mb-2">{t('notFound.title')}</h1>
      <p className="text-slate-600 mb-6">{t('notFound.message')}</p>
      <Link
        to="/"
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#0a3321] transition-colors text-sm font-medium"
      >
        {t('notFound.retour')}
      </Link>
    </div>
  )
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'CEM Azouaou Amrane — Tazmalt',
      },
      {
        name: 'description',
        content:
          "Site officiel du CEM Azouaou Amrane à Tazmalt (Algérie) : présentation de l'établissement, équipe pédagogique, emplois du temps, ressources et espace parents.",
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundComponent,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]">
        <ConvexAuthProvider client={convex}>
          <LanguageProvider>
            <div className="min-h-screen flex flex-col bg-surface">
              <Navbar />
              <main className="flex-1">
                {children ?? <Outlet />}
              </main>
              <Footer />
            </div>
          </LanguageProvider>
        </ConvexAuthProvider>

        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}