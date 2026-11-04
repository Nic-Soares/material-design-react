import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
import "../src/tokens/color.css";
import "../src/tokens/state.css";
import "../src/tokens/typography.css";
import "./preview.css";

const preview: Preview = {
  decorators: [
    // Sets data-theme on <html>, which pins the color-scheme the tokens'
    // light-dark() values follow (ADR-003)
    withThemeByDataAttribute({
      themes: { light: "light", dark: "dark" },
      defaultTheme: "light",
      attributeName: "data-theme",
    }),
  ],
};

export default preview;
