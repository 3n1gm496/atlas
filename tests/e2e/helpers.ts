import { expect, Page } from '@playwright/test';
import cartel2Rows from '../../data/cartel2.dataset.json';

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const seededEntry = cartel2Rows.find((row) => row.A === '21024');

export const SEEDED_SLUGS = {
  entry: seededEntry ? `${slugify(seededEntry.B)}-${seededEntry.A}` : 'why-are-you-dressed-like-that-21024',
  collection: 'diaspora-traces',
  taxonomy: 'typological'
} as const;

export const SEEDED_USERS = {
  admin: { email: 'admin@atlas.local', password: 'admin1234' },
  editor: { email: 'editor@atlas.local', password: 'editor1234' },
  contributor: { email: 'contributor@atlas.local', password: 'contributor1234' },
  researcher: { email: 'researcher@atlas.local', password: 'researcher1234' }
} as const;

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.waitForTimeout(300);
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in|accedi|se connecter/i }).click();
  await page.waitForLoadState('networkidle');
}

export async function expectLoggedIn(page: Page) {
  await expect(page).toHaveURL(/\/account|\/admin|\/review|\/submit/);
}

export async function loginAsRole(page: Page, role: keyof typeof SEEDED_USERS) {
  const user = SEEDED_USERS[role];
  await login(page, user.email, user.password);
  await expectLoggedIn(page);
}

export async function createUniqueEntryDraft(page: Page) {
  const timestamp = Date.now();
  const slug = `atlas-e2e-${timestamp}`;
  const title = `ATLAS E2E Draft ${timestamp}`;

  await page.goto('/submit/new');
  await page.getByRole('button', { name: /step 1|passo 1|etape 1/i }).click();

  await page.getByLabel(/^slug/i).fill(slug);
  await page.getByLabel(/^editorial title|^titolo editoriale|^titre editorial/i).fill(title);
  await page.getByLabel(/^abstract/i).fill(`Abstract ${title}`);
  await page.getByLabel(/^main text|^testo principale|^texte principal/i).fill(`Critical description ${title} for the E2E workflow.`);
  await page.getByRole('button', { name: /^continue$|^continua$|^continuer$/i }).click();

  const countrySelect = page.getByLabel(/^country|^paese|^pays/i);
  const countryOptions = await countrySelect.locator('option').evaluateAll((options) =>
    options.map((option) => ({ value: option.getAttribute('value') ?? '', text: option.textContent ?? '' }))
  );
  const firstCountry = countryOptions.find((option) => option.value);
  if (!firstCountry) {
    throw new Error('No countries available in submission form');
  }
  await countrySelect.selectOption(firstCountry.value);
  await page.getByLabel(/^period|^periodo|^periode/i).fill('2024-2026');
  await page.getByRole('button', { name: /^continue$|^continua$|^continuer$/i }).click();

  await page.getByRole('button', { name: /^continue$|^continua$|^continuer$/i }).click();

  await page.locator('fieldset input[type="checkbox"]').first().check();
  await page.getByRole('button', { name: /^continue$|^continua$|^continuer$/i }).click();

  await page.getByLabel(/^where this material emerges from|^da dove emerge questo materiale|^ou ce materiau emerge/i).fill(
    'ANTICORES E2E test corpus'
  );
  await page.getByLabel(/^in two or three lines|^in due o tre righe|^en deux ou trois lignes/i).fill(
    'Final summary for the editorial workflow E2E card.'
  );
  await page.getByRole('button', { name: /save draft|salva bozza|enregistrer la fiche/i }).click();

  await expect(page.getByText(/draft saved|bozza salvata|fiche enregistree/i)).toBeVisible();
  return { slug, title };
}

export async function findEntryIdByTitle(page: Page, title: string) {
  const response = await page.evaluate(async (entryTitle) => {
    const result = await fetch(`/api/entries?q=${encodeURIComponent(entryTitle)}`);
    return result.json();
  }, title);

  const item = response?.data?.items?.find?.((candidate: { title: string }) => candidate.title === title);
  if (!item?.id) {
    throw new Error(`Unable to resolve entry id for title: ${title}`);
  }

  return item.id as string;
}

export async function apiPost(page: Page, url: string, payload: unknown) {
  return page.evaluate(
    async ({ targetUrl, body }) => {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json().catch(() => null);
      return { ok: response.ok, status: response.status, data };
    },
    { targetUrl: url, body: payload }
  );
}

export async function apiPatch(page: Page, url: string, payload: unknown) {
  return page.evaluate(
    async ({ targetUrl, body }) => {
      const response = await fetch(targetUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json().catch(() => null);
      return { ok: response.ok, status: response.status, data };
    },
    { targetUrl: url, body: payload }
  );
}
