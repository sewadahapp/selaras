---
title: Callout
description: A note/tip/warning/danger admonition box for long-form content.
order: 72
---

## Usage

::component-example{name="callout-basic"}
::

```vue-html
<SCallout type="tip" title="Tip">
  Pass <code>icon="false"</code> to drop the leading icon entirely.
</SCallout>
```

`type` picks both the accent color and the default icon - `note` (the
default), `tip`, `warning`, and `danger`, matching the four admonition
levels most docs sites converge on. Unlike [Alert](/components/elements/alert),
a callout has no `variant`/`closable` - it's meant to sit inline in a stretch
of prose, not stand alone as a page-level notice, so it stays a plain
border-accented box with no background fill or dismiss behavior.

## In markdown

Every Selaras component is already globally registered under its `S`-prefixed
name (this module's own `addComponentsDir` call, `src/module.ts`) - unlike
[Prose](/components/typography/prose)'s two enhanced components, nothing else needs
wiring for `@nuxt/content` to resolve a plain `::s-component-name{...}` block
directly to it. A prop goes in the block's own `{...}` attrs; a named slot
(`title` here) is a `#slot-name` line inside the block, `@nuxtjs/mdc`'s own
convention (`MDCSlot`) - and the block's own body becomes the default slot:

```text
::s-callout{type="warning"}
#title
Heads up
This changes how the export command behaves - check the migration notes first.
::
```

<!-- eslint-disable markdown/no-missing-atx-heading-space -- MDC's own `#slot-name` block-slot syntax, not a heading -->
::s-callout{type="warning"}
#title
Heads up

This changes how the export command behaves - check the migration notes first.
::
<!-- eslint-enable markdown/no-missing-atx-heading-space -->

The same pattern works for any already-shipped component, props and named
slots included - not just the two proven here. [Alert](/components/elements/alert),
for one, works identically:

```text
::s-alert{color="info"}
#title
Heads up
#description
This changes how the export command behaves - check the migration notes first.
::
```

<!-- eslint-disable markdown/no-missing-atx-heading-space -- MDC's own `#slot-name` block-slot syntax, not a heading -->
::s-alert{color="info"}
#title
Heads up
#description
This changes how the export command behaves - check the migration notes first.
::
<!-- eslint-enable markdown/no-missing-atx-heading-space -->

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `type` | `'note' \| 'tip' \| 'warning' \| 'danger'` | `'note'` |
| `title` | `string` | - |
| `icon` | `string \| false` | - |
| `ui` | `Partial<Record<CalloutSlot, string \| object>>` | - |

## Slots

| Slot | Description |
| --- | --- |
| `title` | Custom title content, overrides `title` prop |
| default | The callout's body |
