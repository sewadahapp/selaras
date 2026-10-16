<script setup lang="ts">
import { CalendarDate, Time } from '@internationalized/date'

const sizes = ['sm', 'md', 'lg'] as const
const items = ['One', 'Two', 'Three']
const date = new CalendarDate(2026, 10, 16)
const range = { start: date, end: date.add({ days: 3 }) }
const time = new Time(13, 30)
const wrappingItems = ['Product design', 'Engineering', 'Customer support']
</script>

<template>
  <SApp>
    <main style="padding: 16px; display: grid; gap: 24px">
      <section v-for="size in sizes" :key="size" :data-size="size" style="display: grid; gap: 12px; max-width: 560px">
        <SButton :size="size" data-control="button">
          Save
        </SButton>
        <SInput :size="size" model-value="One" clearable :ui="{ base: { 'data-control': 'input' } }" />
        <SInputNumber :size="size" :default-value="1" data-control="number" />
        <SInputNumber :size="size" :default-value="1" orientation="vertical" data-control="number-vertical" />
        <SPinInput :size="size" :length="3" :ui="{ input: { 'data-control': 'pin' } }" aria-label="Verification code" />
        <SColorPicker :size="size" default-value="#fd5e53" :ui="{ trigger: { 'data-control': 'color' } }" />

        <SSelect :size="size" :items="items" :ui="{ trigger: { 'data-control': 'select' } }" />
        <SSelect :size="size" :items="items" default-value="One" clearable :ui="{ trigger: { 'data-control': 'select-clear' } }" />
        <SSelect :size="size" :items="items" searchable :ui="{ trigger: { 'data-control': 'select-search' } }" />
        <SSelect :size="size" :items="items" :default-value="['One']" multiple display-mode="chip" clearable :ui="{ trigger: { 'data-control': 'select-chips' } }" />
        <SSelect :size="size" :items="items" :default-value="['One']" multiple clearable :ui="{ trigger: { 'data-control': 'select-comma' } }" />
        <SSelect :size="size" :items="items" default-value="One" clearable loading :ui="{ trigger: { 'data-control': 'select-loading' } }" />

        <SAutocomplete :size="size" :items="items" :ui="{ trigger: { 'data-control': 'autocomplete' } }" />
        <SAutocomplete :size="size" :items="items" default-value="One" clearable dropdown :ui="{ trigger: { 'data-control': 'autocomplete-clear' } }" />
        <SAutocomplete :size="size" :items="items" :default-value="['One']" multiple display-mode="chip" clearable dropdown :ui="{ trigger: { 'data-control': 'autocomplete-chips' } }" />
        <SAutocomplete :size="size" :items="items" :default-value="['One']" multiple clearable dropdown :ui="{ trigger: { 'data-control': 'autocomplete-comma' } }" />
        <SAutocomplete :size="size" :items="items" default-value="One" clearable loading :ui="{ trigger: { 'data-control': 'autocomplete-loading' } }" />
        <SAutocomplete :size="size" :items="items" adaptive :ui="{ trigger: { 'data-control': 'autocomplete-adaptive' } }" />

        <template v-for="mode in ['field', 'button'] as const" :key="mode">
          <div :data-picker="`date-${mode}`">
            <SDatePicker :size="size" :trigger-mode="mode" :default-value="date" locale="id-ID" clearable />
          </div>
          <div :data-picker="`range-${mode}`">
            <SDatePicker :size="size" :trigger-mode="mode" :default-value="range" locale="id-ID" range clearable />
          </div>
          <div :data-picker="`time-${mode}`">
            <SDatePicker :size="size" :trigger-mode="mode" :default-value="time" locale="id-ID" time-only clearable />
          </div>
        </template>
      </section>

      <div data-wrapping="select" style="width: 144px">
        <SSelect :items="wrappingItems" :default-value="wrappingItems" multiple display-mode="chip" />
      </div>
      <div data-wrapping="autocomplete" style="width: 144px">
        <SAutocomplete :items="wrappingItems" :default-value="wrappingItems" multiple display-mode="chip" />
      </div>
    </main>
  </SApp>
</template>
