---
title: Separator
description: A visual (and semantic) rule between sections, built on Reka UI's Separator primitive.
order: 12.75
---

## Usage

::component-example{name="separator-basic"}
::

```vue-html
<p>Above the line</p>
<SSeparator />
<p>Below the line</p>
```

### Vertical

`orientation="vertical"` needs a real height to size against - a flex
row with a fixed height (or `items-stretch`) gives it one:

::component-example{name="separator-vertical"}
::

```vue-html
<div class="flex h-5 items-center gap-3">
  <span>Docs</span>
  <SSeparator orientation="vertical" />
  <span>Utilities</span>
</div>
```

### Variant

`variant` switches the line style between `solid` (default), `dashed`,
`dotted`, and `double` - matching CSS's own `border-style` keywords,
since that's what each one maps to under the hood:

::component-example{name="separator-variant"}
::

```vue-html
<SSeparator variant="dashed" />
```

### Color

Unlike most components in this library, `color` isn't gated behind a
focus/hover state - the line is always visible, so it tints directly.
`neutral` (default) is the same subtle border color this component
always used; the rest give a divider real emphasis:

::component-example{name="separator-color"}
::

```vue-html
<SSeparator color="danger" />
```

### With a label

Content in the default slot centers in the line, splitting it evenly on
both sides:

::component-example{name="separator-label"}
::

```vue-html
<SSeparator>Or continue with</SSeparator>
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `horizontal` |
| `variant` | `'solid' \| 'dashed' \| 'dotted' \| 'double'` | `solid` |
| `color` | `'neutral' \| 'primary' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `neutral` |
| `decorative` | `boolean` | `false` |
| `ui` | `Partial<Record<'root' \| 'line' \| 'label', string \| object>>` | - |

`decorative` renders `role="none"` instead of the default
`role="separator"` - use it when the line is purely visual (inside a
toolbar, say) rather than marking a real thematic break in content.

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `default` | - | A label centered in the line |
