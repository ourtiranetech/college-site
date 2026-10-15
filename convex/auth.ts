import Google from "@auth/core/providers/google";
import GitHub from "@auth/core/providers/github";
import { convexAuth } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google, GitHub],
});

// Query pour récupérer l'identité de l'utilisateur connecté
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    return identity;
  },
});