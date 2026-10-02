---
title: Installation
description: Install Selaras and connect its providers and styles.
order: 20
---

## Requirements

Selaras supports Nuxt `^4.5.2`, Tailwind CSS `^4.3.0`, and Node.js
`^22.19.0 || ^24.11.0 || >=26.0.0`. Nuxt provides the Vue runtime and SFC
compiler, so they are not installed or versioned separately. Type checking is
verified with TypeScript `>=5.9.3`; TypeScript is a build-time tool, not a
Selaras runtime dependency.

## Install the package

Nuxt and Tailwind CSS are peer dependencies - install Selaras in an existing
Nuxt project and keep Tailwind under your project's direct control:

::code-group

```bash [bun]
bun add @sewadah/selaras tailwindcss
```

```bash [npm]
npm install @sewadah/selaras tailwindcss
```

```bash [pnpm]
pnpm add @sewadah/selaras tailwindcss
```

::

## Register the module

Add `@sewadah/selaras` to `modules` in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@sewadah/selaras'],
})
```

Components are now auto-imported, and the module pulls in its own
dependencies (`@nuxt/icon`, `@nuxtjs/color-mode`) automatically.

## Wrap your app in `SApp`

Wrap your root `app.vue` in `<SApp>`, once:

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

This isn't optional - without it, Tooltip loses its shared hover-delay
behavior, and `useModal()`/`useDrawer()`/`useSlideover()`/`useConfirm()` (the "open from
anywhere" APIs) have nothing to render into. See [App](/components/layout/app)
for the full picture, including the two components (`SToast`,
`SCommandPalette`) that still need to be placed yourself even with `SApp`
already wrapping everything.

## Import the CSS

Selaras doesn't inject its own CSS for you - import it explicitly in your
own stylesheet, after Tailwind itself:

```css [assets/css/main.css]
@import "tailwindcss";
@import "@sewadah/selaras";
@import "#selaras/tailwind.css";
```

Then point Nuxt at that file:

```ts
export default defineNuxtConfig({
  modules: ['@sewadah/selaras'],
  css: ['~/assets/css/main.css'],
})
```

`@import "@sewadah/selaras";` brings in the default theme and component base
styles - see [Theming](/overview/theming/overview). `#selaras/tailwind.css` is generated
by the Nuxt module. Import it in this same entry so library class candidates
and adaptive presentation use your app's final Tailwind theme.

### Complete explicit theme

Applications with a complete existing semantic theme can import Selaras's
structural entry instead of its owned default foundations:

```css [assets/css/main.css]
@import "tailwindcss";
@import "@sewadah/selaras/structural.css";
@import "#selaras/tailwind.css";
```

This entry retains source discovery, variants, motion and semantic bindings.
Provide a light and dark recipe for every role your components can render,
including any built-in role you keep and each custom role you register. Provide
the functional `--selaras-*` inputs required by your design system as well.
It is not an unthemed zero-configuration mode: incomplete structural themes
have no Selaras fallback palette or runtime completeness diagnostic. Use the
aggregate import unless you provide that complete contract.
If your project also renders long-form markdown/CMS content, add
[prose.css](/components/typography/prose) the same way:

```css [assets/css/main.css]
@import "tailwindcss";
@import "@sewadah/selaras";
@import "#selaras/tailwind.css";
@import "@sewadah/selaras/prose.css";
```



Continue with [Component usage](/overview/getting-started/component-usage) and [Nuxt configuration](/overview/getting-started/nuxt-configuration).
