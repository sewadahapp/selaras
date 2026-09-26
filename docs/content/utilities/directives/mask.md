---
title: v-mask
description: Format text as a user types into an input.
order: 20
---

`v-mask` formats text as it is entered. The input shows the formatted text,
while `v-model` receives the raw value without the mask's literal
characters. It works on native inputs and single-input components such as
`SInput`.

## Usage

In Nuxt, the directive is auto-imported. Pass the mask pattern as a string -
it's a JavaScript expression, so it needs its own quotes:

```vue-html
<input v-model="phone" v-mask="'(###) ###-####'" inputmode="tel">
```

Typing `5551234567` shows `(555) 123-4567`, and `phone` is `5551234567`.
Setting `phone` from code formats it the same way.

It works the same on `SInput`:

::component-example{name="input-masked"}
::

```vue-html
<SInput v-model="phone" v-mask="'(###) ###-####'" inputmode="tel" />
```

## Tokens

| Token | Matches |
| --- | --- |
| `#` | A digit |
| `@` | A letter |
| `*` | A letter or a digit |

Any other character in the mask is a literal, inserted automatically as the
user types. Characters that don't fit the next token are skipped.

A date-shaped mask like `##/##/####` formats text only; it doesn't check
that the date is a real calendar date:

```vue-html
<SInput v-model="date" v-mask="'##/##/####'" placeholder="dd/mm/yyyy" />
```

Literal prefixes work too. With `+62####`, typing `8123` shows `+628123`,
and the raw value stays `8123`.

## Options

Pass an object for custom tokens or to read the formatted value as well:

| Option | Type | Description |
| --- | --- | --- |
| `mask` | `string` | The mask pattern. |
| `tokens` | `Record<string, { pattern: RegExp, transform?: (char: string) => string }>` | Extra tokens, merged over the defaults. |
| `onMask` | `(detail: MaskDetail) => void` | Called with `{ value, maskedValue, completed }` whenever the formatted text changes. |

Custom tokens can transform what they accept - here, a hex code shown in
uppercase:

```vue-html
<SInput
  v-model="color"
  v-mask="{
    mask: 'HHHHHH',
    tokens: { H: { pattern: /[\da-f]/i, transform: char => char.toUpperCase() } },
  }"
/>
```

Use `onMask` when you need the formatted text or want to know whether every
position is filled. `value` matches `v-model`, `maskedValue` is what the
input shows, and `completed` is `true` once every token is filled:

```vue-html
<SInput
  v-model="phone"
  v-mask="{ mask: '(###) ###-####', onMask: ({ maskedValue }) => formatted = maskedValue }"
/>
```

The same detail is also dispatched as a bubbling native `mask` event on the
input.
