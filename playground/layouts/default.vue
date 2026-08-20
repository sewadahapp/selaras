<script setup lang="ts">
const { data: navigation } = await useAsyncData('docs-navigation', () =>
  queryCollectionNavigation('docs').order('order', 'ASC'))
</script>

<template>
  <div class="min-h-screen bg-[var(--ui-bg)] text-[var(--ui-text)]">
    <div class="mx-auto flex max-w-6xl">
      <SPageAside>
        <template #header>
          <NuxtLink to="/" class="block font-semibold">
            Selaras
          </NuxtLink>
        </template>
        <SContentNavigation :navigation="navigation ?? []" />
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
