# Gency Store — site (multi-pages)

Site statique (HTML/CSS/JS, sans framework) pour Gency Store, friperie
femme en ligne en Côte d'Ivoire. Pensé pour être simple à héberger sur
GitHub Pages aujourd'hui, et à faire évoluer vers Firestore demain —
sur le même principe que le Hub ICN Junior Conseil.

**⚠️ Important** : garde tout le dossier ensemble (ne déplace pas un
fichier `.html` tout seul). Chaque page a besoin de `css/style.css` et
des fichiers dans `js/` à côté d'elle pour s'afficher correctement.

## Structure

```
gency-store/
├── index.html          Accueil
├── arrivages.html       Journal complet des arrivages
├── categories.html      Toutes les catégories
├── commander.html       Comment commander + FAQ
├── contact.html         Contact (WhatsApp, Instagram, TikTok)
├── css/style.css        identité visuelle (ivoire / rosé / noir, Cormorant Garamond + Jost)
├── js/data.js            TOUT le contenu modifiable (arrivages, pièces, catégories, FAQ)
├── js/render.js          fonctions d'affichage communes à toutes les pages
└── assets/logo.png       logo Gency Store
```

## Modifier le contenu (aujourd'hui, sans Firestore)

Tout se passe dans `js/data.js` : les tableaux `ARRIVAGES`, `PIECES`,
`CATEGORIES`, `FAQ`. Modifier ces tableaux met à jour toutes les pages
qui les utilisent — pas besoin de toucher au HTML.

Pour de vraies photos : remplacer le bloc `.arrivage-card__swatch`
(actuellement le texte "photo à venir") par une balise `<img>` pointant
vers une image placée dans `assets/`.

## Héberger sur GitHub Pages (gratuit)

1. Crée un dépôt GitHub (ex : `gency-store`) et pousse ce dossier dedans.
2. **Settings → Pages → Source : branche `main`, dossier `/root`**.
3. Le site est en ligne à `https://<utilisateur>.github.io/gency-store/`.
4. Pour un nom de domaine perso (ex : `gencystore.com`) : l'acheter chez
   un registrar (OVH, Namecheap...), puis dans **Settings → Pages**
   renseigner le domaine et suivre les instructions DNS de GitHub.

## Étape suivante : Firestore

Le fichier `js/data.js` expose exprès des fonctions asynchrones —
`getArrivages()`, `getPieces()`, `getCategories()`, `getFAQ()` — qui
retournent aujourd'hui les tableaux statiques via `Promise.resolve()`.

Pour brancher Firestore (comme sur le Hub ICN JC) :

1. Créer un projet Firebase, activer Firestore.
2. Créer les collections `arrivages`, `pieces`, `categories` avec les
   mêmes champs que les objets actuels.
3. Dans `js/data.js`, remplacer uniquement le CORPS de chaque fonction
   `get...()` par un `getDocs(collection(db, "..."))`, en gardant la
   même forme de retour. Aucune page HTML n'a besoin de changer :
   `render.js` et les pages appellent déjà ces fonctions de façon
   asynchrone.
4. Ajouter une mini interface admin (ou réutiliser celle du Hub) pour
   créer des documents sans passer par la console Firebase.
