/*
  GENCY STORE — espace admin
  -----------------------------
  Connexion : un seul compte Firebase caché (email fixe ci-dessous),
  la page ne demande qu'un mot de passe à l'écran.

  Upload : Cloudinary, upload preset non-signé "gency-store-admin"
  (aucune clé secrète nécessaire côté navigateur).
*/

const ADMIN_EMAIL = "stellayathe@gmail.com";
const CLOUD_NAME = "myatymaz";
const UPLOAD_PRESET = "gency-store-admin";

// ---------- CONNEXION ----------

const loginScreen = document.getElementById("login-screen");
const adminScreen = document.getElementById("admin-screen");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loginError.textContent = "";
  const password = document.getElementById("password-input").value;
  firebase
    .auth()
    .signInWithEmailAndPassword(ADMIN_EMAIL, password)
    .catch(() => {
      loginError.textContent = "Mot de passe incorrect.";
    });
});

logoutBtn.addEventListener("click", () => firebase.auth().signOut());

firebase.auth().onAuthStateChanged((user) => {
  if (user && user.email === ADMIN_EMAIL) {
    loginScreen.style.display = "none";
    adminScreen.style.display = "block";
    initAdmin();
  } else {
    loginScreen.style.display = "flex";
    adminScreen.style.display = "none";
  }
});

// ---------- UPLOAD CLOUDINARY ----------

function uploadToCloudinary(file, resourceType) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  return fetch(url, { method: "POST", body: formData })
    .then((res) => res.json())
    .then((data) => {
      if (!data.secure_url) throw new Error(data.error?.message || "Échec de l'envoi");
      return data.secure_url;
    });
}

// ---------- INITIALISATION (une seule fois après connexion) ----------

let adminInitialized = false;

function initAdmin() {
  if (adminInitialized) return;
  adminInitialized = true;
  loadCategoriesIntoSelect();
  refreshPiecesList();
  refreshCategoriesList();
  refreshArrivagesList();
  wirePieceForm();
  wireCategoryForm();
  wireArrivageForm();
}

// ---------- CATEGORIES : select du formulaire pièce ----------

function loadCategoriesIntoSelect() {
  const select = document.getElementById("piece-categorie");
  getCategories().then((cats) => {
    select.innerHTML = cats.map((c) => `<option value="${c.nom}">${c.nom}</option>`).join("");
  });
}

function refreshCategoriesList() {
  getCategories().then((cats) => {
    const el = document.getElementById("categories-admin-list");
    el.innerHTML = cats
      .map(
        (c) => `<div class="admin-row">
          <span>${c.nom} <span class="admin-row__muted">— ${c.desc || ""}</span></span>
          <button class="admin-row__delete" data-id="${c.id}" data-type="categories">Supprimer</button>
        </div>`
      )
      .join("");
    wireDeleteButtons();
  });
}

function wireCategoryForm() {
  document.getElementById("category-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const nom = document.getElementById("cat-nom").value.trim();
    const desc = document.getElementById("cat-desc").value.trim() || "à venir";
    if (!nom) return;
    db.collection("categories")
      .add({ nom, desc })
      .then(() => {
        document.getElementById("category-form").reset();
        loadCategoriesIntoSelect();
        refreshCategoriesList();
      });
  });
}

// ---------- ARRIVAGES ----------

function refreshArrivagesList() {
  getArrivages().then((arrivages) => {
    const el = document.getElementById("arrivages-admin-list");
    el.innerHTML = arrivages
      .map(
        (a) => `<div class="admin-row">
          <span>${a.num} — ${a.nom} <span class="admin-row__muted">(${a.date})</span></span>
          <button class="admin-row__delete" data-id="${a.id}" data-type="arrivages">Supprimer</button>
        </div>`
      )
      .join("");
    wireDeleteButtons();
  });
}

function wireArrivageForm() {
  document.getElementById("arrivage-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const num = document.getElementById("arr-num").value.trim();
    const nom = document.getElementById("arr-nom").value.trim();
    const date = document.getElementById("arr-date").value.trim() || "à venir";
    if (!num || !nom) return;
    db.collection("arrivages")
      .add({ num, nom, date })
      .then(() => {
        document.getElementById("arrivage-form").reset();
        refreshArrivagesList();
      });
  });
}

// ---------- PIECES ----------

let editingPieceId = null;
let pendingPhotos = [];
let pendingVideo = null;

function refreshPiecesList() {
  getPieces().then((pieces) => {
    const el = document.getElementById("pieces-admin-list");
    el.innerHTML = pieces
      .map(
        (p) => `<div class="admin-row">
          <span>${p.nom} <span class="admin-row__muted">— ${p.prix} FCFA · ${p.categorie || "sans catégorie"} · stock ${p.stock ?? "?"}</span></span>
          <span>
            <button class="admin-row__edit" data-id="${p.id}">Modifier</button>
            <button class="admin-row__delete" data-id="${p.id}" data-type="pieces">Supprimer</button>
          </span>
        </div>`
      )
      .join("");
    wireDeleteButtons();
    el.querySelectorAll(".admin-row__edit").forEach((btn) => {
      btn.addEventListener("click", () => loadPieceIntoForm(btn.dataset.id));
    });
  });
}

function loadPieceIntoForm(id) {
  getPiece(id).then((p) => {
    if (!p) return;
    editingPieceId = id;
    document.getElementById("piece-form-title").textContent = "Modifier l'article";
    document.getElementById("piece-nom").value = p.nom || "";
    document.getElementById("piece-prix").value = p.prix || "";
    document.getElementById("piece-description").value = p.description || "";
    document.getElementById("piece-categorie").value = p.categorie || "";
    document.getElementById("piece-tailles").value = (p.tailles || []).join(", ");
    document.getElementById("piece-couleurs").value = (p.couleurs || []).join(", ");
    document.getElementById("piece-stock").value = p.stock ?? 0;
    pendingPhotos = p.photos || [];
    pendingVideo = p.video || null;
    renderMediaPreview();
    document.getElementById("piece-form").scrollIntoView({ behavior: "smooth" });
  });
}

function renderMediaPreview() {
  const el = document.getElementById("media-preview");
  const photosHtml = pendingPhotos
    .map((url, i) => `<div class="media-thumb"><img src="${url}"><button type="button" data-i="${i}" class="media-thumb__remove">×</button></div>`)
    .join("");
  const videoHtml = pendingVideo
    ? `<div class="media-thumb media-thumb--video"><video src="${pendingVideo}" muted></video><button type="button" id="remove-video" class="media-thumb__remove">×</button></div>`
    : "";
  el.innerHTML = photosHtml + videoHtml;
  el.querySelectorAll(".media-thumb__remove[data-i]").forEach((btn) => {
    btn.addEventListener("click", () => {
      pendingPhotos.splice(Number(btn.dataset.i), 1);
      renderMediaPreview();
    });
  });
  const removeVideoBtn = document.getElementById("remove-video");
  if (removeVideoBtn) removeVideoBtn.addEventListener("click", () => { pendingVideo = null; renderMediaPreview(); });
}

function resetPieceForm() {
  editingPieceId = null;
  pendingPhotos = [];
  pendingVideo = null;
  document.getElementById("piece-form-title").textContent = "Ajouter un article";
  document.getElementById("piece-form").reset();
  renderMediaPreview();
}

function wirePieceForm() {
  const photoInput = document.getElementById("piece-photos-input");
  const videoInput = document.getElementById("piece-video-input");
  const uploadStatus = document.getElementById("upload-status");

  photoInput.addEventListener("change", async (e) => {
    const files = Array.from(e.target.files);
    uploadStatus.textContent = "Envoi des photos en cours…";
    try {
      for (const file of files) {
        const url = await uploadToCloudinary(file, "image");
        pendingPhotos.push(url);
        renderMediaPreview();
      }
      uploadStatus.textContent = "";
    } catch (err) {
      uploadStatus.textContent = "Erreur d'envoi photo : " + err.message;
    }
    photoInput.value = "";
  });

  videoInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    uploadStatus.textContent = "Envoi de la vidéo en cours… (peut prendre un moment)";
    try {
      pendingVideo = await uploadToCloudinary(file, "video");
      renderMediaPreview();
      uploadStatus.textContent = "";
    } catch (err) {
      uploadStatus.textContent = "Erreur d'envoi vidéo : " + err.message;
    }
    videoInput.value = "";
  });

  document.getElementById("piece-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      nom: document.getElementById("piece-nom").value.trim(),
      prix: Number(document.getElementById("piece-prix").value) || 0,
      description: document.getElementById("piece-description").value.trim(),
      categorie: document.getElementById("piece-categorie").value,
      tailles: document.getElementById("piece-tailles").value.split(",").map((s) => s.trim()).filter(Boolean),
      couleurs: document.getElementById("piece-couleurs").value.split(",").map((s) => s.trim()).filter(Boolean),
      stock: Number(document.getElementById("piece-stock").value) || 0,
      photos: pendingPhotos,
      video: pendingVideo,
    };
    if (!data.nom || !data.categorie) return;

    const save = editingPieceId
      ? db.collection("pieces").doc(editingPieceId).set(data)
      : db.collection("pieces").add(data);

    save.then(() => {
      resetPieceForm();
      refreshPiecesList();
    });
  });

  document.getElementById("piece-form-cancel").addEventListener("click", resetPieceForm);
}

// ---------- SUPPRESSION (générique) ----------

function wireDeleteButtons() {
  document.querySelectorAll(".admin-row__delete").forEach((btn) => {
    btn.onclick = () => {
      if (!confirm("Supprimer définitivement ?")) return;
      db.collection(btn.dataset.type)
        .doc(btn.dataset.id)
        .delete()
        .then(() => {
          if (btn.dataset.type === "pieces") refreshPiecesList();
          if (btn.dataset.type === "categories") { refreshCategoriesList(); loadCategoriesIntoSelect(); }
          if (btn.dataset.type === "arrivages") refreshArrivagesList();
        });
    };
  });
}
