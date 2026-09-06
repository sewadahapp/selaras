---
title: ReadMore
description: Truncates long content behind a fading "Show more" toggle.
order: 74
---

## Usage

::component-example{name="read-more-basic"}
::

```vue-html
<SReadMore :preview-height="200">
  <p>A long block of content...</p>
</SReadMore>
```

Collapsed height is a real pixel value (`previewHeight`, `200` by default),
not a line-clamp - so it truncates any content, not just plain text. The
reveal animates by transitioning `max-height` toward the content's own
measured height (via `ResizeObserver`, re-measured if it changes), not the
`auto` keyword - CSS can't animate toward `auto`, there's no intermediate
value to interpolate through.

Content shorter than `previewHeight` renders with no truncation UI at
all - the fade and toggle only appear once there's actually more to reveal.
Before the first client-side measurement, though, content renders truncated
by default (the safer assumption for SSR/no-JS output) - it never briefly
flashes fully expanded before collapsing down.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `previewHeight` | `number` | `200` |
| `ui` | `Partial<Record<ReadMoreSlot, string \| object>>` | - |

## Slots

| Slot | Description |
| --- | --- |
| default | The content being truncated |
