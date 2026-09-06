---
title: Theme
description: Scope theme overrides to a subtree instead of the whole app.
order: 69
---

## Usage

`STheme` is headless - it renders no element of its own, just a `<slot />`
- and applies `ui`/`props` overrides to every descendant component below
it, however deeply nested, without touching each one individually.

::component-example{name="theme-basic"}
::

```vue-html
<SButton>Default</SButton>
<STheme :ui="{ button: { base: 'rounded-full' } }">
  <SButton>Rounded, scoped</SButton>
</STheme>
```

This is the same override shape as [`app.config.ui`](/overview/theming#4-global-overrides)
- `{ <componentKey>: { slots: { <slotName>: '...' } } }`, merged onto the
component's base theme the same way (`tv()`'s own `extend`) - just scoped
to this subtree instead of the whole app. See
[Theming](/overview/theming) for the full precedence order and how
`:ui`/`app.config.ui`/`STheme` all fit together.

### Prop defaults

`props` sets a default value for a prop on every matching descendant,
rather than a class override:

```vue-html
<STheme :props="{ button: { size: 'lg' } }">
  <SButton>No own size - renders lg</SButton>
  <SButton size="sm">Explicit size - still sm</SButton>
</STheme>
```

An explicit prop on the component itself always wins - `STheme` only
fills in when a prop is left unset. **Only `size`/`color` are wired up to
read this today**, and only on `Button`, `Badge`, `Avatar`, `Chip`, and
`Input` - not every prop on every component. Unwired components ignore
`props` entirely (their own `:ui`/`app.config.ui` overrides are
unaffected either way).

### Nesting

An inner `STheme` wins for the specific settings it sets, while still
inheriting whatever an outer one set and it didn't touch:

```vue-html
<STheme :ui="{ button: { base: 'rounded-full' } }" :props="{ button: { color: 'neutral' } }">
  <STheme :props="{ button: { color: 'danger' } }">
    <SButton>Rounded (from the outer Theme) + danger (from the inner one)</SButton>
  </STheme>
</STheme>
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `ui` | `Partial<Record<string, object>>` | - |
| `props` | `Partial<Record<string, Record<string, unknown>>>` | - |
