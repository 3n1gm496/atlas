import { expect, test } from '@playwright/test';

test('homepage loads on the configured target', async ({ page, baseURL }) => {
  await page.goto('/');
  if (baseURL) {
    await expect(page).toHaveURL(new RegExp(baseURL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  await expect(page.getByRole('heading', { level: 1, name: /cartography.*digital fashion aesthetics|cartografia.*estetiche digitali della moda|cartographie.*esthetiques numeriques de la mode/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /map|mappa|carte/i }).first()).toBeVisible();
});
