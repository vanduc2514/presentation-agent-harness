'use strict';

/**
 * generate-pdf.cjs — Playwright-based PDF generator
 *
 * Navigates through every slide of the built presentation, captures a
 * high-resolution screenshot of each one (nav bar and UI buttons hidden),
 * assembles them into an A4-landscape print HTML, and converts it to PDF.
 *
 * Usage:  node scripts/generate-pdf.cjs <pdf-filename>
 * Pre-condition: `npm run build:markpress` must have run first.
 */

const { chromium } = require('playwright');
const { spawn }    = require('child_process');
const fs           = require('fs');
const path         = require('path');

// ── Configuration ─────────────────────────────────────────────────────────────

const PORT         = 4174; // different port from visual-qa.cjs (4173)
const BASE_URL     = `http://localhost:${PORT}`;
const OUTPUT_DIR   = path.join(__dirname, '..', 'output');
const GITHUB_REPO_URL = 'https://github.com/vanduc2514/presentation-agent-harness';
const NAV_TIMEOUT  = 10_000;

const PDF_FILENAME = process.argv[2];
if (!PDF_FILENAME) {
  console.error('ERROR: PDF filename argument is required (e.g. presentation-agent-harness-abc1234.pdf)');
  process.exit(1);
}
const PDF_OUT = path.join(OUTPUT_DIR, PDF_FILENAME);

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function startServer() {
  return new Promise((resolve, reject) => {
    const server = spawn(
      'npx', ['serve', OUTPUT_DIR, '-l', String(PORT), '--no-clipboard'],
      { stdio: ['ignore', 'pipe', 'pipe'], detached: true }
    );

    let resolved = false;

    function onData(data) {
      const text = data.toString();
      if (!resolved && text.includes(String(PORT))) {
        resolved = true;
        resolve(server);
      }
    }

    server.stdout.on('data', onData);
    server.stderr.on('data', onData);
    server.on('error', reject);

    setTimeout(() => {
      if (!resolved) { resolved = true; resolve(server); }
    }, 10_000);
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────

(async () => {
  if (!fs.existsSync(path.join(OUTPUT_DIR, 'index.html'))) {
    console.error('ERROR: output/index.html not found. Run `npm run build:markpress` first.');
    process.exit(1);
  }

  console.log(`Starting server on port ${PORT}…`);
  const serverProcess = await startServer();
  await sleep(1_000);

  const browser = await chromium.launch();

  try {
    // ── Capture slide screenshots ─────────────────────────────────────────────

    const context = await browser.newContext({
      viewport: { width: 1600, height: 900 },
      deviceScaleFactor: 2, // 2× resolution for crisp PDF output
    });
    const page = await context.newPage();

    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30_000 });
    await page.waitForSelector('.impress-on', { timeout: NAV_TIMEOUT }).catch(() => {});
    await sleep(800);

    // Hide all interactive UI overlays — they must not appear in the PDF
    await page.addStyleTag({
      content: '.slide-nav, .slide-repo-link, .slide-download-link { display: none !important; }',
    });

    // Collect step IDs in presentation order
    const stepIds = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.step')).map((s) => s.id)
    );

    const screenshots = []; // base64 PNG strings

    for (let i = 0; i < stepIds.length; i++) {
      await page.evaluate((id) => window.impress().goto(id), stepIds[i]);
      await sleep(700); // wait for transition to finish

      const buf = await page.screenshot({ type: 'png' });
      screenshots.push(buf.toString('base64'));
      console.log(`  Captured slide ${i + 1}/${stepIds.length}: ${stepIds[i]}`);
    }

    await context.close();

    // ── Build print HTML ──────────────────────────────────────────────────────

    const totalPages = screenshots.length;

    const pagesHtml = screenshots
      .map(
        (img, i) => `
  <div class="pdf-page">
    <img class="pdf-slide-img" src="data:image/png;base64,${img}" alt="Slide ${i + 1}">
    <div class="pdf-footer">
      <span class="pdf-repo-url">${GITHUB_REPO_URL}</span>
      <span class="pdf-page-num">${i + 1} / ${totalPages}</span>
    </div>
  </div>`
      )
      .join('\n');

    const printHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
@page { size: A4 landscape; margin: 0; }
body { background: white; font-family: "Avenir Next", "Segoe UI", sans-serif; }
.pdf-page {
  width: 297mm;
  height: 210mm;
  position: relative;
  break-after: page;
  overflow: hidden;
  background: white;
  display: flex;
  flex-direction: column;
}
.pdf-page:last-child { break-after: auto; }
.pdf-slide-img {
  display: block;
  width: 100%;
  flex: 1;
  object-fit: contain;
  object-position: center;
  min-height: 0;
}
.pdf-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  height: 22px;
  flex-shrink: 0;
  background: #f5f4f0;
  border-top: 1px solid #e0ddd8;
  font-size: 8pt;
  color: #555;
}
</style>
</head>
<body>
${pagesHtml}
</body>
</html>`;

    // ── Generate PDF ──────────────────────────────────────────────────────────

    const printPage = await browser.newPage();
    await printPage.setContent(printHtml, { waitUntil: 'networkidle' });
    await sleep(500);

    await printPage.pdf({
      path: PDF_OUT,
      format: 'A4',
      landscape: true,
      printBackground: true,
    });

    console.log(`PDF generated: ${PDF_OUT}`);
    await printPage.close();
  } finally {
    await browser.close();
    try {
      process.kill(-serverProcess.pid, 'SIGTERM');
    } catch (_) {
      serverProcess.kill();
    }
  }
})().catch((err) => {
  console.error('PDF generation failed:', err);
  process.exit(1);
});
