/*
  GENCY STORE — rendu partagé
  ----------------------------
  Fonctions de rendu communes à toutes les pages, + petits utilitaires
  (année du footer, mise en avant du lien de nav actif).
*/

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

function renderPieceGrid(el, pieces) {
  el.innerHTML = pieces
    .map(
      (p) => `
    <div class="arrivage-card">
      ${
        p.video
          ? `<video class="arrivage-card__swatch" src="${p.video}" controls muted loop playsinline preload="metadata"></video>`
          : `<div class="arrivage-card__swatch">photo à venir</div>`
      }
      <p class="arrivage-card__name">${p.nom}</p>
      <p class="arrivage-card__price">${p.prix}</p>
    </div>`
    )
    .join("");
}

function renderCategoryList(el, categories) {
  el.innerHTML = categories
    .map(
      (c) => `
    <a href="https://wa.me/2250101580310?text=${encodeURIComponent(
      "Bonjour, je cherche des pièces dans la catégorie " + c.nom
    )}" target="_blank" rel="noopener">
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
