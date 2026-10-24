<script setup lang="ts">
import { useDocsRoutePath } from '../../packages/docs/app/composables/useDocsRoutePath'

const appConfig = useAppConfig()
const docsConfig = computed(() => appConfig.selarasDocs ?? {})
const footer = computed(() => docsConfig.value.footer)
const { locale } = useDocsLocale()
const messages = useDocsMessages()
const links = computed(() => (footer.value?.links ?? [])
  .filter(link => link.label !== 'Powered by Selaras')
  .map(link => ({ ...link, label: link.labels?.[locale.value] ?? link.label })))
const docsRoutePath = useDocsRoutePath()
const footerText = computed(() => footer.value?.textByLocale?.[locale.value] ?? footer.value?.text)
</script>

<template>
  <footer v-if="footerText || links.length" class="selaras-docs-footer" :class="{ 'selaras-docs-footer--fluid': footer?.fluid }">
    <SContainer size="full" class="selaras-docs-footer-inner selaras-site-footer-inner">
      <DocsFooterBrand />
      <div class="selaras-site-footer-meta">
        <nav v-if="links.length" class="selaras-docs-footer-links" :aria-label="messages.footerNavigation">
          <NuxtLink
            v-for="link in links"
            :key="`${link.to}:${link.label ?? link.icon ?? ''}`"
            :to="docsRoutePath(link.to)"
            :target="link.target"
            :rel="link.rel"
            :aria-label="link.ariaLabel ?? link.label"
          >
            <SIcon v-if="link.icon" :name="link.icon" />
            <span v-if="link.label">{{ link.label }}</span>
            <SIcon v-if="link.label && !link.icon" name="hugeicons:arrow-right-01" aria-hidden="true" />
          </NuxtLink>
        </nav>
        <p v-if="footerText" class="selaras-docs-footer-text selaras-site-footer-copyright">
          {{ footerText }}
        </p>
      </div>
    </SContainer>
  </footer>
</template>
