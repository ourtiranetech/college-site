import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/parents-eleves/contact')({
  component: ContactPage,
})

function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  // Use React.SubmitEvent instead of React.FormEvent
  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker text-center mb-2">Contact</p>
        <h1 className="display-title text-center mb-1 text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          Nous contacter
        </h1>
        <p className="m-0 text-center text-base leading-8 text-(--sea-ink-soft)">
          Remplissez le formulaire ci-dessous et nous vous répondrons dans les
          meilleurs délais.
        </p>
      </section>

      <section className="mt-6 island-shell rounded-2xl p-6 sm:p-8">
        {submitted ? (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-800 text-sm font-medium">
            Merci ! Votre message a bien été envoyé.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="nom" className="text-sm font-medium text-slate-700">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  required
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0F2147]/20 focus:border-[#0F2147]"
                  placeholder="Votre nom"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="prenom" className="text-sm font-medium text-slate-700">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  id="prenom"
                  name="prenom"
                  type="text"
                  required
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0F2147]/20 focus:border-[#0F2147]"
                  placeholder="Votre prénom"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Adresse email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0F2147]/20 focus:border-[#0F2147]"
                placeholder="exemple@email.com"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="commentaire" className="text-sm font-medium text-slate-700">
                Commentaire <span className="text-red-500">*</span>
              </label>
              <textarea
                id="commentaire"
                name="commentaire"
                rows={5}
                required
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0F2147]/20 focus:border-[#0F2147] resize-y"
                placeholder="Votre message…"
              />
            </div>

            <button
              type="submit"
              className="rounded-lg bg-[#0F2147] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0F2147]/90 focus:outline-none focus:ring-2 focus:ring-[#0F2147]/40"
            >
              Envoyer le message
            </button>
          </form>
        )}
      </section>
    </main>
  )
}