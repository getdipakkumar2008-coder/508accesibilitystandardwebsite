import { expect, test } from '@playwright/test';

const viewports = [
  { width: 320, height: 900 },
  { width: 480, height: 900 },
  { width: 768, height: 1024 },
  { width: 1024, height: 1024 },
  { width: 1280, height: 1024 },
];

for (const viewport of viewports) {
  test(`pages reflow without horizontal scrolling at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);

    for (const path of ['/', '/about', '/services', '/contact']) {
      await page.goto(path);

      const hasHorizontalOverflow = await page.evaluate(() => {
        const root = document.documentElement;
        return root.scrollWidth > root.clientWidth;
      });

      expect(
        hasHorizontalOverflow,
        `Expected no horizontal overflow at ${viewport.width}px on ${path}`,
      ).toBe(false);
    }
  });
}
