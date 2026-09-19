<template>
  <SCardGroup class="w-full">
    <SCard>
      <template #header>
        <SBadge label="Design" color="primary" variant="soft" />
      </template>
      <h3 class="font-semibold text-[var(--selaras-resolved-text-default)]">
        Building a scalable design token system
      </h3>
      <p class="text-sm text-[var(--selaras-resolved-text-muted)]">
        A look at how semantic tokens keep a component library themeable.
      </p>
    </SCard>
    <SCard>
      <template #header>
        <SBadge label="Engineering" color="secondary" variant="soft" />
      </template>
      <h3 class="font-semibold text-[var(--selaras-resolved-text-default)]">
        CSS-only animation, end to end
      </h3>
      <p class="text-sm text-[var(--selaras-resolved-text-muted)]">
        Why every transition in this library skips JavaScript entirely.
      </p>
    </SCard>
  </SCardGroup>
</template>
