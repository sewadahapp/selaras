<script setup lang="ts">
const collapsed = ref(false)

const items = [
  { label: 'Overview', icon: 'hugeicons:dashboard-square-01', to: '/overview' },
  { label: 'Analytics', icon: 'hugeicons:chart-line-data-01', children: [
    { label: 'Traffic', to: '/analytics/traffic' },
    { label: 'Conversion', to: '/analytics/conversion' },
  ] },
  { label: 'Settings', icon: 'hugeicons:settings-01', to: '/settings' },
]
</script>

<template>
  <div class="flex flex-col gap-3">
    <SButton size="sm" variant="outline" color="neutral" @click="collapsed = !collapsed">
      {{ collapsed ? 'Expand' : 'Collapse' }}
    </SButton>
    <div :class="collapsed ? 'w-16' : 'w-64'">
      <SNavigationMenu :items="items" orientation="vertical" :collapsed="collapsed" />
    </div>
  </div>
</template>
