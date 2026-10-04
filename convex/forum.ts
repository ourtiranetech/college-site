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
    return await ctx.db.insert("posts", {
      ...args,
      epingle:   false,
      createdAt: Date.now(),
    })
  },
})

export const repondre = mutation({
  args: {
    postId:    v.id("posts"),
    contenu:   v.string(),
    auteurId:  v.string(),
    auteurNom: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reponses", {
      ...args,
      createdAt: Date.now(),
    })
  },
})

export const getReponses = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reponses")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("desc")
      .collect()
  },
})

export const getUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await (ctx.storage as any).getUploadUrl()
  },
})

export const uploadImage = mutation({
  args: {
    storageId:  v.string(),
    postId:     v.optional(v.id("posts")),
    reponseId:  v.optional(v.id("reponses")),
  },
  handler: async (ctx, args) => {
    if (args.postId) {
      const post = await ctx.db.get(args.postId)
      if (!post) throw new Error("Post introuvable")
      await ctx.db.patch(args.postId, {
        images: [...(post.images ?? []), args.storageId],
      })
    }
    if (args.reponseId) {
      const reponse = await ctx.db.get(args.reponseId)
      if (!reponse) throw new Error("Réponse introuvable")
      await ctx.db.patch(args.reponseId, {
        images: [...(reponse.images ?? []), args.storageId],
      })
    }
  },
})

export const getImageUrls = query({
  args: { storageIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    return await Promise.all(
      args.storageIds.map((id) => ctx.storage.getUrl(id)),
    )
  },
})