// Lets Node run the token generators, which import the library's source.
// Node's ESM resolver requires file extensions on relative imports; two kinds
// of code leave them out:
//
// - the library's own source (src/), written for bundlers, as the build and
//   Vitest resolve it: an import of "./tokens" means ./tokens.ts;
// - Material Color Utilities 0.4.0, which imports ten of its own modules
//   without .js (https://github.com/material-foundation/material-color-utilities/issues/195).
//
// Loaded with `node --import` (see the `tokens` script): when a relative
// import isn't found, it is retried with .ts, then .js. The .js retry can go
// once a Material Color Utilities release fixes the issue.

import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      const notFound =
        (error as NodeJS.ErrnoException).code === "ERR_MODULE_NOT_FOUND";
      if (!notFound || !specifier.startsWith(".")) throw error;
      for (const extension of [".ts", ".js"]) {
        try {
          return nextResolve(`${specifier}${extension}`, context);
        } catch {
          // try the next extension
        }
      }
      throw error;
    }
  },
});
