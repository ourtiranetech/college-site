// /// <reference types="node" />

// export default {
//   providers: [
//     {
//       type: "google",
//       clientId: process.env.GOOGLE_CLIENT_ID || "",
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
//       callbackUrl: "/_convex/auth/callback/google",
//       // @ts-ignore
//       async profile(client) {
//         const ticket = await client.verifyIdToken();
//         const payload = ticket.getPayload();
//         if (!payload?.email || !payload?.sub) throw new Error("Identité invalide");
//         return {
//           userId: payload.sub,
//           email: payload.email,
//           email_verified: payload.email_verified ?? false,
//           nom: payload.name || payload.email.split("@")[0] || "Utilisateur",
//           avatar: payload.picture || null,
//         };
//       },
//     },
//     {
//       type: "github",
//       clientId: process.env.GITHUB_CLIENT_ID || "",
//       clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
//       callbackUrl: "/_convex/auth/callback/github",
//       // @ts-ignore
//       async profile(client) {
//         try {
//           const res = await client.getToken();
//           const { tokens } = await client.getAccessTokenInfo(res.data?.code || "");
//           const { login } = await client.octokit.rest.users.getAuthenticated({
//             ...tokens,
//           });
//           return {
//             userId: login,
//             email: null,
//             nom: login,
//             avatar: null,
//           };
//         } catch {
//           return {
//             userId: "github_user",
//             email: null,
//             nom: "GitHub",
//             avatar: null,
//           };
//         }
//       },
//     },
//   ],
// };

///
/// 


/// 


/// 

/// <reference types="node" />

export default {
  providers: [
    {
      name: "google",
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackUrl: "/_convex/auth/callback/google",
    },
    {
      name: "github",
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      callbackUrl: "/_convex/auth/callback/github",
    },
  ],
};


