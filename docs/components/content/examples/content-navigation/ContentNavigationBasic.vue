<script setup lang="ts">
const navigation = [
  { title: 'Getting Started', path: '/' },
  { title: 'Forms', path: '/components/forms', children: [
    { title: 'Input', path: '/components/forms/input' },
    { title: 'Select', path: '/components/forms/select' },
  ] },
]
</script>

<template>
  <SContentNavigation :navigation="navigation" class="w-56" />
</template>
