<template>
  <SDropdown
    adaptive
    :items="[
      [{ label: 'Edit profile', icon: 'hugeicons:pencil' }, { label: 'Copy profile link', icon: 'hugeicons:copy' }],
      [{ label: 'Sign out', icon: 'hugeicons:logout-03', destructive: true }],
    ]"
  >
    <SButton variant="outline">
      More actions
    </SButton>
  </SDropdown>
</template>
