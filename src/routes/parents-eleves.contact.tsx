import { createFileRoute } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Mail, MapPin, Phone, Clock, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/parents-eleves/contact')({
  component: ContactPage,
})

const COORDONNEES = [
  { icone: MapPin, texte: 'Rue Titouah Salem, Tazmalt 06006, Algérie' },
  { icone: Mail, texte: 'cemazouaouamrane@gmail.com', href: 'mailto:cemazouaouamrane@gmail.com' },
  { icone: Phone, texte: '+213 36 XX XX XX', href: 'tel:+21336000000' },
  { icone: Clock, texte: 'Dim – Jeu : 8h00 – 16h30' },
]

const CHAMP_VIDE = { nom: '', prenom: '', email: '', commentaire: '' }

type Etat =
  | { type: 'repos' }
  | { type: 'envoi' }
  | { type: 'succes' }
  | { type: 'erreur'; message: string }

function ContactPage() {
  const [champs, setChamps] = useState(CHAMP_VIDE)
  // Champ piège : invisible pour un humain, rempli par les robots.
  const [siteWeb, setSiteWeb] = useState('')
  const [etat, setEtat] = useState<Etat>({ type: 'repos' })

  const envoyer = useMutation("contact:envoyerMessage" as any)
const notifierEmail = useMutation("contact:notifierParEmail" as any)

  const maj =
    (cle: keyof typeof CHAMP_VIDE) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setChamps(prev => ({ ...prev, [cle]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setEtat({ type: 'envoi' })
    try {
      await envoyer({ ...champs, siteWeb })
      setChamps(CHAMP_VIDE)
      setSiteWeb('')
      setEtat({ type: 'succes' })
    } catch (err) {
      setEtat({
        type: 'erreur',
        message:
          err instanceof Error ? err.message : "L'envoi a échoué. Merci de réessayer.",
      })
    }
  }

  const enCours = etat.type === 'envoi'
  const classeChamp =
    'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-[#0F2147] focus:ring-1 focus:ring-[#0F2147]/10'

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 font-sans">
      <header className="bg-[#0F2147] px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-serif text-2xl font-bold text-white sm:text-3xl">Nous contacter</h1>
          <p className="mt-1 text-sm text-white/60">
            Une question sur la scolarité, les inscriptions ou la vie de l'établissement ?
            Écrivez-nous, nous vous répondrons dans les meilleurs délais.
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-4xl gap-8 px-4 py-8 lg:grid-cols-5">
        {/* Coordonnées */}
        <section className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-slate-800">Coordonnées</h2>
            <ul className="space-y-3.5">
              {COORDONNEES.map(({ icone: Icone, texte, href }) => (
                <li key={texte} className="flex items-start gap-2.5">
                  <Icone size={15} className="mt-0.5 shrink-0 text-[#E8A020]" aria-hidden="true" />
                  {href ? (
                    <a
                      href={href}
                      className="text-[13px] leading-relaxed text-slate-600 underline-offset-2 hover:underline"
                    >
                      {texte}
                    </a>
                  ) : (
                    <span className="text-[13px] leading-relaxed text-slate-600">{texte}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 px-1 text-xs leading-relaxed text-slate-500">
            Les messages envoyés via ce formulaire sont transmis à l'administration de
            l'établissement. Merci de ne pas y communiquer de données de santé ou de
            documents confidentiels.
          </p>
        </section>

        {/* Formulaire */}
        <section className="lg:col-span-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-800">Envoyer un message</h2>

            {etat.type === 'succes' ? (
              <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-700" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-green-900">Message bien envoyé</p>
                  <p className="mt-1 text-sm text-green-800">
                    Merci, votre message a été transmis à l'établissement.
                  </p>
                  <button
                    type="button"
                    onClick={() => setEtat({ type: 'repos' })}
                    className="mt-3 text-xs font-semibold text-green-900 underline underline-offset-2"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="prenom" className="mb-1 block text-xs font-medium text-slate-600">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="prenom"
                      type="text"
                      required
                      maxLength={80}
                      value={champs.prenom}
                      onChange={maj('prenom')}
                      className={classeChamp}
                    />
                  </div>
                  <div>
                    <label htmlFor="nom" className="mb-1 block text-xs font-medium text-slate-600">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="nom"
                      type="text"
                      required
                      maxLength={80}
                      value={champs.nom}
                      onChange={maj('nom')}
                      className={classeChamp}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="mb-1 block text-xs font-medium text-slate-600">
                    Adresse email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    maxLength={200}
                    value={champs.email}
                    onChange={maj('email')}
                    placeholder="parent@exemple.dz"
                    className={classeChamp}
                  />
                </div>

                <div>
                  <label htmlFor="commentaire" className="mb-1 block text-xs font-medium text-slate-600">
                    Votre message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="commentaire"
                    required
                    rows={6}
                    minLength={10}
                    maxLength={5000}
                    value={champs.commentaire}
                    onChange={maj('commentaire')}
                    placeholder="Décrivez votre demande…"
                    className={`${classeChamp} resize-y`}
                  />
                  <p className="mt-1 text-right text-[11px] text-slate-400">
                    {champs.commentaire.length} / 5000
                  </p>
                </div>

                {/* Champ piège anti-robot : masqué et ignoré par les humains */}
                <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
                  <label htmlFor="siteWeb">Site web</label>
                  <input
                    id="siteWeb"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={siteWeb}
                    onChange={e => setSiteWeb(e.target.value)}
                  />
                </div>

                {etat.type === 'erreur' && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                    <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-600" aria-hidden="true" />
                    <p className="text-xs text-red-800">{etat.message}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={enCours}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0F2147] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a1a33] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {enCours ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  {enCours ? 'Envoi en cours…' : 'Envoyer le message'}
                </button>

                {/* Bouton dédié pour valider l'envoi d'email */}
                <button
                  type="button"
                  disabled={enCours}
                  onClick={async () => {
                    try {
                      await notifierEmail({
                        nom: champs.nom || 'Test',
                        prenom: champs.prenom || 'Test',
                        email: champs.email || 'test@example.com',
                        commentaire: 'Message de test pour valider l\'envoi.',
                      })
                      alert('Email envoyé vers cemazouaouamrane@gmail.com')
                    } catch (err) {
                      alert('Échec de l\'envoi : ' + (err instanceof Error ? err.message : 'Erreur inconnue'))
                    }
                  }}
                  className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Mail size={15} />
                  Envoyer un test
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
