<script setup lang="ts">
const items = [
  [{ label: 'Edit', icon: 'ph:pencil' }, { label: 'Duplicate', icon: 'ph:copy' }],
  [{ label: 'Delete', icon: 'ph:trash', destructive: true }],
]
</script>

<template>
  <SDropdown :items="items">
    <SButton variant="outline">
      Open dropdown
    </SButton>
  </SDropdown>
</template>
