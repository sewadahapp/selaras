<script setup lang="ts">
const assigned = ref([2])
const items = [
  { id: 1, name: 'Alex Morgan', description: 'Product designer' },
  { id: 2, name: 'Sam Lee', description: 'Software engineer' },
  { id: 3, name: 'Dina Sari', description: 'Project manager' },
  { id: 4, name: 'Taylor Kim', description: 'Workspace owner', disabled: true },
]
</script>

<template>
  <div class="w-full space-y-4">
    <STransferList v-model="assigned" :items="items" value-key="id" label-key="name" source-label="Available members" target-label="Project team" searchable />
    <p class="text-sm text-[var(--selaras-resolved-text-muted)]">
      Assigned member IDs: {{ assigned.join(', ') || 'None' }}
    </p>
  </div>
</template>
