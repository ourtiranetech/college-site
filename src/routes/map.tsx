import { createFileRoute } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageProvider'

export const Route = createFileRoute('/map')({
  component: MapPage,
})

function MapPage() {
  const { t } = useLanguage()
  const lat = 36.38766914960372
  const lng = 4.401082033205013
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8 mb-6">
        <p className="island-kicker mb-2">{t('map.kicker')}</p>
        <h1 className="display-title mb-3 text-4xl font-bold sm:text-5xl">
          {t('map.title')}
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-(--sea-ink-soft)">
          {t('map.subtitle')}
        </p>
      </section>

      <section className="island-shell rounded-2xl overflow-hidden">
        <div className="w-full h-[70vh]">
          <iframe
            title={t('map.title') + ' — ' + t('map.subtitle')}
            src={src}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="p-4 flex items-center gap-2 text-xs text-slate-500">
          <MapPin size={14} />
          <span>
            {lat}, {lng}
          </span>
        </div>
      </section>
    </main>
  )
}
