<script setup lang="ts">
const items = [
  {
    name: 'src',
    children: [
      { name: 'index.ts' },
      { name: 'components', children: [{ name: 'Button.vue' }, { name: 'Input.vue' }] },
    ],
  },
  { name: 'package.json' },
  { name: 'README.md' },
]

const selected = ref()
</script>

<template>
  <div class="flex w-64 flex-col gap-2">
    <SFileTree v-model:selected="selected" :items="items" />
    <p class="text-sm text-[var(--ui-text-muted)]">
      Selected: {{ selected?.name ?? 'none' }}
    </p>
  </div>
</template>
