import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const baseURL = process.env.REVIEW_BASE_URL ?? process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3210';
const outputRoot = path.resolve(process.cwd(), '.tmp/browser-audit');
const routeFilter = new Set(
  (process.env.AUDIT_ROUTES ?? '')
    .split(',')
    .map((route) => route.trim())
    .filter(Boolean)
);

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet-portrait', width: 768, height: 1024 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
  { name: 'desktop', width: 1366, height: 768 },
  { name: 'desktop-large', width: 1440, height: 900 },
  { name: 'desktop-xl', width: 1920, height: 1080 }
];

const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/methodology',
  '/collections',
  '/collections/diaspora-traces',
  '/taxonomy',
  '/taxonomy/typological',
  '/search',
  '/archive',
  '/map',
  '/entry/why-are-you-dressed-like-that-21024',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/terms',
  '/privacy',
  '/accessibility'
];

const contributorRoutes = [
  '/account',
  '/account/profile',
  '/account/favorites',
  '/account/saved-searches',
  '/account/notifications',
  '/account/submissions',
  '/submit',
  '/submit/new'
];

const editorRoutes = [];
const adminRoutes = [
  '/review',
  '/admin',
  '/admin/entries',
  '/admin/collections',
  '/admin/taxonomies',
  '/admin/users',
  '/admin/import-export',
  '/admin/analytics',
  '/admin/audit',
  '/admin/settings'
];

function safeName(route) {
  return route === '/' ? 'home' : route.replace(/[/:?&=#]+/g, '-').replace(/^-+|-+$/g, '');
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function login(page, email, password) {
  await page.goto(`${baseURL}/login`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(300);
  const csrfToken = await page.evaluate(async () => {
    const response = await fetch('/api/auth/csrf');
    const payload = await response.json();
    return payload.csrfToken;
  });

  const result = await page.evaluate(
    async ({ targetEmail, targetPassword, token }) => {
      const body = new URLSearchParams({
        csrfToken: token,
        callbackUrl: '/account',
        json: 'true',
        email: targetEmail,
        password: targetPassword
      });
      const response = await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });
      return {
        status: response.status,
        text: await response.text()
      };
    },
    { targetEmail: email, targetPassword: password, token: csrfToken }
  );

  if (result.status >= 400) {
    throw new Error(`Browser audit login failed with status ${result.status}: ${result.text}`);
  }

  await page.goto(`${baseURL}/account`, { waitUntil: 'networkidle', timeout: 30000 });
}

async function buildContext(browser, viewport, auth) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  if (auth) {
    await login(page, auth.email, auth.password);
    await page.close();
  }
  return { context };
}

async function detectOverflow(page) {
  return page.evaluate(() => {
    const overflowNodes = [];
    for (const element of Array.from(document.querySelectorAll('body *'))) {
      const html = element;
      if (!(html instanceof HTMLElement)) continue;
      const rect = html.getBoundingClientRect();
      if (rect.right > window.innerWidth + 1 || rect.left < -1) {
        overflowNodes.push(html.tagName.toLowerCase());
      }
    }
    return {
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      overflowNodes: [...new Set(overflowNodes)].slice(0, 20)
    };
  });
}

async function captureHotspots(page, viewportDir, routeName, viewport) {
  await page.screenshot({
    path: path.join(viewportDir, `${routeName}--full.png`),
    fullPage: true
  });

  await page.screenshot({
    path: path.join(viewportDir, `${routeName}--first-fold.png`),
    clip: { x: 0, y: 0, width: viewport.width, height: Math.min(viewport.height, 900) }
  });

  const header = page.locator('header').first();
  if (await header.count()) {
    await header.screenshot({ path: path.join(viewportDir, `${routeName}--header.png`) }).catch(() => undefined);
  }

  const footer = page.locator('footer').first();
  if (await footer.count()) {
    await footer.screenshot({ path: path.join(viewportDir, `${routeName}--footer.png`) }).catch(() => undefined);
  }
}

async function auditRoute(page, route, viewportDir, viewport) {
  const consoleIssues = [];
  const pageErrors = [];
  page.removeAllListeners('console');
  page.removeAllListeners('pageerror');
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleIssues.push(msg.text());
  });
  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
  });

  const response = await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
  const routeName = safeName(route);
  await captureHotspots(page, viewportDir, routeName, viewport);
  const overflow = await detectOverflow(page);

  const zoomChecks = [];
  for (const zoom of [1, 1.25, 1.5]) {
    await page.evaluate((value) => {
      document.body.style.zoom = String(value);
    }, zoom);
    await page.waitForTimeout(100);
    const zoomOverflow = await detectOverflow(page);
    zoomChecks.push({ zoom, ...zoomOverflow });
  }
  await page.evaluate(() => {
    document.body.style.zoom = '1';
  });

  return {
    route,
    status: response?.status() ?? null,
    finalUrl: page.url(),
    consoleIssues,
    pageErrors,
    ...overflow,
    zoomChecks
  };
}

async function runGroup(browser, viewport, name, routes, auth) {
  const viewportDir = path.join(outputRoot, viewport.name);
  await ensureDir(viewportDir);
  const { context } = await buildContext(browser, viewport, auth);
  const results = [];
  for (const route of routes) {
    const page = await context.newPage();
    results.push(await auditRoute(page, route, viewportDir, viewport));
    await page.close();
  }
  await context.close();
  return { name, routes: results };
}

async function main() {
  await fs.rm(outputRoot, { recursive: true, force: true });
  await ensureDir(outputRoot);

  const browser = await chromium.launch({
    headless: true,
    chromiumSandbox: false,
    args: ['--no-sandbox']
  });
  const summary = [];

  const filterRoutes = (routes) => (routeFilter.size > 0 ? routes.filter((route) => routeFilter.has(route)) : routes);

  for (const viewport of viewports) {
    const groups = [];
    groups.push(await runGroup(browser, viewport, 'public', filterRoutes(publicRoutes), null));
    groups.push(
      await runGroup(browser, viewport, 'contributor', filterRoutes(contributorRoutes), {
        email: 'contributor@atlas.local',
        password: 'contributor1234'
      })
    );
    if (editorRoutes.length > 0) {
      groups.push(
        await runGroup(browser, viewport, 'editor', filterRoutes(editorRoutes), {
          email: 'editor@atlas.local',
          password: 'editor1234'
        })
      );
    }
    groups.push(
      await runGroup(browser, viewport, 'admin', filterRoutes(adminRoutes), {
        email: 'admin@atlas.local',
        password: 'admin1234'
      })
    );
    summary.push({ viewport: viewport.name, width: viewport.width, height: viewport.height, groups });
  }

  await browser.close();
  await fs.writeFile(path.join(outputRoot, 'summary.json'), JSON.stringify(summary, null, 2));
  console.log(`Browser audit written to ${outputRoot}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
