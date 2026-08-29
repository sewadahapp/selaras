<script setup lang="ts">
const navigation = [
  { title: 'Getting Started', path: '/' },
  { title: 'Forms', path: '/components/forms', children: [
    { title: 'Input', path: '/components/forms/input' },
    { title: 'Textarea', path: '/components/forms/textarea' },
  ] },
]
</script>

<template>
  <SContentNavigation :navigation="navigation" class="w-56">
    <template #link="{ link }">
      <span class="flex flex-1 items-center justify-between gap-2">
        {{ link.title }}
        <SBadge v-if="link.path === '/components/forms/textarea'" label="New" color="primary" size="sm" />
      </span>
    </template>
  </SContentNavigation>
</template>
