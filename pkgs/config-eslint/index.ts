import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import type { ConfigArray } from "typescript-eslint";

export const makeConfig = tseslint.config;

export function baseConfig(dirname: string): ConfigArray {
  return makeConfig(
    {
      ignores: ["**/dist/**", "**/node_modules/**"],
    },

    {
      files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
      ...pluginJs.configs.recommended,
      extends: [
        ...tseslint.configs.strictTypeChecked,
        ...tseslint.configs.stylisticTypeChecked,
      ],
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: dirname,
        },
      },
      rules: {
        "@typescript-eslint/await-thenable": "warn",
        "@typescript-eslint/consistent-type-imports": "warn",
        "@typescript-eslint/no-duplicate-type-constituents": "warn",
        "@typescript-eslint/no-redundant-type-constituents": "warn",
        "@typescript-eslint/no-unused-expressions": "warn",
        "@typescript-eslint/no-unused-vars": "warn",
      },
    },

    // These are opinionated rules that should stay as is
    {
      rules: {
        // Soften the no_unused_vars rule to allow variables starting with _
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
          },
        ],
        // We often have interfaces that require promises, but implementors that
        // don't need to do any async work.
        "@typescript-eslint/require-await": "off",
        // Permit non-void returns in async functions
        "@typescript-eslint/no-misused-promises": [
          "error",
          { checksVoidReturn: false },
        ],
        "@typescript-eslint/consistent-type-imports": [
          "error",
          { disallowTypeAnnotations: false },
        ],
        "no-shadow": "warn",
        "@typescript-eslint/no-unnecessary-type-parameters": "off",
        "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      },
    },

    // This softens any rules from the presets that don't affect the correctness
    // of the code to warnings instead of errors. The primary goal of this is to
    // make it clear to developers which issues will likely break their code and
    // require attention. These are marked as errors. Issues that won't break
    // the code but are more about style or consistency are marked as warnings.
    // Note that warnings still fail CI.
    {
      rules: {
        "no-cond-assign": "warn",
        "no-control-regex": "warn",
        "no-debugger": "warn",
        "no-empty": "warn",
        "no-empty-pattern": "warn",
        "no-regex-spaces": "warn",
        "no-unused-labels": "warn",
        "no-unused-private-class-members": "warn",
        "no-useless-catch": "warn",
        "no-useless-escape": "warn",
        "prefer-const": "warn",
        "prefer-rest-params": "warn",
        "prefer-spread": "warn",
        "require-yield": "warn",
      },
    },
  );
}
