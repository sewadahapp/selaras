---
title: Color roles
description: Configure built-in and custom semantic colors.
order: 30
---

### Built-in component color roles

Selaras supplies these roles:

- `primary`
- `secondary`
- `success`
- `info`
- `warning`
- `danger`
- `neutral`

The default theme maps these roles to foundation palettes:

| Role | Default foundation |
| --- | --- |
| `primary` | `indigo` |
| `secondary` | `plum` |
| `success` | `green` |
| `info` | `blue` |
| `warning` | `yellow` |
| `danger` | `red` |
| `neutral` | `gray` |

The role name is the meaning. The foundation name is the hue family.

For example, the default `warning` recipe reads the Selaras yellow palette.
The default `danger` recipe reads the Selaras red palette.

### Change one exact role value

You can override a public role input directly:

```css
:root {
  --selaras-color-warning-fill: #ffff00;
  --selaras-color-warning-on-fill: #000000;
}
```

Selaras uses the exact CSS value that you provide. It does not change it.

This example changes only two leaves. The other warning leaves still use their
default values. If you want one consistent custom warning theme, define the
complete recipe.

### Build one role from one CSS color

You do not need a TypeScript helper when you want to start from one CSS color.

You can keep the base color exact and derive the other values with CSS:

```css
:root {
  --brand: #fd5e53;

  --selaras-color-primary-fill:
    var(--brand);

  --selaras-color-primary-fill-hover:
    color-mix(in oklch, var(--brand), black 8%);

  --selaras-color-primary-fill-pressed:
    color-mix(in oklch, var(--brand), black 15%);

  --selaras-color-primary-on-fill:
    white;

  --selaras-color-primary-indicator:
    color-mix(in oklch, var(--brand), black 18%);

  --selaras-color-primary-subtle:
    color-mix(in oklch, var(--brand) 12%, transparent);

  --selaras-color-primary-subtle-hover:
    color-mix(in oklch, var(--brand) 18%, transparent);

  --selaras-color-primary-subtle-pressed:
    color-mix(in oklch, var(--brand) 24%, transparent);

  --selaras-color-primary-on-subtle:
    color-mix(in oklch, var(--brand), black 35%);

  --selaras-color-primary-text:
    color-mix(in oklch, var(--brand), black 20%);

  --selaras-color-primary-text-hover:
    color-mix(in oklch, var(--brand), black 28%);

  --selaras-color-primary-text-pressed:
    color-mix(in oklch, var(--brand), black 35%);

  --selaras-color-primary-border:
    var(--brand);

  --selaras-color-primary-focus:
    var(--brand);
}
```

This is only one possible recipe. You own the color choices.

Test the result in the components and contexts that your application uses.
Selaras does not change CSS values that you author.

### Complete role recipe

A color role has these public inputs:

```text
fill
fill-hover
fill-pressed
on-fill
indicator

subtle
subtle-hover
subtle-pressed
on-subtle

text
text-hover
text-pressed

border
focus
```

For `warning`, the full CSS names are:

```css
:root {
  --selaras-color-warning-fill: ...;
  --selaras-color-warning-fill-hover: ...;
  --selaras-color-warning-fill-pressed: ...;
  --selaras-color-warning-on-fill: ...;
  --selaras-color-warning-indicator: ...;

  --selaras-color-warning-subtle: ...;
  --selaras-color-warning-subtle-hover: ...;
  --selaras-color-warning-subtle-pressed: ...;
  --selaras-color-warning-on-subtle: ...;

  --selaras-color-warning-text: ...;
  --selaras-color-warning-text-hover: ...;
  --selaras-color-warning-text-pressed: ...;

  --selaras-color-warning-border: ...;
  --selaras-color-warning-focus: ...;
}
```

Replace `warning` with any registered role name.

The component variant selects the leaves that it needs. For example, a solid
Button uses `fill`, `on-fill`, `fill-hover`, and `fill-pressed`. A soft Button
uses the `subtle` leaves. Essential unpaired graphics, such as progress and
radio indicators, use `indicator`. When it is omitted, it follows `border`.

You can also supply different values for dark mode:

```css
:root {
  --selaras-color-warning-fill: #ffff00;
  --selaras-color-warning-on-fill: #000000;
}

:root.dark {
  --selaras-color-warning-fill: #eaea00;
  --selaras-color-warning-on-fill: #000000;
}
```

## Nuxt configuration and theme helpers

Use CSS first.

Use `nuxt.config.ts` when Selaras needs build-time information. The most common
color case is a new role name.

### Add a new role

Built-in role names already work without theme configuration.

A new role such as `tertiary` or `premium` must be registered at build time so
Selaras can:

- generate its role bindings
- add it to `ColorRole`
- make `color="tertiary"` type-safe

The current Nuxt API requires a light and dark recipe:

```ts
import { defineColor } from '@sewadah/selaras/theme'

export default defineNuxtConfig({
  modules: ['@sewadah/selaras'],

  selaras: {
    theme: {
      colors: {
        tertiary: defineColor({
          light: {
            fill: 'var(--company-tertiary-fill)',
            onFill: 'var(--company-tertiary-on-fill)',
            subtle: 'var(--company-tertiary-subtle)',
            onSubtle: 'var(--company-tertiary-on-subtle)',
            text: 'var(--company-tertiary-text)',
            border: 'var(--company-tertiary-border)',
          },
          dark: {
            fill: 'var(--company-tertiary-fill-dark)',
            onFill: 'var(--company-tertiary-on-fill-dark)',
            subtle: 'var(--company-tertiary-subtle-dark)',
            onSubtle: 'var(--company-tertiary-on-subtle-dark)',
            text: 'var(--company-tertiary-text-dark)',
            border: 'var(--company-tertiary-border-dark)',
          },
        }),
      },
    },
  },
})
```

After registration, you can use:

```vue-html
<SButton color="tertiary">
  Tertiary
</SButton>
```

You can still override the registered role from CSS:

```css
:root {
  --selaras-color-tertiary-fill: #8b5cf6;
}
```

The Nuxt configuration registers the role. CSS can still own its visual values.

### Override a built-in recipe in Nuxt config

You can also replace a built-in recipe:

```ts
import { defineColor } from '@sewadah/selaras/theme'

export default defineNuxtConfig({
  selaras: {
    theme: {
      colors: {
        warning: defineColor({
          light: {
            fill: '#ffff00',
            onFill: '#000000',
            subtle: '#fffbd1',
            onSubtle: '#3d3d00',
            text: '#6b6b00',
            border: '#a3a300',
          },
          dark: {
            fill: '#eaea00',
            onFill: '#000000',
            subtle: '#2a2a00',
            onSubtle: '#ffff99',
            text: '#ffff66',
            border: '#baba00',
          },
        }),
      },
    },
  },
})
```

`defineColor()` validates the required recipe shape. It does not change the
values that you provide.

The required leaves in each mode are:

- `fill`
- `onFill`
- `subtle`
- `onSubtle`
- `text`
- `border`

These leaves are optional:

- `fillHover`
- `fillPressed`
- `indicator` (defaults to `border`)
- `subtleHover`
- `subtlePressed`
- `textHover`
- `textPressed`
- `focus`

If an optional interaction leaf is missing, Selaras links it to the nearest
defined state. It does not calculate a new hue for `defineColor()`.

### Optional helper: `defineColorFromSeed()`

`defineColorFromSeed()` is not the CSS-first theme path.

Use it when you want Selaras to preserve one opaque sRGB color as the resting
solid fill and derive the rest of the recipe around it.

```ts
import { defineColorFromSeed } from '@sewadah/selaras/theme'

export default defineNuxtConfig({
  selaras: {
    theme: {
      colors: {
        coral: defineColorFromSeed('#FD5E53'),
      },
    },
  },
})
```

The light and dark resting `fill` values remain exactly the six-digit color
that you pass. Selaras chooses black or white `onFill`, derives distinct
interaction states, and derives text, border, focus, and indicator colors
against the supplied surfaces. If those supporting families cannot be derived
safely, the helper rejects the input and directs you to `defineColor()`.

Use CSS or `defineColor()` when you need exact control over every state.

The helper currently accepts only opaque six-digit sRGB hex values. It cannot
evaluate CSS variables, transparent colors, or arbitrary CSS expressions.

If you use custom surfaces, you can give the resolved light and dark surface
colors to the helper:

```ts
defineColorFromSeed('#FD5E53', {
  surfaces: {
    light: '#f4f0e8',
    dark: '#20242a',
  },
})
```

### Optional helper: DTCG resolved colors

If your design-token pipeline uses DTCG, resolve aliases and modes in that
pipeline first.

`dtcgColorToCss()` converts a resolved structured DTCG color value to CSS. It
does not parse a token document. It does not resolve aliases. It does not
select a mode.

```ts
import { dtcgColorToCss } from '@sewadah/selaras/theme'

const fill = dtcgColorToCss(tokens.brand.fill.$value, {
  path: 'semantic.brand.fill.$value',
})
```

You can then use the result in `defineColor()` or in your own generated CSS.
