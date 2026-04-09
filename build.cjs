'use strict';

/**
 * build.cjs — Markpress-based presentation builder
 *
 * Converts slides/presentation.md into a self-contained output/index.html
 * using the markpress library.  Custom CSS and a browser-side DOM
 * transformation script are injected into the output via the markpress
 * Promise API.
 */

const fs   = require('fs');
const path = require('path');
const markpress = require('markpress');

// ── Paths ─────────────────────────────────────────────────────────────────────
const ROOT      = __dirname;
const MD_INPUT  = path.join(ROOT, 'slides', 'presentation.md');
const CSS_INPUT = path.join(ROOT, 'styles.css');
const OUTPUT_DIR = path.join(ROOT, 'output');
const HTML_OUT  = path.join(OUTPUT_DIR, 'index.html');
const IMAGES_SRC = path.join(ROOT, 'slides', 'images');
const IMAGES_DST = path.join(OUTPUT_DIR, 'images');

// ── Grid icons (replicated from src/render.js) ────────────────────────────────
const GRID_ICONS = {
  'Speed':      'https://cdn-icons-png.flaticon.com/128/53/53128.png',
  'Navigation': 'https://cdn-icons-png.flaticon.com/128/660/660333.png',
  'Execution':  'https://cdn-icons-png.flaticon.com/128/9640/9640682.png',
  'Debugger':   'https://cdn-icons-png.flaticon.com/128/1541/1541402.png',
};

// ── Navigation SVGs ───────────────────────────────────────────────────────────
const SVG_HOME = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';
const SVG_PREV = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
const SVG_NEXT = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';

// ── Build the browser-side transformation + init script ───────────────────────
function buildTransformScript(css, gridIconsJson, svgHome, svgPrev, svgNext) {
  return `
(function () {
  'use strict';

  var GRID_ICONS = ${gridIconsJson};

  // ── Helpers ────────────────────────────────────────────────────────────────

  function renderGridPanel(rows) {
    var div = document.createElement('div');
    div.className = 'grid-panel';
    div.innerHTML = rows.map(function (row) {
      var label = row[0];
      var text  = row[1];
      var iconUrl = GRID_ICONS[label];
      var iconHtml = iconUrl
        ? '<img class="info-card-icon" src="' + iconUrl + '" alt="' + label + ' icon">'
        : '';
      return '<article class="info-card">' + iconHtml + '<h3>' + label + '</h3><p>' + text + '</p></article>';
    }).join('');
    return div;
  }

  function renderStackPanel(rows) {
    var div = document.createElement('div');
    div.className = 'stack-panel';
    div.innerHTML = rows.map(function (row) {
      return '<article class="stack-card"><span class="stack-label">' + row[0] + '</span><p>' + row[1] + '</p></article>';
    }).join('');
    return div;
  }

  function renderNavGrid(rows) {
    var div = document.createElement('div');
    div.className = 'nav-grid';
    div.innerHTML = rows.map(function (row) {
      return '<button class="nav-card" type="button" data-goto="' + row[3] + '">'
        + '<span class="nav-code">' + row[0] + '</span>'
        + '<strong>' + row[1] + '</strong>'
        + '<span>' + row[2] + '</span>'
        + '</button>';
    }).join('');
    return div;
  }

  function renderTimeline(rows) {
    var div = document.createElement('div');
    div.className = 'timeline';
    div.innerHTML = rows.map(function (row) {
      return '<article class="timeline-step"><span class="timeline-index">' + row[0] + '</span><p>' + row[1] + '</p></article>';
    }).join('');
    return div;
  }

  function tableToRows(table) {
    return Array.from(table.querySelectorAll('tbody tr')).map(function (tr) {
      return Array.from(tr.querySelectorAll('td')).map(function (td) {
        return td.innerHTML.trim();
      });
    });
  }

  // Annotate H2s that follow a <!-- goto: id --> comment
  function annotateGotoComments(container) {
    var nodes = Array.from(container.childNodes);
    nodes.forEach(function (node, i) {
      if (node.nodeType !== 8) return; // not a comment node
      var m = node.textContent.trim().match(/^goto:\s*(.+)$/);
      if (!m) return;
      // find next element sibling
      var next = node.nextSibling;
      while (next && next.nodeType !== 1) next = next.nextSibling;
      if (next && next.tagName === 'H2') {
        next.setAttribute('data-target', m[1].trim());
      }
    });
  }

  // ── Per-step content transformation ───────────────────────────────────────

  function processContent(container, layout) {
    // Style H1 as slide-title, remove marky-markdown's deep-link artifacts
    var h1 = container.querySelector('h1');
    if (h1) {
      h1.removeAttribute('id');
      h1.className = 'slide-title';
    }

    // Process any <!-- goto: --> comments before touching H2s
    annotateGotoComments(container);

    // Dual-columns layout
    if (layout === 'dual') {
      var h2s = Array.from(container.querySelectorAll('h2'));
      if (h2s.length >= 2) {
        var dualDiv = document.createElement('div');
        dualDiv.className = 'dual-columns';

        h2s.forEach(function (h2) {
          var title  = h2.textContent.trim();
          var target = h2.getAttribute('data-target') || null;

          // Collect UL immediately after the H2
          var ul = h2.nextElementSibling;
          var items = [];
          if (ul && ul.tagName === 'UL') {
            items = Array.from(ul.querySelectorAll('li')).map(function (li) {
              return li.innerHTML;
            });
          }

          var section = document.createElement('section');
          section.className = target ? 'column-card column-card--link' : 'column-card';
          if (target) section.setAttribute('data-goto', target);
          section.innerHTML = '<h3>' + title + '</h3>'
            + '<ul>' + items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>';
          dualDiv.appendChild(section);

          if (ul && ul.tagName === 'UL') ul.remove();
          h2.remove();
        });

        container.appendChild(dualDiv);
      }
    }

    // Style blockquotes as takeaway
    container.querySelectorAll('blockquote').forEach(function (bq) {
      // marky-markdown wraps blockquote text in <p>
      var text = bq.querySelector('p') ? bq.querySelector('p').innerHTML : bq.innerHTML;
      var div = document.createElement('div');
      div.className = 'takeaway';
      div.innerHTML = text;
      bq.replaceWith(div);
    });

    // Style paragraphs: skip eyebrow (already classed), count the rest
    var paragraphCount = 0;
    Array.from(container.querySelectorAll('p')).forEach(function (p) {
      if (p.classList.contains('eyebrow')) return;
      var type = paragraphCount === 0 ? 'lead' : paragraphCount === 1 ? 'summary' : 'note';
      p.className = type;
      paragraphCount++;
    });

    // Style lists
    container.querySelectorAll('ul').forEach(function (ul) {
      if (ul.closest('.dual-columns')) return; // already handled
      ul.className = 'bullet-list';
      Array.from(ul.querySelectorAll('li')).forEach(function (li) {
        li.className = 'bullet-item';
      });
    });
    container.querySelectorAll('ol').forEach(function (ol) {
      ol.className = 'numbered-list';
      Array.from(ol.querySelectorAll('li')).forEach(function (li) {
        li.className = 'numbered-item';
      });
    });

    // Transform table based on layout
    var table = container.querySelector('table');
    if (table && layout) {
      var rows = tableToRows(table);
      var replacement;
      if (layout === 'grid')     replacement = renderGridPanel(rows);
      else if (layout === 'stack')    replacement = renderStackPanel(rows);
      else if (layout === 'nav')      replacement = renderNavGrid(rows);
      else if (layout === 'timeline') replacement = renderTimeline(rows);
      if (replacement) table.replaceWith(replacement);
    }
  }

  // ── Main transformation ────────────────────────────────────────────────────

  // Configure the impress container
  var impressEl = document.getElementById('impress');
  if (impressEl) {
    impressEl.setAttribute('data-width', '1600');
    impressEl.setAttribute('data-height', '900');
    impressEl.setAttribute('data-max-scale', '1');
    impressEl.setAttribute('data-min-scale', '0');
    impressEl.setAttribute('data-transition-duration', '500');
  }

  var steps = Array.from(document.querySelectorAll('.step'));

  steps.forEach(function (step) {
    // Move data-id to the real id attribute (markpress prefixes all keys with data-)
    var sid = step.getAttribute('data-id');
    if (sid) {
      step.setAttribute('id', sid);
      step.removeAttribute('data-id');
    }

    // Add step-card and theme class
    step.classList.add('step-card');
    var theme = step.getAttribute('data-theme');
    if (theme) {
      step.classList.add('theme-' + theme);
      step.removeAttribute('data-theme');
    }

    var layout = step.getAttribute('data-layout') || '';
    step.removeAttribute('data-layout');

    // overview-step for the large-scale overview slide
    if (layout === 'nav') {
      var scale = parseFloat(step.getAttribute('data-scale') || '1');
      if (scale > 5) step.classList.add('overview-step');
    }

    // ── Split layout for slides that have a hero image ───────────────────────
    var imgEl = step.querySelector('img');
    if (imgEl) {
      // Remove the image wrapper paragraph from the step DOM before copying
      // innerHTML into the content card — avoids leaving an empty <p> behind.
      var imgWrapper = imgEl.closest('p') || imgEl.parentElement;
      imgWrapper.remove(); // detaches imgEl too; imgEl still accessible in memory

      var splitDiv = document.createElement('div');
      splitDiv.className = 'step-split-layout';

      var contentCard = document.createElement('div');
      contentCard.className = 'step-shell step-content-card';
      // image wrapper already removed from step — copy the rest into content card
      contentCard.innerHTML = step.innerHTML;

      var heroCard = document.createElement('figure');
      heroCard.className = 'hero-image-card';
      heroCard.appendChild(imgEl); // re-attach the detached image

      splitDiv.appendChild(contentCard);
      splitDiv.appendChild(heroCard);

      step.innerHTML = '';
      step.appendChild(splitDiv);

      processContent(contentCard, layout);
    } else {
      // ── Standard single-card layout ─────────────────────────────────────────
      var shellDiv = document.createElement('div');
      shellDiv.className = 'step-shell';
      shellDiv.innerHTML = step.innerHTML;
      step.innerHTML = '';
      step.appendChild(shellDiv);
      processContent(shellDiv, layout);
    }
  });

  // ── Navigation bar ─────────────────────────────────────────────────────────
  var nav = document.createElement('nav');
  nav.className = 'slide-nav';
  nav.setAttribute('aria-label', 'Slide navigation');
  nav.innerHTML =
    '<button class="slide-nav-btn" id="nav-home" type="button" title="Home">'
    + '${SVG_HOME}Home</button>'
    + '<button class="slide-nav-btn" id="nav-prev" type="button" title="Previous slide">'
    + '${SVG_PREV}Prev</button>'
    + '<button class="slide-nav-btn" id="nav-next" type="button" title="Next slide">'
    + 'Next${SVG_NEXT}</button>';
  document.body.appendChild(nav);

  // ── Viewport scaling ───────────────────────────────────────────────────────
  // impress.js hardcodes windowScale=1 and manages #impress positioning itself
  // (top:50%, left:50%, transform: perspective+scale on every step transition).
  // We wrap #impress in a fixed #impress-scaler div and scale/position the
  // wrapper instead, so impress.js can freely mutate #impress without conflict.
  // Only applied for viewport ≥ 768px; smaller viewports use CSS media queries.
  var PRES_W = 1600, PRES_H = 900;
  // Margin kept around the slide as a fraction of the viewport dimension (8%).
  // This keeps the slide centered with visible breathing room on all viewports,
  // matching the desktop look (desktop stays at scale=1 because 8% of 1920px = 154px
  // which does not push the scale below 1.0, while laptop gets ~115px side margins).
  var SLIDE_MARGIN_RATIO = 0.08;
  var scalerEl = null;
  if (impressEl) {
    scalerEl = document.createElement('div');
    scalerEl.id = 'impress-scaler';
    impressEl.parentNode.insertBefore(scalerEl, impressEl);
    scalerEl.appendChild(impressEl);
  }

  function scalePres() {
    if (!scalerEl) return;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    if (vw < 768) {
      scalerEl.style.position = '';
      scalerEl.style.top = '';
      scalerEl.style.left = '';
      scalerEl.style.width = '';
      scalerEl.style.height = '';
      scalerEl.style.overflow = '';
      scalerEl.style.transform = '';
      return;
    }
    var pad_h = Math.round(vw * SLIDE_MARGIN_RATIO);
    var pad_v = Math.round(vh * SLIDE_MARGIN_RATIO);
    var s = Math.min((vw - pad_h * 2) / PRES_W, (vh - pad_v * 2) / PRES_H, 1);
    var tx = (vw - PRES_W * s) / 2;
    var ty = (vh - PRES_H * s) / 2;
    scalerEl.style.position = 'fixed';
    scalerEl.style.top = '0';
    scalerEl.style.left = '0';
    scalerEl.style.width = PRES_W + 'px';
    scalerEl.style.height = PRES_H + 'px';
    scalerEl.style.overflow = 'hidden';
    scalerEl.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + s + ')';
  }
  scalePres();

  // ── Init impress ───────────────────────────────────────────────────────────
  var api = window.impress();
  api.init();

  window.addEventListener('resize', scalePres);

  document.getElementById('nav-home').addEventListener('click', function () {
    api.goto(steps[0]);
  });
  document.getElementById('nav-prev').addEventListener('click', function () {
    api.prev();
  });
  document.getElementById('nav-next').addEventListener('click', function () {
    api.next();
  });

  // data-goto navigation (nav cards, dual-column links)
  document.addEventListener('click', function (event) {
    var target = event.target.closest('[data-goto]');
    if (!target) return;
    event.preventDefault();
    api.goto(target.dataset.goto);
  });
})();
`
  // Interpolate the SVG strings (template literals in the JS source above use ${} so we
  // substitute them as plain string replacements here, avoiding any escaping issues)
  .replace('${SVG_HOME}', svgHome)
  .replace('${SVG_PREV}', svgPrev)
  .replace('${SVG_NEXT}', svgNext);
}

// ── Main build ────────────────────────────────────────────────────────────────

const customCSS   = fs.readFileSync(CSS_INPUT, 'utf8');
const markdownSrc = fs.readFileSync(MD_INPUT,  'utf8');

const markpressOptions = {
  sanitize: false,   // allow raw HTML in markdown
  embed:    true,    // embed remote images as base64
  verbose:  true,
  theme:    'light', // markpress built-in theme (will be replaced by our CSS)
  layout:   'horizontal', // ignored — all slides have slide-attr comments
  title:    'Evaluating IDEs for the AI Agent Era',
};

console.log('Building presentation with markpress…');

markpress(markdownSrc, markpressOptions)
  .then(function (result) {
    let html = result.html;

    // 1. Remove markpress built-in CSS (both web and print styles) and replace
    //    with our custom CSS.
    html = html.replace(/<style type="text\/css">[\s\S]*?<\/style>/, '');
    html = html.replace(/<style\s+media="print"[\s\S]*?<\/style>/, '');
    html = html.replace('</head>', '<style>' + customCSS + '</style>\n</head>');

    // 2. Inject viewport meta and title
    html = html.replace(
      '<meta charset="utf-8" />',
      '<meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />'
    );

    // 3. Add impress-not-supported class and fallback message to <body>
    html = html.replace(
      '<body>',
      '<body class="impress-not-supported">\n'
      + '    <div class="fallback-message">\n'
      + '      <p>Your browser does not support the transforms required for this presentation.</p>\n'
      + '      <p>Use a current Chromium, Firefox, or Safari build.</p>\n'
      + '    </div>\n'
    );

    // 4. Wrap the #impress div in a presentation-shell div
    html = html.replace(
      '<div id="impress">',
      '<div class="presentation-shell">\n    <div id="impress">'
    );
    // Close the presentation-shell before the first script tag
    html = html.replace(
      '</div>\n    <script>',
      '</div>\n    </div>\n    <script>'
    );

    // 5. Replace markpress's bare impress().init() call with our full
    //    transformation + navigation + init script.
    const transformScript = buildTransformScript(
      customCSS,
      JSON.stringify(GRID_ICONS),
      SVG_HOME, SVG_PREV, SVG_NEXT
    );
    html = html.replace(
      '<script>impress().init();</script>',
      '<script>\n' + transformScript + '\n</script>'
    );

    // 6. Write output
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    // Copy diagrams folder to output so local image paths work
    if (fs.existsSync(IMAGES_SRC)) {
      if (!fs.existsSync(IMAGES_DST)) fs.mkdirSync(IMAGES_DST, { recursive: true });
      fs.readdirSync(IMAGES_SRC).forEach(function (file) {
        fs.copyFileSync(path.join(IMAGES_SRC, file), path.join(IMAGES_DST, file));
      });
      console.log('Diagrams copied to output/diagrams/');
    }

    fs.writeFileSync(HTML_OUT, html, 'utf8');
    console.log('Build complete:', HTML_OUT);
  })
  .catch(function (err) {
    console.error('Build failed:', err);
    process.exit(1);
  });
