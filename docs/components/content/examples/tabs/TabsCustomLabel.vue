<script setup lang="ts">
const active = ref('inbox')
const items = [
  { label: 'Inbox', value: 'inbox' },
  { label: 'Archive', value: 'archive' },
]
</script>

<template>
  <STabs v-model="active" :items="items">
    <template #label="{ item }">
      <span class="flex items-center gap-2">
        {{ item.label }}
        <SBadge v-if="item.value === 'inbox'" label="3" color="primary" size="sm" />
      </span>
    </template>
    <template #inbox>
      3 unread messages.
    </template>
    <template #archive>
      Nothing archived yet.
    </template>
  </STabs>
</template>
