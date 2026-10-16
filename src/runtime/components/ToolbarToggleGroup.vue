<script setup lang="ts">
import type { ToolbarToggleGroupThemeSlots } from '../theme/toolbar-toggle-group'
import type { ColorRole } from '../utils/color-registry'
import type { UiProp } from '../utils/ui'
import type { ToggleGroupItemDef } from './ToggleGroup.vue'
import { ToolbarToggleGroup, ToolbarToggleItem } from 'reka-ui'
import { computed, inject } from 'vue'
import { toolbarToggleGroupTheme } from '../theme/toolbar-toggle-group'
import { TOOLBAR_CONTEXT } from '../utils/toolbar'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Button from './Button.vue'
import Icon from './Icon.vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<ToolbarToggleGroupProps>(), { type: 'single' })
const emit = defineEmits<ToolbarToggleGroupEmits>()
defineSlots<ToolbarToggleGroupSlots>()

export interface ToolbarToggleGroupProps {
  items: (string | ToggleGroupItemDef)[]
  type?: 'single' | 'multiple'
  modelValue?: string | string[]
  defaultValue?: string | string[]
  disabled?: boolean
  iconOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: ColorRole
  ui?: UiProp<ToolbarToggleGroupThemeSlots>
}
export interface ToolbarToggleGroupEmits { 'update:modelValue': [value: string | string[]] }
export interface ToolbarToggleGroupSlots { item?: (props: { item: ToggleGroupItemDef }) => any }

const toolbar = inject(TOOLBAR_CONTEXT, undefined)
const disabled = computed(() => props.disabled || toolbar?.value.disabled)
const size = computed(() => props.size ?? toolbar?.value.size ?? 'sm')
const color = computed(() => props.color ?? toolbar?.value.color ?? 'primary')
const items = computed(() => props.items.map(item => typeof item === 'string' ? { value: item, label: item } : item))
const theme = useComponentTheme('toolbarToggleGroup', toolbarToggleGroupTheme)
const ui = computed(() => theme.value({ size: size.value, orientation: toolbar?.value.orientation }))
const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
</script>

<template>
  <ToolbarToggleGroup :type="(type as any)" :model-value="(modelValue as any)" :default-value="(defaultValue as any)" :disabled="disabled" v-bind="rootProps" @update:model-value="emit('update:modelValue', $event as string | string[])">
    <ToolbarToggleItem v-for="item in items" :key="item.value" as-child :value="item.value" :disabled="disabled || item.disabled">
      <Button :size="size" :color="color" variant="ghost" :disabled="disabled || item.disabled" :square="iconOnly" :aria-label="iconOnly ? item.label : undefined" :title="iconOnly ? item.label : undefined" :ui="{ base: resolveSlot(ui.item, props.ui?.item) }">
        <slot name="item" :item="item">
          <Icon v-if="item.icon" :name="item.icon" v-bind="resolveSlot(ui.icon, props.ui?.icon)" />
          <span v-if="!iconOnly">{{ item.label }}</span>
        </slot>
      </Button>
    </ToolbarToggleItem>
  </ToolbarToggleGroup>
</template>
