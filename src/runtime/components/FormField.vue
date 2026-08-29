<script setup lang="ts">
import type { FormFieldSlots } from '../theme/form-field'
import type { UiProp } from '../utils/ui'
import { computed, useId } from 'vue'
import { provideFormField } from '../composables/use-form-field'
import { formFieldTheme } from '../theme/form-field'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  label?: string
  name?: string
  /** A second, muted line under the label, before the control - for context the user should read before reaching it (e.g. "We'll use this to send your receipt"). Distinct from `hint`, which sits below the control instead. */
  description?: string
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

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const labelProps = computed(() => resolveSlot(ui.value.label, props.ui?.label))
const requiredProps = computed(() => resolveSlot(ui.value.required, props.ui?.required))
const descriptionProps = computed(() => resolveSlot(ui.value.description, props.ui?.description))
const containerProps = computed(() => resolveSlot(ui.value.container, props.ui?.container))
const hintProps = computed(() => resolveSlot(ui.value.hint, props.ui?.hint))
const errorProps = computed(() => resolveSlot(ui.value.error, props.ui?.error))
</script>

<template>
  <div v-bind="rootProps">
    <label v-if="label" :for="id" v-bind="labelProps">
      {{ label }}<span v-if="required" v-bind="requiredProps">*</span>
    </label>
    <p v-if="description" v-bind="descriptionProps">
      <slot name="description">
        {{ description }}
      </slot>
    </p>
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
