<template>
  <SDropdown
    :items="[
      [{ label: 'Edit', icon: 'ph:pencil' }, { label: 'Duplicate', icon: 'ph:copy' }],
      [{ label: 'Delete', icon: 'ph:trash' }],
    ]"
  >
    <SButton variant="outline">
      Open dropdown
    </SButton>
  </SDropdown>
</template>
