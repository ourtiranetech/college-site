import { query, mutation } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

const MAX_CONTENU = 2000;
export const MAX_MESSAGES_AFFICHES = 100;

/**
 * Récupère l'utilisateur connecté côté serveur.
 *
 * Comme pour le forum, l'identité n'est jamais acceptée en argument : elle est
 * dérivée du jeton de session, ce qui empêche d'usurper un autre participant.
 */
async function requireUtilisateur(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Vous devez être connecté pour participer au chat.");
  }

  const utilisateur = await ctx.db.get(userId);
  if (!utilisateur) {
    throw new Error("Utilisateur introuvable.");
  }

  const nom = utilisateur.name?.trim() || utilisateur.email?.trim();
  if (!nom) {
    throw new Error("Votre profil ne contient ni nom ni email.");
  }

  return { userId, nom };
}

export const getMessages = query({
  args: { salle: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_salle", (q) => q.eq("salle", args.salle))
      .order("desc")
      .take(MAX_MESSAGES_AFFICHES);
  },
});

export const envoyerMessage = mutation({
  args: {
    // `auteur` et `auteurId` ne sont plus acceptés : ils venaient du client.
    contenu: v.string(),
    salle: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, nom } = await requireUtilisateur(ctx);

    const contenu = args.contenu.trim().slice(0, MAX_CONTENU);
    if (!contenu) {
      throw new Error("Le message est vide.");
    }

    const salle = args.salle.trim().slice(0, 60);
    if (!salle) {
      throw new Error("Salon invalide.");
    }

    return await ctx.db.insert("messages", {
      auteur: nom,
      auteurId: userId,
      contenu,
      salle,
      createdAt: Date.now(),
    });
  },
});
