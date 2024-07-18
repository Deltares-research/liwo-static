const { defineConfig } = require("cypress");
const plugin = require("./tests/e2e/plugins/index.js");

module.exports = defineConfig({
  e2e: {
    ...plugin,
    reporter: "mochawesome",
    projectId: "h5f19q",
    baseUrl: "http://localhost:5173",
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    viewportWidth: 1920,
    viewportHeight: 1080,
    retries: {
      runMode: 3,
      openMode: 0,
    },
  },
});
