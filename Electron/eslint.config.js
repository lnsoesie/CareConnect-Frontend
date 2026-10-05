import js from "@eslint/js";
import globals from "globals";

export default [
  {
    files: ["**/*.{js,jsx}"],
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**"
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      ...js.configs.recommended.rules
    }
  }
];