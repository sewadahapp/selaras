<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { TabsSlots } from '../theme/tabs'
import type { UiProp } from '../utils/ui'
import { TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { computed } from 'vue'
import { tabsTheme } from '../theme/tabs'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Icon from './Icon.vue'

type TabsVariants = VariantProps<typeof tabsTheme>

export interface TabItem {
  label: string
  value?: string
  disabled?: boolean
  icon?: string
}

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  items: TabItem[]
  variant?: TabsVariants['variant']
  defaultValue?: string
  modelValue?: string
  ui?: UiProp<TabsSlots>
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const theme = useComponentTheme('tabs', tabsTheme)
const ui = computed(() => theme.value({ variant: props.variant }))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const listProps = computed(() => resolveSlot(ui.value.list, props.ui?.list))
const triggerProps = computed(() => resolveSlot(ui.value.trigger, props.ui?.trigger))
const iconProps = computed(() => resolveSlot(ui.value.icon, props.ui?.icon))
const indicatorProps = computed(() => resolveSlot(ui.value.indicator, props.ui?.indicator))
const contentProps = computed(() => resolveSlot(ui.value.content, props.ui?.content))

function itemValue(item: TabItem, index: number) {
  return item.value ?? String(index)
}
</script>

<template>
  <TabsRoot
    :default-value="defaultValue"
    :model-value="modelValue"
    v-bind="rootProps"
    @update:model-value="(value) => $emit('update:modelValue', value as string)"
  >
    <TabsList v-bind="listProps">
      <TabsTrigger
        v-for="(item, index) in items"
        :key="itemValue(item, index)"
        :value="itemValue(item, index)"
        :disabled="item.disabled"
        v-bind="triggerProps"
      >
        <Icon v-if="item.icon" :name="item.icon" v-bind="iconProps" />
        <slot name="label" :item="item" :index="index">
          {{ item.label }}
        </slot>
      </TabsTrigger>
      <TabsIndicator aria-hidden="true" v-bind="indicatorProps" />
    </TabsList>
    <TabsContent
      v-for="(item, index) in items"
      :key="itemValue(item, index)"
      :value="itemValue(item, index)"
      v-bind="contentProps"
    >
      <slot :name="itemValue(item, index)" />
    </TabsContent>
  </TabsRoot>
</template>
