/* eslint-disable arrow-body-style */
// https://docs.cypress.io/guides/guides/plugins-guide.html

const getLayers = require('../lib/get-layers')

// if you need a custom webpack configuration you can uncomment the following import
// and then use the `file:preprocessor` event
// as explained in the cypress docs
// https://docs.cypress.io/api/plugins/preprocessors-api.html#Examples

// /* eslint-disable import/no-extraneous-dependencies, global-require */
// const webpack = require('@cypress/webpack-preprocessor')

module.exports = (on, config) => {
  // on('file:preprocessor', webpack({
  //  webpackOptions: require('@vue/cli-service/webpack.config'),
  //  watchOptions: {}
  // }))

  config.env.MAP_LAYERS = getLayers()

  return Object.assign({}, config, {
    reporter: 'mochawesome',
    projectId: 'h5f19q',
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    viewportWidth: 1920,
    viewportHeight: 1080,
    retries: {
      runMode: 3,
      openMode: 0,
    },
    downloadsFolder: 'tests/e2e/downloads',
    fixturesFolder: 'tests/e2e/fixtures',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    e2e: {
      // We've imported your old cypress plugins here.
      // You may want to clean this up later by importing these.
      setupNodeEvents(on, config) {
        return require('./tests/e2e/plugins/index.js')(on, config)
      },
      baseUrl: 'http://localhost:8080',
      specPattern: 'tests/e2e/specs/**/*.{js,jsx,ts,tsx}',
      supportFile: 'tests/e2e/support/index.js',
    },
  })
}
