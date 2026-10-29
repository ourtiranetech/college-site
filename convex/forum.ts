import { query, mutation } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { GenericId } from "convex/values";
import { MAX_IMAGES_PAR_MESSAGE } from "./schema";

// ── LIMITES DE TÉLÉVERSEMENT ───────────────────────────────────────────────
export const MAX_TAILLE_IMAGE = 5 * 1024 * 1024; // 5 Mo
const TYPES_IMAGE_AUTORISES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

/**
 * Récupère l'utilisateur connecté côté serveur.
 *
 * L'identité n'est JAMAIS acceptée en argument : elle est toujours dérivée du
 * jeton de session. Un client ne peut donc pas se faire passer pour quelqu'un
 * d'autre en envoyant un autre auteurId.
 */
async function requireUtilisateur(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Vous devez être connecté pour effectuer cette action.");
  }

  const utilisateur = await ctx.db.get(userId);
  if (!utilisateur) {
    throw new Error("Utilisateur introuvable.");
  }

  // `name` n'est renseigné qu'à l'inscription : on retombe sur l'email.
  const nom = utilisateur.name?.trim() || utilisateur.email?.trim();
  if (!nom) {
    throw new Error("Votre profil ne contient ni nom ni email.");
  }

  return { userId, nom };
}

const EMAIL_AUTORISE_FORUM = "cemazouaouamrane@gmail.com";

async function requireAuteurForumAutorise(
  ctx: QueryCtx | MutationCtx,
): Promise<{ userId: GenericId<"users">; nom: string }> {
  const { userId, nom } = await requireUtilisateur(ctx);

  const utilisateur = await ctx.db.get(userId);
  const email = utilisateur?.email?.trim().toLowerCase();
  if (!email || email !== EMAIL_AUTORISE_FORUM) {
    throw new Error(
      "Seul le compte autorisé peut publier sur le forum pour le moment."
    );
  }

  return { userId, nom };
}

/**
 * Vérifie que chaque identifiant de stockage correspond bien à une image
 * réellement téléversée, dans la limite de taille et de type autorisés.
 *
 * Aucune écriture n'a lieu avant la fin de toutes les vérifications : si une
 * seule image est invalide, rien n'est créé.
 */
async function validerImages(
  ctx: MutationCtx,
  storageIds: string[] | undefined,
): Promise<string[]> {
  if (!storageIds || storageIds.length === 0) return [];

  if (storageIds.length > MAX_IMAGES_PAR_MESSAGE) {
    throw new Error(
      `Maximum ${MAX_IMAGES_PAR_MESSAGE} images par message.`,
    );
  }

  for (const storageId of storageIds) {
    // Le validateur de schéma stocke ces valeurs en `string`, alors que l'API
    // stockage attend un `Id<"_storage">` : la conversion est nécessaire.
    const fichier = await ctx.storage.getMetadata(
      storageId as GenericId<"_storage">,
    );

    if (!fichier) {
      throw new Error("Image introuvable dans le stockage.");
    }
    if (fichier.size > MAX_TAILLE_IMAGE) {
      throw new Error("Image trop volumineuse (maximum 5 Mo).");
    }
    if (fichier.contentType && !TYPES_IMAGE_AUTORISES.includes(fichier.contentType)) {
      throw new Error(
        `Format non pris en charge (${fichier.contentType}). Formats acceptés : JPEG, PNG, WebP, GIF.`,
      );
    }
  }

  return storageIds;
}

// ── LECTURE ────────────────────────────────────────────────────────────────

export const getPosts = query({
  args: { categorie: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.categorie) {
      return await ctx.db
        .query("posts")
        .withIndex("by_categorie", (q) =>
          q.eq("categorie", args.categorie!)
        )
        .order("desc")
        .collect();
    }
    return await ctx.db.query("posts").order("desc").collect();
  },
});

export const getReponses = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reponses")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("desc")
      .collect();
  },
});

/**
 * Résout des identifiants de stockage en URLs affichables.
 *
 * `getUrl` renvoie `null` pour un fichier supprimé : ces entrées sont filtrées
 * pour que le client n'ait jamais à gérer des URLs nulles.
 */
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

// ── ÉCRITURE (identité dérivée du serveur) ─────────────────────────────────

export const creerPost = mutation({
  args: {
    titre: v.string(),
    contenu: v.string(),
    categorie: v.string(),
    images: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { userId, nom } = await requireAuteurForumAutorise(ctx);

    // Validation avant toute écriture.
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

export const repondre = mutation({
  args: {
    postId: v.id("posts"),
    contenu: v.string(),
    images: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { userId, nom } = await requireAuteurForumAutorise(ctx);

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Sujet introuvable.");
    }

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

/**
 * Renvoie une URL de téléversement, réservée aux utilisateurs connectés.
 *
 * La taille et le type ne sont pas vérifiables à ce stade : ils sont contrôlés
 * dans `creerPost` et `repondre` via `validerImages`, avant que l'image ne soit
 * réellement attachée à un message.
 *
 * Doit rester une `mutation` : `ctx.storage` n'expose `generateUploadUrl()` que
 * sur le `StorageWriter`, pas sur la lecture seule disponible dans une `query`.
 */
export const getUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUtilisateur(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

// ── INVITÉS DU FORUM ──────────────────────────────────────────────────────
// « Invité » = visiteur non connecté. Le décompte est public (il s'affiche dans
// l'en-tête du forum) mais l'écriture est idempotente grâce à `inviteKey` :
// recharger la page ne crée donc pas de nouvel invité.

const TAILLE_MAX_INVITE_KEY = 100;

export const registerInvite = mutation({
  args: { inviteKey: v.string() },
  handler: async (ctx, args) => {
    const inviteKey = args.inviteKey.trim().slice(0, TAILLE_MAX_INVITE_KEY);
    if (!inviteKey) {
      throw new Error("Clé d'invité invalide.");
    }

    // Inutile de compter un visiteur déjà connecté comme invité.
    const userId = await getAuthUserId(ctx);
    if (userId) return null;

    const existant = await ctx.db
      .query("forumInvites")
      .withIndex("by_inviteKey", (q) => q.eq("inviteKey", inviteKey))
      .unique();

    const maintenant = Date.now();

    if (existant) {
      await ctx.db.patch(existant._id, {
        dernierVu: maintenant,
        visites: existant.visites + 1,
      });
      return existant._id;
    }

    return await ctx.db.insert("forumInvites", {
      inviteKey,
      premierVu: maintenant,
      dernierVu: maintenant,
      visites: 1,
    });
  },
});

/** Nombre d'invités distincts ayant visité le forum. */
export const getInviteCount = query({
  args: {},
  handler: async (ctx) => {
    const invites = await ctx.db.query("forumInvites").collect();
    return invites.length;
  },
});
