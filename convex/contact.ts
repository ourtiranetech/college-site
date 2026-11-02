import { internalAction, mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// ── LIMITES ────────────────────────────────────────────────────────────────
const MAX_NOM = 80;
const MAX_PRENOM = 80;
const MAX_EMAIL = 200;
const MAX_COMMENTAIRE = 5000;
const MAX_MESSAGES_PAR_HEURE = 20;
const FENETRE_MS = 60 * 60 * 1000; // 1 heure

const ADRESSE_DESTINATAIRE = "ourtiranetech@gmail.com";

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
      .withIndex("by_email", (q) => q.eq("email", email))
      .collect();

    const dansLaFenetre = recents.filter((m) => m.createdAt >= depuis).length;
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
    await ctx.scheduler.runAfter(0, internal.contact.notifierParEmail, {
      nom,
      prenom,
      email,
      commentaire,
    });

    return { ok: true, id };
  },
});

/**
 * Notifie l'établissement par email via Resend.
 *
 * Si `RESEND_API_KEY` n'est pas configurée, on se contente d'un avertissement :
 * le message reste consultable dans la table `contactMessages`.
 */
export const notifierParEmail = internalAction({
  args: {
    nom: v.string(),
    prenom: v.string(),
    email: v.string(),
    commentaire: v.string(),
  },
  handler: async (_ctx, args) => {
    // @ts-ignore : `process.env` est disponible dans le runtime Convex.
    const cle = process.env.RESEND_API_KEY ?? "";
    // @ts-ignore
    const expediteur = process.env.RESEND_FROM ?? "onboarding@resend.dev";

    if (!cle) {
      console.warn(
        "RESEND_API_KEY absente : message de contact enregistré mais non envoyé par email.",
      );
      return { envoye: false, raison: "RESEND_API_KEY manquante" };
    }

    try {
      const reponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cle}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: expediteur,
          to: [ADRESSE_DESTINATAIRE],
          reply_to: args.email,
          subject: `Contact site — ${args.prenom} ${args.nom}`,
          text: [
            `Nouveau message depuis le site du collège.`,
            ``,
            `Nom      : ${args.prenom} ${args.nom}`,
            `Email    : ${args.email}`,
            ``,
            `Message :`,
            args.commentaire,
          ].join("\n"),
        }),
      });

      if (!reponse.ok) {
        const detail = await reponse.text();
        console.error(`Resend a répondu ${reponse.status} : ${detail}`);
        return { envoye: false, raison: `HTTP ${reponse.status}` };
      }

      return { envoye: true };
    } catch (erreur) {
      // Une panne d'email ne doit jamais faire échouer la soumission.
      console.error("Échec de l'envoi Resend :", erreur);
      return { envoye: false, raison: "exception" };
    }
  },
});

/** Suppression de `testerEmail` : c'était une action publique qui permettait
 * d'envoyer des emails depuis n'importe quel client, sans authentification.
 * L'envoi reste possible via le formulaire de contact, avec les protections
 * anti-bot et limite de débit existantes. */
