<script setup lang="ts">
import type { EmptyStateThemeSlots } from '../theme/empty-state'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { emptyStateTheme } from '../theme/empty-state'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Icon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<EmptyStateProps>()
defineSlots<EmptyStateSlots>()

export interface EmptyStateProps {
  title?: string
  description?: string
  /** Optional decorative icon. No icon is rendered by default. */
  icon?: string
  ui?: UiProp<EmptyStateThemeSlots>
}

export interface EmptyStateSlots {
  /** Decorative icon or illustration. */
  icon?: () => any
  title?: () => any
  description?: () => any
  /** Additional content below the description. */
  default?: () => any
  actions?: () => any
}

const theme = useComponentTheme('emptyState', emptyStateTheme)
const ui = computed(() => theme.value())
const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
</script>

<template>
  <div v-bind="rootProps">
    <div v-if="icon || $slots.icon" v-bind="resolveSlot(ui.icon, props.ui?.icon)" aria-hidden="true">
      <slot name="icon">
        <Icon v-if="icon" :name="icon" class="size-full" aria-hidden="true" />
      </slot>
    </div>
    <div v-if="title || description || $slots.title || $slots.description || $slots.default" v-bind="resolveSlot(ui.content, props.ui?.content)">
      <div v-if="title || $slots.title" v-bind="resolveSlot(ui.title, props.ui?.title)">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div v-if="description || $slots.description" v-bind="resolveSlot(ui.description, props.ui?.description)">
        <slot name="description">
          {{ description }}
        </slot>
      </div>
      <slot />
    </div>
    <div v-if="$slots.actions" v-bind="resolveSlot(ui.actions, props.ui?.actions)">
      <slot name="actions" />
    </div>
  </div>
</template>
