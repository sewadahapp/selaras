<script setup>
const collapsed = ref(false)
const items = [
  { label: 'Leading', type: 'separator' },
  { label: 'Workspace', type: 'label' },
  { label: 'Overview', to: '/dashboard' },
  { label: 'Settings', type: 'label' },
  { label: 'Explicit', type: 'separator' },
  { label: 'Security', to: '/security' },
  { label: 'Trailing', type: 'separator' },
]
</script>

<template>
  <SApp>
    <SButton @click="collapsed = !collapsed">
      Toggle rail
    </SButton>
    <div :style="{ width: collapsed ? '64px' : '260px' }">
      <SNavigationMenu :items="items" orientation="vertical" :collapsed="collapsed" tooltip />
    </div>
  </SApp>
</template>
