// Material Color Utilities 0.4.0 imports ten of its own modules without the
// .js extension, which Node's ESM resolver rejects (bundlers accept it):
// https://github.com/material-foundation/material-color-utilities/issues/195
//
// Loaded with `node --import` before scripts that use the library: when a
// relative import inside that package fails, it is retried with `.js`.
// Delete this file, and the --import flag in package.json, once a release
// fixes the issue.

import { registerHooks } from "node:module";

const PACKAGE_PATH = "/node_modules/@material/material-color-utilities/";

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      const fromPackage = context.parentURL?.includes(PACKAGE_PATH) ?? false;
      const isRelative = specifier.startsWith(".");
      const notFound =
        (error as NodeJS.ErrnoException).code === "ERR_MODULE_NOT_FOUND";
      if (fromPackage && isRelative && notFound) {
        return nextResolve(`${specifier}.js`, context);
      }
      throw error;
    }
  },
});
