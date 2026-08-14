<script setup lang="ts">
import type { TabsSlots } from '../theme/tabs'
import type { UiProp } from '../utils/ui'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { computed } from 'vue'
import { tabsTheme } from '../theme/tabs'
import { resolveSlot, useComponentTheme } from '../utils/ui'

export interface TabItem {
  label: string
  value?: string
  disabled?: boolean
}

const props = defineProps<{
  items: TabItem[]
  modelValue?: string
  ui?: UiProp<TabsSlots>
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const theme = useComponentTheme('tabs', tabsTheme)
const ui = computed(() => theme.value())

const rootProps = computed(() => resolveSlot(ui.value.root, props.ui?.root))
const listProps = computed(() => resolveSlot(ui.value.list, props.ui?.list))
const triggerProps = computed(() => resolveSlot(ui.value.trigger, props.ui?.trigger))
const contentProps = computed(() => resolveSlot(ui.value.content, props.ui?.content))

function itemValue(item: TabItem, index: number) {
  return item.value ?? String(index)
}
</script>

<template>
  <TabsRoot
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
        {{ item.label }}
      </TabsTrigger>
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
