<script setup lang="ts" generic="Entry extends object, Key extends string = 'value', Multiple extends boolean = false">
import type { ResolvedOption, SelectItems, SelectOption, SelectOptionGroup } from '../internal/combobox-select'
import type { SelectEmits, SelectEntryGroup, SelectEntryItem, SelectIdentity, SelectModel, SelectProps, SelectResolvedOption, SelectSlots, SelectValue } from '../utils/select-contracts'
import { useForwardProps } from 'reka-ui'
import { getCurrentInstance } from 'vue'
import ComboboxSelectBase from '../internal/ComboboxSelectBase.vue'

export type { SelectEmits, SelectProps, SelectSlots } from '../utils/select-contracts'

const props = withDefaults(defineProps<SelectProps<Entry, Key, Multiple>>(), { portal: undefined })
const emit = defineEmits<SelectEmits<Entry, Key, Multiple>>()
const slots = defineSlots<SelectSlots<Entry, Key>>()
const forwarded = useForwardProps(props)
const instance = getCurrentInstance()!

// The shared Reka implementation erases option metadata. These adapters restore
// the public contract at that boundary without copying consumer-owned arrays.
function baseProps() {
  const controlled = Object.hasOwn(instance.vnode.props ?? {}, 'modelValue') || Object.hasOwn(instance.vnode.props ?? {}, 'model-value')
  return {
    ...forwarded.value,
    items: props.items as SelectItems,
    // useForwardProps omits undefined values; presence still owns selection.
    ...(controlled ? { modelValue: props.modelValue } : {}),
  }
}
function updateValue(value: SelectValue | SelectValue[] | undefined) {
  emit('update:modelValue', value as SelectModel<SelectIdentity<Entry, Key>, Multiple>)
}
function itemData(item: SelectOption) {
  return item as SelectEntryItem<Entry>
}
function groupData(group: SelectOptionGroup) {
  return group as SelectEntryGroup<Entry>
}
function selectedData(selected: ResolvedOption | undefined): SelectResolvedOption<Entry, Key> | undefined {
  return selected && {
    ...selected,
    value: selected.value as SelectIdentity<Entry, Key>,
    raw: selected.raw === undefined ? undefined : itemData(selected.raw),
  }
}
const unscopedSlots = ['header', 'footer', 'empty', 'empty-filter', 'filter-icon', 'clear-icon', 'loading-icon', 'dropdown-icon'] as const
</script>

<template>
  <ComboboxSelectBase
    v-bind="baseProps()"
    :creatable="false"
    @update:open="emit('update:open', $event)"
    @update:model-value="updateValue"
    @update:search-term="emit('update:searchTerm', $event)"
  >
    <template v-if="slots.item" #item="{ item }">
      <slot name="item" :item="itemData(item)" />
    </template>
    <template v-if="slots.group" #group="{ group }">
      <slot name="group" :group="groupData(group)" />
    </template>
    <template v-if="slots.value" #value="{ selected }">
      <slot name="value" :selected="selectedData(selected)" />
    </template>
    <template v-for="slotName in unscopedSlots.filter(name => slots[name])" :key="slotName" #[slotName]>
      <slot :name="slotName" />
    </template>
  </ComboboxSelectBase>
</template>
