import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";

// The docs carry the library's name (the browser tab reads
// "<page> ⋅ Material Design React") and its primary color
addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Material Design React",
    brandUrl: "https://github.com/Nic-Soares/material-design-react",
    brandTarget: "_self",
    colorSecondary: "#65558f",
  }),
});
