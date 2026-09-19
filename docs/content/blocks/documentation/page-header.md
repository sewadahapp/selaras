---
title: PageHeader
description: Renders a content page's title and description.
order: 10
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

## Assembling a full page layout

`PageHeader` is only the top of the main content column - this docs site
wraps four components together into the full page shell you're reading right
now: a left [PageAside](/blocks/documentation/page-aside) wrapping a
[ContentNavigation](/blocks/documentation/content-navigation) for the section
nav, a main column starting with `PageHeader` and followed by the actual
page content, and a right `PageAside` wrapping a
[ContentToc](/blocks/documentation/content-toc) for the "on this page" rail.
The Selaras docs application uses this same arrangement, with a responsive
drawer for the navigation on smaller screens.

::component-example{name="page-layout-assembled"}
::

```vue-html
<div class="flex">
  <SPageAside>
    <SContentNavigation :navigation="navigation" />
  </SPageAside>
  <main class="min-w-0 flex-1">
    <SPageHeader :title="page.title" :description="page.description" />
    <!-- page content -->
  </main>
  <SPageAside>
    <SContentToc :links="page.body.toc.links" />
  </SPageAside>
</div>
```

See also [PageAside](/blocks/documentation/page-aside),
[ContentNavigation](/blocks/documentation/content-navigation) and
[ContentToc](/blocks/documentation/content-toc).

## Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot - here's `PageHeader`'s own theme file:

::theme-source{name="page-header"}
::

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
