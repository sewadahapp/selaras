---
title: v-mask
description: Format text as a user types into an input.
order: 20
---

`v-mask` formats text as it is entered. The input displays the masked value,
while `v-model` receives the raw value without mask literals. It works on native
inputs and single-input components such as `SInput`.

## Usage

In Nuxt, the directive is auto-imported:

::component-example{name="input-masked"}
::

```vue-html
<SInput
  v-model="phone"
  v-mask="{ mask: '(###) ###-####', onMask: ({ maskedValue }) => formattedPhone = maskedValue }"
  inputmode="tel"
/>
```

The `onMask` callback receives `{ value, maskedValue, completed }`. `value`
matches `v-model`; `maskedValue` is the formatted text displayed by the input.
The same detail is emitted as a bubbling native `mask` event.

The default tokens are `#` for a digit, `@` for a letter, and `*` for a
letter or digit. Other characters are inserted as literals. For example,
typing `5551234567` with the phone mask above displays `(555) 123-4567`.

Use the default digit token for a date-shaped value such as `25/09/2026`:

```vue-html
<SInput v-model="date" v-mask="'##/##/####'" placeholder="dd/mm/yyyy" />
```

Masking only formats text; it does not check whether the date is a real
calendar date. If you prefer `dd/mm/yyyy` as the mask pattern, define those
letters as custom digit tokens:

```vue-html
<SInput
  v-model="date"
  v-mask="{
    mask: 'dd/mm/yyyy',
    tokens: {
      d: { pattern: /\d/ },
      m: { pattern: /\d/ },
      y: { pattern: /\d/ },
    },
  }"
/>
```

Literal prefixes work too. With `+62####`, typing `8123` displays `+628123`;
the raw `v-model` value remains `8123`, while `maskedValue` contains `+628123`.

## Options

Pass an options object when you need custom tokens or other mask behavior:

```vue-html
<SInput
  v-model="cardNumber"
  v-mask="{
    mask: 'HHHH HHHH HHHH HHHH',
    tokens: { H: { pattern: /[\da-f]/i, transform: value => value.toUpperCase() } },
  }"
/>
```

Mask options are forwarded to [Maska](https://beholdr.github.io/maska/),
which Selaras uses for input formatting. This includes dynamic masks, custom
tokens, eager and reversed masks, number formatting, and preprocessing hooks.
Selaras uses `onMask` for the normalized callback shape above.

## Outside Nuxt

Import the directive explicitly in a Vue application without Nuxt auto-imports:

```ts
import { vMask } from '@sewadah/selaras/directives'
```

Vue recognizes the `vMask` import in `<script setup>` as the local `v-mask`
directive.
