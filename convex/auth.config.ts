// convex/auth.config.ts — config Auth côté Convex (format @auth/core)
import Password from "@auth/core/providers/credentials";
import Google from "@auth/core/providers/google";

export default {
  providers: [
    Password({
      id: "password",
      name: "Mot de passe",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        return {
          id: credentials.email,
          email: credentials.email,
          name: credentials.name,
          phone: credentials.phone,
          secret: credentials.password,
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
  ],
};
