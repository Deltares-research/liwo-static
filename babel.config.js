module.exports = {
  presets: [
    ['@vue/cli-plugin-babel/preset', {
      useBuiltIns: 'entry',
      corejs: 3
    }]
  ],
  plugins: [
    ['@babel/plugin-transform-arrow-functions', { spec: true }]
  ]
}
