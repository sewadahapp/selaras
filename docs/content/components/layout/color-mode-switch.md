---
title: ColorModeSwitch
description: A switch that changes between light and dark mode.
order: 65
---

## Usage

::component-example{name="color-mode-switch-basic"}
::

```vue-html
<SColorModeSwitch />
<SColorModeSwitch label="Dark mode" description="Choose your preferred appearance." />
```

The switch is checked in dark mode and unchecked in light mode. It follows
the resolved appearance when the preference is `system`; changing it sets
an explicit `light` or `dark` preference through `useColorMode()`. Preferences
are persisted by the color-mode module that Selaras installs automatically.
The switch is disabled on pages with a forced color mode.

It uses the same theme and `ui` slots as [Switch](/components/forms/switch),
with sun and moon icons in the thumb. Use [ColorModeToggle](/components/layout/color-mode-toggle)
for a button instead.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `id` | `string` | — |
| `label` | `string` | — |
| `description` | `string` | — |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `color` | `ColorRole` | `'primary'` |
| `disabled` | `boolean` | `false` |
| `checkedIcon` | `string` | Registered dark-mode icon |
| `uncheckedIcon` | `string` | Registered light-mode icon |
| `ui` | Switch slot overrides | — |

Without a label, the switch has a localized accessible name. Set `aria-label`
to customize it. Set either icon prop to an empty string to hide that icon.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Replaces the label. |
| `description` | Replaces the description when `description` is provided. |
