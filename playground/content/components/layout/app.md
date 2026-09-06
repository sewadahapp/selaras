---
title: App
description: Wraps your root app.vue - required once, for every app using Selaras.
order: 59
---

## Usage

`SApp` wraps your root `app.vue`, once, around everything else:

```vue-html
<!-- app.vue -->
<template>
  <SApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </SApp>
</template>
```

This isn't optional for most of what Selaras ships - without it:

- **Tooltip** loses its shared hover-delay behavior (quickly moving between
  adjacent tooltips should skip the full delay the second time) - it needs
  Reka UI's `TooltipProvider` context, which only exists inside `SApp`.
- **Toast** has nothing to render into - `ToastProvider`'s own context lives
  here too (you still place `<SToast />` yourself, see below).
- **`useModal()`, `useDrawer()`, and `useSlideover()`** (the programmatic,
  "open from anywhere" APIs) have nothing to render the dialog/panel into -
  `SApp` mounts their renderer components internally. A plain declarative
  `<SModal>`/`<SDrawer>`/`<SSlideover>` placed directly in a page doesn't
  need this - only the `useX()` composable versions do.

If you generated your project via `npx nuxt module add selaras`, or copied
the Quick Setup snippet from the [installation guide](/overview/installation),
this is already done for you.

### Toast and CommandPalette still need to be placed yourself

`SApp` establishes the *context* these two need, but doesn't render them for
you the way it does for Modal/Drawer/Slideover - place `<SToast />` and
`<SCommandPalette>` yourself, once, usually right alongside `SApp` itself:

```vue-html
<!-- app.vue -->
<template>
  <SApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <SToast />
    <SCommandPalette :groups="searchGroups" />
  </SApp>
</template>
```

See [Toast](/components/overlays/toast) and
[CommandPalette](/components/overlays/command-palette) for their own setup
details.

### Reading direction (RTL)

`dir` does two things at once, both needed for real right-to-left support:

- passed to Reka UI's `ConfigProvider`, which every primitive underneath
  inherits for its own internal direction-aware logic (arrow-key roving
  focus in RadioGroup/Tabs, Floating UI positioning, ...);
- set as the real `dir` attribute on `<html>` - this is what actually
  drives native browser behavior (text direction, scrollbar side) and any
  CSS logical-property utility (`ms-*`/`ps-*`/`text-start`/...), none of
  which resolve from Reka's own Vue-level context alone.

```vue-html
<SApp dir="rtl">
  ...
</SApp>
```

`lang` on `<html>` is set automatically too, tracking whatever locale
[`useLocale`](/utilities/composables/use-locale) is already resolving text
and date formatting against - there's no separate prop for it, since it
should always match.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `dir` | `'ltr' \| 'rtl'` | `'ltr'` |

## Slots

| Slot | Description |
| --- | --- |
| default | Your whole app |
