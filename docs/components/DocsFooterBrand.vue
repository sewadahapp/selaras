<template>
  <div class="flex items-center gap-3">
    <NuxtLink to="/" aria-label="Selaras home" class="inline-flex shrink-0 rounded-[var(--selaras-resolved-radius-sm)] [--selaras-docs-logo-height:1.75rem]">
      <DocsLogo />
    </NuxtLink>
    <div class="flex flex-col gap-0.5">
      <span class="text-sm font-semibold leading-tight text-[var(--selaras-resolved-text-default)]">Selaras</span>
      <span class="text-xs leading-snug text-[var(--selaras-resolved-text-muted)]">Design system components for Vue and Nuxt</span>
    </div>
  </div>
</template>
