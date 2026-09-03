---
title: CardGroup
description: A responsive grid wrapper for laying out several Cards side by side.
order: 67
---

## Usage

::component-example{name="card-group-basic"}
::

```vue-html
<SCardGroup>
  <SCard>...</SCard>
  <SCard>...</SCard>
</SCardGroup>
```

Single column below the `sm` breakpoint, `cols` columns at `sm` and up -
`2` by default, matching the most common use ([Card](/components/layout/card)'s
own comparison/before-after cases). `SCardGroup` has no opinion on what's
inside it - any children work, not just [Card](/components/layout/card).

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `cols` | `2 \| 3 \| 4` | `2` |
| `ui` | `Partial<Record<CardGroupSlot, string \| object>>` | - |
