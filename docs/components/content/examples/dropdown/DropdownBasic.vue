<template>
  <SDropdown
    :items="[
      [{ label: 'Edit', icon: 'hugeicons:pencil' }, { label: 'Duplicate', icon: 'hugeicons:copy' }],
      [{ label: 'Delete', icon: 'hugeicons:delete-02' }],
    ]"
  >
    <SButton variant="outline">
      Open dropdown
    </SButton>
  </SDropdown>
</template>
