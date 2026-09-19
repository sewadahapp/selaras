<script setup lang="ts">
const items = [
  [{ label: 'Edit', icon: 'hugeicons:pencil' }, { label: 'Duplicate', icon: 'hugeicons:copy' }],
  [{ label: 'Delete', icon: 'hugeicons:delete-02', destructive: true }],
]
</script>

<template>
  <SDropdown :items="items">
    <SButton variant="outline">
      Open dropdown
    </SButton>
  </SDropdown>
</template>
