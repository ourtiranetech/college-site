import { query, mutation } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { GenericId } from "convex/values";
import { MAX_IMAGES_PAR_MESSAGE } from "./schema";

export const MAX_TAILLE_IMAGE = 5 * 1024 * 1024;
const TYPES_IMAGE_AUTORISES = [
  "image/jpeg", "image/png", "image/webp", "image/gif",
];

async function requireUtilisateur(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Vous devez être connecté pour effectuer cette action.");
  const utilisateur = await ctx.db.get(userId);
  if (!utilisateur) throw new Error("Utilisateur introuvable.");
  const nom = utilisateur.name?.trim() || utilisateur.email?.trim();
  if (!nom) throw new Error("Votre profil ne contient ni nom ni email.");
  return { userId, nom };
}

async function requireAuteurForumAutorise(
  ctx: QueryCtx | MutationCtx,
): Promise<{ userId: GenericId<"users">; nom: string }> {
  const { userId, nom } = await requireUtilisateur(ctx);
  return { userId, nom };
}

async function validerImages(
  ctx: MutationCtx,
  storageIds: string[] | undefined,
): Promise<string[]> {
  if (!storageIds || storageIds.length === 0) return [];
  if (storageIds.length > MAX_IMAGES_PAR_MESSAGE) {
    throw new Error(`Maximum ${MAX_IMAGES_PAR_MESSAGE} images par message.`);
  }
  for (const storageId of storageIds) {
    const fichier = await ctx.storage.getMetadata(storageId as GenericId<"_storage">);
    if (!fichier) throw new Error("Image introuvable dans le stockage.");
    if (fichier.size > MAX_TAILLE_IMAGE) throw new Error("Image trop volumineuse (maximum 5 Mo).");
    if (fichier.contentType && !TYPES_IMAGE_AUTORISES.includes(fichier.contentType)) {
      throw new Error(`Format non pris en charge (${fichier.contentType}). Formats acceptés : JPEG, PNG, WebP, GIF.`);
    }
  }
  return storageIds;
}

export const getPosts = query({
  args: { categorie: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.categorie) {
      return await ctx.db.query("posts")
        .withIndex("by_categorie", (q) => q.eq("categorie", args.categorie!))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("posts").order("desc").collect();
  },
});

export const getReponses = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db.query("reponses")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("asc")
      .collect();
  },
});

export const creerPost = mutation({
  args: {
    titre: v.string(),
    contenu: v.string(),
    categorie: v.string(),
    images: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { userId, nom } = await requireAuteurForumAutorise(ctx);
    const images = await validerImages(ctx, args.images);
    return await ctx.db.insert("posts", {
      titre: args.titre,
      contenu: args.contenu,
      categorie: args.categorie,
      auteurId: userId,
      auteurNom: nom,
      epingle: false,
      createdAt: Date.now(),
      ...(images.length > 0 ? { images } : {}),
    });
  },
});

export const creerPostBySystem = mutation({
  args: {
    titre: v.string(),
    contenu: v.string(),
    categorie: v.string(),
  },
  handler: async (ctx, args) => {
    const SYSTEM_USER_ID = "system-bienvenue";
    const SYSTEM_USER_NAME = "Équipe du forum";
    return await ctx.db.insert("posts", {
      titre: args.titre,
      contenu: args.contenu,
      categorie: args.categorie,
      auteurId: SYSTEM_USER_ID,
      auteurNom: SYSTEM_USER_NAME,
      epingle: false,
      createdAt: Date.now(),
    });
  },
});

export const creerPostPublic = mutation({
  args: {
    titre: v.string(),
    contenu: v.string(),
    categorie: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("posts", {
      titre: args.titre,
      contenu: args.contenu,
      categorie: args.categorie,
      auteurId: "system-bienvenue",
      auteurNom: "Équipe du forum",
      epingle: false,
      createdAt: Date.now(),
    });
  },
});

export const repondre = mutation({
  args: {
    postId: v.id("posts"),
    contenu: v.string(),
    images: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { userId, nom } = await requireAuteurForumAutorise(ctx);
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Sujet introuvable.");
    const images = await validerImages(ctx, args.images);
    return await ctx.db.insert("reponses", {
      postId: args.postId,
      contenu: args.contenu,
      auteurId: userId,
      auteurNom: nom,
      createdAt: Date.now(),
      ...(images.length > 0 ? { images } : {}),
    });
  },
});

export const getInviteCount = query({
  args: {},
  handler: async (ctx) => {
    const invites = await ctx.db.query("forumInvites").collect();
    return invites.length;
  },
});
