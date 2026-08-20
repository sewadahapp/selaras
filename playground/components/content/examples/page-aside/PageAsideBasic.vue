<template>
  <div class="flex h-64 w-full rounded-[var(--ui-radius-md)] ring-1 ring-[var(--ui-border)]">
    <SPageAside :ui="{ root: 'static h-full w-48' }">
      <template #header>
        <strong class="text-sm">Header</strong>
      </template>
      <div v-for="i in 20" :key="i" class="py-1 text-sm">
        Item {{ i }}
      </div>
    </SPageAside>
    <div class="flex-1 p-4 text-sm text-[var(--ui-text-muted)]">
      Main content sits alongside the aside.
    </div>
  </div>
</template>
