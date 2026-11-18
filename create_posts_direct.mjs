import { ConvexHttpClient } from 'convex/browser';

const client = new ConvexHttpClient('https://agile-mockingbird-7.eu-west-1.convex.cloud');

const bienvenuePosts = [
  {
    categorie: 'personnel',
    titre: 'Bienvenue sur le forum du personnel',
    contenu: `
🟠 Bonjour à tous,

Bienvenue sur le nouveau forum de la CAE Azouaou Amrane de Tazmalt (Algérie) !
Ce forum est dédié au personnel de l'établissement.

Cette section est réservée pour :
• Échanger sur les fins d'année
• Partager des informations concernant les fonctions et les responsabilités
• Poser des questions aux collègues
• Proposer des idées d'amélioration

N'hésitez pas à participer activement !
Bienvenue dans la communauté. 🎓
    `.trim(),
  },
  {
    categorie: 'equipe-pedagogique',
    titre: 'Bienvenue sur le forum de l\'équipe pédagogique',
    contenu: `
📚 Bonjour à toutes et à tous,

Bienvenue sur le forum dédié à l'équipe pédagogique de la CAE Azouaou Amrane.

Cette section est dédiée à :
• Partager des ressources pédagogiques
• Échanger sur les méthodes de enseignement
• Discuter des programmes et des projets scolaires
• Poser des questions et obtenir de l'aide

Nous vous invitons à participer activement et à partager vos expériences.

Bonne journée 👏
    `.trim(),
  },
  {
    categorie: 'entretien',
    titre: 'Bienvenue sur le forum du personnel d\'entretien',
    contenu: `
🔧 Bonjour à toutes et à tous,

Bienvenue sur le forum dédié au personnel d'entretien de la CAE Azouaou Amrane.

Cette section est réservée pour :
• Échanger sur les travaux d'entretien
• Partager les informations concernant l'entretien des locaux
• Discuter des besoins et des priorités
• Proposer des améliorations

N'hésitez pas à participer et à faire partager vos avis.

Bienvenue dans l'équipe 👏
    `.trim(),
  },
  {
    categorie: 'administratif',
    titre: 'Bienvenue sur le forum du personnel administratif',
    contenu: `
📋 Bonjour à toutes et à tous,

Bienvenue sur le forum dédié au personnel administratif de la CAE Azouaou Amrane.

Cette section est réservée pour :
• Partager les informations administratives
• Échanger sur les documents et les procédures
• Discuter des dossiers scolaires
• Poser des questions et obtenir de l'aide

Nous vous invitons à participer activement.

Bienvenue dans l'équipe 👏
    `.trim(),
  },
  {
    categorie: 'personnel-et-eleves',
    titre: 'Bienvenue sur le forum des parents et élèves',
    contenu: `
👋 Bonjour à toutes et à tous,

Bienvenue sur le forum dédié aux parents et élèves de la CAE Azouaou Amrane.

Cette section est réservée pour :
• Échanger avec l'équipe pédagogique
• Discuter des événements scolaires
• Partager des informations et des ressources
• Poser des questions et obtenir de l'aide

Nous vous invitons à participer activement et à faire partager vos expériences.

Bienvenue dans la communauté 👨‍👩‍👧‍👦
    `.trim(),
  },
];

console.log('Préparation des posts de bienvenue...');
console.log(`Nombre de posts à créer : ${bienvenuePosts.length}`);

const results = [];
for (let i = 0; i < bienvenuePosts.length; i++) {
  const post = bienvenuePosts[i];
  try {
    const response = await client.query('forum:creerPostPublic', {
      titre: post.titre,
      contenu: post.contenu,
      categorie: post.categorie,
    });
    results.push({ success: true, post: response, index: i });
    console.log(`✅ Post "${i+1}/${bienvenuePosts.length}" créé : "${post.titre}"`);
  } catch (err) {
    results.push({ success: false, error: err.message, index: i });
    console.error(`❌ Erreur pour "${post.titre}": ${err.message}`);
  }
}

console.log('\n📊 Résumé :');
const successCount = results.filter(r => r.success).length;
console.log(`✅ ${successCount}/${results.length} posts créés avec succès.`);
if (successCount < results.length) {
  console.log('\n❌ Erreurs :');
  for (const r of results) {
    if (!r.success) {
      console.log(`  • Post ${r.index+1}: ${r.error}`);
    }
  }
}
