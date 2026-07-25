# Styles

Design tokens live in `tokens.css`, sourced from `12_DESIGN_SYSTEM/` in the
knowledge repository. Do not add colors, spacing, or type sizes outside these
tokens without updating the source design system first.

## RTL/LTR convention

This app renders both `dir="rtl"` (Arabic) and `dir="ltr"` (English). Use
Tailwind's logical-property utilities everywhere, not physical-direction ones:

- `ms-*` / `me-*` instead of `ml-*` / `mr-*`
- `ps-*` / `pe-*` instead of `pl-*` / `pr-*`
- `text-start` / `text-end` instead of `text-left` / `text-right`

Physical-direction utility classes should not appear in component code.
