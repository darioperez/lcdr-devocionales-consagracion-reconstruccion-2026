import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      testMatch: /smoke\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3210",
      },
    },
    {
      name: "mobile",
      testMatch: /smoke\.spec\.ts/,
      use: {
        ...devices["Pixel 5"],
        baseURL: "http://localhost:3210",
      },
    },
    {
      name: "ended",
      testMatch: /ended\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3211",
      },
    },
  ],
  webServer: [
    {
      command: "npm run start -- -p 3210",
      url: "http://localhost:3210",
      reuseExistingServer: !process.env.CI,
      env: {
        FAKE_TODAY: "2026-09-30",
        ALLOW_FAKE_TODAY: "1",
      },
    },
    {
      command: "npm run start -- -p 3211",
      url: "http://localhost:3211",
      reuseExistingServer: !process.env.CI,
      env: {
        FAKE_TODAY: "2026-10-06",
        ALLOW_FAKE_TODAY: "1",
      },
    },
  ],
});
