module.exports = {
  baseUrl: process.env.BASE_URL || '/',
  configureWebpack: {
    entry: {
      vendor: [
        'promise-polyfill',
        'whatwg-fetch',
        'url-search-params',
        'vue',
        'vuex'
      ]
    }
  }
}
