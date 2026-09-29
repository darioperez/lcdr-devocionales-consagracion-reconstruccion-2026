import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: "http://localhost:3210",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "npm run start -- -p 3210",
    url: "http://localhost:3210",
    reuseExistingServer: !process.env.CI,
    env: {
      FAKE_TODAY: "2026-09-30",
      ALLOW_FAKE_TODAY: "1",
    },
  },
});
