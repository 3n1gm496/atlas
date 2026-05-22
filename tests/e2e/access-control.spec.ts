import { expect, test } from '@playwright/test';
import { loginAsRole } from './helpers';

const protectedRoutes = ['/admin/media', '/admin/analytics', '/admin/audit', '/review'] as const;
const guestRedirect = /\/(login|account)(?:\?|$)/;

test.describe('access control', () => {
  test('anonymous visitors are redirected away from privileged routes', async ({ page }) => {
    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(guestRedirect);
    }
  });

  test('contributors cannot access admin or review surfaces', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAsRole(page, 'contributor');

    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(/\/account(?:\?|$)/);
    }

    await context.close();
  });
});
