<script setup lang="ts">
import type { CommandPaletteGroup } from '@sewadah/selaras/components/CommandPalette.vue'
import type { ContentNavigationLink } from '@sewadah/selaras/components/ContentNavigation.vue'

const appConfig = useAppConfig()
const { data: navigation } = useDocsNavigation()
const docsConfig = computed(() => appConfig.selarasDocs ?? {})

function leafPages(links: ContentNavigationLink[]): ContentNavigationLink[] {
  return links.flatMap(link => link.children?.length ? leafPages(link.children) : [link])
}

const groups = computed<CommandPaletteGroup[]>(() => {
  return (navigation.value ?? [])
    .map(section => ({
      label: section.title,
      items: leafPages(section.children?.length ? section.children : [section]).map(page => ({
        label: page.title,
        onSelect: () => navigateTo(page.path),
      })),
    }))
    .filter(group => group.items.length > 0)
})
</script>

<template>
  <SCommandPalette v-if="docsConfig.header?.search !== false" :groups="groups" />
</template>
