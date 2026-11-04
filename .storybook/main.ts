import type { StorybookConfig } from "@storybook/react-vite";
import { cssBuildTarget } from "../vite.config.ts";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: [
    "./Introduction.mdx",
    "../src/**/*.mdx",
    "../src/**/*.stories.@(ts|tsx)",
  ],
  core: { disableTelemetry: true },
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
  ],
  // vite.config.ts builds the library; Storybook builds an app, so the
  // library-mode options must not reach it. Storybook sets its own build
  // target, so the library's CSS browsers are set again (light-dark()).
  viteFinal: (viteConfig) => {
    viteConfig.build ??= {};
    delete viteConfig.build.lib;
    delete viteConfig.build.rolldownOptions;
    viteConfig.build.cssTarget = cssBuildTarget;
    return viteConfig;
  },
};

export default config;
