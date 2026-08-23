<script setup lang="ts">
const status = ref('online')

const statusItems = [
  { label: 'Online', value: 'online', color: 'bg-[var(--ui-success)]' },
  { label: 'Away', value: 'away', color: 'bg-[var(--ui-warning)]' },
  { label: 'Offline', value: 'offline', color: 'bg-[var(--ui-text-muted)]' },
]
</script>

<template>
  <SSelect v-model="status" :items="statusItems">
    <template #item="{ item }">
      <span class="size-2 rounded-full" :class="item.color" />
      {{ item.label }}
    </template>
    <template #value="{ selected }">
      <span v-if="selected" class="inline-flex items-center gap-2">
        <span class="size-2 rounded-full" :class="selected.raw.color" />
        {{ selected.label }}
      </span>
    </template>
  </SSelect>
</template>
