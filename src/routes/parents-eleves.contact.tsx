import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/parents-eleves/contact')({
  component: ContactPage,
})

function ContactPage() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Contact</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          Nous contacter
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          (À compléter) Formulaire de contact, adresse, téléphone et email du
          collège Ibn Khaldoun.
        </p>
      </section>
    </main>
  )
}
