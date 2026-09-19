---
title: PinInput
description: A row of single-character boxes for PIN/OTP codes, built on Reka UI's PinInput primitive.
order: 20.9
---

## Usage

`v-model` is an array of strings, one entry per box - typing
auto-advances focus, backspace on an empty box moves back to and clears
the previous one, and pasting a multi-character value fills several
boxes at once:

::component-example{name="pin-input-basic"}
::

```vue
<script setup lang="ts">
const value = ref<string[]>([])
</script>

<template>
  <SPinInput v-model="value" aria-label="Verification code" />
</template>
```

`length` sets how many boxes render (`5` by default).

### OTP autofill

`otp` sets `autocomplete="one-time-code"`, letting the browser/OS offer
to autofill a code from an incoming SMS, and auto-focuses the first
empty box whenever focus lands anywhere in the group:

::component-example{name="pin-input-otp"}
::

```vue-html
<SPinInput v-model="value" otp :length="6" />
```

### Masked

`mask` renders each box as a password field (dots instead of the typed
character) - a PIN code someone might be entering in public:

::component-example{name="pin-input-mask"}
::

```vue-html
<SPinInput v-model="value" mask />
```

### Numeric

`type="number"` gets the mobile numeric keypad (`inputmode="numeric"`)
and filters out non-digit input - but stores each box as a real
`number`, not a string, so a leading zero is lost (`"0"` becomes `0`,
and a code like `"007"` becomes `7`). Stick with the default `type="text"`
whenever leading zeros are significant, which is the common case for a
PIN/OTP code:

::component-example{name="pin-input-numeric"}
::

```vue-html
<SPinInput v-model="value" type="number" />
```

### Color

The `color` variant recolors the focus ring only - the resting ring
stays neutral regardless, matching `Input`:

::component-example{name="pin-input-color"}
::

```vue-html
<SPinInput color="success" />
```

### Forms integration

Wrap it in [FormField](/components/forms/form-field) to get `id`/`name`/`invalid` and
`aria-describedby` wired up automatically - `invalid` falls back to
FormField's own state when not set directly on the pin input, and `size`
does the same.

### Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot and variant - here's `PinInput`'s own theme file:

::theme-source{name="pin-input"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `modelValue` | `(string \| number)[]` | - |
| `defaultValue` | `(string \| number)[]` | - |
| `length` | `number` | `5` |
| `placeholder` | `string` | - |
| `mask` | `boolean` | `false` |
| `otp` | `boolean` | `false` |
| `type` | `'text' \| 'number'` | `text` |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `primary` |
| `name` | `string` | - |
| `required` | `boolean` | `false` |
| `ui` | `Partial<Record<'root' \| 'input', string \| object>>` | - |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `(string \| number)[]` | Fires on every keystroke/paste |
| `complete` | `(string \| number)[]` | Fires once, when every box has a value |
