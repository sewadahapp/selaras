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

## Field clear controls

Input, Textarea, Select, Autocomplete, and DatePicker share a neutral `ghost`
Button for their built-in clear action. Its hover background sits inside the
field border. The target and glyph have independent sizes, so the clear icon
matches adjacent field icons without needing a full-height button:

| Field size | Clear target | Icon |
| --- | --- | --- |
| `sm` | 24px | 16px |
| `md` | 28px | 18px |
| `lg` | 32px | 20px |

These dimensions scale with the root font size. With `clearable`, the action
stays visible whenever there is content, including the number `0` and an
Autocomplete draft query. Empty, disabled, and read-only fields hide it.
Loading indicators and custom `trailing` content can appear alongside it.
Clearing returns focus to the editor or trigger.

Customize one field with `ui.clear`, or replace its glyph with `#clear-icon`:

```vue-html
<SInput v-model="query" clearable :ui="{ clear: 'rounded-sm' }" />
```

Use the shared `fieldClearButton` recipe in `app.config.ts` to style every
built-in field clear control. The same recipe works inside `STheme`:

```ts [app.config.ts]
export default defineAppConfig({
  selaras: {
    ui: {
      fieldClearButton: {
        slots: { base: 'rounded-sm' },
      },
    },
  },
})
```

Size-specific target or icon overrides use `compoundVariants` with a `size`
condition and the `base` and `icon` slots. DatePicker also exposes `ui.buttonClear` for clear placement
in button trigger mode, and `ui.triggerIcon` for its field-mode calendar/clock
glyph. Keep enough space inside the field when changing the target size.

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
