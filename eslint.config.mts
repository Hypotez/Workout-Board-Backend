import globals from "globals";
import tseslint from "typescript-eslint";
import jsonPlugin from "@eslint/json";
import prettierPlugin from 'eslint-plugin-prettier';
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["dist/**", "node_modules/**", "tsconfig.json"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: globals.node,
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error"
    },
  },
  tseslint.configs.recommended,
  {
    files: ["**/*.json"],
    plugins: { json: jsonPlugin },
    language: "json/json",
  },
]);
