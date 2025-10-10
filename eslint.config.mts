import globals from "globals";
import tseslint from "typescript-eslint";
import jsonPlugin from "@eslint/json";
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
  },
  tseslint.configs.recommended,
  {
    files: ["**/*.json"],
    plugins: { json: jsonPlugin },
    language: "json/json",
  },
]);
