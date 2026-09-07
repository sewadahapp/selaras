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
(`SButton`, `SModal`, `SSelect`, ...), plus composables for programmatic
overlays (`useModal`, `useDrawer`, `useSlideover`, `useToast`,
`useCommandPalette`) and one directive (`v-ripple`) for click-feedback.
Start with [Installation](/overview/installation).

## Acknowledgments

Selaras is built directly on top of [Reka UI](https://reka-ui.com) for its
accessible primitives. Beyond that foundation, its API shapes and
interaction patterns were also informed by looking at how other component
libraries in the Vue ecosystem approach the same problems, including:

- [Nuxt UI](https://ui.nuxt.com) - a full-featured Vue and Nuxt component library maintained by the Nuxt team.
- [PrimeVue](https://primevue.org) - a long-established, broad Vue UI component library.
- [shadcn-vue](https://www.shadcn-vue.com) - a Vue port of shadcn/ui's copy-into-your-project approach to components.
- [UI Thing](https://ui-thing.behonbaker.com) - a set of Nuxt components built on Reka UI and Tailwind CSS.
- [Quasar](https://quasar.dev) - a Vue framework with a large set of Material Design-influenced components.

Thanks to those communities for the ideas.
