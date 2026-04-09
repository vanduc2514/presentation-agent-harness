'use strict';

/**
 * build.cjs — Markpress-based presentation builder
 *
 * Converts slides/presentation.md into a self-contained output/index.html
 * using the markpress library.  Custom CSS and a browser-side DOM
 * transformation script are injected into the output via the markpress
 * Promise API.
 */

const fs             = require('fs');
const path           = require('path');
const { execFileSync, execSync } = require('child_process');
const markpress = require('markpress');

// ── Paths ─────────────────────────────────────────────────────────────────────
const ROOT      = __dirname;
const MD_INPUT  = path.join(ROOT, 'slides', 'presentation.md');
const CSS_INPUT = path.join(ROOT, 'styles.css');
const OUTPUT_DIR = path.join(ROOT, 'output');
const HTML_OUT  = path.join(OUTPUT_DIR, 'index.html');
const IMAGES_SRC = path.join(ROOT, 'slides', 'images');
const IMAGES_DST = path.join(OUTPUT_DIR, 'images');
const GITHUB_REPO_URL = 'https://github.com/vanduc2514/presentation-agent-harness';

// ── PDF filename (includes short commit hash for cache-busting) ───────────────
const GIT_HASH    = execSync('git rev-parse --short=7 HEAD', { cwd: ROOT }).toString().trim();
const PDF_FILENAME = `presentation-agent-harness-${GIT_HASH}.pdf`;

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
const SVG_GITHUB = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297C5.373.297 0 5.67 0 12.297c0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.608-4.042-1.608-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.084-.729.084-.729 1.204.085 1.838 1.237 1.838 1.237 1.07 1.835 2.807 1.305 3.492.998.107-.775.418-1.305.762-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.469-2.382 1.236-3.221-.124-.303-.536-1.523.118-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3-.404c1.02.005 2.047.138 3 .404 2.29-1.552 3.297-1.23 3.297-1.23.654 1.653.243 2.873.118 3.176.77.839 1.235 1.911 1.235 3.221 0 4.602-2.805 5.625-5.475 5.922.43.372.815 1.103.815 2.222 0 1.606-.015 2.896-.015 3.289 0 .322.216.694.825.576C20.565 22.097 24 17.599 24 12.297 24 5.67 18.627.297 12 .297z"/></svg>';
const SVG_DOWNLOAD = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';

// ── Build the browser-side transformation + init script ───────────────────────
function buildTransformScript(css, gridIconsJson, repoUrl, svgHome, svgPrev, svgNext, svgGithub, pdfFilename) {
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

  var repoLink = document.createElement('a');
  repoLink.className = 'slide-repo-link';
  repoLink.href = '${repoUrl}';
  repoLink.target = '_blank';
  repoLink.rel = 'noreferrer noopener';
  repoLink.title = 'Open the GitHub repository';
  repoLink.setAttribute('aria-label', 'Open the GitHub repository');
  repoLink.innerHTML = '${svgGithub}';
  document.body.appendChild(repoLink);

  var downloadLink = document.createElement('a');
  downloadLink.className = 'slide-download-link';
  downloadLink.href = './${pdfFilename}';
  downloadLink.download = '${pdfFilename}';
  downloadLink.title = 'Download presentation as PDF';
  downloadLink.setAttribute('aria-label', 'Download PDF');
  downloadLink.innerHTML = '${SVG_DOWNLOAD}';
  document.body.appendChild(downloadLink);

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
    scalerEl.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + s + ')';
  }
  scalePres();

  // ── Init impress ───────────────────────────────────────────────────────────
  var api = window.impress();
  api.init();

  // impress.js sets "overflow: hidden; height: 100%" as inline styles on <body>
  // during init, which overrides the mobile-layout CSS media query that needs
  // overflow-y: auto for slide content to be scrollable.  Strip those inline
  // styles on mobile and re-check on every resize.
  function fixBodyOverflow() {
    if (window.innerWidth < 768) {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
  }
  fixBodyOverflow();

  window.addEventListener('resize', function () { scalePres(); fixBodyOverflow(); });

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

  // ── Disable click-to-advance on slide background ──────────────────────────
  // impress.js has a built-in handler that advances to whichever .step the user
  // clicks on (if it is not the active step).  On mobile the tap is meant for
  // scroll / swiping, so we block that handler via capture-phase interception.
  document.addEventListener('click', function (e) {
    var node = e.target;
    while (node && node !== document.documentElement) {
      // let real interactive elements through
      if (node.tagName === 'BUTTON' || node.tagName === 'A') return;
      if (node.dataset && node.dataset.goto) return;
      if (node.classList && node.classList.contains('step')) {
        e.stopImmediatePropagation();
        return;
      }
      node = node.parentNode;
    }
  }, true); // capture phase — runs before impress.js bubble-phase handlers

  // ── Swipe left/right to navigate, up/down to scroll ──────────────────────
  // impress.js registers a touchstart listener (bubble phase) that navigates
  // when the user taps the left/right 30 % of the screen.  We supersede it by
  // registering our own capture-phase touchstart that records the start
  // position and stops propagation so impress.js never sees the event.  On
  // touchend we decide the intent: horizontal swipe → navigate; vertical → let
  // the browser handle scroll normally.
  var _sx = 0, _sy = 0;

  document.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) {
      _sx = e.touches[0].clientX;
      _sy = e.touches[0].clientY;
      e.stopImmediatePropagation(); // block impress.js touchstart handler
    }
  }, { passive: true, capture: true });

  document.addEventListener('touchend', function (e) {
    if (!e.changedTouches.length) return;
    var dx = e.changedTouches[0].clientX - _sx;
    var dy = e.changedTouches[0].clientY - _sy;
    // Only treat as a navigation swipe if horizontal motion dominates and
    // exceeds a minimum threshold.
    if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
    // Vertical swipes fall through to normal document scroll.
  }, { passive: false, capture: true });
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
      GITHUB_REPO_URL,
      SVG_HOME,
      SVG_PREV,
      SVG_NEXT,
      SVG_GITHUB,
      PDF_FILENAME
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

    // 7. Generate PDF (requires Playwright Chromium to be installed)
    console.log(`Generating PDF: ${PDF_FILENAME}…`);
    execFileSync('node', [path.join(ROOT, 'scripts', 'generate-pdf.cjs'), PDF_FILENAME], {
      stdio: 'inherit',
      cwd: ROOT,
    });
    console.log('PDF build complete.');
  })
  .catch(function (err) {
    console.error('Build failed:', err);
    process.exit(1);
  });
