const webpack = require('webpack')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  // transpileDependencies: [ 'delay' ],
  publicPath: process.env.BASE_URL || '/',
  // devServer: {
  //   disableHostCheck: true
  // },
  devServer: {
    allowedHosts: ['localhost', 'basisinformatie-overstromingen.nl'], // Add any specific hosts you want to allow here
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
    host: 'localhost',
    hot: true,
    https: false,
    open: true,
    port: 8080
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
      // We can not replace this unfetch with whatwg fetch, because whatwg fetch is browser only
      // so we have 2 fetches in this project
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
