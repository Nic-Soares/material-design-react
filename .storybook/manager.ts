import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";

// The docs carry the library's name (the browser tab reads
// "<page> ⋅ Material Design React") and its primary color, and follow the
// system's light or dark setting, like the library's own tokens
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

function theme(dark: boolean) {
  return create({
    base: dark ? "dark" : "light",
    brandTitle: "Material Design React",
    brandUrl: "https://github.com/Nic-Soares/material-design-react",
    brandTarget: "_self",
    // The default scheme's primary, light and dark (src/tokens/color.css)
    colorSecondary: dark ? "#cfbdfe" : "#65558f",
  });
}

addons.setConfig({ theme: theme(systemDark.matches) });
systemDark.addEventListener("change", (event) => {
  addons.setConfig({ theme: theme(event.matches) });
});
