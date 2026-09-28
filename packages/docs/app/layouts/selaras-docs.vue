<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <div
    class="selaras-docs-root min-h-screen text-[var(--selaras-resolved-text-default)]"
    :class="{
      'selaras-docs-root--fluid': appConfig.selarasDocs?.main?.fluid,
    }"
  >
    <a class="selaras-docs-skip-link" href="#selaras-docs-main">Skip to content</a>
    <DocsHeader />
    <div class="selaras-docs-shell">
      <DocsSidebar />
      <main
        id="selaras-docs-main"
        class="selaras-docs-main"
        :class="{ 'selaras-docs-main--unpadded': appConfig.selarasDocs?.main?.padded === false }"
        tabindex="-1"
      >
        <slot />
      </main>
    </div>
    <DocsFooter />
  </div>
</template>
