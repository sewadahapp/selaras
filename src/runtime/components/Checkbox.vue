<script setup lang="ts">
import type { CheckboxSlots } from '../theme/checkbox'
import type { UiProp } from '../utils/ui'
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import { computed } from 'vue'
import { useFormField } from '../composables/use-form-field'
import { checkboxTheme } from '../theme/checkbox'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Icon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  id?: string
  name?: string
  modelValue?: boolean | 'indeterminate'
  label?: string
  disabled?: boolean
  invalid?: boolean
  ui?: UiProp<CheckboxSlots>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean | 'indeterminate']
}>()

const field = useFormField()

const checkboxId = computed(() => props.id ?? field?.id)
const checkboxInvalid = computed(() => props.invalid || (field?.invalid.value ?? false))
const describedBy = computed(() => field?.describedBy.value)

const theme = useComponentTheme('checkbox', checkboxTheme)
const ui = computed(() => theme.value({ invalid: checkboxInvalid.value }))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const boxProps = computed(() => resolveSlot(ui.value.box, props.ui?.box))
const indicatorProps = computed(() => resolveSlot(ui.value.indicator, props.ui?.indicator))
const labelProps = computed(() => resolveSlot(ui.value.label, props.ui?.label))
</script>

<template>
  <label v-bind="rootProps">
    <CheckboxRoot
      :id="checkboxId"
      :model-value="modelValue"
      :name="name ?? field?.name"
      :disabled="disabled"
      :aria-invalid="checkboxInvalid || undefined"
      :aria-describedby="describedBy"
      v-bind="boxProps"
      @update:model-value="(value) => emit('update:modelValue', value)"
    >
      <CheckboxIndicator v-bind="indicatorProps">
        <Icon v-if="modelValue === 'indeterminate'" name="lucide:minus" class="size-3.5" />
        <Icon v-else name="lucide:check" class="size-3.5" />
      </CheckboxIndicator>
    </CheckboxRoot>
    <span v-if="label || $slots.default" v-bind="labelProps">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
