/*
  GENCY STORE — panier
  ----------------------
  Le panier vit dans le navigateur du client (localStorage), pas dans
  Firestore : personne n'a besoin de compte pour l'utiliser, et Gency
  ne voit rien tant que le client n'a pas cliqué sur "Valider sur
  WhatsApp" — à ce moment-là, un message pré-rempli s'ouvre avec le
  détail exact du panier (article, taille, couleur, prix, total).
*/

const CART_KEY = "gency_cart";

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(item) {
  // item: { id, nom, prix, taille, couleur }
  const cart = readCart();
  const existing = cart.find(
    (c) => c.id === item.id && c.taille === item.taille && c.couleur === item.couleur
  );
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  writeCart(cart);
}

function removeFromCart(index) {
  const cart = readCart();
  cart.splice(index, 1);
  writeCart(cart);
}

function updateCartQty(index, qty) {
  const cart = readCart();
  if (qty <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].qty = qty;
  }
  writeCart(cart);
}

function cartCount() {
  return readCart().reduce((sum, c) => sum + c.qty, 0);
}

function cartTotal() {
  return readCart().reduce((sum, c) => sum + c.qty * c.prix, 0);
}

function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  const n = cartCount();
  badge.textContent = n > 0 ? `(${n})` : "";
}

function formatFCFA(n) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

function buildWhatsAppMessage() {
  const cart = readCart();
  if (cart.length === 0) return "Bonjour, je souhaite passer une commande.";
  const lines = cart.map((c, i) => {
    const details = [c.taille ? `taille ${c.taille}` : null, c.couleur ? `couleur ${c.couleur}` : null]
      .filter(Boolean)
      .join(", ");
    return `${i + 1}. ${c.nom}${details ? " (" + details + ")" : ""} x${c.qty} — ${formatFCFA(c.prix * c.qty)}`;
  });
  lines.push("", `Total : ${formatFCFA(cartTotal())}`);
  return "Bonjour, je souhaite commander :\n" + lines.join("\n");
}

function checkoutOnWhatsApp() {
  const message = buildWhatsAppMessage();
  const url = "https://wa.me/2250101580310?text=" + encodeURIComponent(message);
  window.open(url, "_blank");
}

updateCartBadge();
