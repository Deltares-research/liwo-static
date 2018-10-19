const webpack = require('webpack')

module.exports = {
  // transpileDependencies: [ 'delay' ],
  baseUrl: process.env.BASE_URL || '/',
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.m?js$/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        L: 'leaflet'
      })
    ],
    entry: {
      vendor: [
        '@babel/polyfill',
        'unfetch/polyfill',
        'url-search-params-polyfill'
      ]
    }
  }
}
