<script setup lang="ts">
const route = useRoute()
const appConfig = useAppConfig()
const { data: navigation } = useDocsNavigation()
const navigationOpen = ref(false)

const docsConfig = computed(() => appConfig.selarasDocs ?? {})
const siteName = computed(() => docsConfig.value.header?.title ?? docsConfig.value.site?.name ?? 'Documentation')
const showTitle = computed(() => docsConfig.value.header?.showTitle !== false)
const logo = computed(() => docsConfig.value.site?.logo)
const logoAlt = computed(() => typeof logo.value === 'object' ? (logo.value.alt ?? siteName.value) : siteName.value)
const lightLogo = computed(() => typeof logo.value === 'string' ? logo.value : (logo.value?.light ?? logo.value?.dark))
const darkLogo = computed(() => typeof logo.value === 'object' ? (logo.value.dark ?? logo.value.light) : logo.value)
const hasDistinctLogos = computed(() => Boolean(lightLogo.value && darkLogo.value && lightLogo.value !== darkLogo.value))
const headerLinks = computed(() => docsConfig.value.header?.links ?? [])
const repositoryUrl = computed(() => docsConfig.value.repository?.url)

watch(() => route.path, () => {
  navigationOpen.value = false
})
</script>

<template>
  <SHeader>
    <NuxtLink to="/" class="selaras-docs-brand" :aria-label="`${siteName} home`">
      <template v-if="lightLogo">
        <img :src="lightLogo" :alt="logoAlt" class="selaras-docs-logo" :class="{ 'selaras-docs-logo--light': hasDistinctLogos }">
        <img v-if="hasDistinctLogos" :src="darkLogo" :alt="logoAlt" class="selaras-docs-logo selaras-docs-logo--dark">
      </template>
      <span v-if="showTitle">{{ siteName }}</span>
    </NuxtLink>
    <template #right>
      <NuxtLink
        v-for="link in headerLinks"
        :key="`${link.to}:${link.label ?? link.icon ?? ''}`"
        :to="link.to"
        :target="link.target"
        class="selaras-docs-header-link selaras-docs-header-link--desktop"
        :aria-label="link.ariaLabel ?? link.label"
      >
        <SIcon v-if="link.icon" :name="link.icon" />
        <span v-if="link.label">{{ link.label }}</span>
      </NuxtLink>
      <NuxtLink
        v-if="repositoryUrl"
        :to="repositoryUrl"
        target="_blank"
        rel="noreferrer"
        class="selaras-docs-header-link selaras-docs-header-link--desktop"
        aria-label="Source repository"
      >
        <span>Source</span>
      </NuxtLink>
      <DocsSearchButton v-if="docsConfig.header?.search !== false" />
      <SColorModeToggle v-if="docsConfig.header?.colorMode !== false" />
      <SButton
        variant="ghost"
        color="neutral"
        class="selaras-docs-nav-toggle"
        aria-label="Open documentation navigation"
        @click="navigationOpen = true"
      >
        Menu
      </SButton>
    </template>
  </SHeader>
  <SDrawer v-model:open="navigationOpen" side="left" title="Documentation navigation" :handle="false">
    <template #body>
      <SContentNavigation :navigation="navigation ?? []" />
    </template>
  </SDrawer>
</template>
