<script setup lang="ts">
const nav = [
  { label: 'Button', slug: 'button' },
  { label: 'Input', slug: 'input' },
  { label: 'Tooltip', slug: 'tooltip' },
  { label: 'Tabs', slug: 'tabs' },
  { label: 'Dropdown', slug: 'dropdown' },
  { label: 'Modal', slug: 'modal' },
  { label: 'Toast', slug: 'toast' },
  { label: 'Select', slug: 'select' },
  { label: 'Checkbox', slug: 'checkbox' },
  { label: 'Radio Group', slug: 'radio-group' },
  { label: 'Switch', slug: 'switch' },
  { label: 'Textarea', slug: 'textarea' },
]
</script>

<template>
  <div class="min-h-screen bg-[var(--ui-bg)] text-[var(--ui-text)]">
    <div class="mx-auto flex max-w-5xl">
      <aside class="sticky top-0 h-screen w-52 shrink-0 border-r border-[var(--ui-border)] p-4">
        <NuxtLink to="/" class="mb-4 block font-semibold">
          Selaras
        </NuxtLink>
        <nav class="flex flex-col gap-0.5 text-sm">
          <NuxtLink
            v-for="item in nav"
            :key="item.slug"
            :to="`/components/${item.slug}`"
            class="rounded-[var(--ui-radius-sm)] px-2 py-1.5 text-[var(--ui-text-muted)] transition-colors hover:bg-[var(--ui-bg-elevated)] hover:text-[var(--ui-text)]"
            active-class="!bg-[var(--ui-primary-soft)] !text-[var(--ui-primary)]"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </aside>
      <main class="min-w-0 flex-1 p-8">
        <slot />
      </main>
    </div>
    <SToaster />
  </div>
</template>

<style>
.docs-content h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--ui-text);
}
.docs-content p {
  color: var(--ui-text-muted);
}
/*
 * MDC wraps slotted text in a bare <p> with no distinguishing class, even
 * when that text is a live component's label (e.g. a button's slot content).
 * Reset it back to inherited styling wherever it ends up inside an
 * interactive element instead of flowing prose text.
 */
.docs-content button p,
.docs-content a p {
  margin: 0;
  color: inherit;
}
.docs-content h2 {
  margin-top: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--ui-text);
}
.docs-content table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}
.docs-content th {
  border-bottom: 1px solid var(--ui-border);
  padding: 0.5rem;
  text-align: left;
  color: var(--ui-text-muted);
  font-weight: 500;
}
.docs-content td {
  border-bottom: 1px solid var(--ui-border-muted);
  padding: 0.5rem;
}
.docs-content code {
  border-radius: var(--ui-radius-sm);
  background: var(--ui-bg-elevated);
  padding: 0.125rem 0.375rem;
  font-size: 0.8125rem;
}
.docs-content pre {
  border-radius: var(--ui-radius-md);
  background: var(--ui-bg-elevated);
  padding: 1rem;
  overflow-x: auto;
}
.docs-content pre code {
  background: none;
  padding: 0;
}
</style>
