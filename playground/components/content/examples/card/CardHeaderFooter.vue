<template>
  <SCard>
    <template #header>
      <p class="font-semibold text-[var(--ui-text)]">
        Delete project
      </p>
    </template>

    This action cannot be undone. All data associated with this project
    will be permanently removed.

    <template #footer>
      <div class="flex justify-end gap-2">
        <SButton variant="ghost">
          Cancel
        </SButton>
        <SButton color="danger">
          Delete
        </SButton>
      </div>
    </template>
  </SCard>
</template>
