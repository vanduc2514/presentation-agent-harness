const GRID_ICONS = {
  "Speed":      "https://cdn-icons-png.flaticon.com/128/53/53128.png",
  "Navigation": "https://cdn-icons-png.flaticon.com/128/660/660333.png",
  "Execution":  "https://cdn-icons-png.flaticon.com/128/9640/9640682.png",
  "Debugger":   "https://cdn-icons-png.flaticon.com/128/1541/1541402.png",
};

export function renderSlide(slide) {
  const attributes = renderPositionAttributes(slide.position);
  const heroItem = slide.content.find((item) => item.type === "image");
  const contentItems = heroItem ? slide.content.filter((item) => item.type !== "image") : slide.content;
  const innerContent = `
        ${slide.eyebrow ? `<p class="eyebrow">${slide.eyebrow}</p>` : ""}
        <h1 class="slide-title">${slide.title}</h1>
        ${contentItems.map(renderContentItem).join("\n        ")}`;

  if (heroItem) {
    return `
      <section id="${slide.id}" class="${slide.classes}" ${attributes}>
        <div class="step-split-layout">
          <div class="step-shell step-content-card">
            ${innerContent}
          </div>
          <figure class="hero-image-card">
            <img src="${heroItem.src}" alt="${heroItem.alt}">
          </figure>
        </div>
      </section>
    `;
  }

  return `
    <section id="${slide.id}" class="${slide.classes}" ${attributes}>
      <div class="step-shell">
        ${innerContent}
      </div>
    </section>
  `;
}

function renderContentItem(item) {
  switch (item.type) {
    case "lead":           return `<p class="lead">${item.data}</p>`;
    case "summary":        return `<p class="summary">${item.data}</p>`;
    case "note":           return `<p class="note">${item.data}</p>`;
    case "takeaway":       return `<div class="takeaway">${item.data}</div>`;
    case "points":         return renderPoints(item.data);
    case "numberedPoints": return renderNumberedPoints(item.data);
    case "grid":           return renderGridItems(item.data);
    case "stack":          return renderStackItems(item.data);
    case "nav":            return renderNavCards(item.data);
    case "timeline":       return renderTimeline(item.data);
    case "dualColumns":    return renderDualColumns(item.data);
    default:               return "";
  }
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
          ([label, text]) => {
            const iconUrl = GRID_ICONS[label];
            const iconHtml = iconUrl
              ? `<img class="info-card-icon" src="${iconUrl}" alt="${label} icon">`
              : "";
            return `
            <article class="info-card">
              ${iconHtml}<h3>${label}</h3>
              <p>${text}</p>
            </article>
          `;
          }
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
  const leftAttrs = columns.leftTarget ? ` class="column-card column-card--link" data-goto="${columns.leftTarget}"` : ` class="column-card"`;
  const rightAttrs = columns.rightTarget ? ` class="column-card column-card--link" data-goto="${columns.rightTarget}"` : ` class="column-card"`;

  return `
    <div class="dual-columns">
      <section${leftAttrs}>
        <h3>${columns.leftTitle}</h3>
        <ul>
          ${columns.leftItems.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </section>
      <section${rightAttrs}>
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