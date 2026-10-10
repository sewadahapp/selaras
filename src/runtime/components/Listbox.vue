<script setup lang="ts" generic="Entry extends SelectEntry, Key extends string = 'value', Multiple extends boolean = false">
import type { ListboxBaseProps } from '../internal/ListboxBase.vue'
import type { ListboxEmits, ListboxItemSlot, ListboxProps, ListboxSlots } from '../utils/listbox-contracts'
import type { SelectEntry, SelectEntryGroup, SelectIdentity, SelectModel } from '../utils/select-contracts'
import { getCurrentInstance } from 'vue'
import ListboxBase from '../internal/ListboxBase.vue'

export type { ListboxEmits, ListboxProps, ListboxSlots } from '../utils/listbox-contracts'

const props = defineProps<ListboxProps<Entry, Key, Multiple>>()
const emit = defineEmits<ListboxEmits<Entry, Key, Multiple>>()
const slots = defineSlots<ListboxSlots<Entry>>()
const instance = getCurrentInstance()!
function baseProps() {
  const controlled = Object.hasOwn(instance.vnode.props ?? {}, 'modelValue') || Object.hasOwn(instance.vnode.props ?? {}, 'model-value')
  const { modelValue, ...rest } = props
  return { ...rest, ...(controlled ? { modelValue } : {}) } as unknown as ListboxBaseProps
}
const plainSlots = ['header', 'footer', 'empty', 'empty-filter'] as const
</script>

<template>
  <ListboxBase v-bind="baseProps()" @update:model-value="emit('update:modelValue', $event as SelectModel<SelectIdentity<Entry, Key>, Multiple>)" @update:search-term="emit('update:searchTerm', $event)">
    <template v-if="slots.item" #item="data">
      <slot name="item" v-bind="data as ListboxItemSlot<Entry>" />
    </template>
    <template v-if="slots.group" #group="{ group }">
      <slot name="group" :group="group as SelectEntryGroup<Entry>" />
    </template>
    <template v-for="name in plainSlots.filter(name => slots[name])" :key="name" #[name]>
      <slot :name="name" />
    </template>
  </ListboxBase>
</template>
