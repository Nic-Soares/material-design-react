/**
 * Type declarations for CSS imports used in the `@repo/ui` package.
 *
 * This file tells TypeScript how to handle:
 *  - CSS Modules imports (e.g. `import styles from './Button.module.css'`)
 *  - Global CSS imports (e.g. `import '@repo/ui/styles.css'`)
 *
 * Place this file under `packages/ui/src/global.d.ts` so `tsc` and tooling
 * within the package can pick it up during dev and build.
 */

/* CSS Modules (files named *.module.css) */
declare module '*.module.css' {
  // A mapping of class name -> generated class name
  const classes: { readonly [className: string]: string };
  export default classes;
}

/* Generic CSS import (global CSS files) */
declare module '*.css' {
  // Importing a global CSS typically has no runtime value useful to TS.
  // Some bundlers return a string (the CSS content or path). Accept string to be flexible.
  const css: string;
  export default css;
}

/* Also support SCSS variants in case tooling uses them */
declare module '*.module.scss' {
  const classes: { readonly [className: string]: string };
  export default classes;
}
declare module '*.scss' {
  const css: string;
  export default css;
}

/* Explicitly declare the package styles entry so imports like:
 *   import "@repo/ui/styles.css";
 * work and TypeScript doesn't complain (covered by '*.css' above,
 * but this makes intent explicit).
 */
declare module '@repo/ui/styles.css' {
  const css: string;
  export default css;
}
