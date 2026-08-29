---
title: Pagination
description: A page-number control built on Reka UI's Pagination primitive.
order: 44
---

## Usage

::component-example{name="pagination-basic"}
::

```vue
<script setup lang="ts">
const page = ref(1)
</script>

<template>
  <SPagination v-model:page="page" :total="120" :items-per-page="10" />
</template>
```

### Sizes

`size` takes `sm` / `md` / `lg`, scaling every button (and the ellipsis, to
stay aligned with them) together:

::component-example{name="pagination-sizes"}
::

```vue-html
<SPagination v-model:page="page" size="sm" :total="50" :items-per-page="10" />
<SPagination v-model:page="page" size="md" :total="50" :items-per-page="10" />
<SPagination v-model:page="page" size="lg" :total="50" :items-per-page="10" />
```

### Sibling count & edges

`sibling-count` controls how many page numbers show on either side of the
current page before collapsing into an ellipsis; `show-edges` (on by
default) keeps page 1 and the last page visible for quick jumping even when
they'd otherwise fall inside a collapsed range:

::component-example{name="pagination-edges-siblings"}
::

```vue-html
<SPagination v-model:page="page" :total="200" :items-per-page="10" :sibling-count="1" />
<SPagination v-model:page="page" :total="200" :items-per-page="10" :sibling-count="3" />
<SPagination v-model:page="page" :total="200" :items-per-page="10" :sibling-count="1" :show-edges="false" />
```

### Links

`to` maps a page number to a route/href, rendering every control as a real
`<a>` instead of a plain button - useful for crawlable, SEO-friendly
pagination on a content site. Clicking still drives the page change through
the same handling as a plain button (no full navigation) - `to` only
changes what markup renders, not the behavior:

::component-example{name="pagination-links"}
::

```vue-html
<SPagination v-model:page="page" :total="120" :items-per-page="10" :to="(p) => `/posts?page=${p}`" />
```

### Hiding controls

`show-controls` (on by default) toggles Previous/Next - set it `false` for
a bare page-number-only strip:

::component-example{name="pagination-show-controls"}
::

```vue-html
<SPagination v-model:page="page" :total="50" :items-per-page="10" :show-controls="false" />
```

### Color & variant

`color`/`variant` style every inactive control (First/Prev/Next/Last and
non-current page numbers); `active-color`/`active-variant` style the
current page's own button separately:

::component-example{name="pagination-colors"}
::

```vue-html
<SPagination
  v-model:page="page"
  :total="50"
  :items-per-page="10"
  color="primary"
  variant="outline"
  active-color="danger"
  active-variant="solid"
/>
```

### First/Last buttons

`show-first-last` adds jump-to-first/jump-to-last buttons on either end,
alongside the Previous/Next buttons that are always shown:

::component-example{name="pagination-first-last"}
::

```vue-html
<SPagination v-model:page="page" :total="200" :items-per-page="10" show-first-last />
```

### Disabled

`disabled` disables every button at once, regardless of which page is
current:

::component-example{name="pagination-disabled"}
::

```vue-html
<SPagination v-model:page="page" :total="120" :items-per-page="10" disabled />
```

### Accessibility

Pagination renders Reka UI's Pagination primitive, so most of the
accessibility semantics come from there: the root is a `<nav>` landmark
(labeled "Pagination" by default, translatable via the message registry),
each page-number button gets its own `aria-label="Page N"` plus
`aria-current="page"` on whichever one is current, and Previous/Next/First/
Last are icon-only buttons labeled via the message registry (`Previous`,
`Next`, `First`, `Last`) rather than left unlabeled. Previous/Next/First/Last
disable themselves automatically at the relevant boundary (Previous/First on
page 1, Next/Last on the last page) - that boundary logic comes from the
underlying primitive, not something this component reimplements.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `total` | `number` | `0` |
| `itemsPerPage` | `number` | `10` |
| `page` | `number` | - |
| `defaultPage` | `number` | `1` |
| `siblingCount` | `number` | `1` |
| `showEdges` | `boolean` | `true` |
| `showFirstLast` | `boolean` | `false` |
| `showControls` | `boolean` | `true` |
| `to` | `(page: number) => string` | - |
| `disabled` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `'neutral'` |
| `variant` | `'solid' \| 'soft' \| 'outline' \| 'ghost' \| 'text'` | `'ghost'` |
| `activeColor` | same as `color` | `'primary'` |
| `activeVariant` | same as `variant` | `'solid'` |
| `ui` | `Partial<Record<'root' \| 'list' \| 'ellipsis', string \| object>>` | - |

## Emits

| Emit | Payload | Description |
| --- | --- | --- |
| `update:page` | `number` | Fires whenever the current page changes, whether from a page-number button, Previous/Next, or First/Last |
