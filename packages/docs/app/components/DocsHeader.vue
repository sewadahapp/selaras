<script setup lang="ts">
import type { SelarasDocsNavigationItem } from '../../types'
import { useDocsRoutePath } from '../composables/useDocsRoutePath'

const route = useRoute()
const appConfig = useAppConfig()
const { data: navigation } = useDocsNavigation()
const messages = useDocsMessages()
const docsRoutePath = useDocsRoutePath()
const navigationOpen = ref(false)
const { locale } = useDocsLocale()

const docsConfig = computed(() => appConfig.selarasDocs ?? {})
const siteName = computed(() => docsConfig.value.header?.title ?? docsConfig.value.site?.name ?? 'Documentation')
function localizedLink(link: SelarasDocsNavigationItem): SelarasDocsNavigationItem {
  return {
    ...link,
    label: link.labels?.[locale.value] ?? link.label,
    ...(link.to ? { to: docsRoutePath(link.to) } : {}),
    ...(link.children ? { children: link.children.map(localizedLink) } : {}),
  }
}
const headerLinks = computed(() => (docsConfig.value.header?.links ?? []).map(localizedLink))
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
      <NuxtLink :to="docsRoutePath('/')" class="selaras-docs-brand" :aria-label="`${siteName} home`">
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
      <DocsLanguageSwitcher />
      <SButton
        v-if="repositoryUrl"
        as="a"
        :href="repositoryUrl"
        target="_blank"
        rel="noreferrer"
        :aria-label="messages.sourceRepository"
        :title="messages.sourceRepository"
        icon="hugeicons:github"
        variant="ghost"
        color="neutral"
      />
      <SButton
        v-if="mobileNavigationEnabled"
        variant="ghost"
        color="neutral"
        class="selaras-docs-nav-toggle"
        :aria-label="messages.openNavigation"
        @click="navigationOpen = true"
      >
        Menu
      </SButton>
    </div>
  </SHeader>
  <SDrawer v-if="mobileNavigationEnabled" v-model:open="navigationOpen" side="left" :title="messages.documentationNavigation" :handle="false">
    <template #body>
      <SNavigationMenu
        v-if="headerLinks.length"
        :items="headerLinks"
        orientation="vertical"
        :aria-label="messages.mainNavigation"
        :ui="{ root: 'mb-6 w-full' }"
      />
      <SContentNavigation v-if="sidebarEnabled" :navigation="navigation ?? []" :collapsed="docsConfig.sidebar?.collapsed" />
    </template>
  </SDrawer>
</template>
