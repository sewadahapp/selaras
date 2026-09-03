---
title: Splitter
description: A resizable split-pane layout - drag the handle to resize, built on Reka UI's own resizable-panel primitive.
order: 68
---

## Usage

::component-example{name="splitter-basic"}
::

```vue-html
<SSplitter>
  <SSplitterPanel :default-size="30" :min-size="20">Panel one</SSplitterPanel>
  <SSplitterResizeHandle />
  <SSplitterPanel :min-size="20">Panel two</SSplitterPanel>
</SSplitter>
```

Three components used together - `SSplitter` (the group), one
`SSplitterPanel` per pane, and an `SSplitterResizeHandle` between each pair
of panels you want draggable. Sizes are percentages of the group's total by
default (`sizeUnit="%"` on `SSplitterPanel`); pass `sizeUnit="px"` for
pixel-based panels instead - see
[DashboardSidebar](/blocks/dashboard/dashboard-sidebar) for an example, a
sidebar's width reads more naturally in pixels than as a fraction of
however wide the page happens to be.

`SSplitterPanel` has no visual styling of its own beyond clipping its own
overflow - what a panel looks like depends entirely on what it's used for,
left to the consumer.

### Collapsible panels

A panel with `collapsible` snaps fully closed once dragged past its own
`minSize`, down to `collapsedSize` (`0` by default - fully hidden). Call
`.collapse()`/`.expand()` on a template ref to do the same thing
programmatically - see [DashboardSidebar](/blocks/dashboard/dashboard-sidebar)'s
own source for a real example, driven by a button elsewhere on the page
rather than a drag gesture.

### Persistence

`autoSaveId` (on `SSplitter`) remembers every panel's size across reloads,
via `localStorage` by default - pass a custom `storage` object (anything
shaped `{ getItem, setItem }`) to persist somewhere else instead, the same
mechanism [DashboardGroup](/blocks/dashboard/dashboard-group) uses to
persist to a cookie. Whichever storage is used, the remembered layout only
applies once mounted, not during SSR - Reka's own layout-restore call runs
inside a `watch()` callback, which Vue's SSR render pass doesn't flush.

## Props

### Splitter

| Prop | Type | Default |
| --- | --- | --- |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `autoSaveId` | `string` | - |
| `keyboardResizeBy` | `number` | `10` |
| `storage` | `{ getItem, setItem }` | - (Reka's own `localStorage`-backed default) |
| `ui` | `Partial<Record<'root', string \| object>>` | - |

### SplitterPanel

| Prop | Type | Default |
| --- | --- | --- |
| `defaultSize` | `number` | - |
| `minSize` | `number` | - |
| `maxSize` | `number` | - |
| `collapsedSize` | `number` | - |
| `collapsible` | `boolean` | - |
| `sizeUnit` | `'px' \| '%'` | `'%'` |
| `order` | `number` | - |
| `ui` | `Partial<Record<'root', string \| object>>` | - |

### SplitterResizeHandle

| Prop | Type | Default |
| --- | --- | --- |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `disabled` | `boolean` | - |
| `ui` | `Partial<Record<SplitterResizeHandleSlot, string \| object>>` | - |

## Emits

### Splitter

| Event | Payload |
| --- | --- |
| `layout` | `number[]` - every panel's own current size |

### SplitterPanel

| Event | Payload |
| --- | --- |
| `collapse` | - |
| `expand` | - |
| `resize` | `number` |
