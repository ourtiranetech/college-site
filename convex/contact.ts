import { internalAction, mutation } from "./_generated/server";
import { v } from "convex/values";

// ── LIMITES ────────────────────────────────────────────────────────────────
const MAX_NOM = 80;
const MAX_PRENOM = 80;
const MAX_EMAIL = 200;
const MAX_COMMENTAIRE = 5000;
const MAX_MESSAGES_PAR_HEURE = 20;
const FENETRE_MS = 60 * 60 * 1000; // 1 heure

// Volontairement permissif : on ne rejette que ce qui n'est manifestement pas
// une adresse, pour ne pas bloquer un parent au clavier.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Enregistre un message de contact.
 *
 * Deux protections :
 *  - un champ « piège » (`siteWeb`) invisible dans le formulaire : rempli
 *    uniquement par les robots, auquel cas on ignore la soumission ;
 *  - une limitation de débit par adresse email, pour limiter le spam.
 *
 * Aucun envoi d'email ici : les mutations Convex doivent rester déterministes,
 * l'envoi est donc planifié vers une action.
 */
export const envoyerMessage = mutation({
  args: {
    nom: v.string(),
    prenom: v.string(),
    email: v.string(),
    commentaire: v.string(),
    // Champ piège anti-robot : doit rester vide côté humain.
    siteWeb: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Robot détecté : on répond « succès » sans rien enregistrer, pour ne pas
    // lui apprendre que le champ est surveillé.
    if (args.siteWeb && args.siteWeb.trim().length > 0) {
      return { ok: true };
    }

    const nom = args.nom.trim().slice(0, MAX_NOM);
    const prenom = args.prenom.trim().slice(0, MAX_PRENOM);
    const email = args.email.trim().toLowerCase().slice(0, MAX_EMAIL);
    const commentaire = args.commentaire.trim().slice(0, MAX_COMMENTAIRE);

    if (!nom || !prenom) {
      throw new Error("Le nom et le prénom sont obligatoires.");
    }
    if (!EMAIL_REGEX.test(email)) {
      throw new Error("Adresse email invalide.");
    }
    if (commentaire.length < 10) {
      throw new Error("Votre message est trop court (10 caractères minimum).");
    }

    // Limitation de débit : on regarde les messages récents de cette adresse.
    const depuis = Date.now() - FENETRE_MS;
    const recents = await ctx.db
      .query("contactMessages")
      .withIndex("by_email", q => q.eq("email", email))
      .collect();

    const dansLaFenetre = recents.filter(m => m.createdAt >= depuis).length;
    if (dansLaFenetre >= MAX_MESSAGES_PAR_HEURE) {
      throw new Error(
        "Trop de messages envoyés depuis cette adresse. Merci de réessayer dans une heure.",
      );
    }

    const id = await ctx.db.insert("contactMessages", {
      nom,
      prenom,
      email,
      contenu: commentaire,
      createdAt: Date.now(),
    });

    // Planifié : l'échec d'envoi ne remet pas en cause l'enregistrement.
    await ctx.scheduler.runAfter(0, "contact:notifierParEmail" as any, {
      nom,
      prenom,
      email,
      commentaire,
    });

    return { ok: true, id };
  },
});

/**
 * Notifie l'établissement par email via Gmail API (OAuth2).
 *
 * Identifiants : GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN.
 */
export const notifierParEmail = internalAction({
  args: {
    nom: v.string(),
    prenom: v.string(),
    email: v.string(),
    commentaire: v.string(),
  },
  handler: async (_ctx, args) => {
    const clientId = process.env.GMAIL_CLIENT_ID ?? "";
    const clientSecret = process.env.GMAIL_CLIENT_SECRET ?? "";
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN ?? "";

    if (!clientId || !clientSecret || !refreshToken) {
      console.warn("Identifiants Gmail manquants : email non envoyé.");
      return { envoye: false };
    }

    try {
      // 1. Refresh token → access token frais
      const tokenReponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
        }),
      });
      if (!tokenReponse.ok) {
        const detail = await tokenReponse.text();
        console.error("refresh_token échoué :", detail);
        return { envoye: false, raison: `HTTP ${tokenReponse.status}` };
      }
      const { access_token } = await tokenReponse.json() as { access_token: string };
      if (!access_token) return { envoye: false, raison: "pas de token" };

      // 2. Construire l'email MIME
      const texte = [
        `Nouveau message depuis le site du collège.`,
        ``,
        `Nom     : ${args.prenom} ${args.nom}`,
        `Email   : ${args.email}`,
        ``,
        `Message :`,
        args.commentaire,
      ].join("\n");
      const date = new Date().toUTCString();
      const mime = [
        "From: cemazouaouamrane <cemazouaouamrane@gmail.com>",
        "To: cemazouaouamrane <cemazouaouamrane@gmail.com>",
        `Subject: Contact site — ${args.prenom} ${args.nom}`,
        `Date: ${date}`,
        "MIME-Version: 1.0",
        "Content-Type: text/plain; charset=UTF-8",
        "",
        texte,
      ].join("\r\n");
      const raw = Buffer.from(mime).toString("base64url");

      // 3. Envoyer via Gmail API
      const reponse = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ raw }),
        },
      );
      if (!reponse.ok) {
        const detail = await reponse.text();
        console.error(`Gmail HTTP ${reponse.status} : ${detail}`);
        return { envoye: false, raison: `HTTP ${reponse.status}` };
      }
      return { envoye: true };
    } catch (erreur) {
      console.error("Échec Gmail :", erreur);
      return { envoye: false, raison: "exception" };
    }
  },
});