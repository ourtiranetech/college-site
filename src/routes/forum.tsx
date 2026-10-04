// src/routes/forum.tsx — Forum de la communauté (Convex temps réel)
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useState, useRef } from 'react'
import type { FormEvent } from 'react'
import { MessageSquare, Pin, Clock, Plus, ChevronRight, Smile, Image as ImageIcon, X, Loader2 } from 'lucide-react'
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

const EMOJIS = '😀 😃 😄 😁 😆 😅 🤣 😂 🙃 😉 😊 😇 🙂 🤔 🙄 😐 😑 😶 😏 😮 💨 😌 😴 😟 😣 😖 😫 😤 💪 🎉 🔥 ⭐ 💯 👍 👎 👏 ✨ 💡 ✅ ❌ 📚 📝 🏆 🎓 🏫 📖 ✏️ 🎨 📸 🖼️ 📎 🔗 💬 📺 🎵 🎮 ❤️ 🧡 💛 💚 💙 💜 🤍 🤎 ⚽ 🏀 🎯 🎸'.split(' ')

interface Post {
  _id: Id<'posts'>
  titre: string
  contenu: string
  auteurId: string
  auteurNom: string
  categorie: string
  epingle: boolean
  createdAt: number
  images?: string[]
}

interface Reponse {
  _id: Id<'reponses'>
  postId: Id<'posts'>
  contenu: string
  auteurId: string
  auteurNom: string
  createdAt: number
  images?: string[]
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

function insertEmoji(el: HTMLTextAreaElement, emoji: string, value: string, setValue: (v: string) => void) {
  const start = el.selectionStart
  const end = el.selectionEnd
  const next = value.slice(0, start) + emoji + value.slice(end)
  setValue(next)
  requestAnimationFrame(() => {
    el.selectionStart = el.selectionEnd = start + emoji.length
    el.focus()
  })
}

function ImageGallery({ storageIds }: { storageIds: string[] }) {
  if (storageIds.length === 0) return null
  const urls = useQuery(api.forum.getImageUrls, { storageIds }) ?? []
  const visible = urls.filter(Boolean) as string[]
  if (visible.length === 0) return null
  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      {visible.map((url, i) => (
        <img key={i} src={url} alt={`Pièce jointe ${i + 1}`} className="rounded-lg object-cover max-h-48 w-full" />
      ))}
    </div>
  )
}

function ReplyForm({ postId, onReplied }: { postId: Id<'posts'>; onReplied: () => void }) {
  const [contenu, setContenu] = useState('')
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)
  const repondre = useMutation(api.forum.repondre)
  const getUploadUrl = useMutation(api.forum.getUploadUrl)
  const uploadImage = useMutation(api.forum.uploadImage)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = contenu.trim()
    if (!trimmed && files.length === 0) return
    const result = await repondre({ postId, contenu: trimmed, auteurId: 'visitor', auteurNom: 'Visiteur' })
    if (files.length > 0) {
      setUploading(true)
      try {
        for (const file of files) {
          const url = await getUploadUrl({})
          const res = await fetch(url, { method: 'PUT', body: file })
          const text = await res.text()
          const storageId = text.startsWith('"') ? JSON.parse(text) : text
          await uploadImage({ storageId, reponseId: result })
        }
      } finally {
        setUploading(false)
        setFiles([])
      }
    }
    setContenu('')
    ref.current?.focus()
    onReplied()
  }

  const pickImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) setFiles(prev => [...prev, ...Array.from(files)])
    e.target.value = ''
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {files.map((f, i) => (
            <div key={i} className="relative group">
              <img src={URL.createObjectURL(f)} alt={f.name} className="h-16 w-16 rounded-lg object-cover" />
              <button type="button" onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 rounded-full bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-end gap-2">
        <div className="relative">
          <button type="button" onClick={() => setEmojiOpen(o => !o)} className="p-1.5 text-slate-400 hover:text-[#E8A020] transition"><Smile size={18} /></button>
          {emojiOpen && (
            <div className="absolute bottom-full left-0 mb-1 rounded-lg border border-slate-200 bg-white p-2 shadow-lg grid grid-cols-8 gap-0.5 w-56 z-10 max-h-36 overflow-y-auto">
              {EMOJIS.map(e => (
                <button key={e} type="button" onClick={() => { const el = ref.current; if (el) insertEmoji(el, e, contenu, setContenu); setEmojiOpen(false) }} className="text-lg hover:bg-slate-100 rounded p-0.5">{e}</button>
              ))}
            </div>
          )}
        </div>
        <label className="cursor-pointer p-1.5 text-slate-400 hover:text-[#0F2147] transition"><ImageIcon size={18} /><input type="file" accept="image/*" multiple className="hidden" onChange={pickImages} /></label>
        <textarea ref={ref} value={contenu} onChange={e => setContenu(e.target.value)} placeholder="Répondre…" rows={2} className="flex-1 resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0F2147] focus:ring-1 focus:ring-[#0F2147]/10" />
        <button type="submit" disabled={(!contenu.trim() && files.length === 0) || uploading} className="rounded-lg bg-[#0F2147] px-4 py-1.5 text-xs font-semibold text-accent disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1">
          {uploading ? <Loader2 size={12} className="animate-spin" /> : null} Répondre
        </button>
      </div>
    </form>
  )
}

function PostCard({ post }: { post: Post }) {
  const reponsesQuery = useQuery(api.forum.getReponses, { postId: post._id })
  const [showReplies, setShowReplies] = useState(false)
  const reponses: Reponse[] = reponsesQuery ?? []
  const cat = CATEGORIES.find(c => c.id === post.categorie) ?? CATEGORIES[0]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center gap-2.5 text-sm">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F2147] text-xs font-semibold text-white">{post.auteurNom.charAt(0).toUpperCase()}</div>
        <span className="font-medium text-slate-800">{post.auteurNom}</span>
        <span className="text-xs text-slate-500">{cat.label}</span>
        {post.epingle && <Pin size={12} color="#E8A020" />}
        <span className="ml-auto flex items-center gap-1 text-xs text-slate-400"><Clock size={10} />{formatDate(post.createdAt)}</span>
      </div>
      <h3 className="mb-1.5 text-base font-semibold text-slate-800">{post.titre}</h3>
      <p className="mb-3 whitespace-pre-wrap text-sm text-slate-600 leading-relaxed">{post.contenu}</p>
      <ImageGallery storageIds={post.images ?? []} />
      <div className="border-t border-slate-100 pt-2">
        <button onClick={() => setShowReplies(v => !v)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700">
          <ChevronRight size={12} className="transition-transform" style={{ transform: showReplies ? 'rotate(90deg)' : 'rotate(0)' }} />
          {reponses.length > 0 ? `${reponses.length} réponse${reponses.length !== 1 ? 's' : ''}` : 'Afficher les réponses'}
        </button>
        {showReplies && (
          <div className="mt-2 space-y-2">
            {reponses.map(r => (
              <div key={r._id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-300 text-[9px] font-semibold">{r.auteurNom.charAt(0).toUpperCase()}</div>
                  <span className="font-medium text-slate-700">{r.auteurNom}</span>
                  <span>{formatDate(r.createdAt)}</span>
                </div>
                <p className="whitespace-pre-wrap text-xs text-slate-600 leading-relaxed">{r.contenu}</p>
                <ImageGallery storageIds={r.images ?? []} />
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
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const mainRef = useRef<HTMLTextAreaElement>(null)

  const postsResult = useQuery(api.forum.getPosts, {})
  const posts: Post[] = postsResult ?? []
  const creerPost = useMutation(api.forum.creerPost)
  const getUploadUrl = useMutation(api.forum.getUploadUrl)
  const uploadImage = useMutation(api.forum.uploadImage)

  const filteredPosts = catActive === '/' ? posts : posts.filter(p => p.categorie === catActive)
  const epingles = filteredPosts.filter(p => p.epingle)
  const autres = filteredPosts.filter(p => !p.epingle)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const t = titre.trim()
    const c = contenu.trim()
    if (!t && !c && files.length === 0) return
    const result = await creerPost({ titre: t || 'Sans titre', contenu: c || '(pas de texte)', auteurId: 'visitor', auteurNom: 'Visiteur', categorie })
    if (files.length > 0) {
      setUploading(true)
      try {
        for (const file of files) {
          const url = await getUploadUrl({})
          const res = await fetch(url, { method: 'PUT', body: file })
          const text = await res.text()
          const storageId = text.startsWith('"') ? JSON.parse(text) : text
          await uploadImage({ storageId, postId: result })
        }
      } finally {
        setUploading(false)
        setFiles([])
      }
    }
    setTitre('')
    setContenu('')
  }

  const canPublish = titre.trim() || contenu.trim() || files.length > 0

  const pickImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) setFiles(prev => [...prev, ...Array.from(files)])
    e.target.value = ''
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 font-sans">
      <header className="bg-[#0F2147] px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-serif text-2xl font-bold text-white sm:text-3xl">Forum de la communauté</h1>
          <p className="mt-1 text-sm text-white/60">Échangez avec les parents, élèves et personnels du collège Ibn Khaldoun.</p>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button onClick={() => setCatActive('/')} className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${catActive === '/' ? 'bg-[#0F2147] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>Toutes</button>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCatActive(c.id)} className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${catActive === c.id ? 'bg-[#0F2147] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>{c.label}</button>
          ))}
        </div>
        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-800">Nouveau sujet</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <select value={categorie} onChange={e => setCategorie(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2147]/10">
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <input type="text" value={titre} onChange={e => setTitre(e.target.value)} placeholder="Titre du sujet" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#0F2147]/10" />
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {files.map((f, i) => (
                  <div key={i} className="relative group">
                    <img src={URL.createObjectURL(f)} alt={f.name} className="h-16 w-16 rounded-lg object-cover" />
                    <button type="button" onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 rounded-full bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><X size={10} /></button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-end gap-2">
              <div className="relative">
                <button type="button" onClick={() => setEmojiOpen(o => !o)} className="p-1.5 text-slate-400 hover:text-[#E8A020] transition"><Smile size={18} /></button>
                {emojiOpen && (
                  <div className="absolute bottom-full left-0 mb-1 rounded-lg border border-slate-200 bg-white p-2 shadow-lg grid grid-cols-8 gap-0.5 w-56 z-10 max-h-36 overflow-y-auto">
                    {EMOJIS.map(e => (
                      <button key={e} type="button" onClick={() => { const el = mainRef.current; if (el) insertEmoji(el, e, contenu, setContenu); setEmojiOpen(false) }} className="text-lg hover:bg-slate-100 rounded p-0.5">{e}</button>
                    ))}
                  </div>
                )}
              </div>
              <label className="cursor-pointer p-1.5 text-slate-400 hover:text-[#0F2147] transition"><ImageIcon size={18} /><input type="file" accept="image/*" multiple className="hidden" onChange={pickImages} /></label>
              <textarea ref={mainRef} value={contenu} onChange={e => setContenu(e.target.value)} placeholder="Décrivez votre question ou sujet…" rows={3} className="flex-1 resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2147]/10" />
              <button type="submit" disabled={!canPublish || uploading} className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F2147] px-4 py-1.5 text-xs font-semibold text-accent disabled:opacity-50 disabled:cursor-not-allowed">
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Publier
              </button>
            </div>
          </form>
        </section>
        {epingles.length > 0 && (
          <>
            <div className="mb-3 flex items-center gap-1.5"><Pin size={14} color="#E8A020" /><h2 className="text-sm font-semibold text-slate-800">Sujets épinglés</h2></div>
            <div className="space-y-4 pb-6">{epingles.map(p => <PostCard key={p._id} post={p} />)}</div>
          </>
        )}
        <div className="mb-3 flex items-center gap-1.5"><MessageSquare size={14} color="#475569" /><h2 className="text-sm font-semibold text-slate-800">Discussions</h2></div>
        {autres.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center text-slate-400"><MessageSquare size={32} /><p className="text-sm">Aucun sujet pour le moment. Soyez le premier à créer un sujet !</p></div>
        ) : (
          <div className="space-y-4">{autres.map(p => <PostCard key={p._id} post={p} />)}</div>
        )}
      </main>
    </div>
  )
}

