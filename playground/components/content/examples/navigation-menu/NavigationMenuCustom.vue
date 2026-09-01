<script setup lang="ts">
const items = [
  { label: 'Home', to: '/' },
  { label: 'Products', children: [
    { label: 'Analytics', to: '/products/analytics', icon: 'hugeicons:chart-line-data-01', description: 'Track usage across your app.' },
    { label: 'Automation', to: '/products/automation', icon: 'hugeicons:workflow-square-05', description: 'Trigger workflows on events.' },
    { label: 'Integrations', to: '/products/integrations', icon: 'hugeicons:plug-01', description: 'Connect your existing tools.' },
    { label: 'Reporting', to: '/products/reporting', icon: 'hugeicons:file-01', description: 'Export data on a schedule.' },
  ] },
  // `slot: 'help'` targets #help-content specifically, ahead of the
  // generic #item-content every other item with children falls back to.
  { label: 'Help', slot: 'help', children: [
    { label: 'Docs', to: '/help/docs' },
  ] },
]
</script>

<template>
  <SNavigationMenu :items="items">
    <template #item-content="{ item }">
      <ul class="grid w-full grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-2 p-2">
        <li v-for="child in item.children" :key="child.label">
          <NuxtLink :to="child.to" class="flex flex-col gap-1 rounded-[var(--ui-radius-md)] p-3 hover:bg-[var(--ui-bg-elevated)]">
            <span class="flex items-center gap-2 text-sm font-medium text-[var(--ui-text)]">
              <SIcon :name="child.icon" class="size-4" />
              {{ child.label }}
            </span>
            <span class="text-xs text-[var(--ui-text-muted)]">{{ child.description }}</span>
          </NuxtLink>
        </li>
      </ul>
    </template>

    <template #help-content="{ item }">
      <div class="w-56 p-3 text-sm">
        <p class="mb-2 text-[var(--ui-text-muted)]">
          Need a hand?
        </p>
        <NuxtLink v-for="child in item.children" :key="child.label" :to="child.to" class="block py-1 text-[var(--ui-primary)]">
          {{ child.label }} →
        </NuxtLink>
      </div>
    </template>
  </SNavigationMenu>
</template>
