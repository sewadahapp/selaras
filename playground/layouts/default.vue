<script setup lang="ts">
const route = useRoute()

const { data: rawNavigation } = await useAsyncData('docs-navigation', () =>
  queryCollectionNavigation('docs').order('order', 'ASC'))

// queryCollectionNavigation wraps each top-level content folder (guides,
// components, ...) in its own root node - pick the one matching the current
// route's section so the sidebar only shows that section's groups, not
// every section merged together.
const navigation = computed(() => {
  const section = `/${route.path.split('/')[1]}`
  return rawNavigation.value?.find(node => node.path === section)?.children ?? []
})

const asideUi = { root: 'top-16 h-[calc(100vh-4rem)]' }
</script>

<template>
  <div class="min-h-screen bg-[var(--ui-bg)] text-[var(--ui-text)]">
    <SHeader>
      <NuxtLink to="/" class="font-semibold">
        Selaras
      </NuxtLink>
      <template #right>
        <DocsSearchButton />
        <SNavigationMenu :items="docsNavItems" variant="link" :ui="{ root: 'w-auto' }" />
        <SColorModeToggle />
      </template>
    </SHeader>
    <div class="mx-auto flex max-w-[90rem]">
      <SPageAside :ui="asideUi">
        <SContentNavigation :navigation="navigation" />
      </SPageAside>
      <main class="min-w-0 flex-1 p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<style>
/*
 * MDC wraps slotted text in a bare <p> with no distinguishing class, even
 * when that text is a live component's label (e.g. a button's slot content).
 * Reset it back to inherited styling wherever it ends up inside an
 * interactive element instead of flowing prose text. This is unrelated to
 * markdown's own <p> rendering (styled by the selaras-prose CSS class).
 */
.docs-content button p,
.docs-content a p {
  margin: 0;
  color: inherit;
}
</style>
