<template>
  <div class="flex flex-col gap-4">
    <SInputGroup>
      <span class="inline-flex items-center rounded-[var(--ui-radius-md)] bg-[var(--ui-bg-elevated)] px-3 text-sm text-[var(--ui-text-muted)] ring-1 ring-inset ring-[var(--ui-border)]">
        $
      </span>
      <SInput placeholder="0.00" />
      <span class="inline-flex items-center rounded-[var(--ui-radius-md)] bg-[var(--ui-bg-elevated)] px-3 text-sm text-[var(--ui-text-muted)] ring-1 ring-inset ring-[var(--ui-border)]">
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
