import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('home page has required landmarks, headings, search semantics, and no axe violations', async ({ page }) => {
  await page.goto('/');

  const skipNav = page.getByRole('link', { name: /skip to main content/i });
  await expect(skipNav).toBeVisible();

  await page.keyboard.press('Tab');
  await expect(skipNav).toBeFocused();

  await expect(page.locator('header')).toHaveCount(1);
  await expect(page.locator('main#main-content')).toHaveCount(1);
  await expect(page.locator('footer')).toHaveCount(1);
  await expect(page.locator('nav[aria-label="Primary navigation"]')).toHaveCount(1);

  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 2, name: 'Quick links' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Search this site' })).toBeVisible();

  await expect(page.locator('form[role="search"] label[for="home-search-input"]')).toBeVisible();
  await expect(page.locator('#home-search-input')).toHaveAttribute(
    'placeholder',
    /accessibility statement/i,
  );

  const axeResults = await new AxeBuilder({ page }).analyze();
  expect(axeResults.violations).toEqual([]);
});
