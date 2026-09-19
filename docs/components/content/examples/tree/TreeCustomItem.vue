<script setup lang="ts">
const items = [
  {
    label: 'Reports',
    value: 'reports',
    children: [
      { label: 'Daily', value: 'daily', badge: '3' },
      { label: 'Weekly', value: 'weekly', badge: '12' },
    ],
  },
]
</script>

<template>
  <STree :items="items" :default-expanded="['reports']" class="w-full max-w-xs">
    <template #item="{ item }">
      <span class="flex flex-1 items-center justify-between">
        <span>{{ item.label }}</span>
        <SBadge v-if="item.badge" :label="item.badge as string" size="sm" variant="soft" />
      </span>
    </template>
  </STree>
</template>
