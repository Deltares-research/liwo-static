import cypress from "eslint-plugin-cypress";

export default [
  {
    plugins: {
      cypress: cypress,
    },
    languageOptions: {
      globals: {
        mocha: true,
      },
    },
    rules: {
      strict: "off",
    },
  },
];
