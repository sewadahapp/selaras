---
title: ColorModeToggle
description: A button that switches between light and dark mode.
order: 64
---

## Usage

::component-example{name="color-mode-toggle-basic"}
::

```vue-html
<SColorModeToggle />
```

Built on [`@nuxtjs/color-mode`](https://color-mode.nuxtjs.org/) (a
`moduleDependencies` entry in selaras's own Nuxt module, so it's set up
automatically for any consumer) - toggling flips between `light` and `dark`,
applying a bare `dark`/`light` class on `<html>` that matches this library's
own Tailwind v4 dark variant (`theme.css`'s
`@custom-variant dark (&:where(.dark, .dark *))`) with no extra config.

For anything beyond a simple two-way toggle (e.g. a light/dark/system
picker), call `useColorMode()` yourself - it's the same composable this
component uses internally (`colorMode.preference` is writable, `colorMode.value`
is the resolved mode).

## Props

`SColorModeToggle` takes no props.
