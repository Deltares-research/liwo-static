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
  'views pages': browser => {
    // load a few maps
    browser
      .url(process.env.VUE_DEV_SERVER_URL + '#/viewer/31')
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.viewer')
      .url(process.env.VUE_DEV_SERVER_URL + '#/viewer/1')
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.viewer')
      .end()
  },
  'contact page': browser => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL + '#/contact')
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.contact')
      .end()
  }
}
