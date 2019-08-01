const chromedriver = require('chromedriver')

module.exports = {
  selenium: {
    cli_args: {
      'webdriver.chrome.driver': chromedriver.path
    }
  }
}
