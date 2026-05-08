/* app.js */

var container = document.getElementById("projects");
var langBtn = document.getElementById("lang-toggle");
var lang = "es";
var allProjects = [];

async function init() {
  try {
    var res = await fetch("data/interfaces.yaml", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    var data = jsyaml.load(await res.text());
    allProjects = Array.isArray(data.projects) ? data.projects : [];
    render();
  } catch (e) {
    container.textContent = "error: " + e.message;
  }
}

function render() {
  container.innerHTML = allProjects.map(function (p) {
    var main = p.demo || p.repo;
    var desc = lang === "en" ? (p.description_en || p.description) : p.description;
    var btnLabel = lang === "en" ? "play" : "jugar";
    var html = '<div class="project">';

    if (p.image) {
      html +=
        '<a href="' + main + '" target="_blank" rel="noreferrer">' +
        '<img class="project-thumb" src="' + p.image + '" alt="' + esc(p.title) + '" loading="lazy" onerror="this.parentNode.style.display=\'none\'" />' +
        "</a>";
    }

    html += '<div class="project-title"><a href="' + main + '" target="_blank" rel="noreferrer">' + esc(p.title) + "</a></div>";
    html += '<p class="project-desc">' + esc(desc) + "</p>";
    html += '<div class="project-links">';
    if (p.demo) {
      html += '<a class="btn btn-demo" href="' + p.demo + '" target="_blank" rel="noreferrer">&#9654; ' + btnLabel + '</a>';
    }
    html += '<a class="btn btn-repo" href="' + p.repo + '" target="_blank" rel="noreferrer">&#9776; repo</a>';
    html += "</div>";
    html += "</div>";
    return html;
  }).join("");
}

function switchLang() {
  lang = lang === "es" ? "en" : "es";
  langBtn.textContent = lang === "es" ? "EN" : "ES";
  document.documentElement.lang = lang;

  // update static text
  var sub = document.querySelector(".sub");
  var foot = document.querySelector(".foot");
  if (sub) {
    var link = '<a href="https://github.com/vlasvlasvlas">vlasvlasvlas</a>';
    sub.innerHTML = lang === "en"
      ? "by " + link + " · visual, sonic and interactive interfaces"
      : "por " + link + " · interfaces visuales, sonoras e interactivas";
  }
  if (foot) {
    foot.innerHTML = (lang === "en" ? "source: " : "fuente: ") + '<a href="data/interfaces.yaml">interfaces.yaml</a>';
  }

  render();
}

langBtn.addEventListener("click", switchLang);

function esc(s) {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

init();
