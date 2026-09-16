<template>
  <div class="flex items-center gap-6">
    <div class="flex items-center gap-1 rounded-[var(--selaras-resolved-radius-md)] px-2 ring-1 ring-inset ring-[var(--selaras-resolved-border-default)]">
      <span class="text-sm text-[var(--selaras-resolved-text-muted)]">ghost</span>
      <SButton icon="hugeicons:cancel-01" variant="ghost" color="neutral" aria-label="Clear" />
    </div>
    <div class="flex items-center gap-1 rounded-[var(--selaras-resolved-radius-md)] px-2 ring-1 ring-inset ring-[var(--selaras-resolved-border-default)]">
      <span class="text-sm text-[var(--selaras-resolved-text-muted)]">text</span>
      <SButton icon="hugeicons:cancel-01" variant="text" color="neutral" aria-label="Clear" />
    </div>
  </div>
</template>
