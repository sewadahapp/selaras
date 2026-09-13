<script setup lang="ts" generic="Entry extends object, Key extends string = 'value', Multiple extends boolean = false, Forced extends boolean = false">
import type { SelectItems, SelectOption, SelectOptionGroup } from '../internal/combobox-select'
import type { AutocompleteEmits, AutocompleteProps, AutocompleteSlots, AutocompleteValue } from '../utils/autocomplete-contracts'
import type { SelectEntryGroup, SelectEntryItem, SelectModel, SelectValue } from '../utils/select-contracts'
import { useForwardProps } from 'reka-ui'
import { getCurrentInstance } from 'vue'
import ComboboxSelectBase from '../internal/ComboboxSelectBase.vue'

export type { AutocompleteEmits, AutocompleteProps, AutocompleteSlots } from '../utils/autocomplete-contracts'

const props = defineProps<AutocompleteProps<Entry, Key, Multiple, Forced>>()
const emit = defineEmits<AutocompleteEmits<Entry, Key, Multiple, Forced>>()
const slots = defineSlots<AutocompleteSlots<Entry>>()
const forwarded = useForwardProps(props)
const instance = getCurrentInstance()!

function baseProps() {
  const controlled = Object.hasOwn(instance.vnode.props ?? {}, 'modelValue') || Object.hasOwn(instance.vnode.props ?? {}, 'model-value')
  return {
    ...forwarded.value,
    items: props.items as SelectItems,
    ...(controlled ? { modelValue: props.modelValue } : {}),
  }
}
// Restore option metadata and the model contract at the erased Reka boundary.
function updateValue(value: SelectValue | SelectValue[] | undefined) {
  emit('update:modelValue', value as SelectModel<AutocompleteValue<Entry, Key, Forced>, Multiple>)
}
function itemData(item: SelectOption) {
  return item as SelectEntryItem<Entry>
}
function groupData(group: SelectOptionGroup) {
  return group as SelectEntryGroup<Entry>
}
const unscopedSlots = ['header', 'footer', 'empty', 'empty-filter', 'clear-icon', 'loading-icon', 'dropdown-icon'] as const
</script>

<template>
  <ComboboxSelectBase
    v-bind="baseProps()"
    :creatable="true"
    :searchable="true"
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
    <template v-for="slotName in unscopedSlots.filter(name => slots[name])" :key="slotName" #[slotName]>
      <slot :name="slotName" />
    </template>
  </ComboboxSelectBase>
</template>
