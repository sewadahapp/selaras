---
title: CodeGroup
description: Tabbed code blocks - e.g. npm/pnpm/yarn install commands.
order: 71
---

## Usage

::component-example{name="code-group-basic"}
::

```vue-html
<SCodeGroup>
  <SProsePre filename="npm" language="bash" code="npm install selaras">
npm install selaras
  </SProsePre>
  <SProsePre filename="pnpm" language="bash" code="pnpm add selaras">
pnpm add selaras
  </SProsePre>
</SCodeGroup>
```

`SCodeGroup` reads its own default slot's children directly (works with any
children, not just [Prose](/components/typography/prose) ones) and renders each as a tab
via [Tabs](/components/navigation/tabs) - the label comes from each child's `filename`
prop, falling back to `language`, falling back to `Tab 1`/`Tab 2`/... (by
position) for a child with neither. It doesn't wrap or re-render its
children's content, so anything already working standalone (like
[ProsePre](/components/typography/prose)'s copy button) keeps working inside a group.

### In markdown

Once wired into `@nuxt/content` via a `CodeGroup.vue` adapter (same recipe as
[Prose](/components/typography/prose)), plain adjacent fenced code blocks under
`::code-group` become tabs automatically - the `[label]` after the language
becomes each tab's title:

````md
::code-group

```bash [npm]
npm install selaras
```

```bash [pnpm]
pnpm add selaras
```

::
````

## Props

`SCodeGroup` takes no props - it derives everything from its children.
