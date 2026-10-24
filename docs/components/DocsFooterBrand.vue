<script setup lang="ts">
import { useDocsRoutePath } from '../../packages/docs/app/composables/useDocsRoutePath'

const docsRoutePath = useDocsRoutePath()
const { locale } = useDocsLocale()
</script>

<template>
  <div class="selaras-site-footer-brand flex items-center gap-3">
    <NuxtLink :to="docsRoutePath('/')" aria-label="Selaras home" class="inline-flex shrink-0 rounded-[var(--selaras-resolved-radius-sm)] [--selaras-docs-logo-height:1.75rem]">
      <DocsLogo />
    </NuxtLink>
    <div class="flex flex-col gap-1">
      <span class="text-sm font-semibold leading-5 text-[var(--selaras-resolved-text-default)]">Selaras</span>
      <span class="text-xs leading-normal text-[var(--selaras-resolved-text-muted)]">{{ locale === 'id' ? 'Komponen sistem desain untuk Nuxt' : 'Design system components for Nuxt' }}</span>
    </div>
  </div>
</template>
