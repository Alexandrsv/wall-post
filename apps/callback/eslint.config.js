import base from "../../eslint.config.js";
import tseslint from "typescript-eslint";

export default tseslint.config(...base, {
  files: ["**/*.ts", "**/*.tsx"],
});
