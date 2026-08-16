<script setup lang="ts">
import type { SwitchSlots } from '../theme/switch'
import type { UiProp } from '../utils/ui'
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { computed } from 'vue'
import { switchTheme } from '../theme/switch'
import { resolveSlot, useComponentTheme } from '../utils/ui'

const props = defineProps<{
  modelValue?: boolean
  label?: string
  disabled?: boolean
  ui?: UiProp<SwitchSlots>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const theme = useComponentTheme('switch', switchTheme)
const ui = computed(() => theme.value())

const rootProps = computed(() => resolveSlot(ui.value.root, props.ui?.root))
const trackProps = computed(() => resolveSlot(ui.value.track, props.ui?.track))
const thumbProps = computed(() => resolveSlot(ui.value.thumb, props.ui?.thumb))
const labelProps = computed(() => resolveSlot(ui.value.label, props.ui?.label))
</script>

<template>
  <label v-bind="rootProps">
    <SwitchRoot
      :model-value="modelValue"
      :disabled="disabled"
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
