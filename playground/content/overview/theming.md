---
title: Theming
description: Customize Selaras with CSS first. Use Nuxt config and helpers only when you need them.
order: 30
---

Selaras uses CSS custom properties for design values. Start with CSS.

Use Nuxt configuration only when Selaras must know a new color role at build
time, such as `tertiary`. Use TypeScript helpers only when they make a task
easier.

The normal setup is:

```css
@import "tailwindcss";
@import "@sewadah/selaras";
@import "#selaras/tailwind.css";
```

`@sewadah/selaras` supplies the default Selaras colors and structural styles.
`#selaras/tailwind.css` connects Selaras to the Tailwind build of your Nuxt
application. It does not define your color theme.

## Design tokens

### Start with CSS

For most theme changes, edit CSS only.

Selaras has public input variables. The main groups are:

| Input | Purpose |
| --- | --- |
| `--selaras-surface-*` | Page and surface colors |
| `--selaras-text-*` | General text colors |
| `--selaras-border-*` | General border colors |
| `--selaras-color-<role>-<leaf>` | Component color roles, such as `primary` or `warning` |
| `--selaras-radius-*` | Corner radius |
| `--selaras-shadow-*` | Shadow values |
| `--selaras-z-*` | Overlay stacking |
| `--selaras-scrim` | Overlay backdrop |

Selaras also has `--selaras-resolved-*` variables. These are effective read
values. Do not use them as theme inputs.

### Small CSS changes

You can change one value:

```css
:root {
  --selaras-radius-base: 0.375rem;
}
```

Or you can change general surfaces and text:

The light canvas is white by default. A card-heavy dashboard can use a subtle
canvas such as `#f9f9f9` while keeping its component surfaces white:

```css
:root {
  --selaras-surface-canvas: #f9f9f9;
  --selaras-surface-default: #ffffff;
  --selaras-surface-elevated: #fafafa;

  --selaras-text-default: #18181b;
  --selaras-text-muted: #71717a;

  --selaras-border-default: #e4e4e7;
  --selaras-border-hover: #d4d4d8;
}
```

For dark mode, override the same inputs under `:root.dark`:

```css
:root.dark {
  --selaras-surface-canvas: #0c0c0d;
  --selaras-surface-default: #09090b;
  --selaras-surface-elevated: #18181b;

  --selaras-text-default: #fafafa;
  --selaras-text-muted: #a1a1aa;

  --selaras-border-default: #27272a;
  --selaras-border-hover: #3f3f46;
}
```

Selaras follows the `.dark` class on `<html>` for the document theme.

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


### Complete CSS theme example

The following example replaces the main Selaras visual theme with CSS only.

It defines:

- surfaces
- general text
- general borders
- scrim
- radius
- shadows
- `primary`
- `secondary`
- `success`
- `info`
- `warning`
- `danger`
- `neutral`

It also defines separate light and dark values.

These values are examples. Use the values that match your product.

```css
/* Light mode */
:root {
  /* Surfaces */
  --selaras-surface-canvas: #f9f9f9;
  --selaras-surface-default: #fffdf9;
  --selaras-surface-elevated: #ffffff;
  --selaras-surface-inverted: #161616;

  /* General text */
  --selaras-text-default: #1f1f1f;
  --selaras-text-muted: #707070;
  --selaras-text-inverted: #ffffff;

  /* General borders */
  --selaras-border-default: #e7e2dc;
  --selaras-border-muted: #f2eee9;
  --selaras-border-hover: #d4cdc5;

  /* Overlay */
  --selaras-scrim: rgb(0 0 0 / 0.55);

  /* Radius */
  --selaras-radius-base: 0.5rem;
  --selaras-radius-sm: 0.375rem;
  --selaras-radius-md: 0.5rem;
  --selaras-radius-lg: 1rem;
  --selaras-radius-full: 9999px;

  /* Shadows */
  --selaras-shadow-sm: 0 1px 2px rgb(0 0 0 / 0.06);
  --selaras-shadow-md: 0 6px 20px rgb(0 0 0 / 0.10);
  --selaras-shadow-lg: 0 18px 48px rgb(0 0 0 / 0.16);

  /* Primary */
  --selaras-color-primary-fill: #6d4aff;
  --selaras-color-primary-fill-hover: #5e3bf0;
  --selaras-color-primary-fill-pressed: #4f2fd8;
  --selaras-color-primary-on-fill: #ffffff;

  --selaras-color-primary-subtle: #f0ecff;
  --selaras-color-primary-subtle-hover: #e7e0ff;
  --selaras-color-primary-subtle-pressed: #ddd3ff;
  --selaras-color-primary-on-subtle: #3d267f;

  --selaras-color-primary-text: #5b3be0;
  --selaras-color-primary-text-hover: #4f31c4;
  --selaras-color-primary-text-pressed: #4328a9;

  --selaras-color-primary-border: #8d73ff;
  --selaras-color-primary-focus: #6d4aff;

  /* Secondary */
  --selaras-color-secondary-fill: #d946ef;
  --selaras-color-secondary-fill-hover: #c735dc;
  --selaras-color-secondary-fill-pressed: #ad27c2;
  --selaras-color-secondary-on-fill: #ffffff;

  --selaras-color-secondary-subtle: #fcecff;
  --selaras-color-secondary-subtle-hover: #f8ddff;
  --selaras-color-secondary-subtle-pressed: #f3ccff;
  --selaras-color-secondary-on-subtle: #70207c;

  --selaras-color-secondary-text: #b72cca;
  --selaras-color-secondary-text-hover: #9822aa;
  --selaras-color-secondary-text-pressed: #7d1b8b;

  --selaras-color-secondary-border: #e879f9;
  --selaras-color-secondary-focus: #d946ef;

  /* Success */
  --selaras-color-success-fill: #16a34a;
  --selaras-color-success-fill-hover: #138a3f;
  --selaras-color-success-fill-pressed: #107436;
  --selaras-color-success-on-fill: #ffffff;

  --selaras-color-success-subtle: #eaf8ef;
  --selaras-color-success-subtle-hover: #dcf3e4;
  --selaras-color-success-subtle-pressed: #ccecd8;
  --selaras-color-success-on-subtle: #14532d;

  --selaras-color-success-text: #16803f;
  --selaras-color-success-text-hover: #126b35;
  --selaras-color-success-text-pressed: #0f592d;

  --selaras-color-success-border: #3fc16d;
  --selaras-color-success-focus: #16a34a;

  /* Info */
  --selaras-color-info-fill: #0ea5e9;
  --selaras-color-info-fill-hover: #0c91cc;
  --selaras-color-info-fill-pressed: #0a7db0;
  --selaras-color-info-on-fill: #ffffff;

  --selaras-color-info-subtle: #e9f7fe;
  --selaras-color-info-subtle-hover: #d8f1fd;
  --selaras-color-info-subtle-pressed: #c7eafb;
  --selaras-color-info-on-subtle: #0c4a6e;

  --selaras-color-info-text: #087fb6;
  --selaras-color-info-text-hover: #076b9a;
  --selaras-color-info-text-pressed: #065a82;

  --selaras-color-info-border: #38bdf8;
  --selaras-color-info-focus: #0ea5e9;

  /* Warning */
  --selaras-color-warning-fill: #ffff00;
  --selaras-color-warning-fill-hover: #eeee00;
  --selaras-color-warning-fill-pressed: #d8d800;
  --selaras-color-warning-on-fill: #111111;

  --selaras-color-warning-subtle: #fffed6;
  --selaras-color-warning-subtle-hover: #fffca8;
  --selaras-color-warning-subtle-pressed: #fff77a;
  --selaras-color-warning-on-subtle: #575700;

  --selaras-color-warning-text: #757500;
  --selaras-color-warning-text-hover: #626200;
  --selaras-color-warning-text-pressed: #505000;

  --selaras-color-warning-border: #bdbd00;
  --selaras-color-warning-focus: #8a8a00;

  /* Danger */
  --selaras-color-danger-fill: #ff3b5c;
  --selaras-color-danger-fill-hover: #ed2e4e;
  --selaras-color-danger-fill-pressed: #d62241;
  --selaras-color-danger-on-fill: #ffffff;

  --selaras-color-danger-subtle: #fff0f3;
  --selaras-color-danger-subtle-hover: #ffe1e7;
  --selaras-color-danger-subtle-pressed: #ffd0da;
  --selaras-color-danger-on-subtle: #8a1c32;

  --selaras-color-danger-text: #d92c49;
  --selaras-color-danger-text-hover: #bd243f;
  --selaras-color-danger-text-pressed: #a21d35;

  --selaras-color-danger-border: #ff6b84;
  --selaras-color-danger-focus: #ff3b5c;

  /* Neutral */
  --selaras-color-neutral-fill: #27272a;
  --selaras-color-neutral-fill-hover: #3f3f46;
  --selaras-color-neutral-fill-pressed: #52525b;
  --selaras-color-neutral-on-fill: #ffffff;

  --selaras-color-neutral-subtle: #f4f4f5;
  --selaras-color-neutral-subtle-hover: #e4e4e7;
  --selaras-color-neutral-subtle-pressed: #d4d4d8;
  --selaras-color-neutral-on-subtle: #27272a;

  --selaras-color-neutral-text: #3f3f46;
  --selaras-color-neutral-text-hover: #27272a;
  --selaras-color-neutral-text-pressed: #18181b;

  --selaras-color-neutral-border: #a1a1aa;
  --selaras-color-neutral-focus: #52525b;
}


/* Dark mode */
:root.dark {
  /* Surfaces */
  --selaras-surface-canvas: #0c0c0d;
  --selaras-surface-default: #0f0f12;
  --selaras-surface-elevated: #18181d;
  --selaras-surface-inverted: #f6f6f6;

  /* General text */
  --selaras-text-default: #f4f4f5;
  --selaras-text-muted: #a1a1aa;
  --selaras-text-inverted: #18181b;

  /* General borders */
  --selaras-border-default: #2d2d35;
  --selaras-border-muted: #232329;
  --selaras-border-hover: #3b3b45;

  /* Overlay */
  --selaras-scrim: rgb(0 0 0 / 0.72);

  /* Radius */
  --selaras-radius-base: 0.5rem;
  --selaras-radius-sm: 0.375rem;
  --selaras-radius-md: 0.5rem;
  --selaras-radius-lg: 1rem;
  --selaras-radius-full: 9999px;

  /* Shadows */
  --selaras-shadow-sm: 0 1px 2px rgb(0 0 0 / 0.28);
  --selaras-shadow-md: 0 8px 28px rgb(0 0 0 / 0.38);
  --selaras-shadow-lg: 0 22px 56px rgb(0 0 0 / 0.48);

  /* Primary */
  --selaras-color-primary-fill: #8b6cff;
  --selaras-color-primary-fill-hover: #9c82ff;
  --selaras-color-primary-fill-pressed: #ad98ff;
  --selaras-color-primary-on-fill: #171020;

  --selaras-color-primary-subtle: #261f46;
  --selaras-color-primary-subtle-hover: #302858;
  --selaras-color-primary-subtle-pressed: #3a306a;
  --selaras-color-primary-on-subtle: #d9d0ff;

  --selaras-color-primary-text: #b9a9ff;
  --selaras-color-primary-text-hover: #c9bcff;
  --selaras-color-primary-text-pressed: #d8d0ff;

  --selaras-color-primary-border: #7259dc;
  --selaras-color-primary-focus: #9f8aff;

  /* Secondary */
  --selaras-color-secondary-fill: #e879f9;
  --selaras-color-secondary-fill-hover: #ef91fb;
  --selaras-color-secondary-fill-pressed: #f3a9fc;
  --selaras-color-secondary-on-fill: #2a0b2e;

  --selaras-color-secondary-subtle: #3c173f;
  --selaras-color-secondary-subtle-hover: #4a1c4e;
  --selaras-color-secondary-subtle-pressed: #59235d;
  --selaras-color-secondary-on-subtle: #f7c9ff;

  --selaras-color-secondary-text: #f0a5fb;
  --selaras-color-secondary-text-hover: #f5bafd;
  --selaras-color-secondary-text-pressed: #f9d0fe;

  --selaras-color-secondary-border: #c65fd6;
  --selaras-color-secondary-focus: #e879f9;

  /* Success */
  --selaras-color-success-fill: #22c55e;
  --selaras-color-success-fill-hover: #35d36f;
  --selaras-color-success-fill-pressed: #4ade80;
  --selaras-color-success-on-fill: #061a0c;

  --selaras-color-success-subtle: #12331f;
  --selaras-color-success-subtle-hover: #174129;
  --selaras-color-success-subtle-pressed: #1d5033;
  --selaras-color-success-on-subtle: #bbf7d0;

  --selaras-color-success-text: #86efac;
  --selaras-color-success-text-hover: #a7f3c0;
  --selaras-color-success-text-pressed: #c6f6d5;

  --selaras-color-success-border: #3fba68;
  --selaras-color-success-focus: #4ade80;

  /* Info */
  --selaras-color-info-fill: #38bdf8;
  --selaras-color-info-fill-hover: #55c7fa;
  --selaras-color-info-fill-pressed: #73d2fb;
  --selaras-color-info-on-fill: #06151d;

  --selaras-color-info-subtle: #112f3f;
  --selaras-color-info-subtle-hover: #163c50;
  --selaras-color-info-subtle-pressed: #1b4a61;
  --selaras-color-info-on-subtle: #c7efff;

  --selaras-color-info-text: #7dd3fc;
  --selaras-color-info-text-hover: #9bdffc;
  --selaras-color-info-text-pressed: #bae9fd;

  --selaras-color-info-border: #2e9fd0;
  --selaras-color-info-focus: #38bdf8;

  /* Warning */
  --selaras-color-warning-fill: #ffff33;
  --selaras-color-warning-fill-hover: #ffff66;
  --selaras-color-warning-fill-pressed: #ffff88;
  --selaras-color-warning-on-fill: #111100;

  --selaras-color-warning-subtle: #333300;
  --selaras-color-warning-subtle-hover: #414100;
  --selaras-color-warning-subtle-pressed: #505000;
  --selaras-color-warning-on-subtle: #ffffb8;

  --selaras-color-warning-text: #ffff66;
  --selaras-color-warning-text-hover: #ffff88;
  --selaras-color-warning-text-pressed: #ffffaa;

  --selaras-color-warning-border: #baba24;
  --selaras-color-warning-focus: #ffff66;

  /* Danger */
  --selaras-color-danger-fill: #ff5c78;
  --selaras-color-danger-fill-hover: #ff748c;
  --selaras-color-danger-fill-pressed: #ff8ca0;
  --selaras-color-danger-on-fill: #26070d;

  --selaras-color-danger-subtle: #3c1720;
  --selaras-color-danger-subtle-hover: #4b1c28;
  --selaras-color-danger-subtle-pressed: #5b2330;
  --selaras-color-danger-on-subtle: #ffd0da;

  --selaras-color-danger-text: #ff9caf;
  --selaras-color-danger-text-hover: #ffb3c1;
  --selaras-color-danger-text-pressed: #ffc8d2;

  --selaras-color-danger-border: #d64f68;
  --selaras-color-danger-focus: #ff6b84;

  /* Neutral */
  --selaras-color-neutral-fill: #e4e4e7;
  --selaras-color-neutral-fill-hover: #f4f4f5;
  --selaras-color-neutral-fill-pressed: #ffffff;
  --selaras-color-neutral-on-fill: #18181b;

  --selaras-color-neutral-subtle: #27272a;
  --selaras-color-neutral-subtle-hover: #3f3f46;
  --selaras-color-neutral-subtle-pressed: #52525b;
  --selaras-color-neutral-on-subtle: #f4f4f5;

  --selaras-color-neutral-text: #d4d4d8;
  --selaras-color-neutral-text-hover: #e4e4e7;
  --selaras-color-neutral-text-pressed: #f4f4f5;

  --selaras-color-neutral-border: #71717a;
  --selaras-color-neutral-focus: #a1a1aa;
}
```

This example changes the complete semantic theme without `nuxt.config.ts`.

Use `nuxt.config.ts` only when you need build-time features, such as a new
role name that must work with a component `color` prop.

### Change a complete foundation palette

The default foundations are Tailwind v4 theme variables.

For example, the default warning role uses the Selaras yellow foundation. You
can replace that foundation and keep the built-in warning recipe:

```css
@theme {
  --color-selaras-yellow-50: var(--color-orange-50);
  --color-selaras-yellow-100: var(--color-orange-100);
  --color-selaras-yellow-200: var(--color-orange-200);
  --color-selaras-yellow-300: var(--color-orange-300);
  --color-selaras-yellow-400: var(--color-orange-400);
  --color-selaras-yellow-500: var(--color-orange-500);
  --color-selaras-yellow-600: var(--color-orange-600);
  --color-selaras-yellow-700: var(--color-orange-700);
  --color-selaras-yellow-800: var(--color-orange-800);
  --color-selaras-yellow-900: var(--color-orange-900);
  --color-selaras-yellow-950: var(--color-orange-950);
}
```

The warning role now uses your replacement foundation through its existing
recipe.

The same rule applies to:

- `blue` for the default `info` role
- `red` for the default `danger` role
- `gray` for the default `neutral` role
- `green` for the default `success` role
- `yellow` for the default `warning` role
- `indigo` for the default `primary` role
- `plum` for the default `secondary` role

The Selaras gray foundation also supplies the default general surfaces, text,
and borders. A change to the gray foundation can therefore change more than the
`neutral` component role.

### Map an existing design system

You do not have to rename your design tokens.

For example, your design system can use a `10` to `100` scale:

```css
:root {
  --company-brand-10: ...;
  --company-brand-20: ...;
  --company-brand-30: ...;
  --company-brand-40: ...;
  --company-brand-50: ...;
  --company-brand-60: ...;
  --company-brand-70: ...;
  --company-brand-80: ...;
  --company-brand-90: ...;
  --company-brand-100: ...;

  --selaras-color-primary-fill: var(--company-brand-60);
  --selaras-color-primary-fill-hover: var(--company-brand-70);
  --selaras-color-primary-fill-pressed: var(--company-brand-80);
  --selaras-color-primary-on-fill: var(--company-brand-10);

  --selaras-color-primary-subtle: var(--company-brand-10);
  --selaras-color-primary-subtle-hover: var(--company-brand-20);
  --selaras-color-primary-subtle-pressed: var(--company-brand-30);
  --selaras-color-primary-on-subtle: var(--company-brand-90);

  --selaras-color-primary-text: var(--company-brand-70);
  --selaras-color-primary-text-hover: var(--company-brand-80);
  --selaras-color-primary-text-pressed: var(--company-brand-90);

  --selaras-color-primary-border: var(--company-brand-50);
  --selaras-color-primary-focus: var(--company-brand-60);
}
```

Your design system stays the source of truth. The `--selaras-*` variables are
the mapping layer.

### Use your own complete theme

Most applications should import the default theme:

```css
@import "tailwindcss";
@import "@sewadah/selaras";
@import "#selaras/tailwind.css";
```

A mature design system can omit Selaras-owned foundation colors:

```css
@import "tailwindcss";
@import "@sewadah/selaras/structural.css";
@import "#selaras/tailwind.css";
```

Then provide all semantic values that your application uses.

`structural.css` still supplies:

- Selaras source discovery for Tailwind
- variants
- animations
- structural CSS
- semantic read bindings

It does not supply the default Selaras foundation palette.

This mode is for a complete external theme. It is not an automatic unthemed
fallback.

### Radius, shadows, stacking, and Tailwind tokens

Radius uses one base input by default:

```css
:root {
  --selaras-radius-base: 0.25rem;
}
```

Selaras derives its default small, medium, and large radius values from this
base. You can override each radius input separately if you need to.

You can also set shadows and stacking values:

```css
:root {
  --selaras-shadow-sm: 0 1px 2px rgb(0 0 0 / 0.06);
  --selaras-shadow-md: 0 4px 16px -2px rgb(0 0 0 / 0.12);
  --selaras-shadow-lg: 0 12px 32px -4px rgb(0 0 0 / 0.16);

  --selaras-z-modal-overlay: 40;
  --selaras-z-modal: 50;
  --selaras-z-dropdown: 60;
  --selaras-z-tooltip: 70;
  --selaras-z-toast: 80;
}
```

Spacing and normal Tailwind breakpoints are Tailwind tokens, not Selaras theme
tokens:

```css
@theme {
  --breakpoint-3xl: 1920px;
  --spacing: 0.2rem;
}
```

The adaptive Selaras presentation uses the Tailwind breakpoint name selected by
`selaras.adaptive.breakpoint`. The default name is `md`.

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

## The `:ui` prop and `STheme`

Color tokens and component class overrides are separate systems.

Use theme tokens for design values. Use `:ui` when you want to change classes
or attributes for one component instance.

```vue-html
<SButton :ui="{ base: 'font-mono' }">
  Custom
</SButton>
```

Each `:ui` key is a component slot.

A string adds classes. Selaras merges conflicting Tailwind classes with
`tailwind-merge`.

An object can contain `class` and other Vue attributes:

```vue-html
<SButton
  :ui="{
    base: {
      class: 'font-mono',
      'data-test': 'save-button',
    },
  }"
>
  Save
</SButton>
```

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

## Precedence

For component classes, the order from low priority to high priority is:

1. component base `tv()` theme
2. `app.config.selaras.ui`
3. ancestor `STheme` recipes, from outer to inner
4. the component root `class`
5. the component `:ui` slot class

For design tokens, normal CSS cascade rules apply to the public
`--selaras-*` inputs. Managed `STheme` and runtime token scopes create explicit
theme owners for their subtree and supported portals.

## Class prefix

If your Tailwind build uses a class prefix, configure the same prefix in
Selaras. See [Installation](/overview/installation#class-prefix).

The class prefix applies to Selaras utility classes. It does not change the
public `--selaras-*` semantic input names.

## Localization

Theme configuration does not control language or reading direction.

Use:

- [`useMessages`](/utilities/composables/use-messages) for component text
- [`useLocale`](/utilities/composables/use-locale) for locale defaults
- the `SApp` `dir` prop for LTR or RTL layout
