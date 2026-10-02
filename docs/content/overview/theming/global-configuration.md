---
title: Global configuration
description: Set shared component classes, defaults, and runtime tokens.
order: 55
---

## Global overrides

Use `app.config.ts` when you want global component class changes or supported
component defaults.

This configuration is not required for normal CSS theme customization.

### Global component classes

```ts
export default defineAppConfig({
  selaras: {
    ui: {
      button: {
        slots: {
          base: 'font-mono',
        },
      },
    },
  },
})
```

Selaras extends the component `tailwind-variants` recipe with these classes.

### Global component defaults

Only components that support theme defaults read this configuration.

For example:

```ts
export default defineAppConfig({
  selaras: {
    defaults: {
      button: {
        size: 'lg',
      },
    },
  },
})
```

An explicit component prop has higher priority than a configured default.

### Global runtime tokens

`app.config.selaras.tokens` can also supply runtime token overrides.

Use this only when you need runtime-managed values. Prefer CSS for a static
global design theme.

All app-wide Selaras runtime settings use the `app.config.selaras` namespace.
