const webpack = require('webpack')

module.exports = {
  baseUrl: process.env.BASE_URL || '/',
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        L: 'leaflet'
      })
    ],
    // entry: {
    //   vendor: [
    //     'promise-polyfill',
    //     'whatwg-fetch',
    //     'url-search-params',
    //     'vue',
    //     'vuex',
    //     // 'leaflet',
    //     // 'leaflet.markercluster',
    //     // 'mapbox.js',
    //     // 'proj4',
    //     // 'proj4leaflet'
    //   ]
    // }
  }
}
