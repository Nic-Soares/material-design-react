---
"@nic-soares/material-design-react": minor
---

Add `Dialog` (basic, with an optional icon, or full-screen) and `NavigationDrawer` with `NavigationDrawerItem`, the modal drawer for compact windows. Both are controlled (`open`, `onClose`) and built on the native modal `<dialog>`: focus stays inside and returns on close, the page behind is inert and doesn't scroll, and Escape or a click on the scrim asks to close. Drawer items take `href` or a `render` prop for any router.
