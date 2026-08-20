<script setup lang="ts">
const navigation = [
  { title: 'Getting Started', path: '/' },
  { title: 'Components', path: '/components', children: [
    { title: 'Button', path: '/components/button' },
    { title: 'Input', path: '/components/input' },
  ] },
]
</script>

<template>
  <SContentNavigation :navigation="navigation" class="w-56" />
</template>
