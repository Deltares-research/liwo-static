import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import cypress from "eslint-plugin-cypress/flat";

import globals from "globals";

export default [
  js.configs.recommended,
  ...vue.configs["flat/essential"],
  cypress.configs.recommended,
  {
    files: ["**/*.vue", "**/*.js", "**/*.jsx", "**/*.cjs", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "cypress/no-unnecessary-waiting": 0,
      "cypress/unsafe-to-chain-command": 0,
      "no-unused-vars": 1,
      "vue/no-mutating-props": 0,
    },
  },
];
