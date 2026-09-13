<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { InputThemeSlots } from '../theme/input'
import type { ColorRole } from '../utils/color-registry'
import type { UiProp } from '../utils/ui'
import { computed, mergeProps } from 'vue'
import { useFormField } from '../composables/use-form-field'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { inputTheme } from '../theme/input'
import { resolveRegisteredColorRole } from '../utils/registered-colors'
import { resolveSlot, useComponentTheme, useFallthroughAttrs, useRootProps, useThemeProps } from '../utils/ui'
import Button from './Button.vue'
import Icon from './Icon.vue'

type InputVariants = VariantProps<typeof inputTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
})

const emit = defineEmits<InputEmits>()

export interface InputProps {
  id?: string
  name?: string
  modelValue?: string | number
  type?: string
  placeholder?: string
  size?: InputVariants['size']
  disabled?: boolean
  invalid?: boolean
  /** The focus-ring color - the resting (unfocused) ring stays neutral regardless. */
  color?: ColorRole
  clearable?: boolean
  icon?: string
  trailingIcon?: string
  ui?: UiProp<InputThemeSlots>
}

export interface InputEmits {
  'update:modelValue': [value: string]
}

const field = useFormField()

const inputId = computed(() => props.id ?? field?.id)
const inputInvalid = computed(() => props.invalid || (field?.invalid.value ?? false))
const describedBy = computed(() => field?.describedBy.value)

const hasValue = computed(() => props.modelValue !== undefined && props.modelValue !== '')
const showClear = computed(() => !!props.clearable && !props.disabled && hasValue.value)

function clear() {
  emit('update:modelValue', '')
}

const themeProps = useThemeProps('input')
const effectiveSize = computed(() => props.size ?? field?.size ?? themeProps.value.size as InputVariants['size'] ?? 'md')

// One size step down from the input itself - a full-size dismiss icon reads
// as too heavy next to the input's own text, especially at lg. sm has no
// smaller step, so it stays sm.
const clearSize = computed(() => ({ sm: 'sm', md: 'sm', lg: 'md' } as const)[effectiveSize.value])

const icons = useIcons()
const messages = useMessages()
const theme = useComponentTheme('input', inputTheme)
const effectiveColor = computed(() => resolveRegisteredColorRole(props.color ?? themeProps.value.color ?? 'primary', 'primary'))

const ui = computed(() => theme.value({
  size: effectiveSize.value,
  color: effectiveColor.value as InputVariants['color'],
  invalid: inputInvalid.value,
  hasLeadingIcon: !!props.icon,
  hasTrailingIcon: !!props.trailingIcon || showClear.value,
}))

function isNativeInputAttr(key: string) {
  return [
    'autocomplete',
    'autocapitalize',
    'autocorrect',
    'form',
    'inputmode',
    'list',
    'maxlength',
    'minlength',
    'pattern',
    'readonly',
    'required',
    'spellcheck',
    'step',
  ].includes(key) || /^on(?:BeforeInput|Change|CompositionEnd|CompositionStart|CompositionUpdate|Focus|Input|KeyDown|KeyUp|Paste|Select|Blur)$/.test(key)
}

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root, { exclude: isNativeInputAttr })
const nativeInputAttrs = useFallthroughAttrs(isNativeInputAttr)
const baseProps = computed(() => resolveSlot(ui.value.base, props.ui?.base))
const inputProps = computed(() => mergeProps(baseProps.value, nativeInputAttrs.value))
</script>

<template>
  <div :data-selaras-color="inputInvalid ? 'danger' : effectiveColor" v-bind="rootProps">
    <Icon v-if="icon" :name="icon" v-bind="resolveSlot(ui.leadingIcon, props.ui?.leadingIcon)" />
    <input
      :id="inputId"
      data-ui-group-item
      :value="modelValue"
      :type="type"
      :name="name ?? field?.name"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="inputInvalid || undefined"
      :aria-describedby="describedBy"
      v-bind="inputProps"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <Button
      v-if="showClear"
      :size="clearSize"
      variant="text"
      color="neutral"
      :aria-label="messages.clear"
      v-bind="resolveSlot(ui.clear, props.ui?.clear)"
      @click="clear"
    >
      <template #icon="{ class: iconClass }">
        <slot name="clear-icon">
          <Icon :name="icons.close" :class="iconClass" />
        </slot>
      </template>
    </Button>
    <Icon v-else-if="trailingIcon" :name="trailingIcon" v-bind="resolveSlot(ui.trailingIcon, props.ui?.trailingIcon)" />
  </div>
</template>
