const state = {
  projects: [],
  filter: "all",
  query: "",
};

const sectionLabels = {
  core: "Audiovisual web",
  related: "Relacionados",
};

const palette = [
  ["#e0483e", "#0f7180", "#1f2430"],
  ["#2b8c57", "#d6a33f", "#182331"],
  ["#cc3f74", "#2d6fbd", "#21242a"],
  ["#e16b2f", "#23675f", "#20242b"],
  ["#5f67d8", "#d2523d", "#20232a"],
  ["#237c9a", "#cfb13d", "#22252c"],
];

const gallery = document.querySelector("#gallery");
const count = document.querySelector("#project-count");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#search");
const filters = document.querySelector("#filters");

async function init() {
  try {
    const response = await fetch("data/interfaces.yaml", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`No se pudo cargar el YAML (${response.status})`);
    }

    const yamlText = await response.text();
    const data = jsyaml.load(yamlText);
    state.projects = Array.isArray(data.projects) ? data.projects : [];

    buildFilters();
    bindEvents();
    render();
  } catch (error) {
    count.textContent = "No se pudo cargar data/interfaces.yaml.";
    gallery.innerHTML = `<p class="empty-state">${escapeHtml(error.message)}</p>`;
  }
}

function bindEvents() {
  searchInput.addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLowerCase();
    render();
  });
}

function buildFilters() {
  const groups = [...new Set(state.projects.map((project) => project.section).filter(Boolean))];
  const buttons = [
    { id: "all", label: "Todos" },
    ...groups.map((group) => ({ id: group, label: sectionLabels[group] || group })),
    { id: "demo", label: "Con demo" },
  ];

  filters.innerHTML = buttons
    .map(
      (button) => `
        <button class="filter-button" type="button" data-filter="${button.id}" aria-pressed="${button.id === state.filter}">
          ${escapeHtml(button.label)}
        </button>
      `,
    )
    .join("");

  filters.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      render();
    });
  });
}

function render() {
  const visibleProjects = state.projects.filter(projectMatches);

  gallery.innerHTML = visibleProjects.map(renderCard).join("");
  emptyState.hidden = visibleProjects.length > 0;
  count.textContent = `${visibleProjects.length} de ${state.projects.length} interfaces`;

  filters.querySelectorAll("button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.filter === state.filter));
  });
}

function projectMatches(project) {
  const filterMatches =
    state.filter === "all" ||
    (state.filter === "demo" && project.demo) ||
    project.section === state.filter;

  if (!filterMatches) {
    return false;
  }

  if (!state.query) {
    return true;
  }

  const searchable = [
    project.title,
    project.slug,
    project.kind,
    project.description,
    ...(project.tags || []),
  ]
    .join(" ")
    .toLowerCase();

  return searchable.includes(state.query);
}

function renderCard(project) {
  const colors = colorsFor(project.slug);
  const tags = (project.tags || [])
    .slice(0, 4)
    .map((tag) => `<li>${escapeHtml(tag)}</li>`)
    .join("");

  return `
    <article class="card">
      ${renderThumb(project, colors)}
      <div class="card-body">
        <div class="meta">
          <span>${escapeHtml(sectionLabels[project.section] || project.section || "Interfaz")}</span>
          <span>${escapeHtml(project.kind || "Proyecto")}</span>
        </div>
        <h2>${escapeHtml(project.title)}</h2>
        <p class="description">${escapeHtml(project.description)}</p>
        <ul class="tags">${tags}</ul>
      </div>
      <div class="actions">
        ${project.demo ? `<a class="button button--primary" href="${project.demo}" target="_blank" rel="noreferrer">Demo</a>` : ""}
        <a class="button" href="${project.repo}" target="_blank" rel="noreferrer">Repo</a>
        ${project.demo ? "" : `<span class="button button--muted" aria-label="Sin demo publicado">Sin demo</span>`}
      </div>
    </article>
  `;
}

function renderThumb(project, colors) {
  if (project.image) {
    return `
      <figure class="thumb">
        <img src="${project.image}" alt="Vista previa de ${escapeHtml(project.title)}" loading="lazy" />
      </figure>
    `;
  }

  return `
    <figure
      class="thumb thumb--generated"
      data-mark="${escapeHtml(project.title)}"
      style="--c1: ${colors[0]}; --c2: ${colors[1]}; --c3: ${colors[2]};"
      aria-hidden="true"
    ></figure>
  `;
}

function colorsFor(slug) {
  let hash = 0;
  for (const char of slug) {
    hash = (hash * 31 + char.charCodeAt(0)) % 997;
  }

  return palette[hash % palette.length];
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

init();
