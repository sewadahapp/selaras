<script setup lang="ts">
const appConfig = useAppConfig()
const docsConfig = computed(() => appConfig.selarasDocs ?? {})
const siteName = computed(() => docsConfig.value.header?.title ?? docsConfig.value.site?.name ?? 'Documentation')
const showTitle = computed(() => docsConfig.value.header?.showTitle !== false)
</script>

<template>
  <DocsLogo />
  <span v-if="showTitle">{{ siteName }}</span>
</template>
