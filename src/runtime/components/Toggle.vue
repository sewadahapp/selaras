<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { ToggleThemeSlots } from '../theme/toggle'
import type { UiProp } from '../utils/ui'
import { Toggle } from 'reka-ui'
import { computed, useSlots } from 'vue'
import { toggleTheme } from '../theme/toggle'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Icon from './Icon.vue'

type ToggleVariants = VariantProps<typeof toggleTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ToggleProps>(), {
  // An unset `modelValue?: boolean` with no explicit default here resolves
  // to `false` (Vue's own Boolean-prop casting), not `undefined` - that
  // would make this a permanently-controlled-false toggle, ignoring
  // `defaultValue` entirely and breaking uncontrolled use. An explicit
  // `undefined` default disables that casting (same fix as Button's own
  // `square`/Collapsible's own `open`).
  modelValue: undefined,
  square: undefined,
})

const emit = defineEmits<ToggleEmits>()

defineSlots<ToggleSlots>()

export interface ToggleProps {
  modelValue?: boolean
  defaultValue?: boolean
  disabled?: boolean
  icon?: string
  color?: ToggleVariants['color']
  size?: ToggleVariants['size']
  /** Forces (or blocks) the equal-width/height icon-only shape - same convention as Button's own `square`. */
  square?: boolean
  ui?: UiProp<ToggleThemeSlots>
}

export interface ToggleEmits {
  'update:modelValue': [value: boolean]
}

export interface ToggleSlots {
  default?: (props: { pressed: boolean }) => any
}

const slots = useSlots()
const iconOnly = computed(() => !slots.default)

const theme = useComponentTheme('toggle', toggleTheme)
const ui = computed(() => theme.value({
  color: props.color,
  size: props.size,
  square: props.square ?? iconOnly.value,
}))

const rootProps = useRootProps(() => ui.value.base, () => props.ui?.base)
</script>

<template>
  <Toggle
    :model-value="modelValue"
    :default-value="defaultValue"
    :disabled="disabled"
    v-bind="rootProps"
    @update:model-value="(value) => emit('update:modelValue', value as boolean)"
  >
    <template #default="{ pressed }">
      <Icon v-if="icon" :name="icon" v-bind="resolveSlot(ui.icon, props.ui?.icon)" />
      <slot :pressed="pressed" />
    </template>
  </Toggle>
</template>
