import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./test",
  testMatch: "**/*.spec.js",
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:4317",
    headless: true,
    launchOptions: { args: ["--no-sandbox"] },
  },
  webServer: {
    command: "node server.js",
    url: "http://127.0.0.1:4317/api/config",
    env: { HOST: "127.0.0.1", PORT: "4317", ACCESS_TOKEN: "" },
    reuseExistingServer: false,
  },
});
