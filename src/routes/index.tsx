import { createFileRoute } from '@tanstack/react-router'
import { useLanguage } from '../i18n/LanguageProvider'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { t } = useLanguage()

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
     <h1 className='m-auto w-1/4 bg-red-600 border text-center '>{t('index.construction')}</h1>
    </main>
  )
}
