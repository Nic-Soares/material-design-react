// A consumer's app as the README describes it: the stylesheet once, then a
// single component. Plain JS with createElement, so it needs no JSX setup.
import "@nic-soares/material-design-react/styles.css";
import { Button } from "@nic-soares/material-design-react";
import { applyScheme } from "@nic-soares/material-design-react/color";
import { createElement } from "react";
import { createRoot } from "react-dom/client";

applyScheme(document.documentElement, { sourceColor: "#6750A4" });
createRoot(document.getElementById("root")).render(
  createElement(Button, { variant: "tonal" }, "Hello"),
);
