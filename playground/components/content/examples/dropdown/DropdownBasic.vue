<template>
  <SDropdown
    :items="[
      [{ label: 'Edit', icon: 'lucide:pencil' }, { label: 'Duplicate', icon: 'lucide:copy' }],
      [{ label: 'Delete', icon: 'lucide:trash-2' }],
    ]"
  >
    <SButton variant="outline">
      Open dropdown
    </SButton>
  </SDropdown>
</template>
