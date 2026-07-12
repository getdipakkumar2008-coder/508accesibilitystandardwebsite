import { expect, test } from '@playwright/test';

test('mobile menu toggle updates aria-expanded and supports keyboard close', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/');

  const menuButton = page.getByRole('button', { name: 'Menu' });
  await expect(menuButton).toBeVisible();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

  await menuButton.click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

  const firstNavLink = page
    .getByLabel('Primary navigation')
    .getByRole('link', { name: 'Home' })
    .first();
  await expect(firstNavLink).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(menuButton).toBeFocused();
});

test('active page is marked with aria-current in primary nav', async ({ page }) => {
  await page.goto('/services');

  await expect(page.locator('nav[aria-label="Primary navigation"] a[aria-current="page"]')).toContainText(
    'Services',
  );
});
