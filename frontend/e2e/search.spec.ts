import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('search page is keyboard operable, has a live region, and has no axe violations', async ({
  page,
}) => {
  await page.goto('/search');

  // The page should have a single h1
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  // Combobox input should be present and labelled
  const comboboxInput = page.locator('input[role="combobox"]');
  await expect(comboboxInput).toBeVisible();

  // Polite live region should exist
  await expect(page.locator('[aria-live="polite"][role="status"]')).toHaveCount(1);

  // Keyboard operability: Tab to the input, type a query, results appear
  await page.keyboard.press('Tab'); // skip nav
  await comboboxInput.focus();
  await comboboxInput.type('access');

  // Listbox should expand with matching options
  const listbox = page.locator('[role="listbox"]');
  await expect(listbox).toBeVisible();

  // Arrow-key navigation should not crash and should move focus indicator
  await page.keyboard.press('ArrowDown');
  const activeOption = listbox.locator('[aria-selected="true"]');
  await expect(activeOption).toBeVisible();

  // Escape closes the listbox
  await page.keyboard.press('Escape');
  await expect(listbox).not.toBeVisible();

  // Full axe scan: no violations on the search page
  const axeResults = await new AxeBuilder({ page }).analyze();
  expect(axeResults.violations).toEqual([]);
});

test('search page pre-populates query from URL parameter', async ({ page }) => {
  await page.goto('/search?q=accessibility');

  const comboboxInput = page.locator('input[role="combobox"]');
  await expect(comboboxInput).toHaveValue('accessibility');
});

test('navigating from home search form lands on search page with query', async ({ page }) => {
  await page.goto('/');

  // Type a query in the home page search form and submit
  const homeSearchInput = page.locator('#home-search-input');
  await homeSearchInput.fill('services');
  await page.locator('form[role="search"]').evaluate((form: HTMLFormElement) => form.requestSubmit());

  // Should navigate to /search with query param
  await page.waitForURL('/search?q=services');
  await expect(page.locator('input[role="combobox"]')).toHaveValue('services');
});
