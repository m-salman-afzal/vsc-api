import eslintJs from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
    {files: ["**/*.{js,mjs,cjs,ts}"]},
    {
        ignores: ["node_modules/"]
    },
    {languageOptions: {globals: globals.node, ecmaVersion: "latest", sourceType: "module"}},
    eslintJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            eqeqeq: [
                "error",
                "always",
                {
                    null: "ignore"
                }
            ],

            curly: ["error", "all"],
            "handle-callback-err": ["error", "err"],
            "one-var": ["error", "never"],
            "accessor-pairs": ["error"],
            "no-array-constructor": ["error"],
            "no-caller": ["error"],
            "no-duplicate-imports": ["off"],
            "no-eval": ["error"],
            "no-extend-native": ["error"],
            "no-extra-bind": ["error"],
            "no-extra-boolean-cast": ["error"],

            "no-global-assign": [
                "error",
                {
                    exceptions: ["Object"]
                }
            ],

            "no-implied-eval": ["error"],
            "no-iterator": ["error"],
            "no-label-var": ["error"],
            "no-labels": ["error"],
            "no-lone-blocks": ["error"],
            "no-multi-str": ["error"],
            "no-new": ["error"],
            "no-new-func": ["error"],
            "no-new-object": ["error"],
            "no-new-require": ["error"],
            "no-new-wrappers": ["error"],
            "no-obj-calls": ["error"],
            "no-octal-escape": ["error"],
            "no-proto": ["error"],
            "no-return-assign": ["error"],
            "no-self-compare": ["error"],
            "no-sequences": ["error"],

            "no-tabs": [
                "error",
                {
                    allowIndentationTabs: true
                }
            ],

            "no-throw-literal": ["error"],
            "no-undef-init": ["error"],
            "no-unneeded-ternary": ["error"],
            "no-useless-call": ["error"],
            "no-useless-computed-key": ["error"],
            "no-useless-rename": ["error"],
            "spaced-comment": ["error", "always"],
            yoda: ["error"],

            "@typescript-eslint/no-empty-interface": [
                "error",
                {
                    allowSingleExtends: true
                }
            ],

            semi: ["off", "always"],
            "no-console": ["error"],
            "no-useless-return": ["error"],
            "newline-before-return": ["error"],
            "@typescript-eslint/no-unsafe-declaration-merging": "off",
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-expressions": "off",
            "@typescript-eslint/no-empty-object-type": "off"
        }
    }
];
