module.exports = {
  presets: [
    ['@vue/app', {
      useBuiltIns: 'entry',
      corejs: 3
    }]
  ],
  plugins: [
    ['@babel/plugin-transform-arrow-functions', { spec: true }]
  ]
}
