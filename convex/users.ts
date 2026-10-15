import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    
    if (userId === null) {
      return null;
    }
    
    // Spécifiez explicitement la table "users" en premier argument si requis par votre version
    return await ctx.db.get(userId);
  },
}); 