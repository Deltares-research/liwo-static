/* eslint-env node */
module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:cypress/recommended'
  ],
  env: {
    "browser": true,
    "node": true,
  },
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    "cypress/no-unnecessary-waiting": 0,
    "cypress/unsafe-to-chain-command": 0,
    "no-unused-vars": 1,
    "vue/no-mutating-props": 0
  }
}
