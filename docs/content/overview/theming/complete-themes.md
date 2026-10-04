---
title: Complete themes
description: Build a complete CSS theme with light and dark recipes.
order: 70
---

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

It also defines separate light and dark values. When adapting this example,
check visible borders against the surfaces they touch in each mode. Surface
and border tokens are independent; see
[Check borders against their surfaces](/overview/theming/css-tokens#check-borders-against-their-surfaces).

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
