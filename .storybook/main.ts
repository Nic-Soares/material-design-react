import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: [
    "../docs/storybook/**/*.mdx",
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
  // library-mode options must not reach it
  viteFinal: (viteConfig) => {
    if (viteConfig.build) {
      delete viteConfig.build.lib;
      delete viteConfig.build.rolldownOptions;
    }
    return viteConfig;
  },
};

export default config;
