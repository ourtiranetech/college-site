import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getMessages = query({
  args: { salle: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_salle", (q) => q.eq("salle", args.salle))
      .order("desc")
      .take(100);
  },
});

export const envoyerMessage = mutation({
  args: {
    auteur:   v.string(),
    auteurId: v.string(),
    contenu:  v.string(),
    salle:    v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      ...args,
      createdAt: Date.now(),
    });
  },
});