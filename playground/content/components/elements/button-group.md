---
title: ButtonGroup
description: Visually joins adjacent buttons into one unit.
order: 10.5
---

## Usage

`SButtonGroup` squares off each button's inner corner and overlaps their
1px rings so the shared edge isn't double-thick, bumping the hovered/
focused button's edge on top of its neighbor's:

::component-example{name="button-group-basic"}
::

```vue-html
<SButtonGroup>
  <SButton variant="outline">Day</SButton>
  <SButton variant="outline">Week</SButton>
  <SButton variant="outline">Month</SButton>
</SButtonGroup>
```

### Vertical

`orientation="vertical"` stacks buttons vertically, squaring off the top/
bottom corners instead:

::component-example{name="button-group-vertical"}
::

```vue-html
<SButtonGroup orientation="vertical">
  <SButton variant="outline">Submit</SButton>
  <SButton variant="outline">Cancel</SButton>
</SButtonGroup>
```

`SButtonGroup` isn't limited to buttons - see [InputGroup](/components/forms/input-group)
for the same joining mechanism extended to Input/Select/Textarea, which
carry their own ring/radius one level deeper than a Button does.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `ui` | `Partial<Record<'root', string \| object>>` | - |
