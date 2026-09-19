<script setup lang="ts">
const selected = ref()

const items = [
  {
    label: 'Permissions',
    value: 'permissions',
    children: [
      { label: 'Read', value: 'read' },
      { label: 'Write', value: 'write' },
      { label: 'Admin', value: 'admin' },
    ],
  },
]
</script>

<template>
  <STree v-model="selected" :items="items" checkbox :default-expanded="['permissions']" class="w-full max-w-xs" />
</template>
