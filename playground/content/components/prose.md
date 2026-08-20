---
title: Prose
description: A themed set of typography components for long-form content, decoupled from Nuxt Content.
order: 24
---

## Usage

`SProseA`, `SProseH1`-`SProseH6`, `SProseP`, `SProseTable`, `SProsePre`, and 20
others are real, standalone components - use them directly for consistent
long-form typography anywhere, no `@nuxt/content` required:

::component-example{name="prose-standalone"}
::

```vue-html
<SProseH3 id="a-heading">A heading</SProseH3>
<SProseP>Some <SProseStrong>bold</SProseStrong> text.</SProseP>
```

Every heading (`SProseH1`-`SProseH6`) takes an optional `id` and wraps its
content in a self-anchor link when one is given - this page's own headings
work exactly this way.

`SProsePre` adds a themed header bar (filename or language, via
[Badge](/components/badge)) and a copy-to-clipboard button (via
[Button](/components/button)) around the code block - it doesn't do syntax
highlighting itself, since that already happened upstream by the time any
Prose component sees the content.

## Wiring into `@nuxt/content`

`@nuxt/content`'s markdown renderer resolves elements by an *exact* unprefixed
global component name (`ProseH1`, `ProseA`, `ProseTable`, ...) - incompatible
with this library's `S`-prefix convention, and not something this library
auto-registers for you (installing selaras never silently changes how your
existing `@nuxt/content` setup renders markdown). Instead, add a thin adapter
per element under your app's own `components/content/`:

```vue-html
<!-- components/content/ProseH1.vue -->
<script setup lang="ts">
defineProps<{ id?: string }>()
</script>
<template>
  <SProseH1 :id="id"><slot /></SProseH1>
</template>
```

Repeat for each element you want themed (`ProseA` forwards `href`/`target`,
`ProsePre` forwards `code`/`language`/`filename`/`highlights`/`meta`, the rest
just forward a default slot) - this docs site's own
`playground/components/content/Prose*.vue` files are the full, working
reference for all 24.

## Full element list

`A`, `Blockquote`, `Code` (inline), `Em`, `H1`-`H6`, `Hr`, `Img`, `Li`, `Ol`,
`P`, `Pre`, `Strong`, `Table`, `Tbody`, `Td`, `Th`, `Thead`, `Tr`, `Ul`. No
`Script` override - rarely used, upstream's default is fine.
