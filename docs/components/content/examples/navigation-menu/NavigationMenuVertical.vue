<script setup lang="ts">
const items = [
  { label: 'Getting started', to: '/getting-started' },
  { label: 'Components', children: [
    { label: 'Forms', children: [
      { label: 'Input', to: '/components/forms/input' },
      { label: 'Select', to: '/components/forms/select' },
    ] },
    { label: 'Overlays', children: [
      { label: 'Modal', to: '/components/overlays/modal' },
      { label: 'Slideover', to: '/components/overlays/slideover' },
    ] },
  ] },
  { label: 'API Reference', to: '/api' },
]
</script>

<template>
  <div class="max-w-64">
    <SNavigationMenu :items="items" orientation="vertical" />
  </div>
</template>
