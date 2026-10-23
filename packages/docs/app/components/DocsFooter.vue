<script setup lang="ts">
const appConfig = useAppConfig()
const docsConfig = computed(() => appConfig.selarasDocs ?? {})
const footer = computed(() => docsConfig.value.footer)
const messages = useDocsMessages()
</script>

<template>
  <footer v-if="footer?.text || footer?.links?.length" class="selaras-docs-footer" :class="{ 'selaras-docs-footer--fluid': footer?.fluid }">
    <SContainer size="full" class="selaras-docs-footer-inner">
      <DocsFooterBrand />
      <nav v-if="footer?.links?.length" class="selaras-docs-footer-links" :aria-label="messages.footerNavigation">
        <NuxtLink
          v-for="link in footer.links"
          :key="`${link.to}:${link.label ?? link.icon ?? ''}`"
          :to="link.to"
          :target="link.target"
          :rel="link.rel"
          :aria-label="link.ariaLabel ?? link.label"
        >
          <SIcon v-if="link.icon" :name="link.icon" />
          <svg v-else-if="link.to === 'https://selarasui.my.id'" class="selaras-docs-footer-attribution-logo" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M28 80 H68 C94 80 118 36 144 36 H228 V62 H144 C118 62 94 106 68 106 H28 Z" />
            <path d="M28 134 H68 C94 134 118 90 144 90 H228 V116 H144 C118 116 94 160 68 160 H28 Z" />
            <path d="M28 188 H68 C94 188 118 144 144 144 H228 V170 H144 C118 170 94 214 68 214 H28 Z" />
          </svg>
          <span v-if="link.label">{{ link.label }}</span>
        </NuxtLink>
      </nav>
    </SContainer>
  </footer>
</template>
