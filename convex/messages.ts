import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v, type GenericId } from "convex/values";
import { paginationOptsValidator } from "convex/server";

const MAX_CONTENU = 2000;
export const MAX_MESSAGES_AFFICHES = 50;
export const MAX_TAILLE_IMAGE = 5 * 1024 * 1024; // 5 Mo
export const MAX_IMAGES_PAR_MESSAGE = 5;
const TYPES_IMAGE_AUTORISES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

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

async function validerImages(
  ctx: MutationCtx,
  storageIds: string[] | undefined,
): Promise<string[]> {
  if (!storageIds || storageIds.length === 0) return [];

  if (storageIds.length > MAX_IMAGES_PAR_MESSAGE) {
    throw new Error(`Maximum ${MAX_IMAGES_PAR_MESSAGE} images par message.`);
  }

  for (const storageId of storageIds) {
    const fichier = await ctx.storage.getMetadata(
      storageId as GenericId<"_storage">,
    );
    if (!fichier) {
      throw new Error("Image introuvable dans le stockage.");
    }
    if (fichier.size > MAX_TAILLE_IMAGE) {
      throw new Error("Image trop volumineuse (maximum 5 Mo).");
    }
    if (!TYPES_IMAGE_AUTORISES.includes(fichier.contentType ?? "")) {
      throw new Error(`Type non autorisé : ${(fichier.contentType ?? "inconnu").substring(0, 50)}.`);
    }
  }

  return storageIds;
}

export const getMessages = query({
  args: {
    salle: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { salle, paginationOpts } = args;
    return await ctx.db
      .query("messages")
      .withIndex("by_salle", (q) => q.eq("salle", salle))
      .order("desc")
      .paginate(paginationOpts);
  },
});

export const envoyerMessage = mutation({
  args: {
    contenu: v.string(),
    salle: v.string(),
    images: v.optional(v.array(v.string())),
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

    const images = await validerImages(ctx, args.images);

    return await ctx.db.insert("messages", {
      auteur: nom,
      auteurId: userId,
      contenu,
      salle,
      createdAt: Date.now(),
      ...(images.length > 0 ? { images } : {}),
    });
  },
});

export const getUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUtilisateur(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const getImageUrls = query({
  args: { storageIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    const urls = await Promise.all(
      args.storageIds.map((id) =>
        ctx.storage.getUrl(id as GenericId<"_storage">),
      ),
    );
    return urls.filter((url): url is string => url !== null);
  },
});
