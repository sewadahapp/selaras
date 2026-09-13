<script setup lang="ts">
import SSelect from '@sewadah/selaras/components/Select.vue'
import { ref } from 'vue'

interface Row { id: number, title: string, disabled: boolean }
const rows: Row[] = [{ id: 1, title: 'One', disabled: false }]
const emptyRows: Row[] = []
const nestedRows = [{ id: 1, title: 'Parent option', items: [{ id: 2 }] }]
const options = [{ value: 1, label: 'One' }]
const groups = [{ label: 'Group', items: rows, description: 'Metadata' }]
const mixed = [rows[0]!, groups[0]!]
const literals = [{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }] as const
const readonlyGroups = [{ label: 'Group', items: literals }] as const
const optionalIds: { id?: number }[] = []
const nullableIds: { id: number | null }[] = []
const objectIds: { id: { key: number } }[] = []
const inconsistentIds: ({ id: number } | { id: boolean })[] = []
const selected = ref<number>()
const many = ref<number[]>([])
const dynamic = ref(false)
const dynamicValue = ref<number | number[]>()
const expectNumber = (value: number | undefined) => value
const expectNumbers = (value: number[]) => value
</script>

<template>
  <SSelect v-model="selected" :items="options" @update:model-value="expectNumber" />
  <SSelect v-model="selected" :items="rows" value-key="id" label-key="title" @update:model-value="expectNumber">
    <template #item="{ item }">
      {{ item.title.toUpperCase() }} {{ item.id.toFixed() }}
    </template>
    <template #value="{ selected: option }">
      {{ option?.value.toFixed() }} {{ option?.raw?.title.toUpperCase() }}
    </template>
  </SSelect>
  <SSelect v-model="selected" :items="emptyRows" value-key="id" @update:model-value="expectNumber" />
  <SSelect v-model="selected" :items="nestedRows" value-key="id" label-key="title" @update:model-value="expectNumber" />
  <SSelect v-model="selected" :items="groups" value-key="id" @update:model-value="expectNumber">
    <template #group="{ group }">
      {{ group.description.toUpperCase() }} {{ group.items[0]?.id.toFixed() }}
    </template>
  </SSelect>
  <SSelect v-model="selected" :items="mixed" value-key="id" @update:model-value="expectNumber" />
  <SSelect :items="literals" model-value="one" @update:model-value="value => value?.toUpperCase()" />
  <SSelect :items="readonlyGroups" model-value="two" />
  <SSelect v-model="many" :items="rows" value-key="id" multiple @update:model-value="expectNumbers" />
  <SSelect v-model="selected" :items="rows" value-key="id" :multiple="false" @update:model-value="expectNumber" />
  <SSelect v-model="dynamicValue" :items="rows" value-key="id" :multiple="dynamic" />
  <!-- @vue-expect-error authored identities cannot be widened by the model -->
  <SSelect :items="literals" model-value="three" />
  <!-- @vue-expect-error defaults cannot widen the authored identity union -->
  <SSelect :items="literals" default-value="three" />
  <!-- @vue-expect-error event values retain numeric identity -->
  <SSelect :items="rows" value-key="id" @update:model-value="value => value?.toUpperCase()" />
  <SSelect :items="rows" value-key="id">
    <template #item="{ item }">
      <!-- @vue-expect-error slots preserve the option record -->
      <span :title="item.missing" />
    </template>
    <template #value="{ selected: option }">
      <!-- @vue-expect-error unresolved selections do not promise a complete raw record -->
      <span :title="option?.raw.title" />
    </template>
  </SSelect>
  <!-- @vue-expect-error numeric identity rejects string models -->
  <SSelect :items="rows" value-key="id" model-value="wrong" />
  <!-- @vue-expect-error single mode rejects arrays -->
  <SSelect :items="rows" value-key="id" :model-value="[1]" />
  <!-- @vue-expect-error multiple mode rejects scalars -->
  <SSelect :items="rows" value-key="id" multiple :model-value="1" />
  <!-- @vue-expect-error keys must exist on every option -->
  <SSelect :items="rows" value-key="missing" />
  <!-- @vue-expect-error labels use literal top-level option keys -->
  <SSelect :items="rows" value-key="id" label-key="missing" />
  <!-- @vue-expect-error boolean keys are not identities -->
  <SSelect :items="rows" value-key="disabled" />
  <!-- @vue-expect-error default identity requires a value property -->
  <SSelect :items="rows" />
  <!-- @vue-expect-error optional identities are not safe -->
  <SSelect :items="optionalIds" value-key="id" />
  <!-- @vue-expect-error nullable identities are not safe -->
  <SSelect :items="nullableIds" value-key="id" />
  <!-- @vue-expect-error every union member must have a primitive identity -->
  <SSelect :items="inconsistentIds" value-key="id" />
  <!-- @vue-expect-error object identities are unsupported -->
  <SSelect :items="objectIds" value-key="id" />
  <!-- @vue-expect-error dynamic multiple can emit arrays -->
  <SSelect :items="rows" value-key="id" :multiple="dynamic" @update:model-value="expectNumber" />
</template>
