import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('home page has skip-nav, landmarks, and no axe violations', async ({ page }) => {
  await page.goto('/');

  const skipNav = page.getByRole('link', { name: /skip to main content/i });
  await expect(skipNav).toBeVisible();

  await page.keyboard.press('Tab');
  await expect(skipNav).toBeFocused();

  await expect(page.locator('header')).toHaveCount(1);
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('footer')).toHaveCount(1);
  await expect(page.locator('nav[aria-label="Primary navigation"]')).toHaveCount(1);

  const axeResults = await new AxeBuilder({ page }).analyze();
  expect(axeResults.violations).toEqual([]);
});
