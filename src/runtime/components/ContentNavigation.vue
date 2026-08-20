<script setup lang="ts">
import type { ContentNavigationSlots } from '../theme/content-navigation'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { useRoute } from '#imports'
import { contentNavigationTheme } from '../theme/content-navigation'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

export interface ContentNavigationLink {
  title: string
  path: string
  children?: ContentNavigationLink[]
}

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  navigation: ContentNavigationLink[]
  ui?: UiProp<ContentNavigationSlots>
}>()

const route = useRoute()

function isActive(link: ContentNavigationLink) {
  return route.path === link.path
}

const theme = useComponentTheme('contentNavigation', contentNavigationTheme)
const ui = computed(() => theme.value())

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)

// Group headers are a real SAccordion (one instance per group, since
// type="multiple" semantics don't depend on siblings sharing a root) styled
// to match a compact nav tree via its own :ui override, not a bespoke accordion.
const groupUi = computed(() => ({
  item: '',
  trigger: ui.value.trigger(),
  chevron: ui.value.chevron(),
  content: ui.value.content(),
}))
</script>

<template>
  <ul v-bind="rootProps">
    <li v-for="link in navigation" :key="link.path" v-bind="resolveSlot(ui.item, props.ui?.item)">
      <SAccordion
        v-if="link.children?.length"
        :items="[{ value: link.path, label: link.title }]"
        :default-value="[link.path]"
        :ui="groupUi"
      >
        <template #[link.path]>
          <!-- Vue's SFC self-recursion resolves by this file's own bare name -
               keep it unprefixed even though the public component is SContentNavigation. -->
          <ContentNavigation :navigation="link.children!" :ui="props.ui" />
        </template>
      </SAccordion>
      <NuxtLink v-else :to="link.path" v-bind="resolveSlot(isActive(link) ? ui.linkActive : ui.link, props.ui?.link)">
        {{ link.title }}
      </NuxtLink>
    </li>
  </ul>
</template>
