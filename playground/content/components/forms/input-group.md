---
title: InputGroup
description: Visually joins form controls and addons into one unit.
order: 20.25
---

## Usage

`SInputGroup` takes any mix of children in its default slot and squares off
their shared inner corners, overlapping their 1px borders so they read as
one control instead of several stacked side by side.

::component-example{name="input-group-basic"}
::

```vue-html
<SInputGroup>
  <span class="inline-flex items-center rounded-[var(--selaras-resolved-radius-md)] bg-[var(--selaras-resolved-surface-elevated)] px-3 text-sm text-[var(--selaras-resolved-text-muted)] ring-1 ring-inset ring-[var(--selaras-resolved-border-default)]">
    $
  </span>
  <SInput placeholder="0.00" />
  <span class="inline-flex items-center rounded-[var(--selaras-resolved-radius-md)] bg-[var(--selaras-resolved-surface-elevated)] px-3 text-sm text-[var(--selaras-resolved-text-muted)] ring-1 ring-inset ring-[var(--selaras-resolved-border-default)]">
    USD
  </span>
</SInputGroup>

<SInputGroup>
  <SInput placeholder="Search..." />
  <SButton>Search</SButton>
</SInputGroup>
```

### With a Select

Any groupable component works, not just Input and Button - here a
`SSelect` is joined to an `SInput`:

::component-example{name="input-group-select"}
::

```vue-html
<SInputGroup>
  <SSelect v-model="countryCode" :items="countryCodes" class="w-24 shrink-0" />
  <SInput placeholder="Phone number" />
</SInputGroup>
```

### Vertical

::component-example{name="input-group-vertical"}
::

```vue-html
<SInputGroup orientation="vertical">
  <SInput placeholder="First name" />
  <SInput placeholder="Last name" />
</SInputGroup>
```

### Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot and variant - here's `InputGroup`'s own theme file:

Global and scoped theme recipes use `ui.inputGroup`.

::theme-source{name="input-group"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `ui` | `Partial<Record<InputGroupSlot, string \| object>>` | - |
