import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

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
  '/taxonomy',
  '/search',
  '/archive',
  '/map',
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

const adminRoutes = [
  '/review',
  '/admin',
  '/admin/entries',
  '/admin/collections',
  '/admin/taxonomies',
  '/admin/users',
  '/admin/media',
  '/admin/import-export',
  '/admin/analytics',
  '/admin/audit',
  '/admin/settings'
];

function safeName(route) {
  return route === '/' ? 'home' : route.replace(/[/:?&=#]+/g, '-').replace(/^-+|-+$/g, '');
}

function uniqueRoutes(routes) {
  return [...new Set(routes)];
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function launchBrowserWithRetry() {
  let lastError;
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      return await chromium.launch({
        headless: true,
        chromiumSandbox: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--no-zygote', '--disable-dev-shm-usage']
      });
    } catch (error) {
      lastError = error;
      if (attempt < 6) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
      }
    }
  }
  throw lastError;
}

async function login(page, baseURL, email, password) {
  await page.goto(`${baseURL}/login`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(300);
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in|accedi|se connecter/i }).click();
  await page.waitForLoadState('networkidle', { timeout: 30000 });
}

async function buildContext(browser, baseURL, viewport, auth) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  if (auth) {
    await login(page, baseURL, auth.email, auth.password);
    await page.close();
  }
  return { context };
}

async function discoverDetailRoutes(context, baseURL, route, selector) {
  const page = await context.newPage();
  try {
    await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
    return await page.$$eval(selector, (nodes) =>
      nodes
        .map((node) => {
          if (!(node instanceof HTMLAnchorElement)) return null;
          return node.getAttribute('href');
        })
        .filter((href) => typeof href === 'string' && href.length > 0)
        .map((href) => href.split('?')[0])
    );
  } catch {
    return [];
  } finally {
    await page.close();
  }
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

async function auditRoute(page, baseURL, route, viewportDir, viewport) {
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

async function runGroup(browser, baseURL, viewport, name, routes, auth, viewportDir) {
  await ensureDir(viewportDir);
  const { context } = await buildContext(browser, baseURL, viewport, auth);
  const results = [];
  for (const route of routes) {
    const page = await context.newPage();
    results.push(await auditRoute(page, baseURL, route, viewportDir, viewport));
    await page.close();
  }
  await context.close();
  return { name, routes: results };
}

function collectFailures(summary) {
  const failures = [];

  for (const viewport of summary) {
    for (const group of viewport.groups) {
      for (const route of group.routes) {
        const prefix = `${viewport.viewport} ${group.name} ${route.route}`;

        if (route.status !== 200) {
          failures.push(`${prefix}: expected HTTP 200, got ${route.status ?? 'null'}`);
        }

        for (const error of route.pageErrors) {
          failures.push(`${prefix}: pageerror: ${error}`);
        }

        for (const issue of route.consoleIssues) {
          failures.push(`${prefix}: console error: ${issue}`);
        }

        if (route.hasHorizontalOverflow) {
          failures.push(`${prefix}: horizontal overflow detected`);
        }
      }
    }
  }

  return failures;
}

async function runAudit(browser, baseURL) {
  const summary = [];
  const targetDir = outputRoot;
  await fs.rm(targetDir, { recursive: true, force: true });
  await ensureDir(targetDir);

  const filterRoutes = (routes) => (routeFilter.size > 0 ? routes.filter((route) => routeFilter.has(route)) : routes);

  for (const viewport of viewports) {
    const viewportDir = path.join(targetDir, viewport.name);
    const discoveryContext = await browser.newContext({ viewport });
    const discoveredPublicRoutes = uniqueRoutes([
      ...filterRoutes(await discoverDetailRoutes(discoveryContext, baseURL, '/archive', 'a[href^="/entry/"]')),
      ...filterRoutes(await discoverDetailRoutes(discoveryContext, baseURL, '/collections', 'a[href^="/collections/"]')),
      ...filterRoutes(await discoverDetailRoutes(discoveryContext, baseURL, '/taxonomy', 'a[href^="/taxonomy/"]'))
    ]).filter((route) => route !== '/collections' && route !== '/taxonomy');
    await discoveryContext.close();

    const groups = [];
    groups.push(await runGroup(browser, baseURL, viewport, 'public', filterRoutes(uniqueRoutes([...publicRoutes, ...discoveredPublicRoutes])), null, viewportDir));
    groups.push(
      await runGroup(browser, baseURL, viewport, 'contributor', filterRoutes(contributorRoutes), {
        email: 'contributor@atlas.local',
        password: 'contributor1234'
      }, viewportDir)
    );
    groups.push(
      await runGroup(browser, baseURL, viewport, 'admin', filterRoutes(adminRoutes), {
        email: 'admin@atlas.local',
        password: 'admin1234'
      }, viewportDir)
    );
    summary.push({ baseURL, target: baseURL, viewport: viewport.name, width: viewport.width, height: viewport.height, groups });
  }

  const failures = collectFailures(summary);
  await fs.writeFile(path.join(targetDir, 'summary.json'), JSON.stringify(summary, null, 2));
  if (failures.length > 0) {
    throw new Error(`Browser audit failed for ${baseURL}:\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
  }
}

async function main() {
  await fs.rm(outputRoot, { recursive: true, force: true });
  await ensureDir(outputRoot);

  const baseURL = process.env.REVIEW_BASE_URL ?? process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3210';
  const browser = await launchBrowserWithRetry();
  try {
    await runAudit(browser, baseURL);
  } finally {
    await browser.close();
  }

  console.log(`Browser audit written to ${outputRoot}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
