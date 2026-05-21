import { expect, test } from '@playwright/test';
import { SEEDED_SLUGS } from './helpers';

test.describe('public discovery and auth surfaces', () => {
  test('public discovery routes load core surfaces', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: /cartography.*digital fashion aesthetics|cartografia.*estetiche digitali della moda|cartographie.*esthetiques numeriques de la mode/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /map|mappa|carte/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /archive|archivio/i }).first()).toBeVisible();

    await page.goto('/search');
    await expect(page).toHaveURL(/\/archive(?:\?|$)/);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();

    await page.goto('/taxonomy');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page.goto(`/collections/${SEEDED_SLUGS.collection}`);
    await expect(page).toHaveURL(new RegExp(`/collections/${SEEDED_SLUGS.collection}$`));

    await page.goto(`/taxonomy/${SEEDED_SLUGS.taxonomy}`);
    await expect(page).toHaveURL(new RegExp(`/taxonomy/${SEEDED_SLUGS.taxonomy}$`));

    await page.goto(`/entry/${SEEDED_SLUGS.entry}`);
    await expect(page).toHaveURL(new RegExp(`/entry/${SEEDED_SLUGS.entry}$`));

    await page.goto('/map');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('login, register and recovery surfaces handle core paths', async ({ page }) => {
    await page.goto('/login');
    await page.waitForTimeout(300);
    await page.getByLabel(/email/i).fill('admin@atlas.local');
    await page.getByLabel(/password/i).fill('wrong-password');
    await page.getByRole('button', { name: /sign in|accedi|se connecter/i }).click();
    await expect(page).not.toHaveURL(/\/account|\/admin|\/review|\/submit/);
    await expect(page.getByRole('heading', { name: /enter anticores|entra in anticores|entrez dans anticores/i })).toBeVisible();

    const unique = Date.now();
    await page.goto('/register');
    await page.getByLabel(/display name|nome visualizzato|nom affiche/i).fill(`ATLAS E2E ${unique}`);
    await page.getByLabel(/email/i).fill(`atlas-e2e-${unique}@example.test`);
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /create account|crea account|creer un compte/i }).click();
    await expect(page).toHaveURL(/\/login\?registered=1$/);

    await page.goto('/forgot-password');
    await expect(page.getByRole('heading', { name: /password recovery|recupero password|recuperation du mot de passe/i })).toBeVisible();

    await page.goto('/reset-password');
    await expect(page.getByRole('heading', { name: /set a new password|imposta nuova password|definir un nouveau mot de passe/i })).toBeVisible();
  });
});
