<script setup lang="ts">
import type { ContentNavigationThemeSlots } from '../theme/content-navigation'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { useRoute } from '#imports'
import { contentNavigationTheme } from '../theme/content-navigation'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Accordion from './Accordion.vue'
import Icon from './Icon.vue'

export interface ContentNavigationLink {
  title: string
  path: string
  icon?: string
  children?: ContentNavigationLink[]
}

defineOptions({ inheritAttrs: false })

const props = defineProps<ContentNavigationProps>()

defineSlots<ContentNavigationSlots>()

export interface ContentNavigationProps {
  navigation: ContentNavigationLink[]
  ui?: UiProp<ContentNavigationThemeSlots>
}

export interface ContentNavigationSlots {
  /** Replaces a link's (or a group header's) title content - `active` is always false for a group header, since that only ever describes a leaf link's own exact path. */
  link?: (props: { link: ContentNavigationLink, active: boolean }) => any
}

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
// `label` gets its own inline-flex here (Accordion's own default is
// unstyled, deliberately left flexible for reuse like this) so an icon
// sits next to the group's own title the same way a leaf link's does.
const groupUi = computed(() => ({
  item: '',
  trigger: ui.value.trigger(),
  label: 'inline-flex items-center gap-2',
  chevron: ui.value.chevron(),
  content: ui.value.content(),
}))
</script>

<template>
  <ul v-bind="rootProps">
    <li v-for="link in navigation" :key="link.path" v-bind="resolveSlot(ui.item, props.ui?.item)">
      <Accordion
        v-if="link.children?.length"
        :items="[{ value: link.path, label: link.title }]"
        :default-value="[link.path]"
        :ui="groupUi"
      >
        <template #label>
          <slot name="link" :link="link" :active="false">
            <Icon v-if="link.icon" :name="link.icon" v-bind="resolveSlot(ui.icon, props.ui?.icon)" />
            {{ link.title }}
          </slot>
        </template>
        <template #[link.path]>
          <!-- Vue's SFC self-recursion resolves by this file's own bare name -
               keep it unprefixed even though the public component is SContentNavigation. -->
          <ContentNavigation :navigation="link.children!" :ui="props.ui">
            <template #link="scope">
              <slot name="link" v-bind="scope" />
            </template>
          </ContentNavigation>
        </template>
      </Accordion>
      <NuxtLink v-else :to="link.path" v-bind="resolveSlot(isActive(link) ? ui.linkActive : ui.link, props.ui?.link)">
        <slot name="link" :link="link" :active="isActive(link)">
          <Icon v-if="link.icon" :name="link.icon" v-bind="resolveSlot(ui.icon, props.ui?.icon)" />
          {{ link.title }}
        </slot>
      </NuxtLink>
    </li>
  </ul>
</template>
