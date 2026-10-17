<template>
  <div class="selaras-site-footer-brand flex items-center gap-3">
    <NuxtLink to="/" aria-label="Selaras home" class="inline-flex shrink-0 rounded-[var(--selaras-resolved-radius-sm)] [--selaras-docs-logo-height:1.75rem]">
      <DocsLogo />
    </NuxtLink>
    <div class="flex flex-col gap-1">
      <span class="text-sm font-semibold leading-5 text-[var(--selaras-resolved-text-default)]">Selaras</span>
      <span class="text-xs leading-normal text-[var(--selaras-resolved-text-muted)]">Design system components for Nuxt</span>
    </div>
  </div>
</template>
