/*
  GENCY STORE — couche de données
  --------------------------------
  Aujourd'hui : tableaux écrits à la main. Demain, une fois Firestore
  en place (mêmes collections : "arrivages", "pieces", "categories") :
  remplacer uniquement le CORPS de chaque fonction get...() par une
  requête getDocs(collection(db, "...")) qui retourne les mêmes formes
  d'objets. Aucune page n'a besoin de changer, elles appellent déjà
  ces fonctions de façon asynchrone.

  Le champ "video" de chaque pièce attend une URL vers une vidéo déjà
  hébergée ailleurs (lien direct .mp4 sur Firebase Storage, YouTube,
  etc.) — pas un fichier posé dans le dépôt GitHub, trop lourd pour ça.
  Laisser "video: null" tant qu'il n'y a pas de vraie vidéo : la carte
  affiche alors le placeholder "photo à venir" comme aujourd'hui.
*/

const ARRIVAGES = [
  { num: "01", nom: "Robes de soirée", date: "à venir" },
  { num: "02", nom: "Ensembles tailleur", date: "à venir" },
  { num: "03", nom: "Tops & créoles", date: "à venir" },
];

const PIECES = [
  { nom: "Robe longue fendue", prix: "3 000 FCFA", categorie: "Robes", video: null },
  { nom: "Ensemble crop top", prix: "2 500 FCFA", categorie: "Ensembles", video: null },
  { nom: "Robe bustier", prix: "1 500 FCFA", categorie: "Robes", video: null },
  { nom: "Jupe plissée", prix: "1 000 FCFA", categorie: "Pantalons & Jupes", video: null },
  { nom: "Chemisier satiné", prix: "2 000 FCFA", categorie: "Hauts & Tops", video: null },
  { nom: "Pantalon large", prix: "2 500 FCFA", categorie: "Pantalons & Jupes", video: null },
  { nom: "Sac à main structuré", prix: "1 500 FCFA", categorie: "Sacs & Accessoires", video: null },
  { nom: "Robe wax imprimée", prix: "3 500 FCFA", categorie: "Coups de cœur", video: null },
];

const CATEGORIES = [
  { nom: "Robes", desc: "à venir" },
  { nom: "Ensembles", desc: "à venir" },
  { nom: "Hauts & Tops", desc: "à venir" },
  { nom: "Pantalons & Jupes", desc: "à venir" },
  { nom: "Sacs & Accessoires", desc: "à venir" },
  { nom: "Coups de cœur", desc: "à venir" },
];

const FAQ = [
  { q: "Comment se passe le paiement ?", a: "À la livraison ou par transfert Mobile Money — à confirmer avec Gency au moment de la commande." },
  { q: "Quels sont les délais de livraison ?", a: "Variables selon la zone. Le délai exact est communiqué sur WhatsApp après confirmation de la commande." },
  { q: "Les tailles sont-elles précisées ?", a: "Oui, chaque pièce a une taille indiquée. En cas de doute, on peut prendre vos mesures avant de valider." },
  { q: "Peut-on échanger une pièce ?", a: "À voir au cas par cas directement avec Gency sur WhatsApp." },
];

function getArrivages() {
  return Promise.resolve(ARRIVAGES);
}

function getPieces(limit) {
  return Promise.resolve(limit ? PIECES.slice(0, limit) : PIECES);
}

function getCategories() {
  return Promise.resolve(CATEGORIES);
}

function getFAQ() {
  return Promise.resolve(FAQ);
}
