import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'

const GALLERY = [
  { src: '/galerie/img1.jpg', alt: 'Salle de classe' },
  { src: '/galerie/img2.jpg', alt: 'Laboratoire sciences' },
  { src: '/galerie/img3.jpg', alt: 'Bibliothèque' },
  { src: '/galerie/img4.jpg', alt: 'Cour de récréation' },
  { src: '/galerie/img5.jpg', alt: 'Terrain de sport' },
  { src: '/galerie/img6.jpg', alt: "Salle d'informatique" },
]

export const Route = createFileRoute('/presentation/galerie')({
  component: GaleriePage,
})

function Carousel({
  items,
  idx,
  onIdx,
}: {
  items: { src: string; alt: string }[]
  idx: number
  onIdx: (i: number) => void
}) {
  const go = useCallback(
    (n: number) => {
      const next = (idx + n + items.length) % items.length
      onIdx(next)
    },
    [idx, items.length, onIdx]
  )

  useEffect(() => {
    const t = setInterval(() => go(1), 5000)
    return () => clearInterval(t)
  }, [go])

  if (items.length === 0) return null

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
      <div className="aspect-video bg-slate-200 flex items-center justify-center">
        <img
          src={items[idx].src}
          alt={items[idx].alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            ;(e.target as HTMLImageElement).style.display = 'none'
            ;(e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden')
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-slate-200 text-slate-400 text-sm">
          {items[idx].alt}
        </div>
      </div>

      <button
        type="button"
        onClick={() => go(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-1 text-lg font-bold text-slate-700 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2147]/40"
        aria-label="Image précédente"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-1 text-lg font-bold text-slate-700 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2147]/40"
        aria-label="Image suivante"
      >
        ›
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onIdx(i)}
            className={`h-2.5 w-2.5 rounded-full transition ${i === idx ? 'bg-white w-6' : 'bg-white/50'}`}
            aria-label={`Aller à l'image ${i + 1}`}
          />
        ))}
      </div>

      <p className="absolute right-3 bottom-3 text-xs text-white/80">
        {idx + 1} / {items.length}
      </p>
    </div>
  )
}

function GaleriePage() {
  const [idx, setIdx] = useState(0)

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker text-center mb-2">Présentation</p>
        <h1 className="display-title text-center mb-3 text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          Galerie photos
        </h1>
        <p className="m-0 text-center  text-base leading-8 text-(--sea-ink-soft)">
          Album d'images des activités et événements du collège.
        </p>
      </section>

      <section className="mt-6">
        <Carousel items={GALLERY} idx={idx} onIdx={setIdx} />
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {GALLERY.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIdx(i)}
            className="rounded-lg border border-slate-200 bg-white p-2 text-left shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <div className="aspect-video rounded bg-slate-200 flex items-center justify-center text-xs text-slate-400">
              {item.alt}
            </div>
            <p className="mt-1.5 text-xs font-medium text-slate-600">
              {item.alt}
            </p>
          </button>
        ))}
      </section>

      <nav className="mt-8">
        <Link
          to="/presentation"
          className="inline-block rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50"
        >
          ← Retour à l'accueil
        </Link>
      </nav>
    </main>
  )
}
