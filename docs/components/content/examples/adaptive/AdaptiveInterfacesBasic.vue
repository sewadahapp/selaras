<script setup lang="ts">
import type { DateValue } from '@internationalized/date'

const date = shallowRef<DateValue>()
const color = ref('#7c3aed')
const selected = ref<'Design' | 'Engineering' | 'Support'>()
const search = ref<string>()
const message = ref('Choose an action')
const actions = [[
  { label: 'Save draft', onSelect: () => { message.value = 'Draft saved' } },
  { label: 'Duplicate', onSelect: () => { message.value = 'Item duplicated' } },
]]
</script>

<template>
  <div class="flex w-full flex-wrap items-center gap-3">
    <SSelect v-model="selected" :items="['Design', 'Engineering', 'Support']" adaptive placeholder="Choose a team" class="w-56" />
    <SAutocomplete v-model="search" :items="['Jakarta', 'Bandung', 'Surabaya']" adaptive placeholder="Search cities" class="w-56" />
    <SDatePicker v-model="date" adaptive class="w-56" />
    <SColorPicker v-model="color" adaptive />
    <SDropdown :items="actions" adaptive>
      <SButton variant="outline">
        Actions
      </SButton>
    </SDropdown>
    <p class="w-full text-sm text-[var(--selaras-resolved-text-muted)]" aria-live="polite">
      {{ message }}
    </p>
  </div>
</template>
