---
title: Component usage
description: Use providers, component props, slots, models, and shared configuration.
order: 30
---

Selaras components are auto-imported with the `S` prefix. Start with an existing component, then customize its props and slots before building a replacement.

## State and events

```vue
<script setup lang="ts">
const selected = ref<'Small' | 'Medium' | 'Large'>()
</script>

<template>
  <SSelect v-model="selected" :items="['Small', 'Medium', 'Large']" placeholder="Choose a size" />
</template>
```

Component reference pages document models, events, item shapes, and slots. Item labels are your content; internal labels are controlled through [messages](/overview/getting-started/messages).

## Customization

Use props for supported behavior and appearance. Use slots for custom content, `class` for the root, and `:ui` for specific styled parts. See [Component styling](/overview/theming/component-styling) for merging and precedence.

Wrap your app in [SApp](/components/layout/app) for providers. Add [Toast](/components/overlays/toast) and [CommandPalette](/components/overlays/command-palette) where their references describe; providers alone do not render these controls.

## Responsive interfaces

Use [adaptive controls](/overview/getting-started/adaptive-interfaces) to opt into modal presentation on small screens. Responsive layout utilities and adaptive presentation solve different needs.
