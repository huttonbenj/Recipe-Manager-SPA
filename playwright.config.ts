import { defineConfig, devices } from '@playwright/test';
import { CLIENT_CONFIG, TIMEOUTS } from '@recipe-manager/shared';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: TIMEOUTS.TEST_TIMEOUT,
  expect: {
    timeout: CLIENT_CONFIG.TOAST_DURATION.ERROR,
  },
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || `http://localhost:${CLIENT_CONFIG.DEFAULT_PORT}`,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
}); 