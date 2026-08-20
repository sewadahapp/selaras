---
title: ContentNavigation
description: A nested, collapsible nav tree - feed it queryCollectionNavigation()'s result directly.
order: 42
---

## Usage

::component-example{name="content-navigation-basic"}
::

```vue-html
<SContentNavigation :navigation="navigation" />
```

`navigation` is a plain array shaped `{ title, path, children? }[]` - the same
shape `@nuxt/content`'s `queryCollectionNavigation()` returns, so you can pass
its result straight through with no adapter. This library has no hard
dependency on `@nuxt/content` though - hand-build the array yourself if you
don't use it.

The current route's exact path is highlighted. Groups with children render
as an [Accordion](/components/navigation/accordion) item internally
(`type="multiple"`, so several sections can stay open at once, and every
group starts open by default) rather than a hand-rolled toggle.

This docs site's own left sidebar is exactly this component, fed
`queryCollectionNavigation('docs').order('order', 'ASC')`.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `navigation` | `{ title: string, path: string, children?: [...] }[]` | - (required) |
| `ui` | `Partial<Record<ContentNavigationSlot, string \| object>>` | - |
