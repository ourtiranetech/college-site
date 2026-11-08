  // src/routes/forum.tsx — Forum de la communauté (Convex temps réel)
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { useState, useRef, useEffect } from 'react'
import type { FormEvent } from 'react'
import { MessageSquare, Pin, Clock, Plus, ChevronRight, Smile, Image as ImageIcon, X, Loader2, Users } from 'lucide-react'
import type { Id } from '../../convex/_generated/dataModel'
import { LoginButton, useCurrentUser } from '../components/LoginButton'
import { MAX_IMAGES_PAR_MESSAGE } from '../../convex/schema'
import { Lightbox } from '../components/Lightbox'
import { useLanguage } from '../i18n/LanguageProvider'

export const Route = createFileRoute('/forum')({
  component: ForumPage,
})

const CATEGORIES = [
  { id: 'general',      label: 'Général', chip: 'Général', chipColor: 'info' as const },
  { id: 'enseignement', label: 'Enseignement', chip: 'Études', chipColor: 'info' as const },
  { id: 'vie-scolaire', label: 'Vie scolaire', chip: 'Vie', chipColor: 'success' as const },
  { id: 'parents',      label: 'Parents', chip: 'Famille', chipColor: 'warning' as const },
  { id: 'entraide',     label: 'Entraide', chip: 'Aide', chipColor: 'success' as const },
  { id: 'tazmalt',      label: 'Tazmalt', chip: 'Local', chipColor: 'info' as const },
]

const EMOJIS  = [
  // Humeurs
  '😀', '😃', '😄', '😁', '😆',
  '😅', '😂', '🙂', '😉', '😊',
  '😍', '😘', '😎', '🤗', '🤔',
  '🙄', '😐', '😴', '🥳', '🤩',
  
  // Émotions
  '😢', '😭', '😞', '😟', '😰',
  '😱', '😡', '😤', '😬', '🙃',
  // Gestes
  '👍', '👎', '👏', '🙏', '💪',
  '👋', '🤝', '✌️', '👌', '🤞',
  // Réactions
  '🎉', '🔥', '⭐', '💯', '✨',
  '❤️', '💚', '💙', '💛', '🤍',
  // École
  '📚', '📝', '✏️', '📖', '📐',
  '🔬', '🧪', '🧮', '🖊️', '📌',
  '📎', '🗂️', '📅', '📊', '🖥️',
  '🎓', '🏫', '🎒', '🗺️', '🌍',
  // Sport & arts
  '⚽', '🏀', '🏐', '🏃', '🏆',
  '🎨', '🎵', '🎸', '🎭', '📸',
  // Symboles
  '✅', '❌', '💡', '⏰', '❓',
  '❗', '🔔', '🔒', '➕', '➡️',
  // Divers
  '🌈', '☀️', '🌟', '🎁', '🎈',
  '☕', '🍎', '🚌', '🏠', '💬',

    // Émotions & Visages
    "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", 
    "😗", "☺️", "😚", "😙", "🥲", "😏", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🫢", "🫣", 
    "🤫", "🤔", "🫡", "🤤", "🤠", "🥳", "🥸", "😎", "🤓", "🧐", "🙃", "🫠", "🤐", "🤨", "😐", "😑", 
    "😶", "🫥", "😶‍🌫️", "😒", "🙄", "😬", "😮‍💨", "🤥", "🫨", "🙂‍↔️", "🙂‍↕️", "😌", "😔", "😪", "😴", 
    "🫩", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "😵‍💫", "🤯", "🥱", "😕", "🫤", 
    "😟", "🙁", "☹️", "😮", "😯", "😲", "😳", "🫪", "🥺", "🥹", "😦", "😧", "😨", "😰", "😥", "😢", 
    "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "😤", "😡", "😠", "🤬", "👿", "💀", "☠️", "💩", 
    "🤡", "👹", "👺", "👻", "👽", "👾", "🤖", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", 
    "🙈", "🙉", "🙊",
  
    // Vêtements & Accessoires
    "🎀", "🎗️", "👓", "🕶️", "🥽", "🥼", "🦺", "👔", "👕", "👖", "🧣", "🧤", "🧥", "🧦", "👗", "👘", 
    "🥻", "🩱", "🩲", "🩳", "👙", "👚", "🪭", "👛", "👜", "👝", "🛍️", "🎒", "🩴", "👞", "👟", "🥾", 
    "🥿", "👠", "👡", "🩰", "👢", "🪮", "👑", "👒", "🎩", "🎓", "🧢", "🪖", "⛑️", "📿", "💄", "💍", 
    "💎", "🦯", "🧿",
  
    // Bureautique, Livres & Heures
    "📕", "📖", "📗", "📘", "📙", "📚", "📓", "📒", "📃", "📜", "📄", "📰", "🗞️", "📑", "🔖", "🏷️", 
    "✉️", "📧", "📨", "📩", "📤", "📥", "📦", "📫", "📪", "📬", "📭", "📮", "🗳️", "✏️", "✒️", "🖋️", 
    "🖊️", "🖌️", "🖍️", "📝", "💼", "📁", "📂", "🗂️", "📅", "📆", "🗒️", "🗓️", "📇", "📈", "📉", "📊", 
    "⌛", "⏳", "⌚", "⏰", "⏱️", "⏲️", "🕰️", "🕛", "🕧", "🕐", "🕜", "🕑", "🕝", "🕒", "🕞", "🕓", 
    "🕟", "🕔", "🕠", "🕕", "🕡", "🕖", "🕢", "🕗", "🕣", "🕘", "🕤", "🕙", "🕥", "🕚", "🕦", "🧮", 
    "🪙", "💰", "🧳", "🌡️", "🧸", "🧶", "🪢", "🔍", "🔎", "🕯️", "💡", "🔦",
  
    // Outils, Clés, Armes & Objets divers
    "🔒", "🔓", "🔏", "🔐", "🔑", "🗝️", "🔨", "🪓", "⛏️", "⚒️", "🛠️", "🗡️", "⚔️", "💣", "🪃", "🏹", 
    "🛡️", "🪚", "🔧", "🪛", "🔩", "⚙️", "🗜️", "⚖️", "🔗", "⛓️‍💥", "⛓️", "🪝", "🧰", "🧲", "🪜", "🪏", 
    "⚗️", "🧪", "🧫", "🔬", "🔭", "📡", "💉", "🩹", "🩼", "🩺", "🩻", "🚪", "🪞", "🪟", "🛏️", "🛋️", 
    "🪑", "🚽", "🪠", "🚿", "🛁", "🪤", "🪒", "🧴", "🧷", "🧹", "🧺"
  ];
  console.log(`Nombre total d'émojis : ${EMOJIS.length}`);
// Limite partagée avec convex/schema.ts : une seule source de vérité.
const MAX_IMAGES = MAX_IMAGES_PAR_MESSAGE

const CLE_INVITE = 'forum-invite-key'

/**
 * Enregistre le visiteur courant comme « invité » puis renvoie le nombre
 * d'invités distincts du forum.
 *
 * La clé est conservée dans le navigateur : un même visiteur ne compte qu'une
 * fois, même après plusieurs rechargements. Un utilisateur connecté n'est pas
 * compté comme invité (le backend l'ignore également).
 */
function useInviteCounter(estConnecte: boolean) {
  const nombre = useQuery("forum:getInviteCount" as any)
  const enregistrer = useMutation("forum:registerInvite" as any)

  useEffect(() => {
    if (estConnecte) return
    let cle: string
    try {
      const existante = window.localStorage.getItem(CLE_INVITE)
      if (existante) {
        cle = existante
      } else {
        cle =
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `inv-${Date.now()}-${Math.random().toString(36).slice(2)}`
        window.localStorage.setItem(CLE_INVITE, cle)
      }
    } catch {
      // Navigation privée ou stockage bloqué : on n'incrémente pas le compteur.
      return
    }
    enregistrer({ inviteKey: cle }).catch(() => {
      // Le compteur est décoratif : un échec ne doit pas gêner la navigation.
    })
  }, [estConnecte, enregistrer])

  return nombre
}

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

/**
 * Extrait l'identifiant de stockage de la réponse de Convex.
 *
 * Convex renvoie `{"storageId":"..."}` : on n'accepte donc qu'un objet portant
 * un `storageId`, pour ne jamais transmettre une chaîne vide au serveur.
 */
function lireStorageId(texte: string): string {
  let donnees: unknown
  try {
    donnees = JSON.parse(texte)
  } catch {
    throw new Error("Réponse de téléversement illisible.")
  }
  const storageId =
    typeof donnees === 'object' && donnees !== null
      ? (donnees as { storageId?: unknown }).storageId
      : undefined
  if (typeof storageId !== 'string' || storageId.length === 0) {
    throw new Error("Le téléversement n'a renvoyé aucun identifiant.")
  }
  return storageId
}

/**
 * Téléverse les fichiers puis renvoie leurs identifiants de stockage.
 *
 * Les images sont attachées directement par `creerPost` / `repondre` : il n'y a
 * plus de mutation séparée capable d'attacher une image au message d'autrui.
 * L'URL de téléversement est demandée une fois puis réutilisée pour le lot.
 */
async function televerserImages(
  files: File[],
  getUploadUrl: () => Promise<string>,
): Promise<string[]> {
  if (files.length === 0) return []

  const uploadUrl = await getUploadUrl()
  const ids: string[] = []
  for (const file of files) {
    const reponse = await fetch(uploadUrl, { method: 'POST', body: file })
    if (!reponse.ok) {
      throw new Error(`Échec du téléversement de « ${file.name} ».`)
    }
    ids.push(lireStorageId(await reponse.text()))
  }
  return ids
}

function ImageGallery({ storageIds, onSelect }: { storageIds: string[]; onSelect?: (src: string) => void }) {
  if (storageIds.length === 0) return null
  const urls = useQuery("forum:getImageUrls" as any, { storageIds }) ?? []
  if (urls.length === 0) return null
  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      {urls.map((url: string, i: number) => {
        const handleClick = () => { if (onSelect) onSelect(url) }
        return (
          <img key={i} src={url} alt={`Pièce jointe ${i + 1}`} className="cursor-pointer rounded-lg object-cover max-h-48 w-full" onClick={handleClick} />
        )
      })}
    </div>
  )
}

function ReplyForm({ postId, onReplied, onSelectImage }: { postId: Id<'posts'>; onReplied: () => void; onSelectImage?: (src: string) => void }) {
  const { t, isRTL } = useLanguage()
  void onSelectImage
  const [contenu, setContenu] = useState('')
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)
  const repondre = useMutation("forum:repondre" as any)
  const getUploadUrl = useMutation("forum:getUploadUrl" as any)
  const identity = useCurrentUser()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!identity) {
      alert(t('forum.connexionRequise'))
      return
    }
    const trimmed = contenu.trim()
    if (!trimmed && files.length === 0) return

    setUploading(true)
    try {
      const images = await televerserImages(files, () => getUploadUrl({}))

      // L'identité est dérivée du jeton côté serveur : rien à transmettre ici.
      await repondre({
        postId,
        contenu: trimmed || '(pièce jointe)',
        ...(images.length > 0 ? { images } : {}),
      })

      setContenu('')
      setFiles([])
      ref.current?.focus()
      onReplied()
    } catch (err) {
      alert(err instanceof Error ? err.message : t('forum.erreurInconnue'))
    } finally {
      setUploading(false)
    }
  }

  const pickImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const choisis = e.target.files
    if (choisis) {
      const ajoutes = Array.from(choisis)
      setFiles(prev => {
        const total = [...prev, ...ajoutes]
        if (total.length > MAX_IMAGES) {
          alert(t('forum.maxImages', { max: MAX_IMAGES }))
          return total.slice(0, MAX_IMAGES)
        }
        return total
      })
    }
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
          <button type="button" onClick={() => setEmojiOpen(o => !o)} className="p-1.5 text-slate-400 hover:text-accent transition"><Smile size={18} /></button>
          {emojiOpen && (
            <div className="absolute bottom-full left-0 mb-1 rounded-lg border border-slate-200 bg-white p-2 shadow-lg grid grid-cols-8 gap-0.5 w-56 z-10 max-h-36 overflow-y-auto">
              {EMOJIS.map(e => (
                <button key={e} type="button" onClick={() => { const el = ref.current; if (el) insertEmoji(el, e, contenu, setContenu); setEmojiOpen(false) }} className="text-lg hover:bg-slate-100 rounded p-0.5">{e}</button>
              ))}
            </div>
          )}
        </div>
        <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 rounded-lg border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:text-slate-800 transition">
          <ImageIcon size={14} />
          <input type="file" accept="image/*" multiple className="hidden" onChange={pickImages} />
          <span className="hidden sm:inline">Ajouter une image...</span>
          <span className="sm:hidden">Image</span>
        </label>
        <textarea ref={ref} value={contenu} onChange={e => setContenu(e.target.value)} placeholder={t('forum.repondre') + '…'} dir={isRTL ? 'rtl' : 'ltr'} rows={2} className="flex-1 resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/10" />
        <button type="submit" disabled={(!contenu.trim() && files.length === 0) || uploading} className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-accent disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1">
          {uploading ? <Loader2 size={12} className="animate-spin" /> : null} {t('forum.repondre')}
        </button>
      </div>
    </form>
  )
}

function PostCard({ post, onReplied, onSelectImage }: { post: Post; onReplied: () => void; onSelectImage?: (src: string) => void }) {
  const { t, isRTL } = useLanguage()
  const reponsesQuery = useQuery("forum:getReponses" as any, { postId: post._id })
  const [showReplies, setShowReplies] = useState(false)
  const reponses: Reponse[] = reponsesQuery ?? []
  const cat = CATEGORIES.find(c => c.id === post.categorie) ?? CATEGORIES[0]

  return (
    <div className="rounded-xl border border-slate-200 bg-blue-50 p-5 shadow-sm">
      <div className="mb-2 flex items-center gap-2.5 text-sm">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">{post.auteurNom.charAt(0).toUpperCase()}</div>
        <span className="font-medium text-slate-800">{post.auteurNom}</span>
        <span className="text-xs text-slate-500">{cat.label}</span>
        {post.epingle && <Pin size={12} color="#E8A020" />}
        <span className="ml-auto flex items-center gap-1 text-xs text-slate-400">
          <Clock size={10} />{formatDate(post.createdAt)}
        </span>
      </div>
      <h3 className="mb-1.5 text-base font-semibold text-slate-800">{post.titre}</h3>
      <p dir={isRTL ? 'rtl' : 'ltr'} className="mb-3 whitespace-pre-wrap text-sm text-slate-600 leading-relaxed">{post.contenu}</p>
      {post.images && post.images.length > 0 && (
        <div className="mb-2">
          <ImageGallery storageIds={post.images} onSelect={onSelectImage} />
        </div>
      )}
      <div className="border-t border-slate-100 pt-2">
        <button onClick={() => setShowReplies(v => !v)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700">
          <ChevronRight size={12} className="transition-transform" style={{ transform: showReplies ? 'rotate(90deg)' : 'rotate(0)' }} />
          {reponses.length > 0 ? `${reponses.length} ${reponses.length !== 1 ? 'réponses' : 'réponse'}` : t('forum.afficherReponses')}
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
                <p dir={isRTL ? 'rtl' : 'ltr'} className="whitespace-pre-wrap text-xs text-slate-600 leading-relaxed">{r.contenu}</p>
                {r.images && r.images.length > 0 && (
                  <div className="mt-2">
                    <ImageGallery storageIds={r.images} onSelect={onSelectImage} />
                  </div>
                )}
              </div>
            ))}
            <ReplyForm postId={post._id} onReplied={onReplied} onSelectImage={onSelectImage} />
          </div>
        )}
      </div>
    </div>
  )
}

function ForumPage() {
  const { t, isRTL } = useLanguage()
  const [catActive, setCatActive] = useState('/')
  const [postTitle, setPostTitle] = useState('')
  const [contenu, setContenu] = useState('')
  const [categorie, setCategorie] = useState('general')
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  // Les queries Convex sont réactives : ce compteur force simplement un
  // rafraîchissement immédiat après une publication ou une réponse.
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const mainRef = useRef<HTMLTextAreaElement>(null)

  const identity = useCurrentUser()
  const isAuthenticated = identity !== null

  const postsResult = useQuery("forum:getPosts" as any, { categorie: undefined })
  const posts: Post[] = postsResult ?? []
  const creerPost = useMutation("forum:creerPost" as any)
  const getUploadUrl = useMutation("forum:getUploadUrl" as any)
  const nombreInvites = useInviteCounter(isAuthenticated)

  const filteredPosts = catActive === '/' ? posts : posts.filter(p => p.categorie === catActive)
  const epingles = filteredPosts.filter(p => p.epingle)
  const autres = filteredPosts.filter(p => !p.epingle)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      alert("t('forum.connexionRequise')")
      return
    }
    const trimmedTitle = postTitle.trim()
    const c = contenu.trim()
    if (!t && !c && files.length === 0) return

    setUploading(true)
    try {
      const images = await televerserImages(files, () => getUploadUrl({}))

      // L'auteur est dérivé du jeton côté serveur : il n'est plus transmis.
      await creerPost({
        titre: trimmedTitle || t('forum.sansTitre'),
        contenu: c || t('forum.pasDeTexte'),
        categorie,
        ...(images.length > 0 ? { images } : {}),
      })

      setPostTitle('')
      setContenu('')
      setFiles([])
      setRefreshKey(k => k + 1)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de la publication.")
    } finally {
      setUploading(false)
    }
  }

  const canPublish = postTitle.trim() || contenu.trim() || files.length > 0

  const pickImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const choisis = e.target.files
    if (choisis) {
      const ajoutes = Array.from(choisis)
      setFiles(prev => {
        const total = [...prev, ...ajoutes]
        if (total.length > MAX_IMAGES) {
          alert(t('forum.maxImages', { max: MAX_IMAGES }))
          return total.slice(0, MAX_IMAGES)
        }
        return total
      })
    }
    e.target.value = ''
  }

  return (
    <div className="min-w-3xl min-h-[calc(100vh-64px)] bg-slate-50 font-sans">
      <header className="bg-primary px-6 py-10">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-white sm:text-3xl">{t('forum.title')}</h1>
            <p className="mt-1 text-sm text-white/60">{t('forum.subtitle')}</p>
          </div>
          {/* Compteur d'invités : visiteurs non connectés, dédupliqués par navigateur */}
          <div
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5"
            title="Nombre de visiteurs non connectés ayant découvert le forum"
          >
            <Users size={14} className="text-accent" aria-hidden="true" />
            <span className="text-sm font-semibold text-white">
              {nombreInvites === undefined ? '—' : nombreInvites}
            </span>
            <span className="text-xs text-white/60">
              {nombreInvites === 1 ? 'invité' : 'invités'}
            </span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        {!isAuthenticated && (
          <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-800">{t('forum.connexionRequise')}</h2>
            <p className="mb-4 text-sm text-slate-600">{t('forum.connexionTexte')}</p>
            <div className="flex justify-start">
              <LoginButton />
            </div>
          </section>
        )}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button onClick={() => setCatActive('/')} className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${catActive === '/' ? 'bg-primary text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>{t('forum.toutes')}</button>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCatActive(c.id)} className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${catActive === c.id ? 'bg-primary text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>{c.label} {c.chip ? <span className="ml-1 text-[10px] opacity-75">({c.chip})</span> : null}</button>
          ))}
        </div>
        <section className="mb-8 rounded-xl border border-slate-400 bg-blue-50 p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-800">{t('forum.nouveauSujet')}</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <select value={categorie} onChange={e => setCategorie(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/10">
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <input type="text" value={postTitle} onChange={e => setPostTitle(e.target.value)} placeholder={t('forum.titreSujet')} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary/10" />
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
                <button type="button" onClick={() => setEmojiOpen(o => !o)} className="p-1.5 text-slate-400 hover:text-accent transition"><Smile size={18} /></button>
                {emojiOpen && (
                  <div className="absolute bottom-full left-0 mb-1 rounded-lg border border-slate-200 bg-white p-2 shadow-lg grid grid-cols-8 gap-0.5 w-56 z-10 max-h-36 overflow-y-auto">
                    {EMOJIS.map(e => (
                      <button key={e} type="button" onClick={() => { const el = mainRef.current; if (el) insertEmoji(el, e, contenu, setContenu); setEmojiOpen(false) }} className="text-lg hover:bg-slate-100 rounded p-0.5">{e}</button>
                    ))}
                  </div>
                )}
              </div>
              <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 rounded-lg border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:text-slate-800 transition">
          <ImageIcon size={14} />
          <input type="file" accept="image/*" multiple className="hidden" onChange={pickImages} />
          <span className="hidden sm:inline">Ajouter une image...</span>
          <span className="sm:hidden">Image</span>
        </label>
              <textarea ref={mainRef} value={contenu} onChange={e => setContenu(e.target.value)} placeholder="Décrivez votre question ou sujet…" dir={isRTL ? 'rtl' : 'ltr'} rows={3} className="flex-1 resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/10" />
              <button type="submit" disabled={!canPublish || uploading || !isAuthenticated} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-accent disabled:opacity-50 disabled:cursor-not-allowed">
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} {t('forum.publier')}
              </button>
            </div>
          </form>
        </section>
        {epingles.length > 0 && (
          <>
            <div className="mb-3 flex items-center gap-1.5"><Pin size={14} color="#E8A020" /><h2 className="text-sm font-semibold text-slate-800">{t('forum.sujetsEpingles')}</h2></div>
            <div key={`e-${refreshKey}`} className="space-y-4 pb-6">{epingles.map(p =>            <PostCard key={p._id} post={p} onReplied={() => setRefreshKey(k => k + 1)} onSelectImage={setSelectedImage} />)}</div>
          </>
        )}
        <div className="mb-3 flex items-center gap-1.5"><MessageSquare size={14} color="#475569" /><h2 className="text-sm font-semibold text-slate-800">{t('forum.discussions')}  </h2></div>
        {autres.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center text-slate-400"><MessageSquare size={32} /><p className="text-sm">{t('forum.aucunSujet')}</p></div>
        ) : (
          <div key={`a-${refreshKey}`} dir={isRTL ? 'rtl' : 'ltr'} className="space-y-4">{autres.map(p =>            <PostCard key={p._id} post={p} onReplied={() => setRefreshKey(k => k + 1)} onSelectImage={setSelectedImage} />)}</div>
        )}
      </main>
      <Lightbox
        open={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        src={selectedImage ?? ''}
      />
    </div>
  )
}
