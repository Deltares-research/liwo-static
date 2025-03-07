 
// https://docs.cypress.io/guides/guides/plugins-guide.html

const getLayers = require("../lib/get-layers");

// if you need a custom webpack configuration you can uncomment the following import
// and then use the `file:preprocessor` event
// as explained in the cypress docs
// https://docs.cypress.io/api/plugins/preprocessors-api.html#Examples

// /* eslint-disable import/no-extraneous-dependencies, global-require */
// const webpack = require('@cypress/webpack-preprocessor')

module.exports = {
  setupNodeEvents(on, config) {
    // on('file:preprocessor', webpack({
    //  webpackOptions: require('@vue/cli-service/webpack.config'),
    //  watchOptions: {}
    // }))

    config.env.MAP_LAYERS = getLayers();
  },
  fixturesFolder: "./tests/e2e/fixtures",
  downloadsFolder: "./tests/e2e/downloads",
  specPattern: "./tests/e2e/specs",
  screenshotsFolder: "./tests/e2e/screenshots",
  videosFolder: "./tests/e2e/videos",
  supportFile: "./tests/e2e/support/index.js",
};
