<script setup lang="ts">
const route = useRoute()
const appConfig = useAppConfig()
const { data: navigation } = useDocsNavigation()
const navigationOpen = ref(false)

const docsConfig = computed(() => appConfig.selarasDocs ?? {})
const siteName = computed(() => docsConfig.value.header?.title ?? docsConfig.value.site?.name ?? 'Documentation')
const headerLinks = computed(() => docsConfig.value.header?.links ?? [])
const repositoryUrl = computed(() => docsConfig.value.repository?.url)
const sidebarEnabled = computed(() => docsConfig.value.sidebar?.enabled !== false)
const mobileNavigationEnabled = computed(() => sidebarEnabled.value || headerLinks.value.length > 0)

watch(() => route.path, () => {
  navigationOpen.value = false
})
</script>

<template>
  <SHeader
    :ui="{
      root: 'selaras-docs-header',
      left: docsConfig.header?.fluid ? 'selaras-docs-header-inner selaras-docs-header-inner--fluid' : 'selaras-docs-header-inner',
      right: 'hidden',
    }"
  >
    <div class="selaras-docs-brand-area">
      <NuxtLink to="/" class="selaras-docs-brand" :aria-label="`${siteName} home`">
        <DocsHeaderBrand />
      </NuxtLink>
    </div>
    <SNavigationMenu
      v-if="headerLinks.length"
      :items="headerLinks"
      variant="link"
      :ui="{ root: 'hidden w-auto xl:flex' }"
    />
    <div class="selaras-docs-header-actions">
      <DocsSearchButton v-if="docsConfig.header?.search !== false" />
      <SColorModeToggle v-if="docsConfig.header?.colorMode !== false" />
      <DocsThemePicker v-if="docsConfig.header?.themePicker" />
      <SButton
        v-if="repositoryUrl"
        as="a"
        :href="repositoryUrl"
        target="_blank"
        rel="noreferrer"
        aria-label="Source repository"
        title="Source repository"
        icon="hugeicons:github"
        variant="ghost"
        color="neutral"
      />
      <SButton
        v-if="mobileNavigationEnabled"
        variant="ghost"
        color="neutral"
        class="selaras-docs-nav-toggle"
        aria-label="Open documentation navigation"
        @click="navigationOpen = true"
      >
        Menu
      </SButton>
    </div>
  </SHeader>
  <SDrawer v-if="mobileNavigationEnabled" v-model:open="navigationOpen" side="left" title="Documentation navigation" :handle="false">
    <template #body>
      <SNavigationMenu
        v-if="headerLinks.length"
        :items="headerLinks"
        orientation="vertical"
        aria-label="Main navigation"
        :ui="{ root: 'mb-6 w-full' }"
      />
      <SContentNavigation v-if="sidebarEnabled" :navigation="navigation ?? []" :collapsed="docsConfig.sidebar?.collapsed" />
    </template>
  </SDrawer>
</template>
