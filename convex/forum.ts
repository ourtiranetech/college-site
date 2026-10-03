import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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

export const creerPost = mutation({
  args: {
    titre:     v.string(),
    contenu:   v.string(),
    auteurId:  v.string(),
    auteurNom: v.string(),
    categorie: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("posts", {
      ...args,
      epingle:   false,
      createdAt: Date.now(),
    });
  },
});

export const repondre = mutation({
  args: {
    postId:    v.id("posts"),
    contenu:   v.string(),
    auteurId:  v.string(),
    auteurNom: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("reponses", {
      ...args,
      createdAt: Date.now(),
    });
  },
});