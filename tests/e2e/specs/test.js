// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'home page': browser => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL)
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.home')
      .end()
  },
  'about page': browser => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL + '#/about')
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.about')
      .end()
  },
  'maps page': browser => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL + '#/maps')
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.maps')
      .end()
  },
  'viewer page': browser => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL + '#/viewer/1')
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.viewer')
      .end()
  },
  'scenarios page': browser => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL + '#/scenarios')
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.viewer')
      .end()
  },
  'combine page': browser => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL + '#/combine')
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.viewer')
      .end()
  },
  'combined page': browser => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL + '#/combined/1,2')
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.viewer')
      .end()
  }
}
