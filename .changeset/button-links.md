---
"@nic-soares/material-design-react": minor
---

`Button` renders a link (`<a>`) when given `href`, for navigation; a disabled link loses its `href` and gets `aria-disabled`. New `onRippleEnd` runs once a press's ripple has faded, so an app can navigate after the press is seen. `ButtonProps` is now a union of `ButtonAsButtonProps` and `ButtonAsLinkProps`.
