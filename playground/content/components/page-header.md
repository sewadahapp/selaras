---
title: PageHeader
description: Renders a content page's title and description.
order: 21
---

## Usage

::component-example{name="page-header-basic"}
::

```vue-html
<SPageHeader title="Component name" description="A one-line summary." />
```

This docs site uses it on every component page (via
`page.title`/`page.description` from frontmatter), fixing a gap where those
fields previously went completely unused.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `title` | `string` | - |
| `description` | `string` | - |
| `ui` | `Partial<Record<PageHeaderSlot, string \| object>>` | - |

## Slots

| Slot | Description |
| --- | --- |
| `title` | Custom title content, overrides `title` prop |
| `description` | Custom description content, overrides `description` prop |
| default | Extra content below the description |
