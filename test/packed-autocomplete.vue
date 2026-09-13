<script setup lang="ts">
import type { AutocompleteProps, SelectGroup } from '@sewadah/selaras/types'
import SAutocomplete from '@sewadah/selaras/components/Autocomplete.vue'
import { ref } from 'vue'

interface Row { id: number, title: string, disabled: boolean }
const rows: Row[] = [{ id: 1, title: 'One', disabled: false }]
const emptyRows: Row[] = []
const authoredEntries: AutocompleteProps<Row | SelectGroup<Row>, 'id'>['items'] = [{ label: 'Authored group', items: rows }]
const options = [{ value: 1, label: 'One' }]
const groups = [{ label: 'Group', items: rows, description: 'Metadata' }]
const mixed = [rows[0]!, groups[0]!]
const literals = [{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }] as const
const readonlyGroups = [{ label: 'Group', items: literals }] as const
const optionalIds: { id?: number }[] = []
const nullableIds: { id: number | null }[] = []
const inconsistentIds: ({ id: number } | { id: boolean })[] = []
const selected = ref<number>()
const created = ref<number | string>()
const many = ref<(number | string)[]>([])
const forcedMany = ref<number[]>([])
const dynamic = ref(false)
const dynamicValue = ref<number | string | (number | string)[]>()
const expectNumber = (value: number | undefined) => value
const expectCreated = (value: number | string | undefined) => value
const expectNumbers = (value: number[]) => value
</script>

<template>
  <SAutocomplete v-model="created" :items="options" @update:model-value="expectCreated" />
  <SAutocomplete v-model="created" :items="rows" value-key="id" label-key="title" @update:model-value="expectCreated">
    <template #item="{ item }">
      {{ item.title.toUpperCase() }} {{ item.id.toFixed() }}
    </template>
  </SAutocomplete>
  <SAutocomplete v-model="created" :items="emptyRows" value-key="id" @update:model-value="expectCreated" />
  <SAutocomplete v-model="created" :items="authoredEntries" value-key="id" @update:model-value="expectCreated" />
  <SAutocomplete v-model="created" :items="groups" value-key="id" @update:model-value="expectCreated">
    <template #group="{ group }">
      {{ group.description.toUpperCase() }} {{ group.items[0]?.id.toFixed() }}
    </template>
  </SAutocomplete>
  <SAutocomplete v-model="created" :items="mixed" value-key="id" />
  <SAutocomplete :items="literals" model-value="created text" default-value="other text" />
  <SAutocomplete :items="readonlyGroups" model-value="two" force-selection />
  <SAutocomplete v-model="many" :items="rows" value-key="id" multiple />
  <SAutocomplete v-model="selected" :items="rows" value-key="id" force-selection @update:model-value="expectNumber" />
  <SAutocomplete v-model="forcedMany" :items="rows" value-key="id" force-selection multiple @update:model-value="expectNumbers" />
  <SAutocomplete v-model="created" :items="rows" value-key="id" :force-selection="dynamic" @update:model-value="expectCreated" />
  <SAutocomplete v-model="dynamicValue" :items="rows" value-key="id" :multiple="dynamic" :force-selection="dynamic" />
  <!-- @vue-expect-error creatable numeric suggestions can emit strings -->
  <SAutocomplete :items="rows" value-key="id" @update:model-value="expectNumber" />
  <!-- @vue-expect-error a dynamic forceSelection still allows created strings -->
  <SAutocomplete :items="rows" value-key="id" :force-selection="dynamic" @update:model-value="expectNumber" />
  <!-- @vue-expect-error forced numeric identities reject string models -->
  <SAutocomplete :items="rows" value-key="id" force-selection model-value="created text" />
  <!-- @vue-expect-error defaults do not widen forced literal identities -->
  <SAutocomplete :items="literals" force-selection default-value="three" />
  <!-- @vue-expect-error single mode rejects arrays -->
  <SAutocomplete :items="rows" value-key="id" :model-value="[1]" />
  <!-- @vue-expect-error multiple mode rejects scalars -->
  <SAutocomplete :items="rows" value-key="id" multiple :model-value="1" />
  <!-- @vue-expect-error forced multiple mode rejects created strings -->
  <SAutocomplete :items="rows" value-key="id" force-selection multiple :model-value="[1, 'created text']" />
  <!-- @vue-expect-error keys must exist -->
  <SAutocomplete :items="rows" value-key="missing" />
  <!-- @vue-expect-error boolean fields are not identities -->
  <SAutocomplete :items="rows" value-key="disabled" />
  <!-- @vue-expect-error default identity requires value on every option -->
  <SAutocomplete :items="rows" />
  <!-- @vue-expect-error optional identities are not safe -->
  <SAutocomplete :items="optionalIds" value-key="id" />
  <!-- @vue-expect-error nullable identities are not safe -->
  <SAutocomplete :items="nullableIds" value-key="id" />
  <!-- @vue-expect-error every union member needs a primitive identity -->
  <SAutocomplete :items="inconsistentIds" value-key="id" />
  <SAutocomplete :items="rows" value-key="id">
    <template #item="{ item }">
      <!-- @vue-expect-error item slots retain option metadata -->
      <span :title="item.missing" />
    </template>
    <!-- @vue-expect-error Autocomplete has no rendered value slot -->
    <template #value>
      <span />
    </template>
  </SAutocomplete>
</template>
