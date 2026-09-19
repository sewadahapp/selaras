<script setup lang="ts">
const items = [
  [{ label: 'Edit', icon: 'hugeicons:pencil' }, { label: 'Duplicate', icon: 'hugeicons:copy' }],
  [{ label: 'Delete', icon: 'hugeicons:delete-02' }],
]
</script>

<template>
  <SDropdown :items="items" arrow>
    <SButton variant="outline">
      Open dropdown
    </SButton>
  </SDropdown>
</template>
