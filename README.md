# Gency Store — site (multi-pages + panier + Firestore)

Site statique (HTML/CSS/JS, sans framework) pour Gency Store, friperie
femme en ligne en Côte d'Ivoire. Hébergé sur GitHub Pages, contenu géré
depuis Firestore.

**⚠️ Important** : garde tout le dossier ensemble en le poussant sur
GitHub (upload les dossiers `css/`, `js/`, `assets/` un par un si tu
utilises le glisser-déposer web, pour être sûre qu'ils partent avec
leur contenu).

## Structure

```
gency-store/
├── index.html          Accueil
├── arrivages.html       Journal complet des arrivages
├── categories.html      Liste des catégories
├── categorie.html        Tous les articles d'une catégorie (?nom=Robes)
├── piece.html             Fiche détaillée d'un article (?id=...)
├── panier.html            Panier + validation sur WhatsApp
├── commander.html         Comment commander + FAQ
├── contact.html            Contact
├── css/style.css           identité visuelle
├── js/firebase-init.js     connexion au projet Firebase "gency-store"
├── js/data.js               lecture Firestore (arrivages, pieces, categories)
├── js/cart.js                panier client (localStorage) + message WhatsApp
├── js/render.js              fonctions d'affichage
└── assets/logo.png
```

## Modèle de données Firestore

**Collection `categories`** : `nom`, `desc`

**Collection `pieces`** :
`nom`, `prix` (nombre), `description`, `categorie` (doit correspondre
exactement au `nom` d'une catégorie), `tailles` (tableau, ex `["S","M","L"]`),
`couleurs` (tableau), `stock` (nombre — 0 = épuisé, affiché comme tel),
`photos` (tableau d'URLs), `video` (URL directe ou vide)

**Collection `arrivages`** : `num`, `nom`, `date`

## Comment fonctionne le panier

Le panier vit dans le navigateur du client (pas dans Firestore) : pas de
compte nécessaire. Sur `piece.html`, "Ajouter au panier" enregistre
l'article (+ taille/couleur choisies). Sur `panier.html`, "Valider sur
WhatsApp" ouvre une conversation avec un message déjà rédigé listant
chaque article, ses détails, et le total — le reste de la commande se
termine avec Gency sur WhatsApp comme avant.

## Règles Firestore (déjà en place)

Lecture publique autorisée sur `arrivages`, `pieces`, `categories` ;
écriture bloquée côté client (le contenu est ajouté depuis la console
Firebase, ou plus tard depuis une page d'administration dédiée).

## Prochaine étape : page d'administration privée

Pas encore construite — elle demandera une vraie authentification
(Firebase Authentication) et un endroit pour héberger les photos/vidéos
uploadées (ex. Cloudinary, avec upload direct depuis le navigateur, sans
serveur). À faire une fois cette base validée.
