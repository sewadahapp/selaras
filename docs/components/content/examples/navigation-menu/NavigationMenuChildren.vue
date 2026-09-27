<script setup lang="ts">
const items = [
  { label: 'Home', to: '/' },
  { label: 'Products', children: [
    { label: 'Analytics', to: '/components/data/table' },
    { label: 'Automation', to: '/components/forms/validation' },
    { label: 'Integrations', to: '/components/overlays/dropdown' },
  ] },
  { label: 'Company', children: [
    { label: 'About', to: '/components/navigation/navigation-menu' },
    { label: 'Careers', to: '/components/layout/header' },
  ] },
]
</script>

<template>
  <SNavigationMenu :items="items" />
</template>
