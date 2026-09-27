<script setup lang="ts">
const appConfig = useAppConfig()
const assetUrl = useDocsAssetUrl()

useHead(() => {
  const favicon = assetUrl(appConfig.selarasDocs?.site?.favicon)
  return {
    link: favicon ? [{ rel: 'icon', href: favicon, type: favicon.endsWith('.svg') ? 'image/svg+xml' : undefined }] : [],
  }
})
</script>

<template>
  <SApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <DocsSearch />
      <SToast />
    </ClientOnly>
  </SApp>
</template>
