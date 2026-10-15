<script setup lang="ts">
import type { EditableActivationMode, EditableProps, EditableSlotProps, EditableSubmitMode, ThemeConfiguration } from '@sewadah/selaras/types'
import SEditable from '@sewadah/selaras/components/Editable.vue'
import { ref, useTemplateRef } from 'vue'

const value = ref('Published title')
const editing = ref(false)
const editable = useTemplateRef('editable')
const mode: EditableActivationMode = 'none'
const submitMode: EditableSubmitMode = 'none'
const props: EditableProps = { activationMode: mode, submitMode, controls: false, color: 'primary', placeholder: { preview: 'Title', edit: 'Enter title' } }
const theme: ThemeConfiguration = {
  defaults: { editable: { color: 'primary', size: 'lg' } },
  ui: { editable: { slots: { preview: 'font-bold' }, compoundVariants: [{ multiline: true, class: { input: 'resize-none' } }] } },
}
const check = (scope: EditableSlotProps) => scope.draft
const invalid: EditableProps = {
  // @ts-expect-error activation modes are finite
  activationMode: 'click',
}
void theme
void invalid
</script>

<template>
  <SEditable ref="editable" v-model="value" v-model:editing="editing" v-bind="props" @submit="next => next.toUpperCase()" @cancel="next => next.toUpperCase()">
    <template #preview="scope">
      {{ check(scope) }}
    </template>
    <template #controls="scope">
      <button type="button" :disabled="scope.disabled" @click="scope.edit()">
        Edit
      </button>
      <button type="button" @click="editable?.submit()">
        Save
      </button>
      <button type="button" @click="editable?.cancel()">
        Cancel
      </button>
    </template>
  </SEditable>
  <!-- @vue-expect-error Editable is a string editor -->
  <SEditable :model-value="123" />
  <SEditable>
    <!-- @vue-expect-error no option selection in editable slots -->
    <template #preview="{ selected }">
      {{ selected }}
    </template>
  </SEditable>
</template>
