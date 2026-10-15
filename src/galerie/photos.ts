// Liste des photos de la galerie du CEM Azouaou Amrane.
//
// ── COMMENT AJOUTER VOS PHOTOS ──────────────────────────────────────────────
// 1. Déposez vos fichiers dans  public/galerie/  (formats conseillés : .jpg)
//    Nommez-les dans l'ordre : photo-01.jpg, photo-02.jpg, photo-03.jpg…
// 2. Ajoutez ici une ligne par photo, dans le même ordre, en respectant le
//    préfixe « /galerie/ » (chemin public, pas de chemin disque).
//
// Exemple :
//   export const PHOTOS: string[] = [
//     '/galerie/photo-01.jpg',
//     '/galerie/photo-02.jpg',
//   ]
//
// La mosaïque de la page Galerie affiche toujours 100 emplacements : les
// emplacements sans photo apparaissent sous forme de cadre discret numéroté.
// Dès qu'une photo est ajoutée ici, elle remplace le cadre correspondant.
//
// ── ÉTAT ACTUEL ─────────────────────────────────────────────────────────────
// Aucune photo pour l'instant : le dépôt ne contient aucun visuel du collège.
// (Les anciennes images de src/media étaient soit entièrement noires, soit des
// captures de comparatifs d'outils IA — inutilisables pour cet usage.)
// ────────────────────────────────────────────────────────────────────────────

export const PHOTOS: string[] = []

/** Nombre d'emplacements de la mosaïque. */
export const NOMBRE_EMPLACEMENTS = 100
