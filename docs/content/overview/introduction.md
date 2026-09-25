---

title: Introduction
description: Learn what Selaras is, what it provides, and how you can customize it.
order: 10
---

Selaras is a UI component library for Nuxt.

It uses [Reka UI](https://reka-ui.com) for accessible UI primitives. It uses Tailwind CSS v4 for styling and [tailwind-variants](https://www.tailwind-variants.org) for component variants.

Selaras provides ready-to-use components for forms, navigation, data display, overlays, content, and application layouts.

## Design goals

### CSS-first theming

Selaras uses CSS custom properties for design values.

You can change colors, surfaces, text, borders, radius, shadows, and other theme values with CSS.

For example:

```css
:root {
  --selaras-color-primary-fill: #6d4aff;
  --selaras-surface-canvas: #f9f9f9;
  --selaras-surface-default: #ffffff;
  --selaras-radius-base: 0.5rem;
}
```

You do not need JavaScript or Nuxt configuration for normal theme changes.

Use Nuxt configuration only when Selaras needs build-time information. For example, use it when you add a new color role such as `tertiary`.

See [Theming](/overview/theming) for all theme options.

### Predictable component customization

Each component has one `:ui` prop for instance-level customization.

Use `:ui` when you want to change the classes or attributes of one component.

```vue-html
<SButton :ui="{ base: 'font-mono' }">
  Save
</SButton>
```

Use CSS theme tokens when you want to change design values across many components.

Use `app.config.ts` or `STheme` when you want to change component configuration across an application or a subtree.

### Accessible primitives

Selaras uses Reka UI for many interactive primitives.

Reka UI provides keyboard interaction, focus management, ARIA behavior, and other accessibility features for these primitives.

Selaras adds its own components and styling on top of this foundation.

### Adaptive interfaces

Some Selaras components can use a different presentation when the available screen space changes.

For example, a component can use a popover on a larger screen and a modal or drawer on a smaller screen.

The component keeps one public API while Selaras changes the presentation.

### CSS-based motion

Selaras uses CSS for component transitions and interaction states.

It does not require a JavaScript animation library for its standard motion.

Selaras also respects the user's reduced-motion preference.

## What you get

When you install Selaras, Nuxt automatically imports the components with an `S` prefix.

For example:

```vue-html
<SButton />
<SInput />
<SSelect />
<SModal />
<STable />
```

Selaras also provides composables for application-level UI:

```ts
useModal()
useDrawer()
useSlideover()
useToast()
useCommandPalette()
```

Selaras can also provide small DOM behaviors through directives, such as:

```vue-html
<SButton v-ripple>
  Save
</SButton>

<SInput v-mask="'(###) ###-####'" inputmode="tel" />
```

## Where to start

Start with [Installation](/overview/installation).

Then read [Theming](/overview/theming) to learn how to customize Selaras with CSS.

Use the component documentation when you need the props, slots, events, variants, and `:ui` options for a specific component.

## Acknowledgments

Selaras uses [Reka UI](https://reka-ui.com) as its primitive foundation.

Its API and interaction design also take ideas from other Vue and Nuxt UI projects, including:

* [Nuxt UI](https://ui.nuxt.com)
* [PrimeVue](https://primevue.org)
* [shadcn-vue](https://www.shadcn-vue.com)
* [UI Thing](https://ui-thing.behonbaker.com)
* [Quasar](https://quasar.dev)

These projects provide useful references for component APIs, interaction patterns, and design-system architecture.
