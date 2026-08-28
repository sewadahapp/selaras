<template>
  <div class="flex items-center gap-6">
    <div class="flex items-center gap-1 rounded-[var(--ui-radius-md)] px-2 ring-1 ring-inset ring-[var(--ui-border)]">
      <span class="text-sm text-[var(--ui-text-muted)]">ghost</span>
      <SButton icon="ph:x" variant="ghost" color="neutral" aria-label="Clear" />
    </div>
    <div class="flex items-center gap-1 rounded-[var(--ui-radius-md)] px-2 ring-1 ring-inset ring-[var(--ui-border)]">
      <span class="text-sm text-[var(--ui-text-muted)]">text</span>
      <SButton icon="ph:x" variant="text" color="neutral" aria-label="Clear" />
    </div>
  </div>
</template>
