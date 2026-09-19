---
title: Migrating to 1.0
description: Update pre-1.0 Selaras themes, configuration, and adaptive controls.
order: 50
---

Selaras 1.0 makes the theme and component contracts explicit. Most applications
can keep the usual installation and component usage. Review this guide if you
customize CSS variables, define a theme, use scoped configuration, or use an
adaptive picker.

## 1. Keep the aggregate CSS import unless you own a complete theme

The normal import remains the recommended starting point:

```css [assets/css/main.css]
@import "tailwindcss";
@import "@sewadah/selaras";
@import "#selaras/tailwind.css";
```

It includes Selaras's default foundations and semantic recipes. If your design
system supplies every role and functional token that Selaras can render, use
the structural entry instead:

```css [assets/css/main.css]
@import "tailwindcss";
@import "@sewadah/selaras/structural.css";
@import "#selaras/tailwind.css";
```

Structural CSS is an explicit complete-theme contract. It does not fall back
to Selaras palette values or diagnose omitted roles at runtime. See
[Theming](/overview/theming) for the required semantic recipes and functional
inputs.

## 2. Use the public token namespaces

`--selaras-*` variables are customization inputs. Use
`--selaras-resolved-*` only when your own CSS needs the effective value after
Selaras has applied defaults, modes, and scopes. The old `--ui-*` aliases are
not part of the 1.0 contract; move overrides to the semantic input that
matches their purpose.

```css
/* Before: a legacy, collision-prone implementation alias. */
:root { --ui-border: oklch(0.8 0.02 260); }

/* After: the public semantic input. */
:root { --selaras-border-default: oklch(0.8 0.02 260); }
```

For a color role, provide individual recipe leaves such as
`--selaras-color-primary-fill`. Do not target generated selectors,
`--_selaras-*` variables, or mode/portal attributes: they are implementation
details and can change without a public migration path.

## 3. Register colors at Nuxt build time

A custom `color` name must be registered in `nuxt.config.ts`. Registration
generates its CSS bindings and augments `ColorRole`, so the same role works
across components without component-specific configuration:

```ts [nuxt.config.ts]
import { defineColor } from '@sewadah/selaras/theme'

export default defineNuxtConfig({
  modules: ['@sewadah/selaras'],
  selaras: {
    theme: {
      colors: {
        tertiary: defineColor({
          light: {
            fill: 'var(--brand-tertiary)',
            onFill: '#fff',
            subtle: 'var(--brand-tertiary-subtle)',
            onSubtle: '#172033',
            text: '#284772',
            border: '#7aa1d6',
          },
          dark: {
            fill: '#91bcf5',
            onFill: '#10213b',
            subtle: '#18385f',
            onSubtle: '#e9f2ff',
            text: '#b7d4ff',
            border: '#6b9bd8',
          },
        }),
      },
    },
  },
})
```

Then use `<SButton color="tertiary" />`, `<SBadge color="tertiary" />`, and
other applicable components normally. For a single opaque sRGB brand color,
`defineColorFromSeed()` can create an accessible complete recipe. Existing
token systems can map resolved CSS values into `defineColor()`; the DTCG helper
converts resolved color values, but does not import or resolve a whole DTCG
document.

## 4. Move runtime settings under `selaras`

Place application-level Selaras configuration under `app.config.selaras`.
This prevents collisions with other Nuxt modules and gives scoped `STheme`
overrides the same vocabulary:

```ts [app.config.ts]
export default defineAppConfig({
  selaras: {
    ui: {
      button: { slots: { base: 'rounded-full' } },
    },
    defaults: {
      button: { size: 'lg' },
    },
    tokens: {
      light: { surfaces: { default: '#f8fafc' } },
    },
  },
})
```

Use `STheme`'s `defaults` prop for scoped component prop defaults. It supports
only components that document default support; `ui` recipe overrides remain
available for every typed recipe key.

## 5. Replace `mobileModal` with `adaptive`

Select, Autocomplete, DatePicker, and ColorPicker now opt into small-screen
presentation with `adaptive`:

```vue-html
<!-- Before -->
<SDatePicker mobile-modal />

<!-- After -->
<SDatePicker adaptive />
```

The presentation is selected when the control opens and remains stable until it
closes. Autocomplete intentionally uses a nonmodal mobile panel so its editable
combobox keeps focus. The module reads the Tailwind breakpoint selected by
`selaras.adaptive.breakpoint`; see [Installation](/overview/installation#adaptive-breakpoint).

## 6. Follow controlled and native-control conventions

Use `v-model` for controlled values and `default-value` for an uncontrolled
initial value. Controls with open state use `v-model:open` and `default-open`
the same way. Do not pass both forms for the same state.

```vue-html
<!-- Controlled -->
<SSelect v-model="country" v-model:open="isCountryPickerOpen" />

<!-- Uncontrolled -->
<SSelect default-value="id" :default-open="false" />
```

For native form behavior, put `name`, `form`, `required`, `readonly`, ARIA
attributes, and focus listeners on the Selaras control itself. Select and
picker controls synchronize their native form value and reset behavior; a
multiple Select rejects duplicate selected identities.

## 7. Use supported imports

Import from the package root, documented secondary entries, or
`@sewadah/selaras/components/*`. Do not import renderer queues, internal
composables, raw recipe files, or generated implementation files from `dist`.
Those paths were never stable integration points and are intentionally outside
the 1.0 public API.

Read the [Installation](/overview/installation), [Theming](/overview/theming),
and individual component pages for the resulting API reference. The generated
changelog remains a historical record; this page is the migration contract.
