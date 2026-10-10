<script setup lang="ts">
const assigned = ref(['editor'])
const items = [
  { label: 'Administrator', value: 'admin', description: 'Full workspace access' },
  { label: 'Editor', value: 'editor', description: 'Create and edit content' },
  { label: 'Viewer', value: 'viewer', description: 'Read-only access' },
]
</script>

<template>
  <STransferList v-model="assigned" :items="items" source-label="Available roles" target-label="Assigned roles" class="w-full">
    <template #item="{ item, side }">
      <div class="min-w-0 flex-1">
        <p class="font-medium">
          {{ item.label }}
        </p>
        <p class="text-xs text-[var(--selaras-resolved-text-muted)]">
          {{ item.description }}
        </p>
      </div>
      <SBadge v-if="side === 'target'" size="sm" variant="soft" label="Assigned" />
    </template>
  </STransferList>
</template>
