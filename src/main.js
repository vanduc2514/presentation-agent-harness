import "./styles.css";
import "impress.js/js/impress.js";
import { slides } from "./slides.js";

const impressRoot = document.querySelector("#impress");

impressRoot.innerHTML = slides.map(renderSlide).join("");

const api = window.impress();
api.init();

document.getElementById("nav-home").addEventListener("click", () => {
  api.goto(slides[0].id);
});

document.getElementById("nav-prev").addEventListener("click", () => {
  api.prev();
});

document.getElementById("nav-next").addEventListener("click", () => {
  api.next();
});

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-goto]");

  if (!target) {
    return;
  }

  event.preventDefault();
  api.goto(target.dataset.goto);
});

function renderSlide(slide) {
  const attributes = renderPositionAttributes(slide.position);

  return `
    <section id="${slide.id}" class="${slide.classes}" ${attributes}>
      <div class="step-shell">
        ${slide.eyebrow ? `<p class="eyebrow">${slide.eyebrow}</p>` : ""}
        <h1 class="slide-title">${slide.title}</h1>
        ${slide.lead ? `<p class="lead">${slide.lead}</p>` : ""}
        ${slide.summary ? `<p class="summary">${slide.summary}</p>` : ""}
        ${slide.takeaway ? `<div class="takeaway">${slide.takeaway}</div>` : ""}
        ${slide.numberedPoints ? renderNumberedPoints(slide.numberedPoints) : ""}
        ${slide.points ? renderPoints(slide.points) : ""}
        ${slide.gridItems ? renderGridItems(slide.gridItems) : ""}
        ${slide.stackItems ? renderStackItems(slide.stackItems) : ""}
        ${slide.navCards ? renderNavCards(slide.navCards) : ""}
        ${slide.dualColumns ? renderDualColumns(slide.dualColumns) : ""}
        ${slide.timelineItems ? renderTimeline(slide.timelineItems) : ""}
        ${slide.note ? `<p class="note">${slide.note}</p>` : ""}
      </div>
    </section>
  `;
}

function renderPositionAttributes(position) {
  return Object.entries(position)
    .map(([key, value]) => `data-${camelToKebab(key)}="${value}"`)
    .join(" ");
}

function renderPoints(points) {
  return `
    <ul class="bullet-list">
      ${points
        .map((point) => `<li class="bullet-item">${point}</li>`)
        .join("")}
    </ul>
  `;
}

function renderNumberedPoints(points) {
  return `
    <ol class="numbered-list">
      ${points
        .map((point) => `<li class="numbered-item">${point}</li>`)
        .join("")}
    </ol>
  `;
}

function renderGridItems(items) {
  return `
    <div class="grid-panel">
      ${items
        .map(
          ([label, text]) => `
            <article class="info-card">
              <h3>${label}</h3>
              <p>${text}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function renderStackItems(items) {
  return `
    <div class="stack-panel">
      ${items
        .map(
          ([label, text]) => `
            <article class="stack-card">
              <span class="stack-label">${label}</span>
              <p>${text}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function renderNavCards(cards) {
  return `
    <div class="nav-grid">
      ${cards
        .map(
          ([code, label, text, target]) => `
            <button class="nav-card" type="button" data-goto="${target}">
              <span class="nav-code">${code}</span>
              <strong>${label}</strong>
              <span>${text}</span>
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

function renderDualColumns(columns) {
  return `
    <div class="dual-columns">
      <section class="column-card">
        <h3>${columns.leftTitle}</h3>
        <ul>
          ${columns.leftItems.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </section>
      <section class="column-card">
        <h3>${columns.rightTitle}</h3>
        <ul>
          ${columns.rightItems.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </section>
    </div>
  `;
}

function renderTimeline(items) {
  return `
    <div class="timeline">
      ${items
        .map(
          ([index, text]) => `
            <article class="timeline-step">
              <span class="timeline-index">${index}</span>
              <p>${text}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function camelToKebab(value) {
  return value.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`);
}