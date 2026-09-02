---
title: Button
description: A clickable action element with color, variant and size options.
order: 10
---

## Usage

::component-example{name="button-basic"}
::

### Variants

::s-button{variant="solid"}
Solid
::

::s-button{variant="soft"}
Soft
::

::s-button{variant="outline"}
Outline
::

::s-button{variant="ghost"}
Ghost
::

::s-button{variant="text"}
Text
::

### Colors

Every color across every variant, so it's easy to compare both within a
color (is soft/outline/ghost legible?) and across colors (do they stay
distinguishable at a glance?).

::component-example{name="button-colors"}
::

### Icons

`icon` and `trailingIcon` add an icon before or after the label - any
registered icon name works, not just `hugeicons:*`.

::component-example{name="button-icons"}
::

```vue-html
<SButton icon="hugeicons:download-01">Download</SButton>
<SButton trailing-icon="hugeicons:arrow-right-01">Continue</SButton>
```

### Icon only

There's no separate `iconOnly` prop - pass `icon` with no default slot
content and it shapes itself to a square automatically (matching its own
`size`), rather than requiring an explicit flag you could forget to set.
Always add `aria-label` yourself when there's no visible text - it falls
through to the root element like any other attr (see
[Accessibility](#accessibility) below).

::component-example{name="button-icon-only"}
::

```vue-html
<SButton icon="hugeicons:settings-01" variant="outline" aria-label="Settings" />
```

### Square

Icon-only buttons already shape themselves to a square automatically (see
above) - `square` is for when the content isn't an icon but should still get
that same equal-width/height treatment, like a page number or a calendar day.
Without it, each button sizes to its own text width and a row of them (a
pagination bar, a calendar grid) won't line up:

::component-example{name="button-square"}
::

```vue-html
<SButton square>1</SButton>
<SButton square>31</SButton>
```

### Text

`text` never paints a background, at any state - only the label/icon color
shifts on hover. Meant for an action button that sits tight against another
control's own border, like a field's clear button - `ghost`'s hover-fill
would otherwise visually compete with that border right at the seam:

::component-example{name="button-text"}
::

```vue-html
<SButton icon="hugeicons:cancel-01" variant="text" aria-label="Clear" />
```

### Loading

`loading` swaps the leading icon for a spinner. It doesn't imply `disabled` -
combine both if a busy button shouldn't be clickable, the same split
[Select](/components/forms/select#states) and
[Autocomplete](/components/forms/autocomplete#sizes-and-states) already use
for their own `loading` prop.

::component-example{name="button-loading"}
::

```vue-html
<SButton icon="hugeicons:floppy-disk" :loading="saving" :disabled="saving" @click="save">
  {{ saving ? 'Saving...' : 'Save' }}
</SButton>
```

### As a link

`as` renders the button as any tag or component - a plain anchor for an
external link, or a resolved `NuxtLink` reference for client-side navigation
(see below for why a bare `"NuxtLink"` string doesn't work).

::component-example{name="button-link"}
::

```vue-html
<SButton as="a" href="https://github.com" target="_blank" rel="noopener" trailing-icon="hugeicons:square-arrow-up-right">
  Open a link
</SButton>
```

For an internal route with client-side navigation, resolve the component
reference first - `Primitive` renders whatever `as` is given via `h()`, which
doesn't look up global component names the way a compiled template does:

```vue
<script setup lang="ts">
const NuxtLinkComponent = resolveComponent('NuxtLink')
</script>

<template>
  <SButton :as="NuxtLinkComponent" to="/components/elements/button">
    Browse components
  </SButton>
</template>
```

### Raised

`raised` adds `--ui-shadow-md`, independent of `variant` - useful for a solid
button that needs to lift off a busy background, or even a `soft`/`ghost`
one that wants some elevation without switching to `solid`.

::component-example{name="button-raised"}
::

```vue-html
<SButton raised>Raised solid</SButton>
<SButton raised variant="soft">Raised soft</SButton>
```

### Badge

There's no built-in badge slot - overlay a real [Badge](/components/elements/badge)
on an icon-only button with a `relative`/`absolute` pair:

::component-example{name="button-badge"}
::

```vue-html
<div class="relative inline-flex">
  <SButton variant="outline" icon="hugeicons:notification-01" aria-label="Notifications" />
  <SBadge label="3" color="danger" size="sm" class="absolute -top-1.5 -right-1.5" />
</div>
```

### Button group

Adjacent buttons visually joined into one unit are their own component -
see [ButtonGroup](/components/elements/button-group).

### Sizes and states

`size` takes `sm` / `md` / `lg`, `disabled` prevents interaction and dims the
button - see the [Props](#props) table below.

### Custom `:ui`

Every slot can be overridden without fighting the defaults — the override is
tailwind-merge'd, so conflicting utilities resolve instead of both applying.

```vue-html
<SButton :ui="{ base: 'rounded-full' }">Pill button</SButton>
```

### Accessibility

A default `as="button"` gets native button semantics (keyboard-activatable
with <kbd>Enter</kbd>/<kbd>Space</kbd>, exposed as `role="button"`) for free -
nothing to configure. Rendering `as="a"` instead exposes link semantics and
keyboard behavior instead, which is exactly why [As a link](#as-a-link) exists
rather than styling an `<a>` to merely look like a button. An icon-only button
has no accessible name of its own - always pass `aria-label` in that case, as
shown above.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `as` | `string \| Component` | `'button'` |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `primary` |
| `variant` | `'solid' \| 'soft' \| 'outline' \| 'ghost' \| 'text'` | `solid` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `block` | `boolean` | `false` |
| `raised` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `loading` | `boolean` | `false` |
| `icon` | `string` | - |
| `trailingIcon` | `string` | - |
| `square` | `boolean` | - |
| `ui` | `Partial<Record<'base' \| 'leadingIcon' \| 'trailingIcon', string \| object>>` | - |
