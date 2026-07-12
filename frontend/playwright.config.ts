import { defineConfig } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:4173';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  ...(process.env.E2E_BASE_URL
    ? {}
    : {
        webServer: {
          command:
            'npx http-server dist/frontend/browser -p 4173 -a 127.0.0.1 -c-1 -P http://127.0.0.1:4173?',
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }),
});
