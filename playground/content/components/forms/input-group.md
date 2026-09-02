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
  <span class="inline-flex items-center rounded-[var(--ui-radius-md)] bg-[var(--ui-bg-elevated)] px-3 text-sm text-[var(--ui-text-muted)] ring-1 ring-inset ring-[var(--ui-border)]">
    $
  </span>
  <SInput placeholder="0.00" />
  <span class="inline-flex items-center rounded-[var(--ui-radius-md)] bg-[var(--ui-bg-elevated)] px-3 text-sm text-[var(--ui-text-muted)] ring-1 ring-inset ring-[var(--ui-border)]">
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

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `ui` | `Partial<Record<InputGroupSlot, string \| object>>` | - |
