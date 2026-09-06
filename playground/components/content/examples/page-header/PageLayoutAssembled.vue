<script setup lang="ts">
// A simplified stand-in for how this docs site itself assembles all four
// components into one page layout (see playground/layouts/default.vue for
// the left nav, and playground/pages/[section]/[...slug].vue for the header
// + main content + right ToC rail) - a left PageAside wrapping a
// ContentNavigation, a main column with a PageHeader on top, and a right
// PageAside wrapping a ContentToc, all in one flex row.
// Real, existing routes on this docs site - not just placeholders, so the
// static build's own prerender crawler (which follows every rendered
// NuxtLink) can actually resolve them instead of 404ing.
const navigation = [
  { title: 'Guide', path: '/overview', children: [
    { title: 'Introduction', path: '/overview/introduction' },
    { title: 'Installation', path: '/overview/installation' },
  ] },
  { title: 'Components', path: '/components', children: [
    { title: 'Button', path: '/components/elements/button' },
    { title: 'Card', path: '/components/layout/card' },
  ] },
]

// Prefixed so these never collide with this very page's own heading ids
// (`#usage`, `#props`, ...) once this example is embedded inline below them.
const tocLinks = [
  { id: 'demo-overview', text: 'Overview', depth: 2 },
  { id: 'demo-usage', text: 'Usage', depth: 2 },
  { id: 'demo-props', text: 'Props', depth: 2 },
]
</script>

<template>
  <div class="flex h-96 w-full overflow-hidden rounded-[var(--ui-radius-md)] border border-[var(--ui-border)] text-sm">
    <SPageAside :ui="{ root: 'static flex h-full w-40 shrink-0' }">
      <SContentNavigation :navigation="navigation" />
    </SPageAside>
    <main class="min-w-0 flex-1 overflow-y-auto p-6">
      <SPageHeader title="Button" description="A clickable trigger for an action." />
      <div id="demo-overview" class="pt-4 text-[var(--ui-text-muted)]">
        A short introduction to the component would go here.
      </div>
      <div id="demo-usage" class="pt-8 text-[var(--ui-text-muted)]">
        A live example and a usage snippet would go here.
      </div>
      <div id="demo-props" class="pt-8 text-[var(--ui-text-muted)]">
        A Props table would go here.
      </div>
    </main>
    <SPageAside :ui="{ root: 'static flex h-full w-40 shrink-0' }">
      <SContentToc :links="tocLinks" />
    </SPageAside>
  </div>
</template>
