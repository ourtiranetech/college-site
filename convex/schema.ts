import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Limite partagée entre le backend et l'interface : le front l'importe pour
 * bloquer la sélection au-delà du maximum autorisé par `validerImages`.
 */
export const MAX_IMAGES_PAR_MESSAGE = 5;

export default defineSchema({
  ...authTables,

  // ── CHAT EN DIRECT ─────────────────────────────
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  }).index("email", ["email"]),

  messages: defineTable({
    auteur:    v.string(),
    auteurId:  v.string(),
    contenu:   v.string(),
    salle:     v.string(),
    createdAt: v.number(),
  }).index("by_salle", ["salle", "createdAt"]),

  // ── CONTACT ─────────────────────────────────────
  contactMessages: defineTable({
    nom:       v.string(),
    prenom:    v.string(),
    email:     v.string(),
    contenu:   v.string(),
    createdAt: v.number(),
  })
    .index("by_date", ["createdAt"])
    // Utilisé par la limitation de débit du formulaire de contact.
    .index("by_email", ["email"]),

  // ── FORUM ──────────────────────────────────────
  posts: defineTable({
    titre:     v.string(),
    contenu:   v.string(),
    auteurId:  v.string(),
    auteurNom: v.string(),
    categorie: v.string(),
    epingle:   v.boolean(),
    createdAt: v.number(),
    images:    v.optional(v.array(v.string())),
  })
    .index("by_categorie", ["categorie"])
    .index("by_date", ["createdAt"]),

  reponses: defineTable({
    postId:    v.id("posts"),
    contenu:   v.string(),
    auteurId:  v.string(),
    auteurNom: v.string(),
    createdAt: v.number(),
    images:    v.optional(v.array(v.string())),
  }).index("by_post", ["postId"]),

  // ── PERSONNEL ──────────────────────────────────
  personnel: defineTable({
    nom:        v.string(),
    prenom:     v.string(),
    poste:      v.string(),
    matiere:    v.optional(v.string()),
    email:      v.string(),
    photo:      v.optional(v.string()),
    biographie: v.optional(v.string()),
    type:       v.union(
      v.literal("pedagogique"),
      v.literal("entretien")
    ),
  }),

  // ── ACTUALITÉS ─────────────────────────────────
  actualites: defineTable({
    titre:     v.string(),
    contenu:   v.string(),
    date:      v.string(),
    important: v.boolean(),
    categorie: v.string(),
  }),

  // ── DOCUMENTS ──────────────────────────────────
  documents: defineTable({
    titre:       v.string(),
    description: v.string(),
    url:         v.string(),
    categorie:   v.string(),
    classeId:    v.optional(v.string()),
    createdAt:   v.number(),
  }),

  // ── FORUM : INVITÉS ────────────────────────────
  // Un « invité » est un visiteur non connecté. Une ligne par visiteur : la
  // déduplication se fait sur une clé conservée dans le navigateur, pour que le
  // compteur ne gonfle pas à chaque rechargement de page.
  forumInvites: defineTable({
    inviteKey: v.string(),
    premierVu: v.number(),
    dernierVu:  v.number(),
    visites:    v.number(),
  }).index("by_inviteKey", ["inviteKey"]),
});