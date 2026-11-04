---
"@nic-soares/material-design-react": patch
---

A static `InputChip` (no `onClick`) no longer has the 48px touch target: it isn't a control, and the target reached 8px outside the chip, so a row of chips measured taller than it looks.
