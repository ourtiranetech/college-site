# college-site

Site web de présentation du **CEM Azouaou Amrane** — Tazmalt, Béjaïa (Algérie).

Application React 19 / TypeScript construite avec TanStack Start (routage par
fichiers + SSR), Tailwind CSS 4 et un backend Convex (authentification, chat en
direct, forum, formulaire de contact).

## Démarrage

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build de production

```bash
npm run build      # génère dist/client et dist/server
npm run preview
```

## Structure du projet

| Dossier | Rôle |
|---|---|
| `src/routes/` | Pages (une route par fichier) |
| `src/components/` | Composants partagés (Navbar, Footer, LoginButton, SchoolCard, Lightbox…) |
| `src/i18n/` | Dictionnaires FR/AR, provider de langue et hook `useLanguage` |
| `src/galerie/` | Liste des photos de la galerie |
| `convex/` | Fonctions serveur Convex (auth, chat, forum, contact) |
| `public/` | Vidéos et médias statiques |

## Configuration

Les variables d'environnement (URL Convex, OAuth Google, Gmail) se créent dans
`.env.local`, qui n'est pas versionné. Voir `convex/README.md` pour les noms de
variables et l'URI de redirection Google.

## Notes

- Site bilingue FR/AR avec bascule de direction (RTL) automatique.
- Galerie : déposer les photos dans `public/galerie/` puis les enregistrer dans
  `src/galerie/photos.ts`.
