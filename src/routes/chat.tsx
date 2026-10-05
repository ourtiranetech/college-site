import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useState, useRef, useEffect } from 'react'

export const Route = createFileRoute('/chat')({
  component: ChatPage,
})

const SALLES = [
  { id: 'general', label: '💬 Général', desc: 'Questions diverses sur le collège' },
  { id: 'parents', label: '👨‍👩‍👧 Parents', desc: 'Échanges entre parents et administration' },
  { id: 'eleves', label: '🎓 Élèves', desc: 'Entraide devoirs et vie scolaire' },
]

function ChatPage() {
  const [salle, setSalle] = useState('general')
  const [message, setMessage] = useState('')
  const [pseudo, setPseudo] = useState('')
  const [estConnecte, setEstConnecte] = useState(false)

  const messages = useQuery(api.messages.getMessages, { salle })
  const envoyer = useMutation(api.messages.envoyerMessage)

  // Typage explicite du useRef pour corriger la propriété scrollIntoView
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Défilement automatique vers le bas à chaque nouveau message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleConnexion = (e: React.FormEvent) => {
    e.preventDefault()
    if (pseudo.trim()) setEstConnecte(true)
  }

  const handleEnvoi = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !estConnecte) return

    await envoyer({
      auteur: pseudo,
      auteurId: `user-${pseudo.toLowerCase().replace(/\s+/g, '-')}`,
      contenu: message,
      salle,
    })
    setMessage('')
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl text-center font-bold text-gray-900">Chat en Direct</h1>
        <p className="text-gray-600 text-center">
          Posez vos questions en temps réel à la communauté du collège.
        </p>
      </header>

      {/* Formulaire de pseudo au premier accès */}
      {!estConnecte ? (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-md mx-auto text-center">
          <h2 className="text-xl text-center font-semibold mb-2">Bienvenue sur le chat</h2>
          <p className="text-sm text-gray-500 mb-4">
            Veuillez entrer un nom ou pseudo pour participer aux conversations.
          </p>
          <form onSubmit={handleConnexion} className="space-y-4">
            <input
              type="text"
              placeholder="Votre nom ou prénom (ex: Parent-M.Martin)"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-700 text-white font-medium py-2 rounded-lg hover:bg-blue-800 transition"
            >
              Rejoindre le chat
            </button>
          </form>
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
              Connecté en tant que : <strong className="text-gray-800">{pseudo}</strong>
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
                <div className="text-center text-gray-400 py-10">
                  Aucun message dans ce salon. Soyez le premier à écrire !
                </div>
              ) : (
                messages
                  .slice()
                  .reverse()
                  .map((msg) => {
                    const estMoi = msg.auteur === pseudo
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
                          className={`max-w-md px-4 py-2 rounded-2xl text-sm ${
                            estMoi
                              ? 'bg-blue-600 text-white rounded-br-none'
                              : 'bg-gray-100 text-gray-800 rounded-bl-none'
                          }`}
                        >
                          {msg.contenu}
                        </div>
                      </div>
                    )
                  })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Saisie de message */}
            <form onSubmit={handleEnvoi} className="p-4 border-t flex gap-2">
              <input
                type="text"
                placeholder="Écrivez votre message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-800 transition"
              >
                Envoyer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}