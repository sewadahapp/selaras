<script setup lang="ts">
import { degungThemeUi } from './utils/degung-theme-ui'

const appConfig = useAppConfig()
const assetUrl = useDocsAssetUrl()
const preset = useDocsThemePreset()
const activeUi = computed(() => preset.value === 'degung' ? degungThemeUi : undefined)

useHead(() => {
  const favicon = assetUrl(appConfig.selarasDocs?.site?.favicon)
  return {
    link: favicon ? [{ rel: 'icon', href: favicon, type: favicon.endsWith('.svg') ? 'image/svg+xml' : undefined }] : [],
  }
})
</script>

<template>
  <SApp>
    <STheme :ui="activeUi">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <ClientOnly>
        <DocsSearch />
        <SToast />
      </ClientOnly>
    </STheme>
  </SApp>
</template>
