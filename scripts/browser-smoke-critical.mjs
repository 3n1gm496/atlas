import { chromium } from '@playwright/test';

const baseURL = process.env.REVIEW_BASE_URL ?? process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3210';

async function login(page, email, password, expectedPath) {
  await page.goto(`${baseURL}/login`, { waitUntil: 'networkidle', timeout: 20000 });
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await Promise.all([
    page.waitForURL(new RegExp(expectedPath), { timeout: 20000 }),
    page.getByRole('button', { name: /sign in|accedi|se connecter/i }).click()
  ]);
  await page.waitForLoadState('networkidle');
}

async function auditPage(page, route) {
  const consoleIssues = [];
  const pageErrors = [];
  page.removeAllListeners('console');
  page.removeAllListeners('pageerror');
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleIssues.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(err.message));

  const response = await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle', timeout: 20000 });
  const title = await page.title();
  const overflow = await page.evaluate(() => ({
    hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
  }));

  return {
    route,
    status: response?.status() ?? null,
    title,
    finalUrl: page.url(),
    consoleIssues,
    pageErrors,
    ...overflow
  };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  const publicContext = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const publicPage = await publicContext.newPage();
  for (const route of ['/', '/map', '/login']) {
    results.push({ scope: 'public', ...(await auditPage(publicPage, route)) });
  }
  await publicContext.close();

  const contributorContext = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const contributorPage = await contributorContext.newPage();
  await login(contributorPage, 'contributor@atlas.local', 'contributor1234', '/account');
  results.push({ scope: 'contributor', ...(await auditPage(contributorPage, '/account')) });
  await contributorContext.close();

  const adminContext = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const adminPage = await adminContext.newPage();
  await login(adminPage, 'admin@atlas.local', 'admin1234', '/account');
  results.push({ scope: 'admin', ...(await auditPage(adminPage, '/review')) });
  results.push({ scope: 'admin', ...(await auditPage(adminPage, '/admin/settings')) });
  await adminContext.close();

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
