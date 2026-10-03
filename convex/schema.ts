import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  // ── CHAT EN DIRECT ─────────────────────────────
  messages: defineTable({
    auteur:    v.string(),
    auteurId:  v.string(),
    contenu:   v.string(),
    salle:     v.string(),
    createdAt: v.number(),
  }).index("by_salle", ["salle", "createdAt"]),

  // ── FORUM ──────────────────────────────────────
  posts: defineTable({
    titre:     v.string(),
    contenu:   v.string(),
    auteurId:  v.string(),
    auteurNom: v.string(),
    categorie: v.string(),
    epingle:   v.boolean(),
    // Nouveau Convex 1.43.0 : timestamp de commit précis
    createdAt: v.number(),
  })
    .index("by_categorie", ["categorie"])
    .index("by_date", ["createdAt"]),

  reponses: defineTable({
    postId:    v.id("posts"),
    contenu:   v.string(),
    auteurId:  v.string(),
    auteurNom: v.string(),
    createdAt: v.number(),
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

});