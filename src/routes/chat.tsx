import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { useState, useRef, useEffect } from 'react'
import type { FormEvent } from 'react'
import { LogIn, MessageSquare, Send, Smile, Image as ImageIcon, Loader2 } from 'lucide-react'
import { LoginButton, useCurrentUser } from '../components/LoginButton'

export const Route = createFileRoute('/chat')({
  component: ChatPage,
})

const SALLES = [
  { id: 'general', label: '💬 Général', desc: 'Questions diverses sur le collège', chip: 'Général', chipColor: 'info' as const },
  { id: 'parents', label: '👨‍👩‍👧 Parents', desc: 'Échanges entre parents et administration', chip: 'Famille', chipColor: 'warning' as const },
  { id: 'eleves', label: '🎓 Élèves', desc: 'Entraide devoirs et vie scolaire', chip: 'Élèves', chipColor: 'success' as const },
  { id: 'aide', label: '🧮 aide', desc: 'Entraide devoirs et vie scolaire', chip: 'Aide', chipColor: 'info' as const },
]

/** 100 émoticônes proposées dans le chat. */
const EMOTICONS = [
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
  



/**
 * Insère une émoticône à la position du curseur puis replace celui-ci après.
 * Même comportement que le sélecteur du forum, pour rester cohérent.
 */
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

function ChatPage() {
  const [salle, setSalle] = useState('general')
  const [message, setMessage] = useState('')
  const [selecteurOuvert, setSelecteurOuvert] = useState(false)

  const identity = useCurrentUser()
  const estConnecte = identity !== null

  const messages = useQuery("messages:getMessages" as any, { salle })
  const envoyer = useMutation("messages:envoyerMessage" as any)

  // Typage explicite du useRef pour corriger la propriété scrollIntoView
  const chatEndRef = useRef<HTMLDivElement>(null)
  const champRef = useRef<HTMLTextAreaElement>(null)

  // Défilement automatique vers le bas à chaque nouveau message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Fermeture du sélecteur avec la touche Échap
  useEffect(() => {
    if (!selecteurOuvert) return
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelecteurOuvert(false)
    }
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [selecteurOuvert])

  const handleEnvoi = async (e: FormEvent) => {
    e.preventDefault()
    const contenu = message.trim()
    if (!contenu && !files.length) return

    if (!estConnecte) {
      alert("Vous devez être connecté pour envoyer un message.")
      return
    }

    setUploading(true)
    try {
      const images = await televerserImages(files, () => getUploadUrl({}))
      await envoyer({ contenu, salle, images })
      setMessage('')
      setFiles([])
      setSelecteurOuvert(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Le message n'a pas pu être envoyé.")
    } finally {
      setUploading(false)
    }
  }

  const getUploadUrl = useMutation("messages:getUploadUrl" as any)

  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)

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
      ids.push(await reponse.text())
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
          alert("Maximum 5 images par message.")
          return total.slice(0, 5)
        }
        return total
      })
    }
    e.target.value = ''
  }

  const nomAffiche = (identity?.name ?? identity?.email ?? 'Utilisateur') as string

  const ImageGallery = ({ storageIds }: { storageIds: string[] }) => {
    if (storageIds.length === 0) return null
    const [urls, setUrls] = useState<string[]>([])
    useEffect(() => {
      const charger = async () => {
        const resultats = await Promise.all(
          storageIds.map(async (id) => {
            const reponse = await fetch(`/api/messages/getImageUrl?id=${id}`)
            return reponse.text()
          })
        )
        setUrls(resultats.filter((u): u is string => u !== ''))
      }
      charger()
    }, [storageIds])
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {urls.map((url, i) => (
          <img key={i} src={url} alt={`Pièce jointe ${i + 1}`} className="h-24 w-24 rounded-lg object-cover" />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Chat en Direct</h1>
        <p className="text-gray-600">
          Posez vos questions en temps réel à la communauté du collège.
        </p>
      </header>

      {/* Connexion requise : même authentification que le forum */}
      {!estConnecte ? (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-md mx-auto text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary">
            <LogIn size={18} className="text-white" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Connexion requise</h2>
          <p className="text-sm text-gray-500 mb-5">
            Connectez-vous avec votre adresse email pour rejoindre les salons de
            discussion. Votre nom s'affichera automatiquement auprès des autres
            participants.
          </p>
          <div className="flex justify-center">
            <LoginButton />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar des salles */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Salons de discussion
            </h2>
            {SALLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSalle(s.id)}
                className={`w-full text-left p-3 rounded-lg transition ${
                  salle === s.id
                    ? 'bg-blue-50 border border-blue-200 text-blue-900 font-medium'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="font-semibold">{s.label}</div>
                <div className="text-xs text-gray-500">{s.desc}</div>
              </button>
            ))}

            <div className="pt-4 border-t mt-4 text-xs text-gray-500">
              Connecté en tant que : <strong className="text-gray-800">{nomAffiche}</strong>
            </div>
          </div>

          {/* Zone du Chat */}
          <div className="md:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-137.5">
            {/* Titre du salon sélectionné */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
              <span className="font-bold text-gray-800">
                {SALLES.find((s) => s.id === salle)?.label}
              </span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                En direct (Convex)
              </span>
            </div>

            {/* Flux de messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages === undefined ? (
                <div className="text-center text-gray-400 py-10">Chargement des messages...</div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center gap-2 text-center text-gray-400 py-10">
                  <MessageSquare size={28} aria-hidden="true" />
                  <p className="text-sm">
                    Aucun message dans ce salon. Soyez le premier à écrire !
                  </p>
                </div>
              ) : (
                messages
                  .slice()
                  .reverse()
                  .map((msg: any) => {
                    const estMoi = msg.auteur === nomAffiche
                    return (
                      <div
                        key={msg._id}
                        className={`flex flex-col ${estMoi ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-gray-600">
                            {msg.auteur}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div
                          className={`max-w-md px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap wrap-break-word ${

                            estMoi
                              ? 'bg-blue-600 text-white rounded-br-none'
                              : 'bg-gray-100 text-gray-800 rounded-bl-none'
                          }`}
                        >
                          {msg.contenu}
                          {msg.images && msg.images.length > 0 && (
                            <ImageGallery storageIds={msg.images} />
                          )}
                        </div>
                      </div>
                    )
                  })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Saisie de message */}
            <form onSubmit={handleEnvoi} className="p-4 border-t">
              <div className="relative flex items-end gap-2">
                {/* Sélecteur d'émoticônes */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSelecteurOuvert(o => !o)}
                    className={`rounded-lg p-2 transition hover:bg-gray-100 ${
                      selecteurOuvert ? 'text-blue-700' : 'text-gray-400'
                    }`}
                    aria-label="Insérer une émoticône"
                    aria-expanded={selecteurOuvert}
                    title="Émoticônes"
                  >
                    <Smile size={20} />
                  </button>

                  {selecteurOuvert && (
                    <>
                      {/* Ferme le sélecteur au clic à l'extérieur */}
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
                        aria-label="Émoticônes disponibles"
                      >
                        <p className="px-1 pb-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
                          {EMOTICONS.length} émoticônes
                        </p>
                        <div className="grid max-h-44 grid-cols-10 gap-0.5 overflow-y-auto">                          {EMOTICONS.map((e, i) => (
                            <button
                              key={`${e}-${i}`}
                              type="button"
                              onClick={() => {
                                insererEmoticone(champRef.current, e, message, setMessage)
                              }}
                              className="rounded p-0.5 text-lg leading-none transition hover:bg-gray-100"
                              aria-label={`Insérer ${e}`}
                            >
                              {e}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <textarea
                  ref={champRef}
                  placeholder="Écrivez votre message..."
                  value={message}
                  maxLength={2000}
                  rows={1}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    // Entrée envoie, Maj+Entrée ajoute une ligne
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      e.currentTarget.form?.requestSubmit()
                    }
                  }}
                  className="flex-1 resize-y rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <label className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 min-w-0 text-xs font-medium text-slate-600 rounded-lg border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:text-slate-800 transition">
                  <ImageIcon size={14} />
                  <input type="file" accept="image/*" multiple className="hidden" onChange={pickImages} />
                  <span className="whitespace-nowrap">Image</span>
                </label>

                <div className="flex-1 min-w-0">
                  <textarea
                    ref={champRef}
                    placeholder="Écrivez votre message..."
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
                    className="flex-1 resize-y rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!message.trim() && !files.length || uploading}
                  className="inline-flex items-center gap-1.5 bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} aria-hidden="true" />}
                  {uploading ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>

              <p className="mt-1.5 text-right text-[11px] text-gray-400">
                {message.length} / 2000 · Entrée pour envoyer, Maj+Entrée pour un retour à la ligne
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
