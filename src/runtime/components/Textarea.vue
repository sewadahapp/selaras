<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { TextareaThemeSlots } from '../theme/textarea'
import type { ColorRole } from '../utils/color-registry'
import type { FieldAdornmentSlotProps } from '../utils/field-adornments'
import type { UiProp } from '../utils/ui'
import { computed, mergeProps, nextTick, onMounted, ref, useAttrs, watch } from 'vue'
import { useFormField } from '../composables/use-form-field'
import FieldClearButton from '../internal/FieldClearButton.vue'
import { textareaTheme } from '../theme/textarea'
import { useFieldAdornments } from '../utils/field-adornments'
import { canClearField, fieldClearWidths, isFieldReadonly } from '../utils/field-clear'
import { isNativeInputA11yAttr, isNativeInputAttr } from '../utils/native-input'
import { resolveRegisteredColorRole } from '../utils/registered-colors'
import { resolveSlot, useComponentTheme, useFallthroughAttrs, useRootProps } from '../utils/ui'
import Icon from './Icon.vue'

type TextareaVariants = VariantProps<typeof textareaTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TextareaProps>(), {
  rows: 3,
  color: 'primary',
})

const emit = defineEmits<TextareaEmits>()

const slots = defineSlots<TextareaSlots>()

export interface TextareaProps {
  id?: string
  name?: string
  modelValue?: string
  placeholder?: string
  rows?: number
  size?: TextareaVariants['size']
  disabled?: boolean
  invalid?: boolean
  /** The focus-ring color - the resting (unfocused) ring stays neutral regardless. */
  color?: ColorRole
  clearable?: boolean
  icon?: string
  trailingIcon?: string
  /** Grows the box to fit its content instead of a fixed height + scrollbar/drag-handle. */
  autoresize?: boolean
  /** autoresize only - caps how many rows it can grow to before switching to a scrollbar (0/unset grows indefinitely). */
  maxrows?: number
  ui?: UiProp<TextareaThemeSlots>
}

export interface TextareaEmits {
  'update:modelValue': [value: string]
}

export interface TextareaSlots {
  'leading'?: (props: FieldAdornmentSlotProps) => any
  'trailing'?: (props: FieldAdornmentSlotProps) => any
  'clear-icon'?: () => any
}

const { leading, trailing, padding, clearOffset } = useFieldAdornments()

const field = useFormField()
const attrs = useAttrs()
const textareaRef = ref<HTMLTextAreaElement>()
const effectivePlaceholder = computed(() => props.placeholder || (field?.floatingLabel.value ? ' ' : undefined))

const textareaId = computed(() => props.id ?? field?.id)
const textareaInvalid = computed(() => props.invalid || (field?.invalid.value ?? false))
const describedBy = computed(() => field?.describedBy.value)

const hasValue = computed(() => props.modelValue != null && props.modelValue !== '')
const showClear = computed(() => canClearField(props.clearable, hasValue.value, props.disabled, isFieldReadonly(attrs.readonly)))

async function clear() {
  if (!showClear.value)
    return
  emit('update:modelValue', '')
  await nextTick()
  textareaRef.value?.focus()
}

const effectiveSize = computed(() => props.size ?? field?.size ?? 'md')
// Suggested size for actions supplied through the adornment slots.
const adornmentButtonSize = computed(() => ({ sm: 'sm', md: 'sm', lg: 'md' } as const)[effectiveSize.value])

const adornmentScope = computed(() => ({ disabled: !!props.disabled, size: effectiveSize.value, buttonSize: adornmentButtonSize.value }))
const clearWidth = computed(() => fieldClearWidths[effectiveSize.value])
const theme = useComponentTheme('textarea', textareaTheme)
const effectiveColor = computed(() => resolveRegisteredColorRole(props.color ?? 'primary', 'primary'))

const ui = computed(() => theme.value({
  size: effectiveSize.value,
  color: effectiveColor.value as TextareaVariants['color'],
  invalid: textareaInvalid.value,
  hasLeadingIcon: !!props.icon,
  hasTrailingIcon: !!props.trailingIcon || showClear.value,
  autoresize: props.autoresize,
}))

const isTextareaAttr = (key: string) => isNativeInputAttr(key) || isNativeInputA11yAttr(key)
// The wrapper owns positioning for the absolute affordances, so public layout
// classes belong here. Native textarea attributes and listeners still route to
// the editable element below.
const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root, { exclude: isTextareaAttr })
const nativeTextareaAttrs = useFallthroughAttrs(isTextareaAttr)
const baseProps = computed(() => mergeProps(resolveSlot(ui.value.base, props.ui?.base), nativeTextareaAttrs.value))

async function resize() {
  if (!props.autoresize || !textareaRef.value)
    return
  await nextTick()
  const el = textareaRef.value
  el.style.height = 'auto'
  if (props.maxrows) {
    const cs = getComputedStyle(el)
    const lineHeight = Number.parseFloat(cs.lineHeight)
    const padding = Number.parseFloat(cs.paddingTop) + Number.parseFloat(cs.paddingBottom)
    const maxHeight = lineHeight * props.maxrows + padding
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden'
    return
  }
  el.style.height = `${el.scrollHeight}px`
}

onMounted(resize)
// Covers a programmatic value change (not just typing, which already
// triggers the @input handler below).
watch(() => props.modelValue, resize)
function adornedInputProps() {
  return mergeProps({ style: padding(!!slots.leading, !!slots.trailing, showClear.value ? clearWidth.value : '0rem') }, baseProps.value)
}
function clearProps() {
  return mergeProps({ style: slots.trailing ? clearOffset() : undefined }, resolveSlot(ui.value.clear, props.ui?.clear))
}
</script>

<template>
  <div :data-selaras-color="textareaInvalid ? 'danger' : effectiveColor" :data-selaras-field-leading="icon || slots.leading ? '' : undefined" v-bind="rootProps">
    <fieldset v-if="slots.leading" ref="leading" :disabled="disabled" :inert="disabled || undefined" v-bind="resolveSlot(ui.leading, props.ui?.leading)">
      <slot name="leading" v-bind="adornmentScope" />
    </fieldset>
    <Icon v-else-if="icon" :name="icon" v-bind="resolveSlot(ui.leadingIcon, props.ui?.leadingIcon)" />
    <textarea
      :id="textareaId"
      ref="textareaRef"
      data-ui-group-item
      :value="modelValue"
      :name="name ?? field?.name"
      :placeholder="effectivePlaceholder"
      :rows="rows"
      :disabled="disabled"
      :aria-invalid="textareaInvalid || undefined"
      :aria-describedby="describedBy"
      v-bind="adornedInputProps()"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value); resize()"
    />
    <FieldClearButton
      v-if="showClear"
      :size="effectiveSize"
      v-bind="clearProps()"
      @click="clear"
    >
      <template v-if="slots['clear-icon']" #default>
        <slot name="clear-icon" />
      </template>
    </FieldClearButton>
    <Icon v-else-if="trailingIcon && !slots.trailing" :name="trailingIcon" v-bind="resolveSlot(ui.trailingIcon, props.ui?.trailingIcon)" />
    <fieldset v-if="slots.trailing" ref="trailing" :disabled="disabled" :inert="disabled || undefined" v-bind="resolveSlot(ui.trailing, props.ui?.trailing)">
      <slot name="trailing" v-bind="adornmentScope" />
    </fieldset>
  </div>
</template>
