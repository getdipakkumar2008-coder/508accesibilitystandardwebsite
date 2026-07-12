import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('about page includes breadcrumb and accessible data table', async ({ page }) => {
  await page.goto('/about');

  await expect(page.locator('nav[aria-label="Breadcrumb"]')).toBeVisible();
  await expect(page.locator('nav[aria-label="Breadcrumb"] [aria-current="page"]')).toContainText(
    'About',
  );

  const table = page.locator('table').first();
  await expect(table.locator('caption')).toBeVisible();
  await expect(table.locator('thead th[scope="col"]')).toHaveCount(4);
  await expect(table.locator('tbody th[scope="row"]')).toHaveCount(2);

  const axeResults = await new AxeBuilder({ page }).analyze();
  expect(axeResults.violations).toEqual([]);
});
