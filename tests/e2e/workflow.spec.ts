import { expect, test } from '@playwright/test';
import {
  apiPost,
  createUniqueEntryDraft,
  findEntryIdByTitle,
  loginAsRole
} from './helpers';

test.describe.configure({ mode: 'serial' });

test('contributor to review to publish workflow is verified end-to-end', async ({ browser }) => {
  const contributorContext = await browser.newContext();
  const contributorPage = await contributorContext.newPage();
  await loginAsRole(contributorPage, 'contributor');

  const created = await createUniqueEntryDraft(contributorPage);
  await contributorPage.goto('/submit');
  await expect(contributorPage.getByText(created.title)).toBeVisible();

  const entryId = await findEntryIdByTitle(contributorPage, created.title);
  const submitResult = await apiPost(contributorPage, '/api/submit', { entryId });
  expect(submitResult.ok).toBeTruthy();
  expect(submitResult.data?.data?.status).toBe('submitted');

  await contributorContext.close();

  const reviewerContext = await browser.newContext();
  const reviewerPage = await reviewerContext.newPage();
  await loginAsRole(reviewerPage, 'researcher');
  await reviewerPage.goto('/review');
  await expect(reviewerPage.getByRole('heading', { name: /inbox and selected card view|inbox e scheda selezionata|inbox et fiche selectionnee/i })).toBeVisible();

  const startReview = await apiPost(reviewerPage, '/api/review', {
    entryId,
    action: 'start_review',
    comment: 'Playwright review started'
  });
  expect(startReview.ok).toBeTruthy();
  expect(startReview.data?.data?.status).toBe('under_review');

  const approve = await apiPost(reviewerPage, '/api/review', {
    entryId,
    action: 'approve',
    comment: 'Playwright approval'
  });
  expect(approve.ok).toBeTruthy();
  expect(approve.data?.data?.status).toBe('approved');

  await reviewerContext.close();

  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  await loginAsRole(adminPage, 'admin');

  await adminPage.goto('/admin');
  await expect(adminPage.getByRole('heading', { name: /edit cards, edit taxonomy, manage the map|modifica schede, tassonomie e mappa/i })).toBeVisible();

  await adminPage.goto('/admin/media');
  await expect(adminPage.getByRole('heading', { name: /media library|libreria media/i })).toBeVisible();

  await adminPage.goto('/admin/analytics');
  await expect(adminPage.getByRole('heading', { name: /useful numbers, not noise|numeri utili, non rumore/i })).toBeVisible();

  await adminPage.goto('/admin/audit');
  await expect(adminPage.getByRole('heading', { name: /action history|cronologia delle azioni|historique des actions/i })).toBeVisible();
  await expect(adminPage.getByRole('table')).toBeVisible();

  const publish = await apiPost(adminPage, '/api/review', {
    entryId,
    action: 'publish',
    comment: 'Final publication'
  });
  expect(publish.ok).toBeTruthy();
  expect(publish.data?.data?.status).toBe('published');

  await adminContext.close();

  const publicContext = await browser.newContext();
  const publicPage = await publicContext.newPage();
  await publicPage.goto(`/entry/${created.slug}`);
  await expect(publicPage.getByRole('heading', { name: created.title })).toBeVisible();
  await publicContext.close();
});
