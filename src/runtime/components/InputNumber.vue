<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { InputNumberSlots } from '../theme/input-number'
import type { UiProp } from '../utils/ui'
import { computed, ref } from 'vue'
import { useFormField } from '../composables/use-form-field'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { inputNumberTheme } from '../theme/input-number'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Button from './Button.vue'
import Icon from './Icon.vue'

type InputNumberVariants = VariantProps<typeof inputNumberTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  id?: string
  name?: string
  modelValue?: number
  min?: number
  max?: number
  step?: number
  /** When both `min` and `max` are set, stepping (click, arrow keys, or typing an out-of-range value) cycles past the boundary instead of clamping to it - e.g. an hour-of-day stepper going 12 -> 1, not getting stuck at 12. Default false (clamp), matching a plain bounded quantity. */
  wrap?: boolean
  placeholder?: string
  /** Passed straight to `Intl.NumberFormat` for the read-only (blurred) display - e.g. `{ minimumIntegerDigits: 2 }` to zero-pad. Not applied while editing, so typing never fights reformatted text. */
  formatOptions?: Intl.NumberFormatOptions
  locale?: string
  disabled?: boolean
  invalid?: boolean
  size?: InputNumberVariants['size']
  /** 'horizontal' (default) flanks the input with two full-height buttons; 'vertical' replaces them with a single compact up/down pair pinned to the end edge. */
  orientation?: InputNumberVariants['orientation']
  ui?: UiProp<InputNumberSlots>
}>(), {
  step: 1,
  orientation: 'horizontal',
})

const emit = defineEmits<{
  'update:modelValue': [value: number | undefined]
}>()

const field = useFormField()

const inputId = computed(() => props.id ?? field?.id)
const inputInvalid = computed(() => props.invalid || (field?.invalid.value ?? false))
const describedBy = computed(() => field?.describedBy.value)
const effectiveSize = computed(() => props.size ?? field?.size ?? 'md')
// One step down from the field itself - matches Input's own clear-button
// sizing (see Input.vue's clearSize) so the +/- buttons don't read as
// oversized crammed against the number.
const buttonSize = computed(() => ({ sm: 'sm', md: 'sm', lg: 'md' } as const)[effectiveSize.value])

const isFocused = ref(false)
// The raw, editable string while focused - kept separate from modelValue so
// a mid-edit state ("1", "-", "") isn't forced through parsing/clamping on
// every keystroke, only committed (parsed + clamped) on blur/Enter.
const editingValue = ref('')

const numberFormatter = computed(() => props.formatOptions ? new Intl.NumberFormat(props.locale ?? 'en-US', props.formatOptions) : undefined)
const displayValue = computed(() => {
  if (isFocused.value)
    return editingValue.value
  if (props.modelValue === undefined)
    return ''
  return numberFormatter.value ? numberFormatter.value.format(props.modelValue) : String(props.modelValue)
})

function clamp(value: number) {
  if (props.wrap && props.min !== undefined && props.max !== undefined) {
    const size = props.max - props.min + 1
    return props.min + (((value - props.min) % size) + size) % size
  }
  let result = value
  if (props.min !== undefined)
    result = Math.max(props.min, result)
  if (props.max !== undefined)
    result = Math.min(props.max, result)
  return result
}

function commit(value: number | undefined) {
  emit('update:modelValue', value === undefined ? undefined : clamp(value))
}

function focus() {
  isFocused.value = true
  editingValue.value = props.modelValue === undefined ? '' : String(props.modelValue)
}

function blur() {
  isFocused.value = false
  const parsed = editingValue.value.trim() === '' ? undefined : Number(editingValue.value)
  commit(parsed === undefined || Number.isNaN(parsed) ? undefined : parsed)
}

function input(event: Event) {
  editingValue.value = (event.target as HTMLInputElement).value
}

function keydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    (event.target as HTMLInputElement).blur()
    return
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    stepBy(props.step)
  }
  else if (event.key === 'ArrowDown') {
    event.preventDefault()
    stepBy(-props.step)
  }
}

function stepBy(delta: number) {
  const base = props.modelValue ?? props.min ?? 0
  commit(base + delta)
  if (isFocused.value)
    editingValue.value = String(clamp(base + delta))
}

const canDecrement = computed(() => !props.disabled && (props.wrap || props.min === undefined || props.modelValue === undefined || props.modelValue > props.min))
const canIncrement = computed(() => !props.disabled && (props.wrap || props.max === undefined || props.modelValue === undefined || props.modelValue < props.max))

const icons = useIcons()
const messages = useMessages()
const theme = useComponentTheme('inputNumber', inputNumberTheme)
const ui = computed(() => theme.value({ size: effectiveSize.value, invalid: inputInvalid.value, orientation: props.orientation }))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const inputProps = computed(() => resolveSlot(ui.value.input, props.ui?.input))
const stepperProps = computed(() => resolveSlot(ui.value.stepper, props.ui?.stepper))
const stepperButtonProps = computed(() => resolveSlot(ui.value.stepperButton, props.ui?.stepperButton))

// Plain :ui overrides on nested Buttons, not independent theme slots -
// Button already owns variant/size/hover/focus (see DatePicker.vue's
// navButtonUi for the same established pattern).
const stepButtonUi = { base: 'shrink-0' }
</script>

<template>
  <div v-bind="rootProps">
    <Button
      v-if="orientation === 'horizontal'"
      variant="text"
      color="neutral"
      :size="buttonSize"
      :icon="icons.minus"
      :aria-label="messages.decrement"
      :disabled="!canDecrement"
      :ui="stepButtonUi"
      tabindex="-1"
      @click="stepBy(-step)"
    />
    <input
      :id="inputId"
      :value="displayValue"
      type="text"
      inputmode="numeric"
      :name="name ?? field?.name"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="inputInvalid || undefined"
      :aria-describedby="describedBy"
      v-bind="inputProps"
      @focus="focus"
      @blur="blur"
      @input="input"
      @keydown="keydown"
    >
    <Button
      v-if="orientation === 'horizontal'"
      variant="text"
      color="neutral"
      :size="buttonSize"
      :icon="icons.plus"
      :aria-label="messages.increment"
      :disabled="!canIncrement"
      :ui="stepButtonUi"
      tabindex="-1"
      @click="stepBy(step)"
    />

    <div v-else v-bind="stepperProps">
      <button
        type="button"
        v-bind="stepperButtonProps"
        :aria-label="messages.increment"
        :disabled="!canIncrement"
        tabindex="-1"
        @click="stepBy(step)"
      >
        <Icon :name="icons.chevronUp" class="size-3" />
      </button>
      <button
        type="button"
        v-bind="stepperButtonProps"
        :aria-label="messages.decrement"
        :disabled="!canDecrement"
        tabindex="-1"
        @click="stepBy(-step)"
      >
        <Icon :name="icons.chevronDown" class="size-3" />
      </button>
    </div>
  </div>
</template>
