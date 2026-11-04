import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Decorator, Preview } from "@storybook/react-vite";
import "../src/tokens/color.css";
import "../src/tokens/state.css";
import "../src/tokens/typography.css";
import "../src/tokens/shape.css";
import "../src/tokens/elevation.css";
import "../src/tokens/motion.css";
import "./preview.css";

// Sets data-contrast and data-motion on <html> from the toolbar, the same
// attributes an app sets (ADR-003)
const withContrastAndMotion: Decorator = (Story, context) => {
  const root = document.documentElement;
  root.dataset.contrast = context.globals.contrast ?? "standard";
  root.dataset.motion = context.globals.motion ?? "expressive";
  return Story();
};

const preview: Preview = {
  globalTypes: {
    contrast: {
      description: "Contrast level",
      toolbar: {
        title: "Contrast",
        icon: "contrast",
        items: [
          { value: "standard", title: "Standard contrast" },
          { value: "medium", title: "Medium contrast" },
          { value: "high", title: "High contrast" },
        ],
        dynamicTitle: true,
      },
    },
    motion: {
      description: "Motion scheme",
      toolbar: {
        title: "Motion",
        icon: "lightning",
        items: [
          { value: "expressive", title: "Expressive motion" },
          { value: "standard", title: "Standard motion" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { contrast: "standard", motion: "expressive" },
  decorators: [
    withContrastAndMotion,
    // Sets data-theme on <html>, which pins the color-scheme the tokens'
    // light-dark() values follow (ADR-003). Starts from the system setting.
    withThemeByDataAttribute({
      themes: { light: "light", dark: "dark" },
      defaultTheme: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
      attributeName: "data-theme",
    }),
  ],
};

export default preview;
