<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { ToggleGroupThemeSlots } from '../theme/toggle-group'
import type { UiProp } from '../utils/ui'
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'
import { computed } from 'vue'
import { toggleGroupTheme } from '../theme/toggle-group'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Icon from './Icon.vue'

export interface ToggleGroupItemDef {
  label: string
  value: string
  icon?: string
  disabled?: boolean
}

type ToggleGroupVariants = VariantProps<typeof toggleGroupTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ToggleGroupProps>(), {
  type: 'single',
})

const emit = defineEmits<ToggleGroupEmits>()

defineSlots<ToggleGroupSlots>()

export interface ToggleGroupProps {
  /** A plain string is shorthand for `{ label: value, value }`. */
  items: (string | ToggleGroupItemDef)[]
  /** @default 'single' */
  type?: 'single' | 'multiple'
  modelValue?: string | string[]
  defaultValue?: string | string[]
  disabled?: boolean
  orientation?: ToggleGroupVariants['orientation']
  color?: ToggleGroupVariants['color']
  size?: ToggleGroupVariants['size']
  ui?: UiProp<ToggleGroupThemeSlots>
}

export interface ToggleGroupEmits {
  'update:modelValue': [value: string | string[]]
}

export interface ToggleGroupSlots {
  /** Replaces an item's default icon+label content. */
  item?: (props: { item: ToggleGroupItemDef, pressed: boolean }) => any
}

const normalizedItems = computed<ToggleGroupItemDef[]>(() =>
  props.items.map(item => typeof item === 'string' ? { label: item, value: item } : item),
)

const theme = useComponentTheme('toggleGroup', toggleGroupTheme)
const ui = computed(() => theme.value({
  orientation: props.orientation,
  size: props.size,
  color: props.color,
}))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const itemProps = computed(() => resolveSlot(ui.value.item, props.ui?.item))
const iconProps = computed(() => resolveSlot(ui.value.icon, props.ui?.icon))

// Only accurate once `modelValue` is actually bound (v-model) - same
// limitation RadioGroup's own `checked` slot prop already has in pure
// uncontrolled (defaultValue-only) use, kept consistent with it here.
function isPressed(item: ToggleGroupItemDef) {
  return props.type === 'multiple'
    ? Array.isArray(props.modelValue) && props.modelValue.includes(item.value)
    : props.modelValue === item.value
}
</script>

<template>
  <ToggleGroupRoot
    :type="(type as any)"
    :model-value="(modelValue as any)"
    :default-value="(defaultValue as any)"
    :disabled="disabled"
    :orientation="orientation"
    v-bind="rootProps"
    @update:model-value="(value) => emit('update:modelValue', value as string | string[])"
  >
    <ToggleGroupItem
      v-for="item in normalizedItems"
      :key="item.value"
      :value="item.value"
      :disabled="item.disabled"
      v-bind="itemProps"
    >
      <slot name="item" :item="item" :pressed="isPressed(item)">
        <Icon v-if="item.icon" :name="item.icon" v-bind="iconProps" />
        {{ item.label }}
      </slot>
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>
