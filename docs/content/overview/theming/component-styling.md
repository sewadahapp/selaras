---
title: Component styling
description: Customize individual component slots and understand style precedence.
order: 50
---

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
