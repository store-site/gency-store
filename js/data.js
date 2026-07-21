/*
  GENCY STORE — couche de données (Firestore)
  ---------------------------------------------
  Modèle de données attendu :

  Collection "categories" → champs : nom (texte), desc (texte)

  Collection "arrivages" → champs :
    num (texte — identifiant, ex "01"), nom (texte), date (texte),
    video (texte — URL directe de LA vidéo de cet arrivage, ou vide)

  Collection "pieces" → champs :
    nom (texte), prix (nombre, FCFA), description (texte),
    categorie (texte — doit correspondre exactement au "nom" d'une catégorie),
    arrivage (texte — doit correspondre exactement au "num" d'un arrivage),
    tailles (tableau de textes, ex: ["S","M","L"]),
    couleurs (tableau de textes, ex: ["Rose","Noir"]),
    stock (nombre — quantité disponible),
    photos (tableau d'URLs d'images)

  Chaque fonction retourne les documents avec leur "id" Firestore inclus,
  pour pouvoir lier vers la fiche article (piece.html?id=...) ou éditer
  un arrivage depuis l'admin.
*/

function getArrivages() {
  return db
    .collection("arrivages")
    .orderBy("num")
    .get()
    .then((snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

function getPieces(limit) {
  let query = db.collection("pieces");
  if (limit) query = query.limit(limit);
  return query.get().then((snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

function getPiecesByCategory(categorie) {
  return db
    .collection("pieces")
    .where("categorie", "==", categorie)
    .get()
    .then((snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

function getPiece(id) {
  return db
    .collection("pieces")
    .doc(id)
    .get()
    .then((doc) => (doc.exists ? { id: doc.id, ...doc.data() } : null));
}

function getCategories() {
  return db
    .collection("categories")
    .get()
    .then((snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

// La FAQ reste du contenu éditorial fixe, pas besoin de Firestore pour ça.
const FAQ = [
  { q: "Comment se passe le paiement ?", a: "À la livraison ou par transfert Mobile Money — à confirmer avec Gency au moment de la commande." },
  { q: "Quels sont les délais de livraison ?", a: "Variables selon la zone. Le délai exact est communiqué sur WhatsApp après confirmation de la commande." },
  { q: "Les tailles sont-elles précisées ?", a: "Oui, chaque pièce a une taille indiquée. En cas de doute, on peut prendre vos mesures avant de valider." },
  { q: "Peut-on échanger une pièce ?", a: "À voir au cas par cas directement avec Gency sur WhatsApp." },
];

function getFAQ() {
  return Promise.resolve(FAQ);
}
