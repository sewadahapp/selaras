<script setup lang="ts">
const align = ref<'start' | 'center' | 'end'>('start')
const items = [
  { label: 'Products', children: [
    { label: 'Analytics', icon: 'hugeicons:analytics-01', to: '/components/data/table' },
    { label: 'Automation', icon: 'hugeicons:workflow-square-01', to: '/components/forms/validation' },
    { label: 'Integrations', icon: 'hugeicons:link-01', to: '/components/overlays/dropdown' },
  ] },
  { label: 'Company', children: [
    { label: 'About', to: '/overview/getting-started/introduction' },
    { label: 'Contact', to: '/components/layout/header' },
  ] },
]
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <div class="flex items-center gap-3">
      <span class="text-sm text-[var(--selaras-resolved-text-muted)]">Dropdown alignment</span>
      <SSelect v-model="align" :items="['start', 'center', 'end']" aria-label="Dropdown alignment" class="w-32" />
    </div>
    <SNavigationMenu :items="items" :positioning="{ align }" />
  </div>
</template>
