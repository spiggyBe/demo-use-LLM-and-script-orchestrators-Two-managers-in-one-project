import path from "node:path";
import { defineConfig, devices } from "@playwright/test";

const storageStatePath = path.resolve(process.cwd(), "test-results/.auth/todos.json");

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-all-retries",
  },
  projects: [
    {
      name: "storage-state-setup",
      testMatch: "**/storage-state.setup.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "chromium",
      testMatch: "**/*.spec.ts",
      testIgnore: "**/storage-state.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "storage-state-restore",
      testMatch: "**/storage-state.spec.ts",
      dependencies: ["storage-state-setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: storageStatePath,
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
