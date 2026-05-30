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

const videoDurations = ["0:14", "0:32", "1:05", "0:47", "0:22", "0:58"];

function assignVideoMeta(item) {
  if (!("isVideo" in item)) {
    item.isVideo = Math.random() < 0.2;
    if (item.isVideo) {
      item.duration = videoDurations[Math.floor(Math.random() * videoDurations.length)];
    }
  }
  return item;
}

let demoGallery = [
  { title: "Cérémonie", category: "recent", favorite: true, icon: "💍" },
  { title: "Cocktail", category: "recent", favorite: false, icon: "🥂" },
  { title: "Première danse", category: "favorite", favorite: true, icon: "🎶" },
  { title: "Famille", category: "favorite", favorite: true, icon: "👨‍👩‍👧" },
  { title: "Amis", category: "recent", favorite: false, icon: "✨" },
  { title: "Soirée", category: "recent", favorite: false, icon: "🪩" },
  { title: "Discours", category: "favorite", favorite: true, icon: "🎤" },
  { title: "Décoration", category: "recent", favorite: false, icon: "💐" }
].map(assignVideoMeta);

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

const liveGuestNames = ["Sophie M.", "Thomas L.", "Emma R.", "Lucas B.", "Marie C.", "Antoine D.", "Julie P."];
const livePhotoTitles = ["Selfie du groupe", "Vue panoramique", "Moment inattendu", "Les mariés !", "Table de fête", "Fin de soirée", "Coup de coeur"];
const livePhotoIcons = ["🤳", "🌅", "😄", "💕", "🍾", "🌙", "❤️"];

const sampleComments = [
  { author: "Sophie M.", text: "Trop beau ce moment ! 😍" },
  { author: "Thomas L.", text: "Super photo !" },
  { author: "Emma R.", text: "J'adore cette photo 💕" },
  { author: "Lucas B.", text: "Merci pour ce souvenir !" },
  { author: "Marie C.", text: "Magnifique ✨" },
  { author: "Antoine D.", text: "Photo du tonnerre 🎉" }
];

// Comments storage: Map<cardIndex, Array<{author, text}>>
const commentsMap = new Map();

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
const consentOverlay = document.querySelector("#consent-overlay");
const consentCheck = document.querySelector("#consent-check");
const consentAccept = document.querySelector("#consent-accept");
const consentDecline = document.querySelector("#consent-decline");
const mainEl = document.querySelector("#main");

// Dashboard DOM refs
const dashAlbumTitle = document.querySelector("#dash-album-title");
const dashAlbumMeta = document.querySelector("#dash-album-meta");
const dashStatusBadge = document.querySelector("#dash-status-badge");
const dashPhotosEl = document.querySelector("#dash-photos");
const dashVideosEl = document.querySelector("#dash-videos");
const dashGuestsEl = document.querySelector("#dash-guests");
const dashStorageEl = document.querySelector("#dash-storage");
const storageBarFill = document.querySelector(".storage-bar-fill");
const storageLabel = document.querySelector(".storage-label");
const timelineList = document.querySelector("#timeline-list");
const timelineEmpty = document.querySelector("#timeline-empty");

// Share + QR download DOM refs
const btnDownloadQR = document.querySelector("#btn-download-qr");
const shareWhatsapp = document.querySelector("#share-whatsapp");
const shareEmail = document.querySelector("#share-email");
const shareNative = document.querySelector("#share-native");
const qrCanvas = document.querySelector("#qr-canvas");

// ── State ─────────────────────────────────────────────────────────────────────

let currentAlbumCode = "SP----";
let currentAlbumName = "";
let currentFilter = "all";
let toastTimer = null;
let modActionCount = 0;
let isUploading = false;
let isExporting = false;
let liveInterval = null;

// ── Utilities ─────────────────────────────────────────────────────────────────

function generateAlbumCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "SP-";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function showToast(message, type = 'success') {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.remove('toast-success', 'toast-info', 'toast-warn', 'toast-error');
  toast.classList.add('toast-' + type);
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

// ── Count-up animation helper ─────────────────────────────────────────────────

function countUp(element, target, duration) {
  if (!element) return;
  const start = 0;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);
    element.textContent = current;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = target;
    }
  }
  requestAnimationFrame(step);
}

// ── Timeline helper ───────────────────────────────────────────────────────────

function prependTimelineEntry(icon, htmlContent, timeLabel) {
  if (!timelineList) return;

  // Hide empty state if showing
  if (timelineEmpty) timelineEmpty.style.display = "none";

  const li = document.createElement("li");
  li.className = "timeline-item";
  li.style.opacity = "0";
  li.style.transform = "translateY(-8px)";
  li.style.transition = "opacity 0.3s ease, transform 0.3s ease";

  li.innerHTML = `
    <span class="timeline-icon">${icon}</span>
    <div>
      ${htmlContent}
      <span class="timeline-time">${timeLabel || 'à l\'instant'}</span>
    </div>
  `;

  timelineList.prepend(li);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      li.style.opacity = "1";
      li.style.transform = "none";
    });
  });

  // Limit list to 20 items
  const items = timelineList.querySelectorAll(".timeline-item");
  if (items.length > 20) {
    items[items.length - 1].remove();
  }
}

// ── Gallery count helper ───────────────────────────────────────────────────────

function updateGalleryCount() {
  const visible = demoGallery.filter((item) => {
    if (currentFilter === "all") return true;
    if (currentFilter === "favorite") return item.favorite;
    if (currentFilter === "video") return item.isVideo === true;
    return item.category === currentFilter;
  });
  const n = visible.length;
  galleryCount.textContent = n + " souvenir" + (n !== 1 ? "s" : "") + " dans cet album";
}

// ── Moderation log helper ─────────────────────────────────────────────────────

function logModerationAction(title, action) {
  modActionCount++;

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

  modLog.scrollTop = 0;

  // Also update dashboard timeline
  const actionText = action === "hide" ? "a masqué" : action === "show" ? "a affiché" : "a supprimé";
  prependTimelineEntry("🛡️", `<strong>Organisateur</strong> ${actionText} : ${title}`, "à l'instant");
}

// ── Render gallery ────────────────────────────────────────────────────────────

function renderGallery() {
  galleryGrid.innerHTML = "";

  const items = demoGallery.filter((item) => {
    if (currentFilter === "all") return true;
    if (currentFilter === "favorite") return item.favorite;
    if (currentFilter === "video") return item.isVideo === true;
    return item.category === currentFilter;
  });

  items.forEach((item, index) => {
    const gradient = gradients[index % gradients.length];
    const author = randomFrom(guestNames);
    const mins = randomMinutes();

    // Initialise comments for this card if not already done
    const globalIndex = demoGallery.indexOf(item);
    const cardKey = globalIndex !== -1 ? globalIndex : index;
    if (!commentsMap.has(cardKey)) {
      const count = Math.floor(Math.random() * 3); // 0, 1, or 2
      const initialComments = [];
      const shuffled = [...sampleComments].sort(() => Math.random() - 0.5);
      for (let i = 0; i < count; i++) {
        initialComments.push(shuffled[i]);
      }
      commentsMap.set(cardKey, initialComments);
    }
    const cardComments = commentsMap.get(cardKey);

    const card = document.createElement("article");
    card.className = "photo-card" + (item.isVideo ? " is-video" : "");
    card.style.animationDelay = (index * 0.05) + "s";
    card.dataset.title = item.title;
    card.dataset.cardIndex = cardKey;

    // Build category label
    let categoryLabel;
    if (item.isVideo) {
      categoryLabel = "Vidéo";
    } else if (item.category === "recent") {
      categoryLabel = "Récent";
    } else {
      categoryLabel = "Favori";
    }

    // Duration badge for videos
    const durationBadge = item.isVideo ? `<span class="video-duration">${item.duration || "0:30"}</span>` : "";

    // Build comment items HTML
    const commentsHtml = cardComments.map(c =>
      `<div class="comment-item"><span class="comment-author">${c.author}</span><span class="comment-text">${c.text}</span></div>`
    ).join("");

    card.innerHTML = `
      <div class="photo-visual" style="--gradient-a:${gradient[0]};--gradient-b:${gradient[1]}">
        <span aria-hidden="true">${item.icon || "📷"}</span>
        ${durationBadge}
      </div>
      <div class="photo-body">
        <strong>${item.title}</strong>
        <div class="photo-meta">
          <span>${categoryLabel}</span>
          <span>${item.favorite ? "★" : "☆"}</span>
        </div>
        <p class="photo-author">${author} · il y a ${mins} min</p>
        <button class="comment-toggle" data-toggle="comments">💬 <span class="comment-count">${cardComments.length}</span> commentaire(s)</button>
      </div>
      <div class="photo-comments">
        <div class="comment-list">${commentsHtml}</div>
        <div class="comment-form">
          <input class="comment-input" type="text" placeholder="Ajouter un commentaire…" aria-label="Ajouter un commentaire" />
          <button class="comment-submit" type="button">Envoyer</button>
        </div>
      </div>
      <div class="photo-actions">
        <button class="photo-action-btn hide" data-action="hide" aria-label="Masquer la photo">Masquer</button>
        <button class="photo-action-btn delete" data-action="delete" aria-label="Supprimer la photo">Supprimer</button>
      </div>
    `;

    // Moderation buttons
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
      card.style.transition = "opacity 0.3s, transform 0.3s";
      card.style.opacity = "0";
      card.style.transform = "scale(0.9)";

      setTimeout(() => {
        card.remove();
        const idx = demoGallery.findIndex((g) => g.title === item.title);
        if (idx !== -1) demoGallery.splice(idx, 1);
        logModerationAction(item.title, "delete");
        updateGalleryCount();
      }, 300);
    });

    // Comment toggle button
    const commentToggle = card.querySelector("[data-toggle='comments']");
    commentToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      card.classList.toggle("comments-open");
    });

    // Comment form submit
    const commentInput = card.querySelector(".comment-input");
    const commentSubmit = card.querySelector(".comment-submit");
    const commentList = card.querySelector(".comment-list");
    const commentCount = card.querySelector(".comment-count");

    commentSubmit.addEventListener("click", (e) => {
      e.stopPropagation();
      const text = commentInput.value.trim();
      if (!text) return;

      const newComment = { author: "Vous", text };
      cardComments.push(newComment);

      const newItem = document.createElement("div");
      newItem.className = "comment-item";
      newItem.innerHTML = `<span class="comment-author">Vous</span><span class="comment-text">${text}</span>`;
      commentList.appendChild(newItem);
      commentList.scrollTop = commentList.scrollHeight;

      commentCount.textContent = cardComments.length;
      commentInput.value = "";
      showToast("Commentaire ajouté.", 'success');
    });

    commentInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        commentSubmit.click();
      }
    });

    // Video card click
    if (item.isVideo) {
      card.addEventListener("click", (e) => {
        if (
          e.target.closest("[data-action]") ||
          e.target.closest("[data-toggle='comments']") ||
          e.target.closest(".comment-form") ||
          e.target.closest(".comment-input") ||
          e.target.closest(".comment-submit")
        ) return;
        showToast("▶ Lecture vidéo simulée — fonctionnalité disponible dans la version complète.", 'info');
      });
    }

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

  albumResult.classList.add("loading");
  statusBadge.classList.remove("active");
  statusBadge.textContent = "Création…";

  setTimeout(() => {
    albumResult.classList.remove("loading");

    currentAlbumCode = newCode;
    currentAlbumName = eventName || "Album privé";

    previewTitle.textContent = currentAlbumName;
    previewMeta.textContent = [
      eventType,
      eventDate ? new Date(eventDate).toLocaleDateString("fr-FR") : null,
      ownerName ? `créé par ${ownerName}` : null,
      commentsEnabled ? "commentaires activés" : "sans commentaires",
      privateGallery ? "galerie privée" : "galerie ouverte"
    ].filter(Boolean).join(" · ");

    albumCodeEl.textContent = currentAlbumCode;
    albumLinkEl.textContent = link;

    statusBadge.textContent = "Album actif";
    statusBadge.classList.add("active");

    qrEventName.textContent = currentAlbumName;

    albumResult.classList.remove("revealed");
    void albumResult.offsetWidth;
    albumResult.classList.add("revealed");

    const resultCode = document.querySelector("#album-code");
    resultCode.classList.remove("popped");
    void resultCode.offsetWidth;
    resultCode.classList.add("popped");

    document.querySelector(".qr-card").classList.add("glowing");

    showToast("Album créé avec succès.", 'success');

    // ── Update dashboard ──
    updateDashboardOnAlbumCreate(eventName, eventType, eventDate, newCode, ownerName);

    // Start live gallery simulation
    setupLiveGallery();
  }, 1200);
}

// ── Dashboard update on album creation ───────────────────────────────────────

function updateDashboardOnAlbumCreate(eventName, eventType, eventDate, code, ownerName) {
  // Update title and meta
  if (dashAlbumTitle) dashAlbumTitle.textContent = eventName || "Album privé";

  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : "";
  const metaParts = [code, eventType, formattedDate].filter(Boolean);
  if (dashAlbumMeta) dashAlbumMeta.textContent = metaParts.join(" · ");

  // Animate stat values
  const photos = Math.floor(Math.random() * 101) + 80;   // 80–180
  const videos = Math.floor(Math.random() * 31) + 10;    // 10–40
  const guests = Math.floor(Math.random() * 41) + 20;    // 20–60
  const storageGo = (photos * 0.019).toFixed(1);         // rough estimate

  countUp(dashPhotosEl, photos, 900);
  countUp(dashVideosEl, videos, 900);
  countUp(dashGuestsEl, guests, 900);

  // Storage is text, handle separately
  if (dashStorageEl) {
    let storageStart = 0;
    const storageTarget = parseFloat(storageGo);
    const storageStartTime = performance.now();
    const storageDuration = 900;
    function stepStorage(currentTime) {
      const elapsed = currentTime - storageStartTime;
      const progress = Math.min(elapsed / storageDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = (storageStart + (storageTarget - storageStart) * eased).toFixed(1);
      dashStorageEl.textContent = current.replace(".", ",") + " Go";
      if (progress < 1) requestAnimationFrame(stepStorage);
    }
    requestAnimationFrame(stepStorage);
  }

  // Animate storage bar
  const barPct = Math.min(photos * 0.3, 90);
  if (storageBarFill) {
    storageBarFill.style.width = "0%";
    setTimeout(() => {
      storageBarFill.style.width = barPct + "%";
    }, 100);
  }
  if (storageLabel) {
    storageLabel.textContent = storageGo.replace(".", ",") + " Go / 5 Go utilisés";
  }

  // Prepend timeline entry for album creation
  const creatorName = ownerName || "Organisateur";
  prependTimelineEntry("✨", `<strong>${creatorName}</strong> a créé l'album`, "à l'instant");
}

// ── Copy link ─────────────────────────────────────────────────────────────────

async function copyAlbumLink() {
  const link = albumLinkEl.textContent;
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(link);
    }
    showToast("Lien copié.", 'success');
    copyLinkBtn.classList.add('copied');
    copyLinkBtn.textContent = '✓ Copié';
    setTimeout(() => {
      copyLinkBtn.classList.remove('copied');
      copyLinkBtn.textContent = 'Copier';
    }, 1500);
  } catch (error) {
    showToast("Copie impossible dans ce navigateur.", 'error');
  }
}

// ── Add fake photo (toolbar button) ──────────────────────────────────────────

function addFakePhoto() {
  const labels = ["Ambiance", "Sourires", "Table d'honneur", "Photo de groupe", "Surprise", "Fin de soirée"];
  const icons = ["📸", "😊", "🍽️", "👥", "🎁", "🌙"];
  const randomIndex = Math.floor(Math.random() * labels.length);

  const newItem = {
    title: labels[randomIndex],
    category: "recent",
    favorite: Math.random() > 0.55,
    icon: icons[randomIndex]
  };
  assignVideoMeta(newItem);
  demoGallery.unshift(newItem);

  currentFilter = "all";
  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === "all");
  });

  renderGallery();
  showToast("Photo fictive ajoutée.", 'success');
}

// ── Upload simulation ─────────────────────────────────────────────────────────

function runUploadSimulation() {
  if (isUploading) return;

  if (currentAlbumCode === "SP----") {
    showToast("Créez d'abord un album.", 'warn');
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
    pct += Math.floor(Math.random() * 4) + 3;
    if (pct >= 100) pct = 100;

    progressBar.style.setProperty("--progress", pct + "%");
    progressLabel.textContent = pct + "%";

    if (pct >= 100) {
      clearInterval(interval);

      setTimeout(() => {
        uploadZone.classList.remove("uploading");
        uploadProgress.classList.remove("active");
        uploadProgress.setAttribute("aria-hidden", "true");
        progressBar.style.setProperty("--progress", "0%");
        progressLabel.textContent = "0%";
        isUploading = false;

        const randomIndex = Math.floor(Math.random() * uploadLabels.length);
        const newItem = {
          title: uploadLabels[randomIndex],
          category: "recent",
          favorite: false,
          icon: uploadIcons[randomIndex]
        };
        assignVideoMeta(newItem);
        demoGallery.unshift(newItem);

        currentFilter = "all";
        filterButtons.forEach((button) => {
          button.classList.toggle("active", button.dataset.filter === "all");
        });

        renderGallery();
        showToast("Photo uploadée par un invité !", 'success');

        // Dashboard timeline update
        prependTimelineEntry("📤", `<strong>Invité</strong> a uploadé "${uploadLabels[randomIndex]}"`, "à l'instant");
      }, 400);
    }
  }, 50);
}

// ── Consent modal ─────────────────────────────────────────────────────────────

function openConsentModal() {
  if (currentAlbumCode === "SP----") {
    showToast("Créez d'abord un album.", 'warn');
    return;
  }
  consentCheck.checked = false;
  consentAccept.disabled = true;
  consentOverlay.removeAttribute("hidden");
  mainEl.setAttribute("aria-hidden", "true");

  // Trap focus: collect focusable elements
  trapFocusInModal();

  // Return focus target saved
  consentOverlay._returnFocus = uploadZone;
}

function closeConsentModal() {
  consentOverlay.setAttribute("hidden", "");
  mainEl.removeAttribute("aria-hidden");

  // Restore focus
  if (consentOverlay._returnFocus) {
    consentOverlay._returnFocus.focus();
  }
}

function trapFocusInModal() {
  const focusable = Array.from(
    consentOverlay.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])')
  ).filter(el => !el.disabled);

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (first) first.focus();

  consentOverlay._trapHandler = function(e) {
    if (e.key !== "Tab") return;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };
  consentOverlay.addEventListener("keydown", consentOverlay._trapHandler);
}

function setupConsentModal() {
  // Checkbox toggles accept button
  consentCheck.addEventListener("change", () => {
    consentAccept.disabled = !consentCheck.checked;
  });

  // Accept: close modal, run upload
  consentAccept.addEventListener("click", () => {
    closeConsentModal();
    if (consentOverlay._trapHandler) {
      consentOverlay.removeEventListener("keydown", consentOverlay._trapHandler);
    }
    runUploadSimulation();
  });

  // Decline: close modal, info toast
  consentDecline.addEventListener("click", () => {
    closeConsentModal();
    if (consentOverlay._trapHandler) {
      consentOverlay.removeEventListener("keydown", consentOverlay._trapHandler);
    }
    showToast("Upload annulé.", 'info');
  });

  // Overlay background click closes
  consentOverlay.addEventListener("click", (e) => {
    if (e.target === consentOverlay) {
      closeConsentModal();
      if (consentOverlay._trapHandler) {
        consentOverlay.removeEventListener("keydown", consentOverlay._trapHandler);
      }
      showToast("Upload annulé.", 'info');
    }
  });

  // Escape key closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !consentOverlay.hasAttribute("hidden")) {
      closeConsentModal();
      if (consentOverlay._trapHandler) {
        consentOverlay.removeEventListener("keydown", consentOverlay._trapHandler);
      }
      showToast("Upload annulé.", 'info');
    }
  });
}

function setupUploadZone() {
  // Upload zone and mock button open consent modal instead of running upload directly
  uploadZone.addEventListener("click", openConsentModal);
  uploadZone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openConsentModal();
    }
  });

  const mockBtn = document.querySelector("#mock-upload-btn");
  if (mockBtn) {
    mockBtn.addEventListener("click", openConsentModal);
  }
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
        showToast("ZIP prêt — 47 fichiers exportés.", 'success');
      }, 1000);

      return;
    }

    const step = steps[stepIndex];
    exportBar.style.width = step.pct + "%";
    exportLabel.textContent = step.label;
  }, 290);
}

// ── Live gallery ──────────────────────────────────────────────────────────────

function setupLiveGallery() {
  // Clear old interval if any
  if (liveInterval) {
    clearInterval(liveInterval);
    liveInterval = null;
  }

  if (currentAlbumCode === "SP----") return;

  const scheduleNext = () => {
    const delay = (Math.random() * 10000) + 8000; // 8–18 seconds
    liveInterval = setTimeout(() => {
      // If album changed, stop
      if (currentAlbumCode === "SP----") return;

      const titleIdx = Math.floor(Math.random() * livePhotoTitles.length);
      const guest = randomFrom(liveGuestNames);
      const newItem = {
        title: livePhotoTitles[titleIdx],
        category: "recent",
        favorite: Math.random() > 0.6,
        icon: livePhotoIcons[titleIdx]
      };
      assignVideoMeta(newItem);
      demoGallery.unshift(newItem);

      if (currentFilter === "all" || currentFilter === "recent" || (currentFilter === "video" && newItem.isVideo)) {
        renderGallery();
      } else {
        updateGalleryCount();
      }

      showToast(`📸 ${guest} vient d'ajouter une photo !`, 'info');

      // Dashboard timeline update
      const icon = newItem.isVideo ? "🎥" : "📸";
      const action = newItem.isVideo ? "a ajouté une vidéo" : "a ajouté une photo";
      prependTimelineEntry(icon, `<strong>${guest}</strong> ${action}`, "à l'instant");

      scheduleNext();
    }, delay);
  };

  scheduleNext();
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
      showToast(button.dataset.toast, 'info');
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

    showToast(isDark ? "Mode sombre activé." : "Mode clair activé.", 'info');
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

// ── Scroll reveal with IntersectionObserver ───────────────────────────────────

function setupScrollReveal() {
  const sections = document.querySelectorAll('.section');

  sections.forEach((s, i) => {
    if (i !== 0) {
      s.classList.add('reveal-hidden');
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('reveal-hidden');
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  sections.forEach(s => observer.observe(s));
}

// ── QR code download ──────────────────────────────────────────────────────────

function downloadQRCode() {
  if (!qrCanvas) return;

  const size = 200;
  qrCanvas.width = size;
  qrCanvas.height = size + 28; // extra for text
  const ctx = qrCanvas.getContext("2d");

  const totalH = size + 28;

  // White rounded background
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  const r = 18;
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0);
  ctx.quadraticCurveTo(size, 0, size, r);
  ctx.lineTo(size, totalH - r);
  ctx.quadraticCurveTo(size, totalH, size - r, totalH);
  ctx.lineTo(r, totalH);
  ctx.quadraticCurveTo(0, totalH, 0, totalH - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fill();

  // Helper: draw finder square (QR corner)
  function drawFinder(x, y) {
    // Outer border square
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(x, y, 40, 40, 5);
    ctx.stroke();
    // Inner filled square
    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.roundRect(x + 9, y + 9, 22, 22, 3);
    ctx.fill();
  }

  // Draw 3 finder squares
  const margin = 18;
  drawFinder(margin, margin);                            // top-left
  drawFinder(size - margin - 40, margin);               // top-right
  drawFinder(margin, size - margin - 40);               // bottom-left

  // Random dots grid in center area (8x8)
  const gridStartX = margin + 50;
  const gridStartY = margin + 50;
  const gridSize = size - (margin + 50) * 2;
  const cellSize = gridSize / 8;

  ctx.fillStyle = "#111827";
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (Math.random() > 0.45) {
        const cx = gridStartX + col * cellSize + cellSize * 0.15;
        const cy = gridStartY + row * cellSize + cellSize * 0.15;
        const cw = cellSize * 0.7;
        ctx.beginPath();
        ctx.roundRect(cx, cy, cw, cw, 2);
        ctx.fill();
      }
    }
  }

  // Event name text at bottom
  const displayName = currentAlbumName || "SouvenirsPartagés";
  ctx.fillStyle = "#374151";
  ctx.font = "bold 11px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // Truncate if too long
  const maxWidth = size - 20;
  let displayText = displayName;
  if (ctx.measureText(displayText).width > maxWidth) {
    while (ctx.measureText(displayText + "…").width > maxWidth && displayText.length > 0) {
      displayText = displayText.slice(0, -1);
    }
    displayText += "…";
  }
  ctx.fillText(displayText, size / 2, size + 14);

  // Trigger download
  qrCanvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-${currentAlbumCode}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("QR code téléchargé.", 'success');
  });
}

// ── Social share setup ────────────────────────────────────────────────────────

function setupShare() {
  if (btnDownloadQR) {
    btnDownloadQR.addEventListener("click", downloadQRCode);
  }

  if (shareWhatsapp) {
    shareWhatsapp.addEventListener("click", () => {
      const link = albumLinkEl ? albumLinkEl.textContent : "souvenirs-partages.fr";
      const text = encodeURIComponent("Rejoignez notre album photo : " + link);
      window.open("https://wa.me/?text=" + text, "_blank", "noopener,noreferrer");
    });
  }

  if (shareEmail) {
    shareEmail.addEventListener("click", () => {
      const link = albumLinkEl ? albumLinkEl.textContent : "souvenirs-partages.fr";
      const eventName = currentAlbumName || "notre événement";
      const subject = encodeURIComponent("Album photo — " + eventName);
      const body = encodeURIComponent("Scannez le QR code ou rejoignez-nous ici : " + link);
      window.location.href = "mailto:?subject=" + subject + "&body=" + body;
    });
  }

  if (shareNative) {
    shareNative.addEventListener("click", async () => {
      const link = albumLinkEl ? albumLinkEl.textContent : "souvenirs-partages.fr";
      const fullLink = "https://" + link;

      if (navigator.share) {
        try {
          await navigator.share({
            title: "Album photo — " + (currentAlbumName || "SouvenirsPartagés"),
            url: fullLink
          });
        } catch (err) {
          // User cancelled or error
        }
      } else {
        // Fallback: copy link
        try {
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(fullLink);
          }
          showToast("Lien copié.", 'success');
        } catch (err) {
          showToast("Lien copié.", 'success');
        }
      }
    });
  }
}

// ── Dashboard button setup ────────────────────────────────────────────────────

function setupDashboard() {
  const dashExportBtn = document.querySelector("#dash-export-dash");
  if (dashExportBtn) {
    dashExportBtn.addEventListener("click", () => {
      showToast("Export du dashboard en cours…", 'info');
    });
  }
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
setupConsentModal();
setupShare();
setupDashboard();
renderGallery();
setupScrollReveal();
