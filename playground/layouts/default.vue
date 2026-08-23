<script setup lang="ts">
const { data: rawNavigation } = await useAsyncData('docs-navigation', () =>
  queryCollectionNavigation('docs').order('order', 'ASC'))

// queryCollectionNavigation wraps everything in one root node named after the
// collection's own source folder ("components") - redundant here since this
// whole sidebar is already scoped to components; unwrap to its real groups.
const navigation = computed(() => rawNavigation.value?.[0]?.children ?? [])

const asideUi = { root: 'top-16 h-[calc(100vh-4rem)]' }
</script>

<template>
  <div class="min-h-screen bg-[var(--ui-bg)] text-[var(--ui-text)]">
    <SHeader>
      <NuxtLink to="/" class="font-mono font-semibold">
        selaras
      </NuxtLink>
      <template #right>
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
 * markdown's own <p> rendering (handled by SProseP/ProseP.vue).
 */
.docs-content button p,
.docs-content a p {
  margin: 0;
  color: inherit;
}
</style>
