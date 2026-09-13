<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { PinInputThemeSlots } from '../theme/pin-input'
import type { ColorRole } from '../utils/color-registry'
import type { UiProp } from '../utils/ui'
import { PinInputInput, PinInputRoot } from 'reka-ui'
import { computed, mergeProps, useAttrs } from 'vue'
import { useFormField } from '../composables/use-form-field'
import { pinInputTheme } from '../theme/pin-input'
import { isBuiltinColorRole } from '../utils/color-registry'
import { isNativeInputAttr } from '../utils/native-input'
import { resolveRegisteredColorRole } from '../utils/registered-colors'
import { resolveSlot, useComponentTheme, useFallthroughAttrs, useRootProps } from '../utils/ui'

type PinInputVariants = VariantProps<typeof pinInputTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<PinInputProps>(), {
  type: 'text',
})

const emit = defineEmits<PinInputEmits>()

export interface PinInputProps {
  id?: string
  modelValue?: (string | number)[]
  defaultValue?: (string | number)[]
  /** Number of boxes. @default 5 */
  length?: number
  placeholder?: string
  /** Password-style dot masking. */
  mask?: boolean
  /** Sets autocomplete="one-time-code" for SMS autofill, and auto-focuses the first empty box. */
  otp?: boolean
  /** 'number' enables the mobile numeric keypad but loses leading zeros - values are stored as real numbers, not strings ("007" becomes 7). @default 'text' */
  type?: 'text' | 'number'
  disabled?: boolean
  invalid?: boolean
  size?: PinInputVariants['size']
  color?: ColorRole
  name?: string
  required?: boolean
  ui?: UiProp<PinInputThemeSlots>
}

export interface PinInputEmits {
  'update:modelValue': [value: (string | number)[]]
  /** Fires once, when every box has a value. */
  'complete': [value: (string | number)[]]
}

const field = useFormField()
const attrs = useAttrs()

const pinInputId = computed(() => props.id ?? field?.id)
const pinInputInvalid = computed(() => props.invalid || (field?.invalid.value ?? false))
const effectiveSize = computed(() => props.size ?? field?.size ?? 'md')
const describedBy = computed(() => attrs['aria-describedby'] ?? field?.describedBy.value)

const theme = useComponentTheme('pinInput', pinInputTheme)
const effectiveColor = computed(() => resolveRegisteredColorRole(props.color ?? 'primary', 'primary'))
const recipeColor = computed(() => isBuiltinColorRole(effectiveColor.value) ? effectiveColor.value as PinInputVariants['color'] : 'primary')
const ui = computed(() => theme.value({
  size: effectiveSize.value,
  color: recipeColor.value,
  invalid: pinInputInvalid.value,
}))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root, { exclude: isNativeInputAttr })
const nativeInputAttrs = useFallthroughAttrs(isNativeInputAttr)
const inputProps = computed(() => mergeProps(resolveSlot(ui.value.input, props.ui?.input), nativeInputAttrs.value))
</script>

<template>
  <PinInputRoot
    :id="pinInputId"
    :model-value="(modelValue as any)"
    :default-value="(defaultValue as any)"
    :placeholder="placeholder"
    :mask="mask"
    :otp="otp"
    :type="type"
    :disabled="disabled"
    :name="name ?? field?.name"
    :required="required"
    :aria-invalid="pinInputInvalid || undefined"
    :aria-describedby="describedBy"
    :data-selaras-color="isBuiltinColorRole(effectiveColor) ? undefined : effectiveColor"
    v-bind="rootProps"
    @update:model-value="(value) => emit('update:modelValue', value as (string | number)[])"
    @complete="(value) => emit('complete', value as (string | number)[])"
  >
    <PinInputInput
      v-for="i in (length ?? 5)"
      :key="i"
      :index="i - 1"
      :aria-invalid="pinInputInvalid || undefined"
      :aria-describedby="describedBy"
      v-bind="inputProps"
    />
  </PinInputRoot>
</template>
