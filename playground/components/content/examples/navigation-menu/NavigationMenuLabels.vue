<script setup lang="ts">
const items = [
  { label: 'Guide', type: 'label' as const },
  { label: 'Introduction', to: '/introduction' },
  { label: 'Installation', to: '/installation' },
  { label: 'sep-1', type: 'separator' as const },
  { label: 'Components', type: 'label' as const },
  { label: 'Button', to: '/components/button' },
  { label: 'Input', to: '/components/input' },
]
</script>

<template>
  <div class="max-w-64">
    <SNavigationMenu :items="items" orientation="vertical" />
  </div>
</template>
