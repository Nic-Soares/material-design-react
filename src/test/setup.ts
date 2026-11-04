import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Without Vitest globals, Testing Library can't unmount on its own
afterEach(() => {
  cleanup();
});

// jsdom has no modal dialogs: a minimal showModal() and close() that toggle
// `open` and fire "close", enough for the components' own logic. Focus
// trapping and the inert page are the browser's, checked in Storybook.
if (typeof HTMLDialogElement.prototype.showModal !== "function") {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close() {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
}
