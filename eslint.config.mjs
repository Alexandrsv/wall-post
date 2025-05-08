import tseslint from "typescript-eslint";
import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import reactPlugin from "eslint-plugin-react";

export default defineConfig([
  reactHooks.configs["recommended-latest"],
  reactPlugin.configs.flat["jsx-runtime"],
  reactPlugin.configs.flat.recommended,
  globalIgnores([
    "node_modules",
    "**/dist/**",
    "**/.next/**",
    "**/.yarn/**",
    "packages/prisma/src/generated",
    "**/generated/**",
    "**/src/generated/**",
    "**/client/generated/**",
    "**/client/runtime/**",
  ]),
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "no-debugger": "error",
      eqeqeq: ["error", "always"],
      "no-empty": ["error", { allowEmptyCatch: true }],
      "padding-line-between-statements": [
        "warn",
        {
          blankLine: "always",
          prev: "*",
          next: ["return", "export", "block-like"],
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "react/react-in-jsx-scope": "off",
      curly: "off",
    },
    languageOptions: {
      parserOptions: {
        // projectService: false,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
]);
