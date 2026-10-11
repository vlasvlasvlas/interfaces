/* app.js */

var container = document.getElementById("projects");
var langBtn = document.getElementById("lang-toggle");
var filtersEl = document.getElementById("filters");
var modalOverlay = document.getElementById("modal-overlay");
var modalClose = document.getElementById("modal-close");
var modalMedia = document.getElementById("modal-media");
var modalTitle = document.getElementById("modal-title");
var modalDesc = document.getElementById("modal-desc");
var modalTagList = document.getElementById("modal-tags");
var modalActions = document.getElementById("modal-actions");
var introDeclaration = document.querySelector(".intro-declaration");
var introContext = document.querySelector(".intro-context");
var introLinks = document.querySelector(".intro-links");

var lang = "es";
var allProjects = [];
var activeFilter = "todos";
var currentProject = null;
var currentCount = "—";

function updateIntro() {
  var ghLink = '<a href="https://github.com/vlasvlasvlas" target="_blank" rel="noreferrer">vlasvlasvlas</a>';
  var igLink = '<a href="https://www.instagram.com/vlas.vlas.vlas" target="_blank" rel="noreferrer">instagram ↗</a>';
  var gh2Link = '<a href="https://github.com/vlasvlasvlas" target="_blank" rel="noreferrer">github ↗</a>';
  var posLink = '<a href="https://www.instagram.com/posnetes" target="_blank" rel="noreferrer">POSNETES ↗</a>';
  var v1Link = '<a href="videos/promo_interfaces_90s.mp4" target="_blank" rel="noreferrer">video 1 ↗</a>';
  var v2Link = '<a href="videos/promo_interfaces_90s_v2.mp4" target="_blank" rel="noreferrer">video 2 ↗</a>';

  if (lang === "en") {
    introDeclaration.textContent = "An ongoing ecosystem of browser-based musical instruments.";
    introContext.innerHTML = "Gestures, text, pixels, algorithms, weather, clocks — each instrument proposes a different interaction model as raw material for sound and image. <span id=\"instrument-count\">" + currentCount + "</span> works. No installation. Nothing but a browser.";
    introLinks.innerHTML = "by " + ghLink + " \xb7 " + igLink + " \xb7 " + gh2Link + "<br>\ud83c\udfac promo reels: " + v1Link + " \xb7 " + v2Link + "<br>Also performed live within " + posLink;
  } else {
    introDeclaration.textContent = "Un ecosistema vivo de instrumentos musicales para navegador.";
    introContext.innerHTML = "Gestos, texto, p\xedxeles, algoritmos, clima, relojes — cada instrumento propone un modelo de interacci\xf3n distinto como materia prima para sonido e imagen. <span id=\"instrument-count\">" + currentCount + "</span> obras. Sin instalaci\xf3n. Solo un navegador.";
    introLinks.innerHTML = "por " + ghLink + " \xb7 " + igLink + " \xb7 " + gh2Link + "<br>\ud83c\udfac videos promocionales: " + v1Link + " \xb7 " + v2Link + "<br>Tambi\xe9n en performance en vivo dentro de " + posLink;
  }
}

async function init() {
  try {
    var res = await fetch("data/interfaces.yaml", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    var data = jsyaml.load(await res.text());
    allProjects = Array.isArray(data.projects) ? data.projects : [];
    currentCount = allProjects.length;
    updateIntro();
    renderFilters();
    render();
    sortByLastCommit();
  } catch (e) {
    container.className = "loading";
    container.textContent = "error: " + e.message;
  }
}

function tags(p) {
  return Array.isArray(p.tags) ? p.tags : [];
}

function filteredProjects() {
  if (activeFilter === "todos") return allProjects;
  return allProjects.filter(function (p) {
    return tags(p).includes(activeFilter);
  });
}

function renderFilters() {
  var tagSet = new Set();
  allProjects.forEach(function (p) {
    tags(p).forEach(function (t) { tagSet.add(t); });
  });
  var sorted = Array.from(tagSet).sort();

  var html = '<button class="filter-btn active" data-filter="todos">todos</button>';
  sorted.forEach(function (t) {
    html += '<button class="filter-btn" data-filter="' + esc(t) + '">' + esc(t) + '</button>';
  });
  filtersEl.innerHTML = html;

  filtersEl.querySelectorAll(".filter-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      activeFilter = this.dataset.filter;
      filtersEl.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("active"); });
      this.classList.add("active");
      render();
    });
  });
}

function render() {
  container.className = "";
  var projects = filteredProjects();

  if (projects.length === 0) {
    container.innerHTML = '<div class="no-results">sin resultados</div>';
    return;
  }

  var overlayLabel = lang === "en" ? "▶ open" : "▶ abrir";

  container.innerHTML = projects.map(function (p) {
    var desc = lang === "en" ? (p.description_en || p.description) : p.description;
    var ptags = tags(p);

    var html = '<div class="card">';
    html += '<div class="card-img-wrap">';
    if (p.image) {
      html += '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy" onerror="this.style.display=\'none\'">';
    }
    html += '<div class="card-overlay"><span class="card-overlay-label">' + overlayLabel + '</span></div>';
    html += '</div>';
    html += '<div class="card-body">';
    html += '<div class="card-title">' + esc(p.title) + '</div>';
    html += '<p class="card-desc">' + esc(desc) + '</p>';
    if (ptags.length > 0) {
      html += '<div class="card-tags">' + ptags.map(function (t) {
        return '<span class="tag">' + esc(t) + '</span>';
      }).join('') + '</div>';
    }
    html += '</div></div>';
    return html;
  }).join("");

  container.querySelectorAll(".card").forEach(function (card, i) {
    var project = projects[i];
    card.addEventListener("click", function () { openModal(project); });
  });
}

function openModal(p) {
  currentProject = p;
  var desc = lang === "en" ? (p.description_en || p.description) : p.description;

  if (p.image) {
    modalMedia.innerHTML = '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + '">';
  } else {
    modalMedia.innerHTML = '';
  }

  modalTitle.textContent = p.title;
  modalDesc.textContent = desc;

  var ptags = tags(p);
  modalTagList.innerHTML = ptags.map(function (t) {
    return '<span class="tag">' + esc(t) + '</span>';
  }).join('');

  var openLabel = lang === "en" ? "↗ open" : "↗ abrir";
  var repoLabel = lang === "en" ? "⌗ code" : "⌗ código";

  var html = '';
  if (p.demo) {
    html += '<a class="btn btn-primary" href="' + esc(p.demo) + '" target="_blank" rel="noreferrer">' + openLabel + '</a>';
  }
  html += '<a class="btn btn-secondary" href="' + esc(p.repo) + '" target="_blank" rel="noreferrer">' + repoLabel + '</a>';
  modalActions.innerHTML = html;

  modalOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay.classList.remove("open");
  document.body.style.overflow = "";
  modalMedia.innerHTML = "";
  currentProject = null;
}

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", function (e) {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeModal();
});

async function sortByLastCommit() {
  var fetches = allProjects.map(function (p) {
    var repoPath = extractRepoPath(p.repo);
    if (!repoPath) return Promise.resolve(null);
    return fetch(
      "https://api.github.com/repos/" + repoPath + "/commits?per_page=1",
      { headers: { Accept: "application/vnd.github.v3+json" } }
    )
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (commits) {
        if (commits.length > 0) p._lastCommit = commits[0].commit.committer.date;
      })
      .catch(function () {});
  });

  await Promise.all(fetches);

  allProjects.sort(function (a, b) {
    var da = a._lastCommit || "1970-01-01";
    var db = b._lastCommit || "1970-01-01";
    return db.localeCompare(da);
  });

  render();
}

function switchLang() {
  lang = lang === "es" ? "en" : "es";
  langBtn.textContent = lang === "es" ? "EN" : "ES";
  document.documentElement.lang = lang;

  updateIntro();
  render();

  if (currentProject) {
    var desc = lang === "en" ? (currentProject.description_en || currentProject.description) : currentProject.description;
    modalDesc.textContent = desc;
  }
}

langBtn.addEventListener("click", switchLang);

function extractRepoPath(url) {
  if (!url) return null;
  var m = url.match(/github\.com\/([^/]+\/[^/]+)/);
  return m ? m[1] : null;
}

function esc(s) {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

init();
