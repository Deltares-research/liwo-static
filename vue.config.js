const webpack = require('webpack')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  // transpileDependencies: [ 'delay' ],
  publicPath: process.env.BASE_URL || '/',
  devServer: {
    disableHostCheck: true
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.m?js$/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: ['lodash']
            }
          }
        }
      ]
    },
    plugins: [
      // enable _.get(obj, 'a.b.c') and _.map([], 'a')
      new LodashModuleReplacementPlugin({
        shorthands: true,
        paths: true,
        flattening: true,
        collections: true

      }),
      new webpack.ProvidePlugin({
        L: 'leaflet'
      })
    ],
    entry: {
      // TODO: check if we can replace this unfetch with whatwg fetch
      vendor: [
        '@babel/polyfill',
        'unfetch/polyfill',
        'url-search-params-polyfill'
      ]
    }
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      // don't run online, only create a report
      analyzerMode: 'static',
      openAnalyzer: false
    }
  }
}
