<script setup lang="ts">
const appConfig = useAppConfig()
const docsConfig = computed(() => appConfig.selarasDocs ?? {})
const footer = computed(() => docsConfig.value.footer)
</script>

<template>
  <footer v-if="footer?.text || footer?.links?.length" class="selaras-docs-footer">
    <SContainer size="full" class="selaras-docs-footer-inner">
      <p v-if="footer?.text" class="selaras-docs-footer-text">
        {{ footer.text }}
      </p>
      <nav v-if="footer?.links?.length" class="selaras-docs-footer-links" aria-label="Footer navigation">
        <NuxtLink
          v-for="link in footer.links"
          :key="`${link.to}:${link.label ?? link.icon ?? ''}`"
          :to="link.to"
          :target="link.target"
          :rel="link.rel"
          :aria-label="link.ariaLabel ?? link.label"
        >
          <SIcon v-if="link.icon" :name="link.icon" />
          <span v-if="link.label">{{ link.label }}</span>
        </NuxtLink>
      </nav>
    </SContainer>
  </footer>
</template>
