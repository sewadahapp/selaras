<script setup lang="ts">
import type { SwitchSlots } from '../theme/switch'
import type { UiProp } from '../utils/ui'
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { computed } from 'vue'
import { useFormField } from '../composables/use-form-field'
import { switchTheme } from '../theme/switch'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  id?: string
  name?: string
  modelValue?: boolean
  label?: string
  disabled?: boolean
  invalid?: boolean
  ui?: UiProp<SwitchSlots>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const field = useFormField()

const switchId = computed(() => props.id ?? field?.id)
const switchInvalid = computed(() => props.invalid || (field?.invalid.value ?? false))
const describedBy = computed(() => field?.describedBy.value)

const theme = useComponentTheme('switch', switchTheme)
const ui = computed(() => theme.value({ invalid: switchInvalid.value }))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const trackProps = computed(() => resolveSlot(ui.value.track, props.ui?.track))
const thumbProps = computed(() => resolveSlot(ui.value.thumb, props.ui?.thumb))
const labelProps = computed(() => resolveSlot(ui.value.label, props.ui?.label))
</script>

<template>
  <label v-bind="rootProps">
    <SwitchRoot
      :id="switchId"
      :model-value="modelValue"
      :name="name ?? field?.name"
      :disabled="disabled"
      :aria-invalid="switchInvalid || undefined"
      :aria-describedby="describedBy"
      v-bind="trackProps"
      @update:model-value="(value) => emit('update:modelValue', value)"
    >
      <SwitchThumb v-bind="thumbProps" />
    </SwitchRoot>
    <span v-if="label || $slots.default" v-bind="labelProps">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
