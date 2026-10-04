---
title: CSS tokens
description: Customize semantic tokens and foundation palettes in CSS.
order: 20
---

### Start with CSS

For most theme changes, edit CSS only.

Selaras has public input variables. The main groups are:

| Input | Purpose |
| --- | --- |
| `--selaras-surface-*` | Page and surface colors |
| `--selaras-text-*` | General text colors |
| `--selaras-border-*` | General border colors |
| `--selaras-color-<role>-<leaf>` | Component color roles, such as `primary` or `warning` |
| `--selaras-radius-*` | Corner radius |
| `--selaras-shadow-*` | Shadow values |
| `--selaras-z-*` | Overlay stacking |
| `--selaras-scrim` | Overlay backdrop |

Selaras also has `--selaras-resolved-*` variables. These are effective read
values. Do not use them as theme inputs.

### Small CSS changes

You can change one value:

```css
:root {
  --selaras-radius-base: 0.375rem;
}
```

Or you can change general surfaces and text:

The light canvas is white by default. A card-heavy dashboard can use a subtle
canvas such as `#f9f9f9` while keeping its component surfaces white:

```css
:root {
  --selaras-surface-canvas: #f9f9f9;
  --selaras-surface-default: #ffffff;
  --selaras-surface-elevated: #fafafa;

  --selaras-text-default: #18181b;
  --selaras-text-muted: #71717a;

  --selaras-border-default: #e4e4e7;
  --selaras-border-hover: #d4d4d8;
}
```

For dark mode, override the same inputs under `:root.dark`:

```css
:root.dark {
  --selaras-surface-canvas: #0c0c0d;
  --selaras-surface-default: #09090b;
  --selaras-surface-elevated: #18181b;

  --selaras-text-default: #fafafa;
  --selaras-text-muted: #a1a1aa;

  --selaras-border-default: #27272a;
  --selaras-border-hover: #3f3f46;
}
```

Selaras follows the `.dark` class on `<html>` for the document theme.

### Check borders against their surfaces

`--selaras-surface-*` and `--selaras-border-*` are independent inputs. Component
themes choose which ones to pair. For example,
[DashboardSidebar](/composites/dashboard/dashboard-sidebar) paints its background
with `surface-elevated` and draws its footer divider with `border-default`.
If both resolve to the same color, the divider blends into that background.

When a border should be visible, give it enough contrast against the surfaces
it touches. Check the actual component in both light and dark modes, including
hover and focus states, after changing either token or its foundation palette.
Different token names or different scale steps alone do not guarantee a visible
boundary. An intentionally blended border is also a valid design choice; each
border does not need to differ from every surface in your theme.

Selaras does not automatically adjust border colors or validate their contrast
when you override CSS variables. For transparent components, check the actual
background showing through, which may be your application's canvas.

### Change a complete foundation palette

The default foundations are Tailwind v4 theme variables.

For example, the default warning role uses the Selaras yellow foundation. You
can replace that foundation and keep the built-in warning recipe:

```css
@theme {
  --color-selaras-yellow-50: var(--color-orange-50);
  --color-selaras-yellow-100: var(--color-orange-100);
  --color-selaras-yellow-200: var(--color-orange-200);
  --color-selaras-yellow-300: var(--color-orange-300);
  --color-selaras-yellow-400: var(--color-orange-400);
  --color-selaras-yellow-500: var(--color-orange-500);
  --color-selaras-yellow-600: var(--color-orange-600);
  --color-selaras-yellow-700: var(--color-orange-700);
  --color-selaras-yellow-800: var(--color-orange-800);
  --color-selaras-yellow-900: var(--color-orange-900);
  --color-selaras-yellow-950: var(--color-orange-950);
}
```

The warning role now uses your replacement foundation through its existing
recipe.

The same rule applies to:

- `blue` for the default `info` role
- `red` for the default `danger` role
- `gray` for the default `neutral` role
- `green` for the default `success` role
- `yellow` for the default `warning` role
- `indigo` for the default `primary` role
- `plum` for the default `secondary` role

The Selaras gray foundation also supplies the default general surfaces, text,
and borders. A change to the gray foundation can therefore change more than the
`neutral` component role.

### Map an existing design system

You do not have to rename your design tokens.

For example, your design system can use a `10` to `100` scale:

```css
:root {
  --company-brand-10: ...;
  --company-brand-20: ...;
  --company-brand-30: ...;
  --company-brand-40: ...;
  --company-brand-50: ...;
  --company-brand-60: ...;
  --company-brand-70: ...;
  --company-brand-80: ...;
  --company-brand-90: ...;
  --company-brand-100: ...;

  --selaras-color-primary-fill: var(--company-brand-60);
  --selaras-color-primary-fill-hover: var(--company-brand-70);
  --selaras-color-primary-fill-pressed: var(--company-brand-80);
  --selaras-color-primary-on-fill: var(--company-brand-10);

  --selaras-color-primary-subtle: var(--company-brand-10);
  --selaras-color-primary-subtle-hover: var(--company-brand-20);
  --selaras-color-primary-subtle-pressed: var(--company-brand-30);
  --selaras-color-primary-on-subtle: var(--company-brand-90);

  --selaras-color-primary-text: var(--company-brand-70);
  --selaras-color-primary-text-hover: var(--company-brand-80);
  --selaras-color-primary-text-pressed: var(--company-brand-90);

  --selaras-color-primary-border: var(--company-brand-50);
  --selaras-color-primary-focus: var(--company-brand-60);
}
```

Map the neutral foundations as well as component color roles. For example,
if your existing system exposes these surface and divider tokens:

```css
:root {
  --selaras-surface-canvas: var(--company-canvas-light);
  --selaras-surface-default: var(--company-panel-light);
  --selaras-surface-elevated: var(--company-sidebar-light);

  --selaras-border-default: var(--company-divider-light);
  --selaras-border-muted: var(--company-divider-subtle-light);
  --selaras-border-hover: var(--company-divider-hover-light);
}

:root.dark {
  --selaras-surface-canvas: var(--company-canvas-dark);
  --selaras-surface-default: var(--company-panel-dark);
  --selaras-surface-elevated: var(--company-sidebar-dark);

  --selaras-border-default: var(--company-divider-dark);
  --selaras-border-muted: var(--company-divider-subtle-dark);
  --selaras-border-hover: var(--company-divider-hover-dark);
}
```

Define the `--company-*` variables in your own system. Choose divider values
that remain visible on the panels and sidebar where you need a boundary; do
not automatically map a border to the same scale entry as its background.
See [Check borders against their surfaces](#check-borders-against-their-surfaces).

Your design system stays the source of truth. The `--selaras-*` variables are
the mapping layer.

### Use your own complete theme

Most applications should import the default theme:

```css
@import "tailwindcss";
@import "@sewadah/selaras";
@import "#selaras/tailwind.css";
```

A mature design system can omit Selaras-owned foundation colors:

```css
@import "tailwindcss";
@import "@sewadah/selaras/structural.css";
@import "#selaras/tailwind.css";
```

Then provide all semantic values that your application uses.

`structural.css` still supplies:

- Selaras source discovery for Tailwind
- variants
- animations
- structural CSS
- semantic read bindings

It does not supply the default Selaras foundation palette.

This mode is for a complete external theme. It is not an automatic unthemed
fallback.

### Radius, shadows, stacking, and Tailwind tokens

Radius uses one base input by default:

```css
:root {
  --selaras-radius-base: 0.25rem;
}
```

Selaras derives its default small, medium, and large radius values from this
base. You can override each radius input separately if you need to.

You can also set shadows and stacking values:

```css
:root {
  --selaras-shadow-sm: 0 1px 2px rgb(0 0 0 / 0.06);
  --selaras-shadow-md: 0 4px 16px -2px rgb(0 0 0 / 0.12);
  --selaras-shadow-lg: 0 12px 32px -4px rgb(0 0 0 / 0.16);

  --selaras-z-modal-overlay: 40;
  --selaras-z-modal: 50;
  --selaras-z-dropdown: 60;
  --selaras-z-tooltip: 70;
  --selaras-z-toast: 80;
}
```

Spacing and normal Tailwind breakpoints are Tailwind tokens, not Selaras theme
tokens:

```css
@theme {
  --breakpoint-3xl: 1920px;
  --spacing: 0.2rem;
}
```

The adaptive Selaras presentation uses the Tailwind breakpoint name selected by
`selaras.adaptive.breakpoint`. The default name is `md`.
