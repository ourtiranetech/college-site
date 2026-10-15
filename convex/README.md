# Welcome to your Convex functions directory!

## ⚠️ Ce dossier ne contient QUE du code serveur

Tout fichier de ce dossier est compilé et déployé par Convex. Un composant React
(JSX, `useState`, `@tanstack/react-router`, `lucide-react`…) placé ici **casse le
déploiement** :

```
X [ERROR] Expected ">" but found "className"
```

Les pages et composants d'interface vont dans `src/routes/` et `src/components/`.
Ici, uniquement des `query`, `mutation`, `action` et `internalAction`.

Le forum est réparti sur deux fichiers, à ne pas confondre :

| Fichier | Rôle |
|---|---|
| `src/routes/forum.tsx` | interface React du forum |
| `convex/forum.ts` | fonctions serveur du forum (`getPosts`, `creerPost`, `repondre`, `getUploadUrl`, invités…) |

Il n'existe **pas** de `convex/posts.ts`. Ce fichier a déjà été créé deux fois par
erreur en recopiant `src/routes/forum.tsx` ; sa suppression est volontaire.

### Vérification rapide

```bash
npx tsc --noEmit          # doit ne rien afficher
npx convex dev --once     # doit afficher « Convex functions ready! »
```

## Authentification

Deux fournisseurs sont actifs dans `convex/auth.ts` :

| Fournisseur | Identifiants |
|---|---|
| `Password` | email + mot de passe, inscrits en base |
| `Google` | variables d'environnement du déploiement |

### Variables attendues par le fournisseur Google

Convex Auth dérive les noms de variables depuis l'identifiant du fournisseur
(`google` → `AUTH_GOOGLE_*`). Ce ne sont **pas** les noms `GOOGLE_CLIENT_*`.

```
AUTH_GOOGLE_ID
AUTH_GOOGLE_SECRET
```

Déjà posées sur le déploiement `agile-mockingbird-7`. Pour les remettre :

```bash
npx convex env set --from-file .env.local
```

### URI de redirection à déclarer dans Google Cloud Console

```
https://agile-mockingbird-7.eu-west-1.convex.site/api/auth/callback/google
```

Format : `<CONVEX_SITE_URL>/api/auth/callback/google`.
Si cette URI n'est pas déclarée, Google répond `redirect_uri_mismatch`.

### Piège n°1 : ne pas casser `auth.config.ts`

`convex/auth.config.ts` doit contenir le `domain` (l'émetteur JWT, c'est-à-dire
l'URL `convex.site`) et l'`applicationID`. S'il est absent ou faux, l'application
est **silencieusement toujours déconnectée** — aucune erreur n'est levée.

Write your Convex functions here.
See https://docs.convex.dev/functions for more.

A query function that takes two arguments looks like:

```ts
// convex/myFunctions.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const myQueryFunction = query({
  // Validators for arguments.
  args: {
    first: v.number(),
    second: v.string(),
  },

  // Function implementation.
  handler: async (ctx, args) => {
    // Read the database as many times as you need here.
    // See https://docs.convex.dev/database/reading-data.
    const documents = await ctx.db.query("tablename").collect();

    // Arguments passed from the client are properties of the args object.
    console.log(args.first, args.second);

    // Write arbitrary JavaScript here: filter, aggregate, build derived data,
    // remove non-public properties, or create new objects.
    return documents;
  },
});
```

Using this query function in a React component looks like:

```ts
const data = useQuery(api.myFunctions.myQueryFunction, {
  first: 10,
  second: "hello",
});
```

A mutation function looks like:

```ts
// convex/myFunctions.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const myMutationFunction = mutation({
  // Validators for arguments.
  args: {
    first: v.string(),
    second: v.string(),
  },

  // Function implementation.
  handler: async (ctx, args) => {
    // Insert or modify documents in the database here.
    // Mutations can also read from the database like queries.
    // See https://docs.convex.dev/database/writing-data.
    const message = { body: args.first, author: args.second };
    const id = await ctx.db.insert("messages", message);

    // Optionally, return a value from your mutation.
    return await ctx.db.get("messages", id);
  },
});
```

Using this mutation function in a React component looks like:

```ts
const mutation = useMutation(api.myFunctions.myMutationFunction);
function handleButtonPress() {
  // fire and forget, the most common way to use mutations
  mutation({ first: "Hello!", second: "me" });
  // OR
  // use the result once the mutation has completed
  mutation({ first: "Hello!", second: "me" }).then((result) =>
    console.log(result),
  );
}
```

Use the Convex CLI to push your functions to a deployment. See everything
the Convex CLI can do by running `npx convex -h` in your project root
directory. To learn more, launch the docs with `npx convex docs`.
