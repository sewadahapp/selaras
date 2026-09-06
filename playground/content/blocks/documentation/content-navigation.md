---
title: ContentNavigation
description: A nested, collapsible nav tree - feed it queryCollectionNavigation()'s result directly.
order: 30
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
`queryCollectionNavigation('docs').order('order', 'ASC')`. It's normally
wrapped in a [PageAside](/blocks/documentation/page-aside) rather than used
bare, which supplies the sticky positioning and scrollable rail chrome - see
[PageHeader](/blocks/documentation/page-header)'s "Assembling a full page
layout" section for how it and [ContentToc](/blocks/documentation/content-toc)
fit together with the rest of a page.

A `path` starting with `http://`/`https://` renders as a real external link
automatically - that's `NuxtLink`'s own default behavior, nothing to opt into.

### Icons

Give a link (or a group) an `icon` and it renders before the title
automatically:

::component-example{name="content-navigation-icons"}
::

```vue-html
<SContentNavigation
  :navigation="[
    { title: 'Getting Started', path: '/', icon: 'hugeicons:rocket-01' },
    { title: 'Forms', path: '/components/forms', icon: 'hugeicons:folder-01', children: [...] },
  ]"
/>
```

### Custom link content

The `link` slot replaces a link's (or a group header's) title content -
scoped with `link` and `active` (always `false` for a group header, since
that only ever describes a leaf link's own exact path):

::component-example{name="content-navigation-custom-link"}
::

```vue-html
<SContentNavigation :navigation="navigation">
  <template #link="{ link }">
    <span class="flex flex-1 items-center justify-between gap-2">
      {{ link.title }}
      <SBadge v-if="link.path === '/components/forms/textarea'" label="New" color="primary" size="sm" />
    </span>
  </template>
</SContentNavigation>
```

### Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot - here's `ContentNavigation`'s own theme file:

::theme-source{name="content-navigation"}
::

### Accessibility

The active link gets `aria-current="page"` automatically - `NuxtLink`'s own
default behavior for whichever link matches the current route, not
something this component sets itself. Expand/collapse keyboard behavior
for groups comes from the same [Accordion](/components/navigation/accordion)
primitive used internally - see its own Accessibility section for details.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `navigation` | `{ title: string, path: string, icon?: string, children?: [...] }[]` | - (required) |
| `ui` | `Partial<Record<ContentNavigationSlot, string \| object>>` | - |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `link` | `{ link, active }` | Replaces a link's (or group header's) title content |
