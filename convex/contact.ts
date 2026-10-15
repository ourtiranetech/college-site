import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const envoyerMessage = mutation({
  args: {
    nom: v.string(),
    prenom: v.string(),
    email: v.string(),
    commentaire: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Insert into database using matching schema fields (map commentaire -> contenu if required by schema)
    const result = await ctx.db.insert("contactMessages", {
      nom: args.nom,
      prenom: args.prenom,
      email: args.email,
      contenu: args.commentaire, // Map to 'contenu' if that's what your schema expects
      createdAt: Date.now(),
    });

    // 2. Access environment variables safely
    const resendApiKey = process.env.RESEND_API_KEY ?? "";

    // ... your email sending logic using args.nom, args.prenom, args.email, args.commentaire
    return result;
  },
});