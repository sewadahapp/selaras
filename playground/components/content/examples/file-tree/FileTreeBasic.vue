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
</script>

<template>
  <SFileTree :items="items" class="w-64" />
</template>
