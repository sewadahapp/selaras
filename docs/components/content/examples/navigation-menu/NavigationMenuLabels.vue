<script setup lang="ts">
const collapsed = ref(false)
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
  <div class="flex flex-col items-start gap-3">
    <SButton size="sm" variant="outline" @click="collapsed = !collapsed">
      {{ collapsed ? 'Expand groups' : 'Collapse groups' }}
    </SButton>
    <div :class="collapsed ? 'w-16' : 'w-64'">
      <SNavigationMenu :items="items" orientation="vertical" :collapsed="collapsed" tooltip />
    </div>
  </div>
</template>
