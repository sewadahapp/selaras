<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { AlertThemeSlots } from '../theme/alert'
import type { ColorRole } from '../utils/color-registry'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { alertTheme } from '../theme/alert'
import { resolveRegisteredColorRole } from '../utils/registered-colors'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Button from './Button.vue'
import Icon from './Icon.vue'

type AlertVariants = VariantProps<typeof alertTheme>

defineOptions({ inheritAttrs: false })

const props = defineProps<AlertProps>()

const emit = defineEmits<AlertEmits>()

defineSlots<AlertSlots>()

export interface AlertProps {
  title?: string
  description?: string
  /** Falls back to the color's own default icon (icons.success/danger/warning/info) when unset - no icon renders at all without a color either. */
  icon?: string
  /** Shows a dismiss button and emits `close` when clicked. The alert has no open state of its own - closing it is left to the consumer's own v-if/v-for, the same way Chip's own `removable` + `remove` already works. */
  closable?: boolean
  color?: ColorRole
  variant?: AlertVariants['variant']
  ui?: UiProp<AlertThemeSlots>
}

export interface AlertEmits {
  close: []
}

export interface AlertSlots {
  title?: () => any
  description?: () => any
  /** Action buttons (Retry, Undo, ...) below the description. */
  actions?: () => any
}

const icons = useIcons()
const messages = useMessages()

const effectiveColor = computed(() => resolveRegisteredColorRole(props.color ?? 'info', 'info'))
const recipeColor = computed<AlertVariants['color']>(() => ['success', 'danger', 'warning', 'info'].includes(effectiveColor.value) ? effectiveColor.value as AlertVariants['color'] : 'info')
const iconName = computed(() => props.icon ?? (props.color ? icons.value[recipeColor.value ?? 'info'] : undefined))

const theme = useComponentTheme('alert', alertTheme)
const ui = computed(() => theme.value({ color: recipeColor.value, variant: props.variant }))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const iconProps = computed(() => resolveSlot(ui.value.icon, props.ui?.icon))
const contentProps = computed(() => resolveSlot(ui.value.content, props.ui?.content))
const titleProps = computed(() => resolveSlot(ui.value.title, props.ui?.title))
const descriptionProps = computed(() => resolveSlot(ui.value.description, props.ui?.description))
const actionsProps = computed(() => resolveSlot(ui.value.actions, props.ui?.actions))
const closeProps = computed(() => resolveSlot(ui.value.close, props.ui?.close))
</script>

<template>
  <div :data-selaras-color="effectiveColor" v-bind="rootProps">
    <Icon v-if="iconName" :name="iconName" v-bind="iconProps" />
    <div v-bind="contentProps">
      <p v-if="title || $slots.title" v-bind="titleProps">
        <slot name="title">
          {{ title }}
        </slot>
      </p>
      <p v-if="description || $slots.description" v-bind="descriptionProps">
        <slot name="description">
          {{ description }}
        </slot>
      </p>
      <div v-if="$slots.actions" v-bind="actionsProps">
        <slot name="actions" />
      </div>
    </div>
    <Button
      v-if="closable"
      size="sm"
      variant="ghost"
      color="neutral"
      :icon="icons.close"
      :aria-label="messages.close"
      v-bind="closeProps"
      @click="emit('close')"
    />
  </div>
</template>
