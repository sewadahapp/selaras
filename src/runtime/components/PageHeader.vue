<script setup lang="ts">
import type { PageHeaderThemeSlots } from '../theme/page-header'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { pageHeaderTheme } from '../theme/page-header'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

defineOptions({ inheritAttrs: false })

const props = defineProps<PageHeaderProps>()

export interface PageHeaderProps {
  title?: string
  description?: string
  ui?: UiProp<PageHeaderThemeSlots>
}

const theme = useComponentTheme('pageHeader', pageHeaderTheme)
const ui = computed(() => theme.value())

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
</script>

<template>
  <div v-bind="rootProps">
    <h1 v-if="title || $slots.title" v-bind="resolveSlot(ui.title, props.ui?.title)">
      <slot name="title">
        {{ title }}
      </slot>
    </h1>
    <p v-if="description || $slots.description" v-bind="resolveSlot(ui.description, props.ui?.description)">
      <slot name="description">
        {{ description }}
      </slot>
    </p>
    <slot />
  </div>
</template>
