# Styles d'implémentation pour le site CEM Azouaou Amrane

Site bilingue FR/AR — React 19, TanStack Start, Convex, Vercel, Tazmalt (Algérie)

---

## Style 1 : Simplicité & Clarté
**Principe** : Design minimaliste, maximum de lisibilité, navigation intuitive.
**Couleurs** : Blanc, gris clair, accent vert principal (#22c55e).
**Typographie** : Sans-serif (Inter, system fonts), 16px base size.
**Bords arrondis** : 8–12px.
**Espaces** : 16px (padding), 24px (margin).
**Usage** : Parfait pour la lisibilité sur mobile, chargement rapide.
**Composants** : Cartes doubles, tableaux simples, listes propres.

```css
/* Exemple de variables CSS */
:root {
  --color-background: #ffffff;
  --color-surface: #f8faf9;
  --color-text: #1e293b;
  --color-text-secondary: #64748b;
  --color-primary: #22c55e;
  --color-primary-hover: #16a34a;
  --color-border: #e2e8f0;
  --border-radius: 12px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}
```

## Style 2 : Écolo & Communautaire
**Principe** : Design chaleureux, encourage l'engagement, orientation communautaire.
**Couleurs** : Vert émeraude (#059669), crème (#fef3c7), bleu ciel (#7dd3fc), touches orange (#f59e0b) pour les alertes.
**Typographie** : Sans-serif lisible, taille régulière, icônes colorées.
**Bords arrondis** : 12–16px.
**Espaces** : 12px (padding), 20px (margin).
**Usage** : Forum, événements, communauté, bon pour le taux d'engagement.
**Dégradés** : Arrière-plans doux, ombres légères, cartes espacées.

```css
/* Exemple de variables CSS */
:root {
  --color-background: #f0fdfa;
  --color-surface: #ecfdf5;
  --color-text: #134e4a;
  --color-text-secondary: #4a5568;
  --color-primary: #059669;
  --color-primary-hover: #047857;
  --color-accent: #f59e0b;
  --color-accent-hover: #d97706;
  --border-radius: 16px;
  --spacing-sm: 10px;
  --spacing-md: 16px;
  --spacing-lg: 20px;
}
```

## Style 3 : Moderne & Complet
**Principe** : Design riche, fonctionnel, dimensions d'entreprise.
**Couleurs** : Bleu nuit (#1e3a8a), gris sombre (#111827), accent ambre/orange (#f59e0b).
**Typographie** : Sans-serif moderne, 14–16px base.
**Bords arrondis** : 6–10px.
**Espaces** : 12px (padding), 16px (margin).
**Usage** : Administration, emploi du temps, notes, accueil complet.
**Composants** : Tableau avancé, filtres, calendrier détaillé.

```css
/* Exemple de variables CSS */
:root {
  --color-background: #0f172a;
  --color-surface: #1e293b;
  --color-text: #f8faf9;
  --color-text-secondary: #94a3b8;
  --color-primary: #1e3a8a;
  --color-primary-hover: #1e40af;
  --color-accent: #f59e0b;
  --border-radius: 8px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
}
```

## Recommandation

Pour un site scolaire bilingue (FR/AR), commencer par **Style 2** (Écolo & Communautaire) car il encourage l'engagement, puis ajuster selon les retours utilisateurs. Ce style convient particulièrement bien pour :
- Le forum (communauté)
- Le calendrier (événements scolaires)
- Les informations générales de l'établissement
- La navigation sur mobile

### Points clés à conserver
- **Bilinguisme FR/AR** : `dir="rtl"` pour l'arabe, `dir="ltr"` pour le français
- **Accessibilité** : Contrastes suffisants, tailles de texte lisibles
- **Mobile** : Dessus-noyau, touch targets ≥ 44×44px
- **Vitesse** : Charger les vues dynamiques (chat, forum) avec suspense
- **Performances** : Code-splitting, images optimisées
