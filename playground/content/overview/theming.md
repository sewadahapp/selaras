---
title: Theming
description: Design tokens, the :ui prop, and global overrides.
order: 30
---

Every component reads its colors from a small set of semantic CSS custom
properties, and its layout/variant classes from a `tailwind-variants`
theme. There are three ways to customize a component, in increasing order
of precedence.

## 1. Design tokens

`--ui-*` custom properties carry every component's colors, radius,
shadow, and overlay stacking order - components never reference a raw
Tailwind color/radius/shadow class directly:

| Token | Purpose |
| --- | --- |
| `--ui-bg`, `--ui-bg-elevated`, `--ui-bg-inverted` | Page/surface backgrounds |
| `--ui-border`, `--ui-border-hover`, `--ui-border-muted` | Borders |
| `--ui-text`, `--ui-text-muted`, `--ui-text-inverted` | Text |
| `--ui-primary`, `--ui-secondary`, `--ui-success`, `--ui-danger`, `--ui-info`, `--ui-warning` | Role colors, each with a `-hover`, `-active`, `-foreground` and `-soft` variant |
| `--ui-radius` | Base corner radius - see below |
| `--ui-shadow-sm`, `--ui-shadow-md`, `--ui-shadow-lg` | Overlay elevation (Modal, Dropdown, Popover, ...) |
| `--ui-z-modal-overlay`, `--ui-z-modal`, `--ui-z-dropdown`, `--ui-z-tooltip`, `--ui-z-toast` | Overlay stacking order, reflecting real nesting (a Dropdown can open from inside a Modal, a Toast always stays on top) |

Redefine any of these in your own CSS to retheme the whole library without
touching a single component. Dark mode is just a second set of the same
tokens, applied under a `.dark` class on `<html>` (flipped by
`SColorModeToggle`, or your own `useColorMode()` logic).

**Radius is one knob, not four.** `--ui-radius-sm`/`-md`/`-lg` are derived
from `--ui-radius` itself (0.75x/1x/2x), so changing the single base value
rescales every component's corners proportionally:

```css
:root {
  --ui-radius: 0.25rem; /* sharper corners across the whole library */
}
```

`--ui-radius-full` (pills, avatars) stays independent - "pill-shaped" is
a distinct visual choice, not a point on the same size gradient.

**Breakpoints and spacing** aren't Selaras tokens at all - components use
Tailwind's own default scale directly, so you customize them the same way
you would in any Tailwind v4 project, through Tailwind's own `@theme`:

```css
@theme {
  --breakpoint-3xl: 1920px;
  --spacing: 0.2rem;
}
```

## 2. The `:ui` prop

Every component takes a single `:ui` prop for per-instance overrides -
there's no separate "pass-through props" prop alongside it. Each key is a
slot name; each value is either:

- a **string** - extra classes, merged with the slot's own classes via
  `tailwind-merge` (so a conflicting utility like `bg-*` correctly
  replaces the default rather than stacking both);
- an **object** - `{ class, ...attrs }`, where `class` is merged the same
  way and everything else is applied as raw attributes/event handlers via
  Vue's `mergeProps` (never tailwind-merged) - the escape hatch for the
  rare case you need more than classes.

```vue-html
<SButton :ui="{ base: 'font-mono' }">
  Custom
</SButton>
```

## 3. Global overrides

To retheme a component everywhere instead of one instance at a time,
extend its theme from `app.config.ts` under `ui.<componentKey>` (the
lowercase component name, e.g. `button`, `modal`):

```ts
export default defineAppConfig({
  ui: {
    button: {
      slots: {
        base: 'font-mono',
      },
    },
  },
})
```

This is merged over the component's base theme with `tailwind-variants`'
own `extend`, so you only need to specify what you're changing.

## Precedence

Lowest to highest: the component's base `tv()` theme → your
`app.config.ts` override → the instance's `:ui` prop → a native `class`/
fallthrough attribute on the component's root element.

## Class prefix

If your own Tailwind build namespaces its utilities behind a prefix, see
[Installation](/overview/installation#class-prefix) for the matching
`classPrefix` option - it applies after every one of the mechanisms above,
regardless of which one produced the final class string.
