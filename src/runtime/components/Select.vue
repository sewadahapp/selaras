<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { SelectSlots } from '../theme/select'
import type { UiProp } from '../utils/ui'
import { SelectContent, SelectIcon, SelectItem, SelectItemIndicator, SelectItemText, SelectPortal, SelectRoot, SelectTrigger, SelectValue, SelectViewport } from 'reka-ui'
import { computed } from 'vue'
import { selectTheme } from '../theme/select'
import { resolveSlot, useComponentTheme } from '../utils/ui'

export interface SelectItemOption {
  label: string
  value: string
  disabled?: boolean
}

type SelectVariants = VariantProps<typeof selectTheme>

const props = defineProps<{
  items: SelectItemOption[]
  modelValue?: string
  placeholder?: string
  size?: SelectVariants['size']
  disabled?: boolean
  ui?: UiProp<SelectSlots>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const theme = useComponentTheme('select', selectTheme)

const ui = computed(() => theme.value({ size: props.size }))

const triggerProps = computed(() => resolveSlot(ui.value.trigger, props.ui?.trigger))
const valueProps = computed(() => resolveSlot(ui.value.value, props.ui?.value))
const iconProps = computed(() => resolveSlot(ui.value.icon, props.ui?.icon))
const contentProps = computed(() => resolveSlot(ui.value.content, props.ui?.content))
const viewportProps = computed(() => resolveSlot(ui.value.viewport, props.ui?.viewport))
const itemProps = computed(() => resolveSlot(ui.value.item, props.ui?.item))
const itemIndicatorProps = computed(() => resolveSlot(ui.value.itemIndicator, props.ui?.itemIndicator))
</script>

<template>
  <SelectRoot :model-value="modelValue" :disabled="disabled" @update:model-value="(value) => emit('update:modelValue', value as string)">
    <SelectTrigger v-bind="triggerProps">
      <SelectValue v-bind="valueProps" :placeholder="placeholder" />
      <SelectIcon v-bind="iconProps">
        <Icon name="lucide:chevron-down" class="size-4" />
      </SelectIcon>
    </SelectTrigger>
    <SelectPortal>
      <SelectContent position="popper" :side-offset="6" v-bind="contentProps">
        <SelectViewport v-bind="viewportProps">
          <SelectItem
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :disabled="item.disabled"
            v-bind="itemProps"
          >
            <SelectItemText>{{ item.label }}</SelectItemText>
            <SelectItemIndicator v-bind="itemIndicatorProps">
              <Icon name="lucide:check" class="size-4" />
            </SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
