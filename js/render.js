/*
  GENCY STORE — rendu partagé
  ----------------------------
  Fonctions de rendu communes à toutes les pages, + petits utilitaires
  (année du footer, lien de nav actif, badge panier).
*/

function fmt(n) {
  return Number(n || 0).toLocaleString("fr-FR") + " FCFA";
}

function renderLedger(el, arrivages) {
  el.innerHTML = arrivages
    .map(
      (a) => `
    <li>
      <span class="ledger__num">${a.num}</span>
      <span class="ledger__name">${a.nom}</span>
      <span class="ledger__date">${a.date}</span>
    </li>`
    )
    .join("");
}

// Aperçu (page d'accueil) — non cliquable, juste un avant-goût
function renderPieceGrid(el, pieces) {
  el.innerHTML = pieces
    .map(
      (p) => `
    <div class="arrivage-card">
      ${
        p.video
          ? `<video class="arrivage-card__swatch" src="${p.video}" muted loop playsinline preload="metadata"></video>`
          : `<div class="arrivage-card__swatch">photo à venir</div>`
      }
      <p class="arrivage-card__name">${p.nom}</p>
      <p class="arrivage-card__price">${fmt(p.prix)}</p>
    </div>`
    )
    .join("");
}

// Grille cliquable (page catégorie) — chaque carte mène à sa fiche article
function renderPieceCards(el, pieces) {
  if (pieces.length === 0) {
    el.innerHTML = `<p style="color:var(--espresso-soft)">Rien dans cette catégorie pour l'instant — reviens bientôt.</p>`;
    return;
  }
  el.innerHTML = pieces
    .map(
      (p) => `
    <a class="arrivage-card arrivage-card--link" href="piece.html?id=${p.id}">
      ${
        p.video
          ? `<video class="arrivage-card__swatch" src="${p.video}" muted loop playsinline preload="metadata"></video>`
          : `<div class="arrivage-card__swatch">photo à venir</div>`
      }
      <p class="arrivage-card__name">${p.nom}</p>
      <p class="arrivage-card__price">${fmt(p.prix)}${p.stock === 0 ? ' <span class="tag-sold">épuisé</span>' : ""}</p>
    </a>`
    )
    .join("");
}

function renderCategoryList(el, categories) {
  el.innerHTML = categories
    .map(
      (c) => `
    <a href="categorie.html?nom=${encodeURIComponent(c.nom)}">
      <span class="cat-list__name">${c.nom}</span>
      <span class="cat-list__desc">${c.desc}</span>
    </a>`
    )
    .join("");
}

function renderFAQ(el, items) {
  el.innerHTML = items
    .map(
      (f) => `
    <div class="faq__item">
      <p class="faq__q">${f.q}</p>
      <p class="faq__a">${f.a}</p>
    </div>`
    )
    .join("");
}

// Fiche article détaillée (piece.html)
function renderPieceDetail(el, p) {
  const tailles = Array.isArray(p.tailles) ? p.tailles : [];
  const couleurs = Array.isArray(p.couleurs) ? p.couleurs : [];
  const enStock = p.stock === undefined || p.stock > 0;

  el.innerHTML = `
    <div class="piece">
      <div class="piece__media">
        ${
          p.video
            ? `<video src="${p.video}" controls muted loop playsinline preload="metadata"></video>`
            : `<div class="piece__placeholder">photo à venir</div>`
        }
      </div>
      <div class="piece__info">
        <p class="eyebrow">${p.categorie || ""}</p>
        <h1 class="piece__name">${p.nom}</h1>
        <p class="piece__price">${fmt(p.prix)}</p>
        <p class="piece__desc">${p.description || ""}</p>

        ${
          tailles.length
            ? `<div class="piece__field">
                 <label for="taille-select">Taille</label>
                 <select id="taille-select">${tailles.map((t) => `<option value="${t}">${t}</option>`).join("")}</select>
               </div>`
            : ""
        }
        ${
          couleurs.length
            ? `<div class="piece__field">
                 <label for="couleur-select">Couleur</label>
                 <select id="couleur-select">${couleurs.map((c) => `<option value="${c}">${c}</option>`).join("")}</select>
               </div>`
            : ""
        }

        ${
          enStock
            ? `<button class="btn btn--primary" id="add-to-cart-btn">Ajouter au panier</button>`
            : `<p class="tag-sold tag-sold--block">Actuellement épuisé</p>`
        }
        <a href="https://wa.me/2250101580310?text=${encodeURIComponent(
          "Bonjour, une question sur : " + p.nom
        )}" class="btn btn--ghost" target="_blank" rel="noopener" style="margin-top:12px;">Une question ? Écrire sur WhatsApp</a>
      </div>
    </div>
  `;

  const btn = document.getElementById("add-to-cart-btn");
  if (btn) {
    btn.addEventListener("click", () => {
      addToCart({
        id: p.id,
        nom: p.nom,
        prix: p.prix,
        taille: tailles.length ? document.getElementById("taille-select").value : null,
        couleur: couleurs.length ? document.getElementById("couleur-select").value : null,
      });
      btn.textContent = "Ajouté ✓";
      setTimeout(() => (btn.textContent = "Ajouter au panier"), 1500);
    });
  }
}

// Panier (panier.html)
function renderCartPage(el, emptyEl) {
  const cart = readCart();
  if (cart.length === 0) {
    el.innerHTML = "";
    if (emptyEl) emptyEl.style.display = "block";
    return;
  }
  if (emptyEl) emptyEl.style.display = "none";

  el.innerHTML = cart
    .map((c, i) => {
      const details = [c.taille, c.couleur].filter(Boolean).join(" · ");
      return `
      <div class="cart-row">
        <div class="cart-row__info">
          <p class="cart-row__name">${c.nom}</p>
          ${details ? `<p class="cart-row__details">${details}</p>` : ""}
          <p class="cart-row__price">${fmt(c.prix)}</p>
        </div>
        <div class="cart-row__actions">
          <input type="number" min="1" value="${c.qty}" data-index="${i}" class="cart-row__qty">
          <button data-index="${i}" class="cart-row__remove">Retirer</button>
        </div>
      </div>`;
    })
    .join("");

  el.querySelectorAll(".cart-row__qty").forEach((input) => {
    input.addEventListener("change", (e) => {
      updateCartQty(Number(e.target.dataset.index), Number(e.target.value));
      renderCartPage(el, emptyEl);
      renderCartTotal();
    });
  });
  el.querySelectorAll(".cart-row__remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      removeFromCart(Number(e.target.dataset.index));
      renderCartPage(el, emptyEl);
      renderCartTotal();
    });
  });
}

function renderCartTotal() {
  const totalEl = document.getElementById("cart-total");
  if (totalEl) totalEl.textContent = fmt(cartTotal());
}

function initChrome() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".sidebar__nav a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === current) a.classList.add("is-active");
  });
}

initChrome();
