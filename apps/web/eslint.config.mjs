/**
 * @acp:domain configuration
 * @acp:layer config
 */
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import nextjsConfig from "@acp-website/eslint-config/nextjs";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...nextjsConfig,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    ignores: [".next/**", "node_modules/**"],
  }
);