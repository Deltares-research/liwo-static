const { defineConfig } = require("cypress");
const plugin = require("./tests/e2e/plugins/index.js");

async function checkLink({ url, attempts = 3, timeoutMs = 10000 }) {
  try {
    let last = { error: 'not attempted' }
    for (let i = 1; i <= attempts; i++) {
      try {
        const res = await fetch(url, {
          redirect: 'follow',
          signal: AbortSignal.timeout(timeoutMs),
        })
        last = { status: res.status }
        if (res.status !== 404) break
      } catch (err) {
        last = { error: `${err.name}: ${err.cause?.code || err.message}` }
      }
    }
    return { url, ...last }
  } catch (err) {
    return { url, error: `task crashed: ${err.message}` }
  }
}

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
    setupNodeEvents(on) {
      on('task', { checkLink })
    },
  },
});
