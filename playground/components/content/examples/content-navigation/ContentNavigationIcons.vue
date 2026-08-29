<script setup lang="ts">
const navigation = [
  { title: 'Getting Started', path: '/', icon: 'ph:rocket-launch' },
  { title: 'Forms', path: '/components/forms', icon: 'ph:folder', children: [
    { title: 'Input', path: '/components/forms/input' },
    { title: 'Select', path: '/components/forms/select' },
  ] },
]
</script>

<template>
  <SContentNavigation :navigation="navigation" class="w-56" />
</template>
