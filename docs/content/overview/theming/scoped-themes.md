---
title: Scoped themes
description: Apply component configuration and color modes to a subtree.
order: 60
---

### Scoped component configuration

Use `STheme` to scope `ui` and supported default props to a subtree:

```vue-html
<STheme :ui="{ button: { slots: { base: 'font-mono' } } }">
  <SButton>Scoped</SButton>
</STheme>
```

Use a DOM boundary when you also need runtime token overrides:

```vue-html
<STheme
  as="section"
  :tokens="{
    light: {
      colors: {
        primary: {
          fill: '#fd5e53',
        },
      },
    },
  }"
>
  <SButton color="primary">Scoped color</SButton>
</STheme>
```

Runtime tokens are useful for dynamic or scoped themes. They do not replace the
normal CSS-first global theme path.

Supported overlay portals carry managed Selaras theme values into the portal
scope. External CSS custom properties still follow normal DOM inheritance.
