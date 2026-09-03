---
title: Card
description: A simple container for grouping related content.
order: 66
---

## Usage

::component-example{name="card-basic"}
::

```vue-html
<SCard>
  A card is a simple container for grouping related content.
</SCard>
```

### Header and footer

`header` and `footer` are optional - each only renders (with its own
separating border) when you actually pass it:

::component-example{name="card-header-footer"}
::

```vue-html
<SCard>
  <template #header>
    <p class="font-semibold text-[var(--ui-text)]">Delete project</p>
  </template>

  This action cannot be undone. All data associated with this project
  will be permanently removed.

  <template #footer>
    <div class="flex justify-end gap-2">
      <SButton variant="ghost">Cancel</SButton>
      <SButton color="danger">Delete</SButton>
    </div>
  </template>
</SCard>
```

### Variant

::component-example{name="card-variants"}
::

```vue-html
<SCard variant="outline">
  <!-- bordered, no shadow -->
</SCard>
<SCard variant="solid">
  <!-- elevated, no border -->
</SCard>
<SCard variant="soft">
  <!-- subtle tinted background -->
</SCard>
<SCard variant="subtle">
  <!-- tinted background, plus a border -->
</SCard>
```

### Blog post

A `header` badge and a `footer` byline, built entirely from other Selaras
components:

::component-example{name="card-blog-post"}
::

```vue-html
<SCard class="w-80">
  <template #header>
    <SBadge label="Design" color="primary" variant="soft" />
  </template>

  <h3 class="font-semibold text-[var(--ui-text)]">
    Building a scalable design token system
  </h3>
  <p class="text-sm text-[var(--ui-text-muted)]">
    A look at how semantic tokens keep a component library themeable
    without ever touching a single component file.
  </p>

  <template #footer>
    <div class="flex items-center gap-2">
      <SAvatar text="JS" size="sm" />
      <div class="text-sm leading-tight">
        <p class="font-medium text-[var(--ui-text)]">Jane Smith</p>
        <p class="text-[var(--ui-text-muted)]">Mar 12, 2026</p>
      </div>
    </div>
  </template>
</SCard>
```

### Product

Overriding `ui.body` to `p-0` lets a full-bleed image sit flush against the
card's edges, with your own padded wrapper underneath for the details:

::component-example{name="card-product"}
::

```vue-html
<SCard :ui="{ body: 'p-0' }" class="w-64">
  <img
    src="https://picsum.photos/seed/selaras-headphones/400/300"
    alt="Wireless headphones"
    class="aspect-[4/3] w-full object-cover"
  >
  <div class="flex flex-col gap-1 p-4">
    <p class="font-medium text-[var(--ui-text)]">Wireless headphones</p>
    <p class="text-sm text-[var(--ui-text-muted)]">Noise-cancelling, 30-hour battery life</p>
    <div class="mt-2 flex items-center justify-between">
      <span class="font-semibold text-[var(--ui-text)]">$129</span>
      <SButton size="sm">Add to cart</SButton>
    </div>
  </div>
</SCard>
```

## In markdown

Every Selaras component is already globally registered under its `S`-prefixed
name - a bare `::s-card{...}` block works with no extra wiring (see
[Callout](/components/typography/callout)'s own "In markdown" section for how
the pattern works generally). Its `header`/`footer` named slots are each a
`#slot-name` line inside the block, `@nuxtjs/mdc`'s own convention:

```text
::s-card
#header
Design
#footer
Posted March 2026
::
```

A block mixing `header`/`footer` markers with unmarked body text for the
default slot doesn't reliably separate the two - confirmed empirically, not
just undocumented - so keep a markdown-authored card to its named slots only;
reach for `<SCard>` directly in a `.vue` file once the body needs its own
text.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `variant` | `'outline' \| 'solid' \| 'soft' \| 'subtle'` | `'outline'` |
| `ui` | `Partial<Record<CardSlot, string \| object>>` | - |

## Slots

| Slot | Description |
| --- | --- |
| `header` | Optional content above the body, separated by a border. Only rendered when passed. |
| default | The card's body content. |
| `footer` | Optional content below the body, separated by a border. Only rendered when passed. |
