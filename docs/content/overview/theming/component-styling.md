---
title: Component styling
description: Customize individual component slots and understand style precedence.
order: 50
---

## Control sizes

Buttons and single-line fields share the same default outer height for each size:

| Size | Height | At a 16px root font size |
| --- | --- | --- |
| `sm` | `2rem` | 32px |
| `md` | `2.5rem` | 40px |
| `lg` | `2.75rem` | 44px |

This applies to Button, Input, InputNumber, Select, Autocomplete, DatePicker,
ColorPicker's trigger, and each PinInput box. DatePicker keeps the same height
with `trigger-mode="field"` and `trigger-mode="button"`, including range and
time-only modes. Clear buttons and loading indicators do not increase the
outer height.

Use the same `size` when placing a field beside an action:

```vue-html
<div class="flex items-center gap-2">
  <SInput size="md" placeholder="Search projects" />
  <SButton size="md">Search</SButton>
</div>
```

The height refers to the control itself; FormField labels, descriptions, and
validation messages add space around it. Textareas and wrapping selections can
grow to fit their content. Buttons embedded inside a field use smaller dimensions
to leave room within the field. Theme and local `:ui` overrides can customize
these defaults.

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
