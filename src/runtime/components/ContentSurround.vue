<script setup lang="ts">
import type { ContentSurroundThemeSlots } from '../theme/content-surround'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { contentSurroundTheme } from '../theme/content-surround'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Icon from './Icon.vue'

export interface ContentSurroundLink {
  title: string
  path: string
}

defineOptions({ inheritAttrs: false })

const props = defineProps<ContentSurroundProps>()

export interface ContentSurroundProps {
  /** The previous page in reading order. Omit (along with `next`) to render nothing. */
  prev?: ContentSurroundLink
  /** The next page in reading order. */
  next?: ContentSurroundLink
  ui?: UiProp<ContentSurroundThemeSlots>
}

const icons = useIcons()
const messages = useMessages()

const theme = useComponentTheme('contentSurround', contentSurroundTheme)
const startUi = computed(() => theme.value({ align: 'start' }))
const endUi = computed(() => theme.value({ align: 'end' }))

const rootProps = useRootProps(() => theme.value().root, () => props.ui?.root)
const prevLinkProps = computed(() => resolveSlot(startUi.value.link, props.ui?.link))
const nextLinkProps = computed(() => resolveSlot(endUi.value.link, props.ui?.link))
const prevLabelProps = computed(() => resolveSlot(startUi.value.label, props.ui?.label))
const nextLabelProps = computed(() => resolveSlot(endUi.value.label, props.ui?.label))
const iconProps = computed(() => resolveSlot(startUi.value.icon, props.ui?.icon))
const titleProps = computed(() => resolveSlot(startUi.value.title, props.ui?.title))
</script>

<template>
  <nav v-if="prev || next" v-bind="rootProps" :aria-label="`${messages.previous} / ${messages.next}`">
    <NuxtLink v-if="prev" :to="prev.path" v-bind="prevLinkProps">
      <span v-bind="prevLabelProps">
        <Icon :name="icons.chevronLeft" v-bind="iconProps" />
        {{ messages.previous }}
      </span>
      <span v-bind="titleProps">{{ prev.title }}</span>
    </NuxtLink>
    <div v-else />
    <NuxtLink v-if="next" :to="next.path" v-bind="nextLinkProps">
      <span v-bind="nextLabelProps">
        {{ messages.next }}
        <Icon :name="icons.chevronRight" v-bind="iconProps" />
      </span>
      <span v-bind="titleProps">{{ next.title }}</span>
    </NuxtLink>
  </nav>
</template>
