<template>
  <div class="flex flex-wrap items-start gap-6">
    <div class="flex flex-col gap-2">
      <span class="text-xs font-medium text-[var(--selaras-resolved-text-muted)]">Default sizing</span>
      <div class="flex gap-1">
        <SButton variant="outline" color="neutral">
          1
        </SButton>
        <SButton variant="outline" color="neutral">
          31
        </SButton>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <span class="text-xs font-medium text-[var(--selaras-resolved-text-muted)]">Square</span>
      <div class="flex gap-1">
        <SButton variant="outline" color="neutral" square>
          1
        </SButton>
        <SButton variant="outline" color="neutral" square>
          31
        </SButton>
      </div>
    </div>
  </div>
</template>
