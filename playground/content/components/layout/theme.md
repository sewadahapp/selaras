---
title: Theme
description: Scope theme overrides to a subtree instead of the whole app.
order: 69
---

## Usage

`STheme` applies `ui`/`defaults` overrides to descendant components.
It is headless by default. Set `as` to give runtime token overrides an
explicit DOM boundary.

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

`defaults` sets a default value for a prop on every matching descendant,
rather than a class override:

```vue-html
<STheme :defaults="{ button: { size: 'lg' } }">
  <SButton>No own size - renders lg</SButton>
  <SButton size="sm">Explicit size - still sm</SButton>
</STheme>
```

An explicit prop on the component itself always wins - `STheme` only
fills in when a prop is left unset. **Only `size`/`color` are wired up to
read this today**, and only on `Button`, `Badge`, `Avatar`, `Chip`, and
`Input` - not every prop on every component. Unwired components ignore
`defaults` entirely (their own `:ui`/`app.config.ui` overrides are
unaffected either way).

### Nesting

An inner `STheme` wins for the specific settings it sets, while still
inheriting whatever an outer one set and it didn't touch:

```vue-html
<STheme :ui="{ button: { base: 'rounded-full' } }" :defaults="{ button: { color: 'neutral' } }">
  <STheme :defaults="{ button: { color: 'danger' } }">
    <SButton>Rounded (from the outer Theme) + danger (from the inner one)</SButton>
  </STheme>
</STheme>
```

### Scoped tokens and portals

Use `as` to create a DOM boundary for semantic token overrides:

```vue-html
<STheme as="section" :tokens="{ light: { premium: { fill: '#5134a8' } } }">
  <!-- nested token scopes inherit untouched modes, roles and leaves -->
</STheme>
```

This example assumes a registered `premium` role. Managed overrides are
carried into supported overlay portals. An inner scope
can override one leaf and retain its outer scope's other values, including
after reactive updates. A headless `STheme` passes the existing token scope
through; its own `tokens` require an explicit `as` root.

External CSS variables still follow DOM inheritance. If a token references
a variable declared on a local ancestor, use a portal target within that
ancestor; the theme marker does not copy arbitrary CSS variables.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `ui` | `Partial<Record<string, object>>` | - |
| `defaults` | `Partial<Record<string, Record<string, unknown>>>` | - |
| `tokens` | `RuntimeTokenOverrides` | - |
| `as` | `string \| Component` | - |
