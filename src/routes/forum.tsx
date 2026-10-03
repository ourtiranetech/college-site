import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forum')({
  component: ForumPage,
})

function ForumPage() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Forum</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          Forum de la communauté
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          (À compléter) Discussions entre parents, élèves et personnels.
          Les fonctions Convex <code>getPosts</code>, <code>creerPost</code>
          et <code>repondre</code> sont prêtes dans <code>convex/forum.ts</code>.
        </p>
      </section>
    </main>
  )
}
