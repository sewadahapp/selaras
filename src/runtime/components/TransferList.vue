<script setup lang="ts" generic="Entry extends SelectEntry, Key extends string = 'value'">
import type { TransferListBaseProps } from '../internal/TransferListBase.vue'
import type { SelectEntry } from '../utils/select-contracts'
import type { TransferListEmits, TransferListProps, TransferListSlots } from '../utils/transfer-list-contracts'
import { getCurrentInstance } from 'vue'
import TransferListBase from '../internal/TransferListBase.vue'

export type { TransferDirection, TransferListEmits, TransferListProps, TransferListSlots, TransferSide } from '../utils/transfer-list-contracts'

const props = withDefaults(defineProps<TransferListProps<Entry, Key>>(), { showSelectAll: true })
const emit = defineEmits<TransferListEmits<Entry, Key>>()
const slots = defineSlots<TransferListSlots<Entry>>()
const instance = getCurrentInstance()!
function baseProps() {
  const raw = instance.vnode.props ?? {}
  const { modelValue, checked, ...rest } = props
  return {
    ...rest,
    ...(Object.hasOwn(raw, 'modelValue') || Object.hasOwn(raw, 'model-value') ? { modelValue } : {}),
    ...(Object.hasOwn(raw, 'checked') ? { checked } : {}),
  } as unknown as TransferListBaseProps
}
</script>

<template>
  <TransferListBase
    v-bind="baseProps()"
    @update:model-value="emit('update:modelValue', $event as TransferListEmits<Entry, Key>['update:modelValue'][0])"
    @update:checked="emit('update:checked', $event as TransferListEmits<Entry, Key>['update:checked'][0])"
    @update:source-search-term="emit('update:sourceSearchTerm', $event)"
    @update:target-search-term="emit('update:targetSearchTerm', $event)"
    @transfer="emit('transfer', $event as TransferListEmits<Entry, Key>['transfer'][0])"
  >
    <template v-if="slots.item" #item="data">
      <slot name="item" v-bind="data as Parameters<NonNullable<TransferListSlots<Entry>['item']>>[0]" />
    </template>
    <template v-for="name in (['source-header', 'target-header'] as const).filter(name => slots[name])" :key="name" #[name]="data">
      <slot :name="name" v-bind="data" />
    </template>
    <template v-for="name in (['source-footer', 'target-footer'] as const).filter(name => slots[name])" :key="name" #[name]>
      <slot :name="name" />
    </template>
    <template v-for="name in (['empty', 'empty-filter'] as const).filter(name => slots[name])" :key="name" #[name]="data">
      <slot :name="name" v-bind="data" />
    </template>
  </TransferListBase>
</template>
