<template>
  <SCard class="w-80">
    <template #header>
      <SBadge label="Design" color="primary" variant="soft" />
    </template>

    <h3 class="font-semibold text-[var(--ui-text)]">
      Building a scalable design token system
    </h3>
    <p class="text-sm text-[var(--ui-text-muted)]">
      A look at how semantic tokens keep a component library themeable
      without ever touching a single component file.
    </p>

    <template #footer>
      <div class="flex items-center gap-2">
        <SAvatar text="JS" size="sm" />
        <div class="text-sm leading-tight">
          <p class="font-medium text-[var(--ui-text)]">
            Jane Smith
          </p>
          <p class="text-[var(--ui-text-muted)]">
            Mar 12, 2026
          </p>
        </div>
      </div>
    </template>
  </SCard>
</template>
