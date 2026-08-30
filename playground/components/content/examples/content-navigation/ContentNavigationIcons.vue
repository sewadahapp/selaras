<script setup lang="ts">
const navigation = [
  { title: 'Getting Started', path: '/', icon: 'hugeicons:rocket-01' },
  { title: 'Forms', path: '/components/forms', icon: 'hugeicons:folder-01', children: [
    { title: 'Input', path: '/components/forms/input' },
    { title: 'Select', path: '/components/forms/select' },
  ] },
]
</script>

<template>
  <SContentNavigation :navigation="navigation" class="w-56" />
</template>
