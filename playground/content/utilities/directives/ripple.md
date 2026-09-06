---
title: v-ripple
description: A click-feedback ripple effect for any element.
order: 10
---

`v-ripple` spawns a growing, fading circle from the pointer's position on
`pointerdown` - the classic ripple-style click feedback. It works on any
element, not just Selaras components.

## Usage

Auto-imported, no explicit import needed inside a Nuxt app:

```vue-html
<button v-ripple>
  Click me
</button>
```

Opt out per-element with `v-ripple="false"`, or override the defaults:

```vue-html
<button v-ripple="{ color: 'var(--ui-primary)', opacity: 0.4, duration: 700 }">
  Click me
</button>
```

### `RippleOptions`

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `string` | `'currentColor'` | Fill color for the ripple. |
| `opacity` | `number` | `0.25` | Peak opacity before fading out. |
| `duration` | `number` | `500` | How long the ripple takes to grow and fade, in ms. |

### Disabling it globally

`app.config.ripple = false` turns ripples off everywhere, instead of
opting out one element at a time:

```ts
// app.config.ts
export default defineAppConfig({
  ripple: false,
})
```

This only reaches components that actually check it - Selaras's own
components that use `v-ripple` internally (like `SButton`) already do, via
the `useRippleEnabled()` composable. A bare `v-ripple` you write yourself
on a plain element doesn't read `app.config.ripple` automatically (a
directive's own lifecycle hooks can't call `useAppConfig()` - it needs a
component's `setup()` context) - read it yourself and pass it as the
binding value if you want your own elements to respect the same global
toggle:

```vue-html
<script setup lang="ts">
const rippleEnabled = useRippleEnabled()
</script>

<template>
  <button v-ripple="rippleEnabled">
    Click me
  </button>
</template>
```

## Outside a Nuxt app

`v-ripple` is also exported explicitly, for a plain Vue app or one with
auto-imports disabled:

```ts
import { vRipple } from 'selaras/directives'
```

## Behavior notes

- The host element gets `position: relative; overflow: hidden` applied
  automatically if it doesn't already have an opinion on either, so the
  ripple stays contained to its shape without any extra CSS from you.
- Respects `prefers-reduced-motion` automatically, through the same
  reduced-motion handling every other animation in the library goes
  through - no separate configuration needed.
