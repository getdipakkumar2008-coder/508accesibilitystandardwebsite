import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('contact page form is present and has no axe violations', async ({ page }) => {
  await page.goto('/contact');

  const form = page.locator('form.usa-form');
  await expect(form).toBeVisible();

  await expect(page.getByLabel(/full name/i)).toBeVisible();
  await expect(page.getByLabel(/email address/i)).toBeVisible();
  await expect(page.getByLabel(/message/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /send message/i })).toBeVisible();

  const axeResults = await new AxeBuilder({ page }).analyze();
  expect(axeResults.violations).toEqual([]);
});
