module.exports = {
  baseUrl: process.env.BASE_URL || '/',
  configureWebpack: {
    entry: {
      vendor: [
        'promise-polyfill',
        'whatwg-fetch',
        'url-search-params',
        'leaflet',
        'leaflet.markercluster',
        // 'vue2-leaflet',
        'proj4leaflet',
        'vue',
        'vuex'
      ]
    }
  }
}
