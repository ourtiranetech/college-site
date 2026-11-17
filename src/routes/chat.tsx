import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { useState, useRef, useEffect } from 'react'
import type { SubmitEvent } from 'react'
import { LogIn, Send, Smile, Image as ImageIcon, Loader2 } from 'lucide-react'
import { LoginButton, useCurrentUser } from '../components/LoginButton'
import { Lightbox } from '../components/Lightbox'
import { useLanguage } from '../i18n/LanguageProvider'
import { getMessages, envoyerMessage, getUploadUrl } from '../../convex/messages'

export const Route = createFileRoute('/chat')({
  component: ChatPage,
})

function getSalles(t: (key: string) => string, isRTL: boolean) {
  const frenchLetters = { general: 'G', parents: 'P', eleves: 'E', aide: 'A' }
  const arabicLetters = { general: 'ع', parents: 'أ', eleves: 'ت', aide: 'م' }

  return [
    { id: 'general', label: t('chat.salonGeneral'), lettre: isRTL ? arabicLetters.general : frenchLetters.general, couleur: 'bg-blue-100 text-blue-700', desc: t('chat.salonGeneralDesc') },
    { id: 'parents', label: t('chat.salonParents'), lettre: isRTL ? arabicLetters.parents : frenchLetters.parents, couleur: 'bg-amber-100 text-amber-700', desc: t('chat.salonParentsDesc') },
    { id: 'eleves', label: t('chat.salonEleves'), lettre: isRTL ? arabicLetters.eleves : frenchLetters.eleves, couleur: 'bg-emerald-100 text-emerald-700', desc: t('chat.salonElevesDesc') },
    { id: 'aide', label: t('chat.salonAide'), lettre: isRTL ? arabicLetters.aide : frenchLetters.aide, couleur: 'bg-violet-100 text-violet-700', desc: t('chat.salonAideDesc') },
  ]
}

const EMOTICONS = [
  '😀', '😃', '😄', '😁', '😆',
  '😅', '😂', '🙂', '😉', '😊',
  '😍', '😘', '😎', '🤗', '🤔',
  '🙄', '😐', '😴', '🥳', '🤩',
  '😢', '😭', '😞', '😟', '😰',
  '😱', '😡', '😤', '😬', '🙃',
  '👍', '👎', '👏', '🙏', '💪',
  '👋', '🤝', '✌️', '👌', '🤞',
  '🎉', '🔥', '⭐', '💯', '✨',
  '❤️', '💚', '💙', '💛', '🤍',
  '📚', '📝', '✏️', '📖', '📐',
  '🔬', '🧪', '🧮', '🖊️', '📌',
  '📎', '🗂️', '📅', '📊', '🖥️',
  '🎓', '🏫', '🎒', '🗺️', '🌍',
  '⚽', '🏀', '🏐', '🏃', '🏆',
  '🎨', '🎵', '🎸', '🎭', '📸',
  '✅', '❌', '💡', '⏰', '❓',
  '❗', '🔔', '🔒', '➕', '➡️',
  '🌈', '☀️', '🌟', '🎁', '🎈',
  '☕', '🍎', '🚌', '🏠', '💬',
]

function insererEmoticone(
  el: HTMLTextAreaElement | null,
  emoticone: string,
  valeur: string,
  setValeur: (v: string) => void,
) {
  if (!el) {
    setValeur(valeur + emoticone)
    return
  }
  const debut = el.selectionStart
  const fin = el.selectionEnd
  setValeur(valeur.slice(0, debut) + emoticone + valeur.slice(fin))
  requestAnimationFrame(() => {
    el.selectionStart = el.selectionEnd = debut + emoticone.length
    el.focus()
  })
}

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

function ChatPage() {
  const { t, isRTL } = useLanguage()
  const salles = getSalles(t, isRTL)
  const [salle, setSalle] = useState('general')
  const [message, setMessage] = useState('')
  const [selecteurOuvert, setSelecteurOuvert] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const messagesQuery = useQuery(getMessages, { salle, take: 50, skip: page * 50 }, { initialData: [] })
  const envoyer = useMutation(envoyerMessage)
  const getUploadUrl = useMutation(getUploadUrl)

  const identity = useCurrentUser()
  const estConnecte = identity !== null

  const salleCourante = salles.find((s) => s.id === salle)

  const chatEndRef = useRef<HTMLDivElement>(null)
  const champRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messagesQuery])

  useEffect(() => {
    const el = chatEndRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((p) => p + 1)
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, loading])

  const handleEnvoi = async (e: SubmitEvent) => {
    e.preventDefault()
    const contenu = message.trim()
    if (!contenu && !files.length) return

    if (!estConnecte) {
      alert(t('chat.connexionMessage'))
      return
    }

    setUploading(true)
    try {
      const images = await televerserImages(files, () => getUploadUrl({}))
      await envoyer({ contenu, salle, images })
      setMessage('')
      setFiles([])
    } catch (err) {
      alert(err instanceof Error ? err.message : t('chat.envoiImpossible'))
    } finally {
      setUploading(false)
    }
  }

  const televerserImages = async (
    fichiers: File[],
    getUploadUrl: () => Promise<string>,
  ): Promise<string[]> => {
    if (fichiers.length === 0) return []
    const url = await getUploadUrl()
    const ids: string[] = []
    for (const fichier of fichiers) {
      const reponse = await fetch(url, { method: 'POST', body: fichier })
      if (!reponse.ok) throw new Error('Echec du televersement de ' + fichier.name + '.')
      ids.push(lireStorageId(await reponse.text()))
    }
    return ids
  }

  const pickImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const choisis = e.target.files
    if (choisis) {
      const ajoutes = Array.from(choisis)
      setFiles(prev => {
        const total = [...prev, ...ajoutes]
        if (total.length > 5) {
          alert(t('chat.maxImages'))
          return total.slice(0, 5)
        }
        return total
      })
    }
    e.target.value = ''
  }

  const nomAffiche = (identity?.name ?? identity?.email ?? t('chat.utilisateur')) as string

  const ImageGallery = ({ storageIds }: { storageIds: string[] }) => {
    if (storageIds.length === 0) return null
    const urls = useQuery(getImageUrls, { storageIds }) ?? []
    if (urls.length === 0) return null
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {urls.map((url: string, i: number) => (
          <img
            key={i}
            src={url}
            alt={t('chat.pieceJointe', { n: i + 1 })}
            className="h-24 w-24 cursor-pointer rounded-lg object-cover"
            onClick={() => setSelectedImage(url)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{t('chat.title')}</h1>
        <p className="text-gray-600">{t('chat.subtitle')}</p>
      </header>

      {!estConnecte ? (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-md mx-auto text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary">
            <LogIn size={18} className="text-white" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{t('chat.connexionRequise')}</h2>
          <p className="text-sm text-gray-500 mb-5">{t('chat.connexionTexte')}</p>
          <div className="flex justify-center">
            <LoginButton />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t('chat.salons')}</h2>
            {salles.map((s) => (
              <button
                key={s.id}
                onClick={() => setSalle(s.id)}
                className={`w-full text-left p-3 rounded-lg transition ${
                  salle === s.id
                    ? 'bg-blue-50 border border-blue-200 text-blue-900 font-medium'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${s.couleur}`}>
                    <span className="text-sm font-bold">{s.lettre}</span>
                  </div>
                  <span className="font-medium">{s.label}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="md:col-span-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{nomAffiche}</span>
                  <span className="text-xs text-gray-500">{salleCourante?.label}</span>
                </div>
                <div className="h-64 overflow-y-auto bg-gray-50 rounded-lg p-4 space-y-2">
                  {messagesQuery.map((msg) => (
                    <div key={msg._id} className="text-sm bg-white p-3 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">{msg.auteur}</div>
                      <p className="text-gray-800">{msg.contenu}</p>
                      {msg.images?.map((img) => (
                        <img key={img} src={img} className="mt-2 h-32 w-32 object-cover rounded" />
                      ))}
                    </div>
                  ))}
                  {loading && <div className="text-sm text-gray-500">Chargement...</div>}
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setSelecteurOuvert(!selecteurOuvert)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    📷
                  </button>
                  <button
                    onClick={handleEnvoi}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                  >
                    <Send size={18} />
                  </button>
                </div>
                {selecteurOuvert && (
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={pickImages}
                    className="mt-2"
                  />
                )}
                {uploading && <div className="mt-2 text-sm text-gray-500">Envoi...</div>}
                {selectedImage && (
                  <ImageGallery storageIds={[selectedImage]} />
                )}
              </div>
              <div className="w-64 space-y-2">
                <div className="text-sm text-gray-600 p-2">
                  <strong className="block mb-1">{t('chat.suggestions')}</strong>
                  <div className="flex flex-wrap gap-1">
                    {EMOTICONS.map((emo) => (
                      <span
                        key={emo}
                        className="text-lg cursor-pointer hover:bg-gray-100 rounded px-1"
                        onClick={() => setMessage((m) => m + emo)}
                      >
                        {emo}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-600 p-2">
                  <strong className="block mb-1">{t('chat.urgent')}</strong>
                  <button className="text-left hover:underline">
                    {t('chat.urgentTexte')}
                  </button>
                </div>
              </div>
            </div>
            <textarea
              ref={champRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('chat.taperMessage')}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {message.length}/2000
              </span>
              <button
                onClick={() => setMessage('')}
                className="text-xs text-gray-500 hover:underline"
              >
                {t('chat.effacer')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatPage
