---
title: Progress
description: A linear or circular progress indicator, built on Reka UI's Progress primitive.
order: 12.97
---

## Usage

::component-example{name="progress-basic"}
::

```vue-html
<SProgress :model-value="40" />
```

### Indeterminate

Omit `modelValue` (or set it `null`) for a busy indicator with no known
completion percentage - the bar slides continuously instead of
tracking a width:

::component-example{name="progress-indeterminate"}
::

```vue-html
<SProgress />
```

### Color

::component-example{name="progress-color"}
::

```vue-html
<SProgress :model-value="65" color="success" />
```

### Circular

`type="circular"` draws a ring instead of a bar - the default slot, if
given, centers inside it (there's no room to overlay text on an 8px
bar, so `linear` doesn't get this treatment):

::component-example{name="progress-circular"}
::

```vue-html
<SProgress type="circular" :model-value="70">
  <template #default="{ percent }">{{ Math.round(percent) }}%</template>
</SProgress>
```

### Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot and variant - here's `Progress`'s own theme file:

::theme-source{name="progress"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `modelValue` | `number \| null` | - |
| `max` | `number` | `100` |
| `type` | `'linear' \| 'circular'` | `'linear'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `'primary'` |
| `ui` | `Partial<Record<ProgressSlot, string \| object>>` | - |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `default` | `{ percent }` | Label content - centered inside the ring for `circular` |
