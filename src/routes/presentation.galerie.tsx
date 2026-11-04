import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import { ImageIcon, X, ChevronLeft, ChevronRight, Camera } from 'lucide-react'
import { PHOTOS, NOMBRE_EMPLACEMENTS } from '../galerie/photos'
import { useLanguage } from '../i18n/LanguageProvider'

export const Route = createFileRoute('/presentation/galerie')({
  component: GaleriePage,
})

/**
 * Mosaïque de la galerie.
 *
 * 100 emplacements sont toujours affichés : ceux qui n'ont pas encore de photo
 * apparaissent sous forme de cadre discret et numéroté. Voir src/galerie/photos.ts
 * pour ajouter des photos.
 */
const EMPLACEMENTS = Array.from({ length: NOMBRE_EMPLACEMENTS }, (_, i) => i)

/** Donne un léger relief à la grille : certains emplacements sont mis en avant. */
function classeTuile(i: number): string {
  // Motif régulier : une grande tuile toutes les 13, une haute toutes les 7.
  if (i % 13 === 0) return 'col-span-2 row-span-2'
  if (i % 7 === 0) return 'row-span-2'
  return ''
}

function GaleriePage() {
  const { t } = useLanguage()
  const [indexOuvert, setIndexOuvert] = useState<number | null>(null)

  const photosDisponibles = PHOTOS.length
  const aDesPhotos = photosDisponibles > 0

  const fermer = useCallback(() => setIndexOuvert(null), [])
  const precedent = useCallback(
    () => setIndexOuvert(i => (i === null ? i : (i - 1 + photosDisponibles) % photosDisponibles)),
    [photosDisponibles],
  )
  const suivant = useCallback(
    () => setIndexOuvert(i => (i === null ? i : (i + 1) % photosDisponibles)),
    [photosDisponibles],
  )

  // Navigation clavier + blocage du défilement quand la visionneuse est ouverte
  useEffect(() => {
    if (indexOuvert === null) return
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fermer()
      if (e.key === 'ArrowLeft') precedent()
      if (e.key === 'ArrowRight') suivant()
    }
    window.addEventListener('keydown', surTouche)
    const overflowInitial = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', surTouche)
      document.body.style.overflow = overflowInitial
    }
  }, [indexOuvert, fermer, precedent, suivant])

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">{t('galerie.kicker')}</p>
        <h1 className="display-title mb-3 text-4xl font-bold sm:text-5xl">
          {t('galerie.title')}
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          {t('galerie.subtitle')}
        </p>

        {aDesPhotos ? (
          <p className="mt-3 text-sm text-slate-500">
            {t('galerie.photosEnLigne', { count: photosDisponibles, plural: photosDisponibles > 1 ? 's' : '' })}
            {photosDisponibles < NOMBRE_EMPLACEMENTS && (
              <> · {t('galerie.emplacementACompleter', { count: NOMBRE_EMPLACEMENTS - photosDisponibles, plural: NOMBRE_EMPLACEMENTS - photosDisponibles > 1 ? 's' : '' })}</>
            )}
          </p>
        ) : (
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <Camera size={18} className="mt-0.5 shrink-0 text-amber-600" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-amber-900">
                {t('galerie.aucunePhoto')}
              </p>
              <p className="mt-1 text-sm text-amber-800">
                {t('galerie.mosaiquePrete', { count: NOMBRE_EMPLACEMENTS })}
              </p>
            </div>
          </div>
        )}

        {/* Mosaïque */}
        <div
          className="mt-8 grid auto-rows-[110px] grid-cols-2 gap-3 sm:auto-rows-[130px] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          aria-label={t('galerie.photosEnLigne', { count: NOMBRE_EMPLACEMENTS, plural: 's' })}
        >
          {EMPLACEMENTS.map(i => {
            const photo = PHOTOS[i]
            const classes = `relative overflow-hidden rounded-xl ${classeTuile(i)}`

            if (photo) {
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndexOuvert(i)}
                  className={`${classes} group border border-slate-200 bg-slate-100 shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2147]`}
                  aria-label={t('galerie.agrandirPhoto', { n: i + 1 })}
                >
                  <img
                    src={photo}
                    alt={t('galerie.photoN', { n: i + 1 })}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </button>
              )
            }

            // Emplacement en attente de photo
            return (
              <div
                key={i}
                className={`${classes} flex flex-col items-center justify-center gap-1 border border-dashed border-slate-300 bg-slate-50/70 text-slate-400`}
                aria-hidden="true"
              >
                <ImageIcon size={18} />
                <span className="text-[11px] font-medium tabular-nums">{i + 1}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Visionneuse */}
      {indexOuvert !== null && PHOTOS[indexOuvert] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t('galerie.photoN', { n: indexOuvert + 1 }) + ' ' + t('galerie.sur') + ' ' + photosDisponibles}
          onClick={fermer}
        >
          <button
            type="button"
            onClick={fermer}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label={t('galerie.fermer')}
          >
            <X size={20} />
          </button>

          <button
            type="button"
            onClick={e => { e.stopPropagation(); precedent() }}
            className="absolute left-3 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 sm:left-6"
            aria-label={t('galerie.precedente')}
          >
            <ChevronLeft size={22} />
          </button>

          <img
            src={PHOTOS[indexOuvert]}
            alt={t('galerie.photoN', { n: indexOuvert + 1 })}
            onClick={e => e.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
          />

          <button
            type="button"
            onClick={e => { e.stopPropagation(); suivant() }}
            className="absolute right-3 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 sm:right-6"
            aria-label={t('galerie.suivante')}
          >
            <ChevronRight size={22} />
          </button>

          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs text-white tabular-nums">
            {indexOuvert + 1} / {photosDisponibles}
          </p>
        </div>
      )}
    </main>
  )
}
