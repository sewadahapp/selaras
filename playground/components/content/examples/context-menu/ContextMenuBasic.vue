<template>
  <SContextMenu
    :items="[
      [{ label: 'Edit', icon: 'hugeicons:pencil' }, { label: 'Duplicate', icon: 'hugeicons:copy' }],
      [{ label: 'Delete', icon: 'hugeicons:delete-02' }],
    ]"
  >
    <div class="flex h-32 w-64 select-none items-center justify-center rounded-[var(--selaras-resolved-radius-md)] border border-dashed border-[var(--selaras-resolved-border-default)] text-sm text-[var(--selaras-resolved-text-muted)]">
      Right-click here
    </div>
  </SContextMenu>
</template>
