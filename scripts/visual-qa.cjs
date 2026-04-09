'use strict';

/**
 * visual-qa.cjs — Playwright-based visual QA script
 *
 * Serves the built presentation (output/index.html) on a local port,
 * then captures screenshots of the first few slides at each of several
 * viewport sizes.  All screenshots are written to screenshots/ at the
 * repo root (qa-screenshots/).
 *
 * Usage: node scripts/visual-qa.cjs
 * Pre-condition: `npm run build:markpress` must have run first.
 */

const { chromium } = require('playwright');
const { spawn }    = require('child_process');
const fs           = require('fs');
const path         = require('path');

// ── Configuration ─────────────────────────────────────────────────────────────

const PORT         = 4173;
const BASE_URL     = `http://localhost:${PORT}`;
const OUTPUT_DIR   = path.join(__dirname, '..', 'output');
const SCREENSHOT_DIR = path.join(__dirname, '..', 'qa-screenshots');
const SLIDES_TO_CAPTURE = 15;  // number of slides to capture per viewport
const NAV_TIMEOUT  = 10_000;   // ms to wait for slide transitions

const VIEWPORTS = [
  { name: 'desktop-1920x1080', width: 1920, height: 1080 },
  { name: 'laptop-1440x900',   width: 1440, height: 900  },
  { name: 'laptop-1280x800',   width: 1280, height: 800  },
  { name: 'tablet-768x1024',   width: 768,  height: 1024 },
  { name: 'mobile-390x844',    width: 390,  height: 844  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Start `npx serve output -l <port>` as a child process.
 * Returns { process, waitReady } where waitReady() resolves when the server
 * is accepting connections.
 */
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

    // Fallback: if not resolved in 10 s, assume it's up
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(server);
      }
    }, 10_000);
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────

(async () => {
  // Ensure the output build exists
  if (!fs.existsSync(path.join(OUTPUT_DIR, 'index.html'))) {
    console.error('ERROR: output/index.html not found. Run `npm run build:markpress` first.');
    process.exit(1);
  }

  // Clean and recreate screenshots directory
  if (fs.existsSync(SCREENSHOT_DIR)) {
    fs.rmSync(SCREENSHOT_DIR, { recursive: true });
  }
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  // Start static server
  console.log(`Starting server on port ${PORT}…`);
  const serverProcess = await startServer();
  await sleep(1_000); // brief extra wait for the port to be fully ready

  const browser = await chromium.launch();

  try {
    const capturedFiles = [];

    for (const vp of VIEWPORTS) {
      console.log(`\n── Viewport: ${vp.name} (${vp.width}×${vp.height}) ──`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await context.newPage();

      // Load presentation and wait for impress.js to initialise
      await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30_000 });
      await page.waitForSelector('.impress-on', { timeout: NAV_TIMEOUT }).catch(() => {
        // impress adds .impress-on to <body>; fall back gracefully
      });
      await sleep(800);

      for (let slide = 1; slide <= SLIDES_TO_CAPTURE; slide++) {
        const fileName = `${vp.name}_slide-${String(slide).padStart(2, '0')}.png`;
        const filePath = path.join(SCREENSHOT_DIR, fileName);

        await page.screenshot({ path: filePath, fullPage: false });
        capturedFiles.push(fileName);
        console.log(`  Captured: ${fileName}`);

        // Navigate to the next slide (skip after the last capture)
        if (slide < SLIDES_TO_CAPTURE) {
          await page.click('#nav-next').catch(() =>
            page.keyboard.press('ArrowRight')
          );
          await sleep(600); // wait for transition
        }
      }

      await context.close();
    }

    console.log(`\n✅ Done. ${capturedFiles.length} screenshots saved to qa-screenshots/`);
    capturedFiles.forEach((f) => console.log(`  ${f}`));
  } finally {
    await browser.close();
    // Kill the whole process group to ensure the serve child exits cleanly
    try {
      process.kill(-serverProcess.pid, 'SIGTERM');
    } catch (_) {
      serverProcess.kill();
    }
  }
})().catch((err) => {
  console.error('Visual QA failed:', err);
  process.exit(1);
});
