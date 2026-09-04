<script setup lang="ts">
const selected = ref()

const items = [
  {
    label: 'Frontend',
    value: 'frontend',
    children: [
      { label: 'Vue', value: 'vue' },
      { label: 'Svelte', value: 'svelte' },
    ],
  },
  {
    label: 'Backend',
    value: 'backend',
    children: [
      { label: 'Node', value: 'node' },
      { label: 'Go', value: 'go' },
    ],
  },
]
</script>

<template>
  <div class="flex w-full max-w-xs flex-col gap-2">
    <STree v-model="selected" :items="items" multiple :default-expanded="['frontend', 'backend']" />
    <p class="text-sm text-[var(--ui-text-muted)]">
      {{ selected?.length ?? 0 }} selected
    </p>
  </div>
</template>
