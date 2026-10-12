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
    const result = await ctx.db.insert("contactMessages", {
      ...args,
      createdAt: Date.now(),
    });
    return { messageId: result };
  },
});

// ── Envoi vers l'adresse mail institutionnelle ─────────
// API: Resend (https://resend.com)
// .env.local: RESEND_API_KEY=***
// LES EMAILS NE PEUVENT ETRE ENVOYES QUE D'UN SEUL DOMAINE

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export const envoyerContactEmail = mutation({
  args: {
    nom: v.string(),
    prenom: v.string(),
    email: v.string(),
    commentaire: v.string(),
  },
  handler: async (args) => {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY manquante. Ajoutez-la dans .env.local");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${RESEND_API_KEY}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Collège Azouaou Amrane <cemazouaouamrane@gmail.com>`,
        to: ["cemazouaouamrane@gmail.com"],
        subject: "[Contact] Formulaire de contact - Collège Azouaou Amrane",
        text: `
Nom : ${args.nom}
Prénom : ${args.prenom}
Email : ${args.email}
Message :
${args.commentaire}
        `,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8faf9;">
    <h2 style="color: #0F2147; margin-top: 0;">Nouveau message de contact</h2>
    <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; width: 120px;"><strong>Nom :</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${args.nom}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; width: 120px;"><strong>Prénom :</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${args.prenom}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; width: 120px;"><strong>Email :</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${args.email}</td>
      </tr>
    </table>
    <div style="background: #f0f9f5; border-left: 4px solid #47C982; padding: 15px; border-radius: 4px; margin: 15px 0;">
      <p style="margin: 0;"><strong>Message :</strong></p>
      <p style="margin: 10px 0 0 0; white-space: pre-wrap; font-size: 14px;">${args.commentaire}</p>
    </div>
    <p style="font-size: 12px; color: #666; margin-top: 20px;">
      Ce message a été envoyé via le formulaire de contact du Collège Azouaou Amrane.
    </p>
  </div>
</body>
</html>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erreur envoi email : ${response.status} ${error}`);
    }

    const result = await response.json();
    return { messageId: result.id };
  },
});
