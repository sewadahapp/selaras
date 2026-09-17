<template>
  <div class="flex flex-wrap gap-6">
    <div class="flex flex-col gap-1.5">
      <span class="text-xs font-medium text-[var(--selaras-resolved-text-muted)]">Ghost clear action</span>
      <div class="flex h-10 w-52 items-center gap-2 rounded-[var(--selaras-resolved-radius-md)] px-3 ring-1 ring-inset ring-[var(--selaras-resolved-border-default)]">
        <span class="flex-1 text-sm text-[var(--selaras-resolved-text-muted)]">Example field</span>
        <SButton icon="hugeicons:cancel-01" size="sm" variant="ghost" color="neutral" aria-label="Clear" />
      </div>
    </div>
    <div class="flex flex-col gap-1.5">
      <span class="text-xs font-medium text-[var(--selaras-resolved-text-muted)]">Text clear action</span>
      <div class="flex h-10 w-52 items-center gap-2 rounded-[var(--selaras-resolved-radius-md)] px-3 ring-1 ring-inset ring-[var(--selaras-resolved-border-default)]">
        <span class="flex-1 text-sm text-[var(--selaras-resolved-text-muted)]">Example field</span>
        <SButton icon="hugeicons:cancel-01" size="sm" variant="text" color="neutral" aria-label="Clear" />
      </div>
    </div>
  </div>
</template>
