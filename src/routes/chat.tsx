import { createFileRoute } from '@tanstack/react-router'
import { usePaginatedQuery, useMutation, useQuery } from 'convex/react'
import { useState, useRef, useEffect } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { LogIn, Send, Smile, Image as ImageIcon, Loader2 } from 'lucide-react'
import { LoginButton, useCurrentUser } from '../components/LoginButton'
import { Lightbox } from '../components/Lightbox'
import { useLanguage } from '../i18n/LanguageProvider'
import { api } from '../../convex/_generated/api'

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
    throw new Error('Réponse de téléversement illisible.')
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

  const messagesQuery = usePaginatedQuery(
    api.messages.getMessages,
    { salle },
    { initialNumItems: 50 }
  )
  const envoyer = useMutation(api.messages.envoyerMessage)
  const getUploadUrl = useMutation(api.messages.getUploadUrl)

  const identity = useCurrentUser()
  const estConnecte = identity !== null

  const salleCourante = salles.find((s) => s.id === salle)

  const chatEndRef = useRef<HTMLDivElement>(null)
  const champRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (messagesQuery.results) {
      setMessage('')
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messagesQuery])

  useEffect(() => {
    const el = chatEndRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && messagesQuery.status === 'CanLoadMore') {
          messagesQuery.loadMore(50)
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [messagesQuery])

  const handleEnvoi = async (e: FormEvent<HTMLFormElement>) => {
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
      if (!reponse.ok) throw new Error(`Échec du téléversement de ${fichier.name}.`)
      ids.push(lireStorageId(await reponse.text()))
    }
    return ids
  }

  const pickImages = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement
    const choisis = input.files
    if (choisis) {
      const ajoutes: File[] = Array.from(choisis)
      setFiles(prev => {
        const total = [...prev, ...ajoutes]
        if (total.length > 5) {
          alert(t('chat.maxImages'))
          return total.slice(0, 5)
        }
        return total
      })
    }
    input.value = ''
  }

  const nomAffiche = (identity?.name ?? identity?.email ?? t('chat.utilisateur')) as string

  const ImageGallery = ({ storageIds }: { storageIds: string[] }) => {
    if (storageIds.length === 0) return null
    const urls = useQuery(api.messages.getImageUrls, { storageIds })
    if (urls === undefined) return null
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
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${s.couleur}`}>
                    {s.lettre}
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{s.label}</div>
                    <div className="text-xs text-gray-500">{s.desc}</div>
                  </div>
                </div>
              </button>
            ))}
            <div className="pt-4 border-t mt-4 text-xs text-gray-500">
              {t('chat.connecteEnTantQue')} <strong className="text-gray-800">{nomAffiche}</strong>
            </div>
          </div>

          <div className="md:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[550px]">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
              <span className="flex items-center gap-2 font-bold text-gray-800">
                {salleCourante && (
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${salleCourante.couleur}`}>
                    {salleCourante.lettre}
                  </span>
                )}
                {salleCourante?.label}
              </span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                {t('chat.enDirect')}
              </span>
            </div>

            <div dir={isRTL ? 'rtl' : 'ltr'} className="flex-1 p-6 overflow-y-auto space-y-4">
              {messagesQuery.status === 'LoadingFirstPage' || messagesQuery.status === 'LoadingMore' || messagesQuery.status === 'CanLoadMore' ? (
                <div className="text-center text-gray-400 py-10">{t('chat.chargement')}</div>
              ) : messagesQuery.results ? (
                <>
                  {messagesQuery.results.map((msg: any) => {
                    const estMoi = msg.auteur === nomAffiche
                    return (
                      <div
                        key={msg._id}
                        className={`flex flex-col ${estMoi ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-gray-600">{msg.auteur}</span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div
                          className={`max-w-md px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words ${
                            estMoi ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'
                          }`}
                        >
                          {msg.contenu}
                          {msg.images && msg.images.length > 0 && <ImageGallery storageIds={msg.images} />}
                        </div>
                      </div>
                    )
                  })}
                  {messagesQuery.results.length === 0 && (
                    <div className="text-center text-gray-400 py-4">{t('chat.pasDeMessage')}</div>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-400 py-10">{t('chat.chargement')}</div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleEnvoi} className="p-4 border-t">
              <div className="relative flex items-end gap-2">
                <textarea
                  ref={champRef}
                  placeholder={t('chat.placeholder')}
                  value={message}
                  maxLength={2000}
                  rows={1}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      e.currentTarget.form?.requestSubmit()
                    }
                  }}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className="flex-1 resize-y rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <label className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 min-w-0 text-xs font-medium text-slate-600 rounded-lg border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:text-slate-800 transition">
                  <ImageIcon size={14} />
                  <input type="file" accept="image/*" multiple className="hidden" onChange={pickImages} />
                  <span className="whitespace-nowrap">{t('chat.image')}</span>
                </label>

                <button
                  type="button"
                  onClick={() => setSelecteurOuvert(o => !o)}
                  className={`rounded-lg p-2 transition hover:bg-gray-100 ${selecteurOuvert ? 'text-blue-700' : 'text-gray-400'}`}
                  title={t('chat.emoticones')}
                >
                  <Smile size={20} />
                </button>

                {selecteurOuvert && (
                  <>
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-hidden="true"
                      onClick={() => setSelecteurOuvert(false)}
                      className="fixed inset-0 z-10 cursor-default"
                    />
                    <div
                      className="absolute bottom-full left-0 z-20 mb-2 w-64 rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
                      role="group"
                      aria-label={t('chat.emoticones')}
                    >
                      <p className="px-1 pb-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        {t('chat.nbEmoticones', { count: EMOTICONS.length })}
                      </p>
                      <div className="grid max-h-44 grid-cols-10 gap-0.5 overflow-y-auto">
                        {EMOTICONS.map((e) => (
                          <button
                            key={e}
                            type="button"
                            onClick={() => insererEmoticone(champRef.current, e, message, setMessage)}
                            className="rounded p-0.5 text-lg leading-none transition hover:bg-gray-100"
                            aria-label={t('chat.insererEmoticone', { emoji: e })}
                          >
                            {e}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={(!message.trim() && !files.length) || uploading}
                  className="inline-flex items-center gap-1.5 bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} aria-hidden="true" />}
                  {uploading ? t('chat.envoiEnCours') : t('chat.envoyer')}
                </button>
              </div>

              <p className="mt-1.5 text-right text-[11px] text-gray-400">
                {message.length} / 2000 · {t('chat.toucheEntree')}
              </p>
            </form>
          </div>
        </div>
      )}
      <Lightbox
        open={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        src={selectedImage ?? ''}
      />
    </div>
  )
}

export default ChatPage
