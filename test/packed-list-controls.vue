<script setup lang="ts">
import type { ListboxProps, SelectGroup, ThemeConfiguration, TransferListProps } from '@sewadah/selaras/types'
import SListbox from '@sewadah/selaras/components/Listbox.vue'
import STransferList from '@sewadah/selaras/components/TransferList.vue'
import { ref } from 'vue'

interface Row { id: number, title: string }
const rows: readonly Row[] = [{ id: 1, title: 'One' }]
const groups: readonly SelectGroup<Row>[] = [{ label: 'Group', items: rows }]
const literals = [{ label: 'One', value: 'one' }, { label: 'Two', value: 'two' }] as const
const selected = ref<number>()
const numbers: number[] = [0, 1]
const selectedRows = ref<Row[]>([])
const assigned = ref<number[]>([])
const strings = ref<string[]>([])
const stringItems: string[] = ['one', 'two']
const checked = ref<number[]>([])
const props: ListboxProps<Row, 'id', true> = { items: rows, valueKey: 'id', modelValue: [1], multiple: true }
const transferProps: TransferListProps<SelectGroup<Row>, 'id'> = { items: groups, valueKey: 'id', modelValue: [1], checked: [1] }
const theme = { ui: {
  listbox: { compoundVariants: [{ color: 'primary', size: 'lg', class: { item: 'font-bold' } }] },
  transferList: { compoundVariants: [{ layout: 'auto', class: { root: 'gap-6' } }] },
} } satisfies ThemeConfiguration
void props
void transferProps
void theme
</script>

<template>
  <SListbox v-model="selected" :items="numbers" @update:model-value="value => value?.toFixed()" />
  <SListbox v-model="selected" :items="rows" value-key="id" label-key="title">
    <template #item="{ item }">
      {{ item.title }} {{ item.id.toFixed() }}
    </template>
  </SListbox>
  <SListbox v-model="selectedRows" :items="rows" label-key="title" multiple />
  <SListbox :items="literals" model-value="one" />
  <SListbox :items="groups" value-key="id" label-key="title">
    <template #group="{ group }">
      {{ group.items[0]?.title }}
    </template>
  </SListbox>
  <STransferList v-model="assigned" v-model:checked="checked" :items="groups" value-key="id" label-key="title" @transfer="event => [event.items[0]?.title, event.values[0]?.toFixed()]">
    <template #item="{ item, side }">
      {{ item.title }} {{ side }}
    </template>
    <template #source-header="{ count, checkedCount }">
      {{ count.toFixed() }} {{ checkedCount.toFixed() }}
    </template>
  </STransferList>
  <STransferList v-model="selectedRows" :items="rows" label-key="title" />
  <STransferList v-model="strings" :items="stringItems" />
  <!-- @vue-expect-error values must belong to the inferred literal union -->
  <SListbox :items="literals" model-value="three" />
  <!-- @vue-expect-error single selection cannot accept an array -->
  <SListbox :items="[0, 1]" :model-value="[0]" />
  <!-- @vue-expect-error multiple selection requires an array -->
  <SListbox :items="[0, 1]" multiple :model-value="0" />
  <!-- @vue-expect-error numeric identities cannot accept string models -->
  <STransferList v-model="strings" :items="rows" value-key="id" />
  <!-- @vue-expect-error checked values use the same identity type -->
  <STransferList :items="rows" value-key="id" :checked="['one']" />
  <!-- @vue-expect-error configured identity keys must exist -->
  <STransferList :items="rows" value-key="missing" />
  <!-- @vue-expect-error transfer event identities must retain their numeric type -->
  <STransferList :items="rows" value-key="id" @transfer="event => event.values[0]?.toUpperCase()" />
</template>
