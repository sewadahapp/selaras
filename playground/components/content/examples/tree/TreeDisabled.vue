<script setup lang="ts">
const items = [
  {
    label: 'Team',
    value: 'team',
    children: [
      { label: 'Members', value: 'members' },
      { label: 'Billing', value: 'billing', disabled: true },
      { label: 'Danger zone', value: 'danger', disabled: true },
    ],
  },
]
</script>

<template>
  <STree :items="items" :default-expanded="['team']" class="w-full max-w-xs" />
</template>
