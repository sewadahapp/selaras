---
title: Introduction
description: What Selaras is and how it's put together.
order: 10
---

Selaras is a Nuxt module that provides a set of UI components built on
[Reka UI](https://reka-ui.com) primitives, styled with Tailwind CSS v4 and
[tailwind-variants](https://www.tailwind-variants.org).

## Design goals

- **One customization prop.** Every component accepts a single `:ui` prop
  for per-instance style overrides - no separate "pass-through props" prop
  alongside it. Each slot value can be a plain string (extra classes,
  merged via `tailwind-merge`) or an object (`{ class, ...attrs }`, merged
  via Vue's `mergeProps`) for the rare case where you need to pass raw
  attributes or event handlers instead of just classes. See
  [Theming](/overview/theming) for the full merge order.
- **CSS-only animation.** Open/close and hover/focus motion is done with
  Reka UI's `data-state` attributes and Tailwind variants - no JavaScript
  animation library. Every transition respects `prefers-reduced-motion`
  automatically.
- **Design tokens, not hardcoded colors.** Every component reads from a
  small set of semantic CSS custom properties (`--ui-primary`,
  `--ui-border`, `--ui-text-muted`, and so on) instead of baking in
  specific Tailwind color classes, so retheming an app doesn't require
  rebuilding the library. See [Theming](/overview/theming).

## What you get

Installing the module auto-imports every component with an `S` prefix
(`SButton`, `SModal`, `SSelect`, ...), plus two composables
(`useModal`, `useSlideover`) and one directive (`v-ripple`) for
programmatic overlays and click-feedback. Start with
[Installation](/overview/installation).
