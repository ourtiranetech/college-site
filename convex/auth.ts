// convex/auth.ts
import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import Google from "@auth/core/providers/google";
import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Fournisseurs d'authentification.
 *
 * - `Password` : email + mot de passe (inscription depuis le site).
 * - `Google`   : connexion OAuth Google.
 *
 * Les identifiants Google ne sont PAS écrits ici : Convex Auth les lit dans les
 * variables d'environnement du déploiement, dérivées de l'identifiant du
 * fournisseur (« google » -> AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET).
 *
 * URI de redirection à déclarer dans Google Cloud Console :
 *   https://<CONVEX_SITE_URL>/api/auth/callback/google
 * soit pour ce projet :
 *   https://agile-mockingbird-7.eu-west-1.convex.site/api/auth/callback/google
 */
export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Password({
      // Optionnel : permet de définir des champs personnalisés dans la table users à l'inscription
      profile(params) {
        return {
          email: params.email as string,
          name: params.name as string,
          phone: params.phone as string,
        };
      },
    }),
    Google({}),
  ],
});

/**
 * Vérifie qu'un email n'est pas déjà utilisé.
 *
 * La création de compte password est gérée par Convex Auth via `signIn`
 * avec `flow: "signUp"` ; cette query sert seulement à vérifier la
 * disponibilité côté client avant de tenter l'inscription.
 */
export const checkEmailAvailable = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.trim().toLowerCase();
    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", normalizedEmail))
      .first();

    return existing === null;
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});
