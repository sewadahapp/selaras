---
title: Color modes
description: Use light, dark, and system appearance with optional scoped modes.
order: 40
---

Selaras automatically installs Nuxt Color Mode and ships light and dark token recipes. The `system` preference follows the operating system; the resolved appearance is either `light` or `dark`.

## Built-in controls

```vue-html
<SColorModeToggle />
<SColorModeSwitch />
```

[ColorModeToggle](/components/layout/color-mode-toggle) switches appearance through a button. [ColorModeSwitch](/components/layout/color-mode-switch) offers a switch. Both use the shared color-mode state.

## Preference and resolved appearance

```vue
<script setup lang="ts">
const colorMode = useColorMode()
</script>

<template>
  <SButton @click="colorMode.preference = 'system'">
    Use system appearance
  </SButton>
</template>
```

Read `colorMode.preference` for the user's choice and `colorMode.value` for the resolved mode. Nuxt Color Mode manages the root `.light` and `.dark` classes and persistence. Configure its `colorMode` options in `nuxt.config.ts` when you need a different initial preference or storage policy.

## Scoped appearance

```vue-html
<STheme as="section" mode="dark">
  <SCard>Dark content inside a light page</SCard>
</STheme>
```

`STheme` accepts `inherit`, `light`, and `dark`. An explicit scoped mode needs a DOM owner through `as`. See [Scoped themes](/overview/theming/scoped-themes) for component configuration and token overrides.

Color modes choose light or dark recipes. Semantic roles such as `primary` and `danger` select a color purpose; documentation theme presets choose a visual design. These are separate settings.
