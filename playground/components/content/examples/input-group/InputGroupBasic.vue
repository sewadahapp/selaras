<template>
  <div class="flex flex-col gap-4">
    <SInputGroup>
      <span class="inline-flex items-center rounded-[var(--selaras-resolved-radius-md)] bg-[var(--selaras-resolved-surface-elevated)] px-3 text-sm text-[var(--selaras-resolved-text-muted)] ring-1 ring-inset ring-[var(--selaras-resolved-border-default)]">
        $
      </span>
      <SInput placeholder="0.00" />
      <span class="inline-flex items-center rounded-[var(--selaras-resolved-radius-md)] bg-[var(--selaras-resolved-surface-elevated)] px-3 text-sm text-[var(--selaras-resolved-text-muted)] ring-1 ring-inset ring-[var(--selaras-resolved-border-default)]">
        USD
      </span>
    </SInputGroup>

    <SInputGroup>
      <SInput placeholder="Search..." />
      <SButton>
        Search
      </SButton>
    </SInputGroup>
  </div>
</template>
