// src/routes/forum.tsx — Forum de la communauté (Convex temps réel)
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useState, useRef } from 'react'
import type { FormEvent } from 'react'
import { MessageSquare, Pin, Clock, Plus, ChevronRight } from 'lucide-react'
import type { Id } from '../../convex/_generated/dataModel'

export const Route = createFileRoute('/forum')({
  component: ForumPage,
})

const CATEGORIES = [
  { id: 'general',      label: 'Général',      dot: 'bg-slate-400' },
  { id: 'enseignement', label: 'Enseignement', dot: 'bg-blue-400' },
  { id: 'vie-scolaire', label: 'Vie scolaire',  dot: 'bg-green-400' },
  { id: 'parents',      label: 'Parents',      dot: 'bg-amber-400' },
]

interface Post {
  _id: Id<'posts'>
  titre: string
  contenu: string
  auteurId: string
  auteurNom: string
  categorie: string
  epingle: boolean
  createdAt: number
}

interface Reponse {
  _id: Id<'reponses'>
  postId: Id<'posts'>
  contenu: string
  auteurId: string
  auteurNom: string
  createdAt: number
}

function formatDate(ts: number) {
  const now = Date.now()
  const diff = now - ts
  const h = Math.floor(diff / 3600000)
  const j = Math.floor(diff / 86400000)
  if (j === 0) return `${h}h`
  if (j === 1) return 'hier'
  if (j < 7) return `${j} jour${j > 1 ? 's' : ''}`
  return new Date(ts).toLocaleDateString('fr-DZ', { day: 'numeric', month: 'short' })
}

function ReplyForm({ postId, onReplied }: { postId: Id<'posts'>; onReplied: () => void }) {
  const [contenu, setContenu] = useState('')
  const repondre = useMutation(api.forum.repondre)
  const ref = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = contenu.trim()
    if (!trimmed) return
    await repondre({ postId, contenu: trimmed, auteurId: 'visitor', auteurNom: 'Visiteur' })
    setContenu('')
    ref.current?.focus()
    onReplied()
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <textarea
        ref={ref}
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
        placeholder="Répondre…"
        rows={2}
        className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F2147] focus:ring-1 focus:ring-[#0F2147]/10"
      />
      <div className="mt-1.5 text-right">
        <button
          type="submit"
          disabled={!contenu.trim()}
          className="rounded-lg bg-[#0F2147] px-4 py-1.5 text-xs font-semibold text-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Répondre
        </button>
      </div>
    </form>
  )
}

function PostCard({ post }: { post: Post }) {
  const reponsesQuery = useQuery(api.forum.getReponses, { postId: post._id })
  const [showReplies, setShowReplies] = useState(false)

  const reponses: Reponse[] = reponsesQuery ?? []
  const cat = CATEGORIES.find((c) => c.id === post.categorie) ?? CATEGORIES[0]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center gap-2.5 text-sm">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F2147] text-xs font-semibold text-white">
          {post.auteurNom.charAt(0).toUpperCase()}
        </div>
        <span className="font-medium text-slate-800">{post.auteurNom}</span>
        <span className="text-xs text-slate-500">{cat.label}</span>
        {post.epingle && <Pin size={12} color="#E8A020" />}
        <span className="ml-auto flex items-center gap-1 text-xs text-slate-400">
          <Clock size={10} />
          {formatDate(post.createdAt)}
        </span>
      </div>

      <h3 className="mb-1.5 text-base font-semibold text-slate-800">{post.titre}</h3>
      <p className="mb-3 whitespace-pre-wrap text-sm text-slate-600 leading-relaxed">
        {post.contenu}
      </p>

      <div className="border-t border-slate-100 pt-2">
        <button
          onClick={() => setShowReplies((v) => !v)}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
        >
          <ChevronRight
            size={12}
            className="transition-transform"
            style={{ transform: showReplies ? 'rotate(90deg)' : 'rotate(0)' }}
          />
          {reponses.length > 0
            ? `${reponses.length} réponse${reponses.length !== 1 ? 's' : ''}`
            : 'Afficher les réponses'}
        </button>

        {showReplies && (
          <div className="mt-2 space-y-2">
            {reponses.map((r) => (
              <div key={r._id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-300 text-[9px] font-semibold">
                    {r.auteurNom.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-slate-700">{r.auteurNom}</span>
                  <span>{formatDate(r.createdAt)}</span>
                </div>
                <p className="whitespace-pre-wrap text-xs text-slate-600 leading-relaxed">
                  {r.contenu}
                </p>
              </div>
            ))}
            <ReplyForm postId={post._id} onReplied={() => {}} />
          </div>
        )}
      </div>
    </div>
  )
}

function ForumPage() {
  const [catActive, setCatActive] = useState('/')
  const [titre, setTitre] = useState('')
  const [contenu, setContenu] = useState('')
  const [categorie, setCategorie] = useState('general')

  const postsResult = useQuery(api.forum.getPosts, {})
  const posts: Post[] = postsResult ?? []
  const creerPost = useMutation(api.forum.creerPost)

  const filteredPosts =
    catActive === '/' ? posts : posts.filter((p) => p.categorie === catActive)
  const epingles = filteredPosts.filter((p) => p.epingle)
  const autres = filteredPosts.filter((p) => !p.epingle)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const t = titre.trim()
    const c = contenu.trim()
    if (!t || !c) return
    await creerPost({
      titre: t,
      contenu: c,
      auteurId: 'visitor',
      auteurNom: 'Visiteur',
      categorie,
    })
    setTitre('')
    setContenu('')
  }

  const canPublish = titre.trim() && contenu.trim()

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 font-sans">
      <header className="bg-[#0F2147] px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-serif text-2xl font-bold text-white sm:text-3xl">
            Forum de la communauté
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Échangez avec les parents, élèves et personnels du collège Ibn Khaldoun.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Category filter */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCatActive('/')}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${
              catActive === '/'
                ? 'bg-[#0F2147] text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Toutes
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCatActive(c.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${
                catActive === c.id
                  ? 'bg-[#0F2147] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Nouveau sujet */}
        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-800">Nouveau sujet</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2147]/10"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Titre du sujet"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#0F2147]/10"
            />
            <textarea
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              placeholder="Décrivez votre question ou sujet…"
              rows={3}
              className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2147]/10"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Connecté en tant que : Visiteur</span>
              <button
                type="submit"
                disabled={!canPublish}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F2147] px-4 py-1.5 text-xs font-semibold text-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={14} />
                Publier
              </button>
            </div>
          </form>
        </section>

        {/* Sujets épinglés */}
        {epingles.length > 0 && (
          <>
            <div className="mb-3 flex items-center gap-1.5">
              <Pin size={14} color="#E8A020" />
              <h2 className="text-sm font-semibold text-slate-800">Sujets épinglés</h2>
            </div>
            <div className="space-y-4 pb-6">
              {epingles.map((p) => (
                <PostCard key={p._id} post={p} />
              ))}
            </div>
          </>
        )}

        {/* Discussions */}
        <div className="mb-3 flex items-center gap-1.5">
          <MessageSquare size={14} color="#475569" />
          <h2 className="text-sm font-semibold text-slate-800">Discussions</h2>
        </div>
        {autres.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center text-slate-400">
            <MessageSquare size={32} />
            <p className="text-sm">
              Aucun sujet pour le moment. Soyez le premier à créer un sujet !
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {autres.map((p) => (
              <PostCard key={p._id} post={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

