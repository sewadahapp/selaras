<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { ChipSlots } from '../theme/chip'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { chipTheme } from '../theme/chip'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

type ChipVariants = VariantProps<typeof chipTheme>

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  label?: string
  icon?: string
  removable?: boolean
  /** Overrides the remove button's aria-label - it's icon-only, so it needs a name from somewhere. Defaults to "Remove {label}", or plain "Remove" without one. */
  removeLabel?: string
  disabled?: boolean
  /** Fully-rounded pill shape instead of the default (Badge's own) small radius. */
  rounded?: boolean
  color?: ChipVariants['color']
  variant?: ChipVariants['variant']
  size?: ChipVariants['size']
  ui?: UiProp<ChipSlots>
}>()

const emit = defineEmits<{
  remove: []
}>()

const theme = useComponentTheme('chip', chipTheme)

const ui = computed(() => theme.value({
  color: props.color,
  variant: props.variant,
  size: props.size,
  disabled: props.disabled,
  rounded: props.rounded,
  removable: props.removable,
}))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)

const effectiveRemoveLabel = computed(() => props.removeLabel ?? (props.label ? `Remove ${props.label}` : 'Remove'))
</script>

<template>
  <span v-bind="rootProps">
    <Icon v-if="icon" :name="icon" v-bind="resolveSlot(ui.leadingIcon, props.ui?.leadingIcon)" />
    <span v-bind="resolveSlot(ui.label, props.ui?.label)">
      <slot>{{ label }}</slot>
    </span>
    <button
      v-if="removable"
      type="button"
      :disabled="disabled"
      :aria-label="effectiveRemoveLabel"
      v-bind="resolveSlot(ui.remove, props.ui?.remove)"
      @click.stop="emit('remove')"
    >
      <slot name="remove-icon">
        <Icon name="lucide:x" v-bind="resolveSlot(ui.removeIcon, props.ui?.removeIcon)" />
      </slot>
    </button>
  </span>
</template>
