<script setup lang="ts">
import type { FieldAdornmentSlotProps } from '@sewadah/selaras/types'
import SAutocomplete from '@sewadah/selaras/components/Autocomplete.vue'
import SInput from '@sewadah/selaras/components/Input.vue'
import SSelect from '@sewadah/selaras/components/Select.vue'
import STextarea from '@sewadah/selaras/components/Textarea.vue'

const checkScope = (disabled: boolean, size: FieldAdornmentSlotProps['size'], buttonSize: FieldAdornmentSlotProps['buttonSize']) => `${disabled}:${size}:${buttonSize}`
</script>

<template>
  <SInput>
    <template #leading="{ disabled, size, buttonSize }">
      {{ checkScope(disabled, size, buttonSize) }}
    </template>
    <template #trailing="{ disabled, size, buttonSize }">
      <button type="button" :disabled="disabled">
        {{ checkScope(disabled, size, buttonSize) }}
      </button>
    </template>
  </SInput>
  <STextarea>
    <template #leading="{ disabled, size, buttonSize }">
      {{ checkScope(disabled, size, buttonSize) }}
    </template>
    <template #trailing="{ disabled, size, buttonSize }">
      {{ checkScope(disabled, size, buttonSize) }}
    </template>
  </STextarea>
  <SSelect :items="[1, 2]">
    <template #leading="{ disabled, size, buttonSize }">
      {{ checkScope(disabled, size, buttonSize) }}
    </template>
    <template #trailing="{ disabled, size, buttonSize }">
      {{ checkScope(disabled, size, buttonSize) }}
    </template>
  </SSelect>
  <SAutocomplete :items="['One', 'Two']">
    <template #leading="{ disabled, size, buttonSize }">
      {{ checkScope(disabled, size, buttonSize) }}
    </template>
    <template #trailing="{ disabled, size, buttonSize }">
      {{ checkScope(disabled, size, buttonSize) }}
    </template>
  </SAutocomplete>
  <SInput>
    <!-- @vue-expect-error field slots do not expose a selection -->
    <template #trailing="{ selected }">
      {{ selected }}
    </template>
  </SInput>
  <STextarea>
    <!-- @vue-expect-error field slots do not expose a selection -->
    <template #leading="{ selected }">
      {{ selected }}
    </template>
  </STextarea>
  <SSelect :items="[1, 2]">
    <!-- @vue-expect-error field slots do not expose an option -->
    <template #trailing="{ item }">
      {{ item }}
    </template>
  </SSelect>
  <SAutocomplete :items="[1, 2]">
    <!-- @vue-expect-error field slots do not expose an option -->
    <template #leading="{ item }">
      {{ item }}
    </template>
  </SAutocomplete>
</template>
