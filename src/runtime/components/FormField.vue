<script setup lang="ts">
import type { FormFieldSlots } from '../theme/form-field'
import type { UiProp } from '../utils/ui'
import { computed, useId } from 'vue'
import { provideFormField } from '../composables/use-form-field'
import { formFieldTheme } from '../theme/form-field'
import { resolveSlot, useComponentTheme } from '../utils/ui'

const props = defineProps<{
  label?: string
  name?: string
  hint?: string
  error?: string | boolean
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
  ui?: UiProp<FormFieldSlots>
}>()

const id = useId()

const invalid = computed(() => !!props.error)
const errorMessage = computed(() => typeof props.error === 'string' ? props.error : undefined)
const describedBy = computed(() => {
  if (invalid.value && errorMessage.value)
    return `${id}-error`
  if (props.hint)
    return `${id}-hint`
  return undefined
})

provideFormField({
  id,
  name: props.name,
  size: props.size,
  invalid,
  describedBy,
})

const theme = useComponentTheme('formField', formFieldTheme)
const ui = computed(() => theme.value())

const rootProps = computed(() => resolveSlot(ui.value.root, props.ui?.root))
const labelProps = computed(() => resolveSlot(ui.value.label, props.ui?.label))
const requiredProps = computed(() => resolveSlot(ui.value.required, props.ui?.required))
const containerProps = computed(() => resolveSlot(ui.value.container, props.ui?.container))
const hintProps = computed(() => resolveSlot(ui.value.hint, props.ui?.hint))
const errorProps = computed(() => resolveSlot(ui.value.error, props.ui?.error))
</script>

<template>
  <div v-bind="rootProps">
    <label v-if="label" :for="id" v-bind="labelProps">
      {{ label }}<span v-if="required" v-bind="requiredProps">*</span>
    </label>
    <div v-bind="containerProps">
      <slot :id="id" :invalid="invalid" :described-by="describedBy" />
    </div>
    <p v-if="invalid && errorMessage" :id="`${id}-error`" role="alert" v-bind="errorProps">
      {{ errorMessage }}
    </p>
    <p v-else-if="hint" :id="`${id}-hint`" v-bind="hintProps">
      {{ hint }}
    </p>
  </div>
</template>
