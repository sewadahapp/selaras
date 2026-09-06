---
title: useLocale
description: Set the app-wide default locale that date/time formatting falls back to.
order: 50
---

`DatePicker`, `InputNumber`, and `TimeStepper` (DatePicker's own internal
time section) each take a `locale` prop for their own real `Intl`/
`@internationalized/date`-driven formatting - a BCP-47 code like `de-DE`
or `ar-EG`. Without a global default, every instance across an app needs
that prop repeated explicitly, and forgetting one silently falls back to
`en-US`.

## Usage

Set the default once in `app.config.ts`:

```ts
export default defineAppConfig({
  locale: 'de-DE',
})
```

Every `DatePicker`/`InputNumber` instance that doesn't set its own
`locale` prop now formats against `de-DE` instead of `en-US` - an
explicit per-instance `locale` still overrides this, exactly as before.

This is deliberately just the *date/time-formatting* locale, not a
combined "app language" switch - it's a separate axis from
[`useMessages`](/utilities/composables/use-messages) (the text every
component renders) and from `SApp`'s own `dir` prop (RTL/LTR layout).
Number formatting (`InputNumber`'s `formatOptions`, `Table`'s cell
formatting) reads from the same locale too, but per component instance -
a data grid legitimately showing figures in more than one locale side by
side doesn't need to fight a single global setting.

`SApp` itself reads this to set `<html lang>` alongside its existing
`dir` attribute - no extra wiring needed.

## API

```ts
function useLocale(): ComputedRef<string>
```

Returns your `app.config.locale` override, or `'en-US'` if unset - use
this if you're building your own component and want its own formatting to
respect the same app-wide default DatePicker/InputNumber already do:

```vue
<script setup lang="ts">
const locale = useLocale()
const formatter = computed(() => new Intl.NumberFormat(locale.value))
</script>
```
