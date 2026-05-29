// ── Data ──────────────────────────────────────────────────────────────────────

const demoEvents = [
  {
    name: "Mariage de Léa & Thomas",
    code: "SP-84K2",
    type: "Mariage",
    photos: 128,
    guests: 46
  },
  {
    name: "Anniversaire de Camille",
    code: "SP-39B7",
    type: "Anniversaire",
    photos: 74,
    guests: 22
  }
];

let demoGallery = [
  { title: "Cérémonie", category: "recent", favorite: true, icon: "💍" },
  { title: "Cocktail", category: "recent", favorite: false, icon: "🥂" },
  { title: "Première danse", category: "favorite", favorite: true, icon: "🎶" },
  { title: "Famille", category: "favorite", favorite: true, icon: "👨‍👩‍👧" },
  { title: "Amis", category: "recent", favorite: false, icon: "✨" },
  { title: "Soirée", category: "recent", favorite: false, icon: "🪩" },
  { title: "Discours", category: "favorite", favorite: true, icon: "🎤" },
  { title: "Décoration", category: "recent", favorite: false, icon: "💐" }
];

const gradients = [
  ["#7c3aed", "#ec4899"],
  ["#f97316", "#f43f5e"],
  ["#06b6d4", "#3b82f6"],
  ["#10b981", "#84cc16"],
  ["#8b5cf6", "#06b6d4"],
  ["#f59e0b", "#ef4444"],
  ["#14b8a6", "#6366f1"],
  ["#db2777", "#f97316"]
];

const guestNames = [
  "Sophie M.", "Thomas L.", "Emma R.", "Lucas B.",
  "Marie C.", "Antoine D.", "Julie P.", "Marc V."
];

const uploadLabels = [
  "Photo d'invité", "Moment spontané", "Groupe d'amis",
  "Danse", "Buffet", "Photo de nuit"
];
const uploadIcons = ["🤳", "💫", "🎉", "💃", "🍰", "🌃"];

// ── DOM refs ──────────────────────────────────────────────────────────────────

const form = document.querySelector("#album-form");
const previewTitle = document.querySelector("#preview-title");
const previewMeta = document.querySelector("#preview-meta");
const albumCodeEl = document.querySelector("#album-code");
const albumLinkEl = document.querySelector("#album-link");
const copyLinkBtn = document.querySelector("#copy-link");
const toast = document.querySelector("#toast");
const galleryGrid = document.querySelector("#gallery-grid");
const addPhotoBtn = document.querySelector("#add-photo");
const exportZipBtn = document.querySelector("#export-zip");
const filterButtons = document.querySelectorAll(".filter-btn");
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#nav-links");
const statusBadge = document.querySelector("#status-badge");
const qrEventName = document.querySelector("#qr-event-name");
const uploadZone = document.querySelector("#upload-zone");
const uploadProgress = document.querySelector("#upload-progress");
const progressBar = document.querySelector("#progress-bar");
const progressLabel = document.querySelector("#progress-label");
const galleryCount = document.querySelector("#gallery-count");
const exportProgress = document.querySelector("#export-progress");
const exportBar = document.querySelector("#export-bar");
const exportLabel = document.querySelector("#export-label");
const modLog = document.querySelector("#moderation-log");
const modCount = document.querySelector("#mod-count");
const albumResult = document.querySelector(".album-result");

// ── State ─────────────────────────────────────────────────────────────────────

let currentAlbumCode = "SP----";
let currentFilter = "all";
let toastTimer = null;
let modActionCount = 0;
let isUploading = false;
let isExporting = false;

// ── Utilities ─────────────────────────────────────────────────────────────────

function generateAlbumCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "SP-";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

function createAlbumLink(code) {
  return `souvenirs-partages.fr/a/${code}`;
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomMinutes() {
  return Math.floor(Math.random() * 7) + 2;
}

// ── Gallery count helper ───────────────────────────────────────────────────────

function updateGalleryCount() {
  const visible = demoGallery.filter((item) => {
    if (currentFilter === "all") return true;
    if (currentFilter === "favorite") return item.favorite;
    return item.category === currentFilter;
  });
  const n = visible.length;
  galleryCount.textContent = n + " souvenir" + (n !== 1 ? "s" : "") + " dans cet album";
}

// ── Moderation log helper ─────────────────────────────────────────────────────

function logModerationAction(title, action) {
  modActionCount++;

  // Remove empty placeholder if present
  const emptyMsg = modLog.querySelector(".mod-empty");
  if (emptyMsg) emptyMsg.remove();

  const entry = document.createElement("div");
  entry.className = "mod-entry";
  const actionLabel = action === "hide" ? "Masquée" : action === "show" ? "Affichée" : "Supprimée";
  const actionClass = action === "delete" ? "delete" : "hide";
  entry.innerHTML = `
    <span>${title}</span>
    <span class="mod-action ${actionClass}">${actionLabel} · il y a quelques secondes</span>
  `;
  modLog.prepend(entry);

  const plural = modActionCount > 1 ? "signalements" : "signalement";
  modCount.textContent = modActionCount + " " + plural;

  // Scroll log to top
  modLog.scrollTop = 0;
}

// ── Render gallery ────────────────────────────────────────────────────────────

function renderGallery() {
  galleryGrid.innerHTML = "";

  const items = demoGallery.filter((item) => {
    if (currentFilter === "all") return true;
    if (currentFilter === "favorite") return item.favorite;
    return item.category === currentFilter;
  });

  items.forEach((item, index) => {
    const gradient = gradients[index % gradients.length];
    const author = randomFrom(guestNames);
    const mins = randomMinutes();

    const card = document.createElement("article");
    card.className = "photo-card";
    card.style.animationDelay = (index * 0.05) + "s";
    // Store the item reference for moderation actions
    card.dataset.title = item.title;

    card.innerHTML = `
      <div class="photo-visual" style="--gradient-a:${gradient[0]};--gradient-b:${gradient[1]}">
        <span aria-hidden="true">${item.icon || "📷"}</span>
      </div>
      <div class="photo-body">
        <strong>${item.title}</strong>
        <div class="photo-meta">
          <span>${item.category === "recent" ? "Récent" : "Favori"}</span>
          <span>${item.favorite ? "★" : "☆"}</span>
        </div>
        <p class="photo-author">${author} · il y a ${mins} min</p>
      </div>
      <div class="photo-actions">
        <button class="photo-action-btn hide" data-action="hide" aria-label="Masquer la photo">Masquer</button>
        <button class="photo-action-btn delete" data-action="delete" aria-label="Supprimer la photo">Supprimer</button>
      </div>
    `;

    // Moderation button handlers
    const hideBtn = card.querySelector("[data-action='hide']");
    const deleteBtn = card.querySelector("[data-action='delete']");

    hideBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isHidden = card.classList.contains("hidden-card");
      if (isHidden) {
        card.classList.remove("hidden-card");
        hideBtn.textContent = "Masquer";
        logModerationAction(item.title, "show");
      } else {
        card.classList.add("hidden-card");
        hideBtn.textContent = "Afficher";
        logModerationAction(item.title, "hide");
      }
    });

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Animate out
      card.style.transition = "opacity 0.3s, transform 0.3s";
      card.style.opacity = "0";
      card.style.transform = "scale(0.9)";

      setTimeout(() => {
        card.remove();
        // Remove from data array
        const idx = demoGallery.findIndex((g) => g.title === item.title);
        if (idx !== -1) demoGallery.splice(idx, 1);
        logModerationAction(item.title, "delete");
        updateGalleryCount();
      }, 300);
    });

    galleryGrid.appendChild(card);
  });

  updateGalleryCount();
}

// ── Album form submit ─────────────────────────────────────────────────────────

function handleAlbumSubmit(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const eventName = formData.get("eventName").trim();
  const eventType = formData.get("eventType");
  const eventDate = formData.get("eventDate");
  const ownerName = formData.get("ownerName").trim();
  const commentsEnabled = document.querySelector("#comments-enabled").checked;
  const privateGallery = document.querySelector("#private-gallery").checked;

  const newCode = generateAlbumCode();
  const link = createAlbumLink(newCode);

  // 1. Loading state
  albumResult.classList.add("loading");
  statusBadge.classList.remove("active");
  statusBadge.textContent = "Création…";

  setTimeout(() => {
    // 2. Apply result
    albumResult.classList.remove("loading");

    currentAlbumCode = newCode;

    previewTitle.textContent = eventName || "Album privé";
    previewMeta.textContent = [
      eventType,
      eventDate ? new Date(eventDate).toLocaleDateString("fr-FR") : null,
      ownerName ? `créé par ${ownerName}` : null,
      commentsEnabled ? "commentaires activés" : "sans commentaires",
      privateGallery ? "galerie privée" : "galerie ouverte"
    ].filter(Boolean).join(" · ");

    albumCodeEl.textContent = currentAlbumCode;
    albumLinkEl.textContent = link;

    // Update status badge
    statusBadge.textContent = "Album actif";
    statusBadge.classList.add("active");

    // Update QR event name
    qrEventName.textContent = eventName || "Votre événement";

    showToast("Album créé avec succès.");
  }, 1200);
}

// ── Copy link ─────────────────────────────────────────────────────────────────

async function copyAlbumLink() {
  const link = albumLinkEl.textContent;
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(link);
    }
    showToast("Lien copié.");
  } catch (error) {
    showToast("Copie impossible dans ce navigateur.");
  }
}

// ── Add fake photo (toolbar button) ──────────────────────────────────────────

function addFakePhoto() {
  const labels = ["Ambiance", "Sourires", "Table d'honneur", "Photo de groupe", "Surprise", "Fin de soirée"];
  const icons = ["📸", "😊", "🍽️", "👥", "🎁", "🌙"];
  const randomIndex = Math.floor(Math.random() * labels.length);

  demoGallery.unshift({
    title: labels[randomIndex],
    category: "recent",
    favorite: Math.random() > 0.55,
    icon: icons[randomIndex]
  });

  currentFilter = "all";
  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === "all");
  });

  renderGallery();
  showToast("Photo fictive ajoutée.");
}

// ── Upload simulation ─────────────────────────────────────────────────────────

function runUploadSimulation() {
  if (isUploading) return;

  if (currentAlbumCode === "SP----") {
    showToast("Créez d'abord un album.");
    return;
  }

  isUploading = true;
  uploadZone.classList.add("uploading");
  uploadProgress.classList.add("active");
  uploadProgress.removeAttribute("aria-hidden");

  let pct = 0;
  progressBar.style.setProperty("--progress", "0%");
  progressLabel.textContent = "0%";

  const interval = setInterval(() => {
    pct += Math.floor(Math.random() * 4) + 3; // 3-6% per step
    if (pct >= 100) pct = 100;

    progressBar.style.setProperty("--progress", pct + "%");
    progressLabel.textContent = pct + "%";

    if (pct >= 100) {
      clearInterval(interval);

      setTimeout(() => {
        // Reset UI
        uploadZone.classList.remove("uploading");
        uploadProgress.classList.remove("active");
        uploadProgress.setAttribute("aria-hidden", "true");
        progressBar.style.setProperty("--progress", "0%");
        progressLabel.textContent = "0%";
        isUploading = false;

        // Add photo to gallery
        const randomIndex = Math.floor(Math.random() * uploadLabels.length);
        demoGallery.unshift({
          title: uploadLabels[randomIndex],
          category: "recent",
          favorite: false,
          icon: uploadIcons[randomIndex]
        });

        currentFilter = "all";
        filterButtons.forEach((button) => {
          button.classList.toggle("active", button.dataset.filter === "all");
        });

        renderGallery();
        showToast("Photo uploadée par un invité !");
      }, 400);
    }
  }, 50);
}

function setupUploadZone() {
  uploadZone.addEventListener("click", runUploadSimulation);
  uploadZone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      runUploadSimulation();
    }
  });
}

// ── Export ZIP simulation ─────────────────────────────────────────────────────

function runExportSimulation() {
  if (isExporting) return;
  isExporting = true;

  exportProgress.style.display = "flex";
  exportBar.style.width = "0%";
  exportLabel.textContent = "Préparation… 0%";

  const steps = [
    { pct: 0,   label: "Préparation… 0%" },
    { pct: 20,  label: "Préparation… 20%" },
    { pct: 45,  label: "Compression des fichiers… 45%" },
    { pct: 65,  label: "Compression des fichiers… 65%" },
    { pct: 85,  label: "Finalisation… 85%" },
    { pct: 95,  label: "Finalisation… 95%" },
    { pct: 100, label: "ZIP prêt !" }
  ];

  let stepIndex = 0;
  const interval = setInterval(() => {
    stepIndex++;
    if (stepIndex >= steps.length) {
      clearInterval(interval);

      exportBar.style.width = "100%";
      exportLabel.textContent = "ZIP prêt !";

      setTimeout(() => {
        exportProgress.style.display = "none";
        exportBar.style.width = "0%";
        exportLabel.textContent = "Préparation du ZIP… 0%";
        isExporting = false;
        showToast("ZIP prêt — 47 fichiers exportés.");
      }, 1000);

      return;
    }

    const step = steps[stepIndex];
    exportBar.style.width = step.pct + "%";
    exportLabel.textContent = step.label;
  }, 290); // ~2s total over 7 steps
}

// ── Filters ───────────────────────────────────────────────────────────────────

function setupFilters() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter;
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      renderGallery();
    });
  });
}

// ── FAQ ───────────────────────────────────────────────────────────────────────

function setupFaq() {
  const faqButtons = document.querySelectorAll(".faq-question");

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const currentItem = button.closest(".faq-item");
      const isOpen = currentItem.classList.contains("open");

      document.querySelectorAll(".faq-item").forEach((item) => {
        item.classList.remove("open");
        const question = item.querySelector(".faq-question");
        question.setAttribute("aria-expanded", "false");
        question.querySelector("span").textContent = "+";
      });

      if (!isOpen) {
        currentItem.classList.add("open");
        button.setAttribute("aria-expanded", "true");
        button.querySelector("span").textContent = "–";
      }
    });
  });
}

// ── Toast buttons ─────────────────────────────────────────────────────────────

function setupToastButtons() {
  document.querySelectorAll("[data-toast]").forEach((button) => {
    button.addEventListener("click", () => {
      showToast(button.dataset.toast);
    });
  });
}

// ── Theme ─────────────────────────────────────────────────────────────────────

function setupTheme() {
  const savedTheme = localStorage.getItem("souvenirs-theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀";
    themeToggle.setAttribute("aria-label", "Activer le mode clair");
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");

    themeToggle.textContent = isDark ? "☀" : "☾";
    themeToggle.setAttribute("aria-label", isDark ? "Activer le mode clair" : "Activer le mode sombre");
    localStorage.setItem("souvenirs-theme", isDark ? "dark" : "light");

    showToast(isDark ? "Mode sombre activé." : "Mode clair activé.");
  });
}

// ── Menu ──────────────────────────────────────────────────────────────────────

function setupMenu() {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ── Live preview while typing ─────────────────────────────────────────────────

function setupLivePreview() {
  const eventNameInput = document.querySelector("#event-name");

  eventNameInput.addEventListener("input", () => {
    const value = eventNameInput.value.trim();
    if (!value || currentAlbumCode !== "SP----") return;
    previewTitle.textContent = value;
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────

form.addEventListener("submit", handleAlbumSubmit);
copyLinkBtn.addEventListener("click", copyAlbumLink);
addPhotoBtn.addEventListener("click", addFakePhoto);
exportZipBtn.addEventListener("click", runExportSimulation);

setupFilters();
setupFaq();
setupToastButtons();
setupTheme();
setupMenu();
setupLivePreview();
setupUploadZone();
renderGallery();
