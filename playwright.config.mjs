import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: process.env.BODHUNO_BASE_URL || "https://bodhuno.pages.dev",
    browserName: "chromium",
    headless: true,
    viewport: { width: 390, height: 844 },
    actionTimeout: 10_000,
    navigationTimeout: 20_000
  }
});
