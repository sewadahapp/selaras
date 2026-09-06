<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { SwitchThemeSlots } from '../theme/switch'
import type { UiProp } from '../utils/ui'
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { computed } from 'vue'
import { useFormField } from '../composables/use-form-field'
import { useIcons } from '../composables/use-icons'
import { switchTheme } from '../theme/switch'
import { applyClassPrefix, resolveSlot, useComponentTheme, useRootProps, withFallthroughClass } from '../utils/ui'
import Icon from './Icon.vue'

type SwitchVariants = VariantProps<typeof switchTheme>

defineOptions({ inheritAttrs: false })

const props = defineProps<SwitchProps>()

const emit = defineEmits<SwitchEmits>()

export interface SwitchProps {
  id?: string
  name?: string
  modelValue?: boolean
  label?: string
  /** A second, muted line under the label - for a standalone toggle (e.g. a settings list) where wrapping every switch in its own FormField would be needless ceremony. */
  description?: string
  disabled?: boolean
  invalid?: boolean
  required?: boolean
  size?: SwitchVariants['size']
  color?: SwitchVariants['color']
  /** Shows a spinner in the thumb. Doesn't imply `disabled` - combine `:loading="x" :disabled="x"` if a busy switch shouldn't be touchable. Takes precedence over checkedIcon/uncheckedIcon. */
  loading?: boolean
  /** Icon shown in the thumb when on. */
  checkedIcon?: string
  /** Icon shown in the thumb when off. */
  uncheckedIcon?: string
  ui?: UiProp<SwitchThemeSlots>
}

export interface SwitchEmits {
  'update:modelValue': [value: boolean]
}

const field = useFormField()

const switchId = computed(() => props.id ?? field?.id)
const switchInvalid = computed(() => props.invalid || (field?.invalid.value ?? false))
const effectiveSize = computed(() => props.size ?? field?.size ?? 'md')
const describedBy = computed(() => field?.describedBy.value)

const theme = useComponentTheme('switch', switchTheme)
const ui = computed(() => theme.value({ invalid: switchInvalid.value, size: effectiveSize.value, color: props.color }))

// A description pushes the label onto a second line, so the track top-
// aligns with the label's first line instead of centering against the
// whole two-line block - same conditional treatment RadioGroup already
// applies per item for the same reason.
const rootProps = useRootProps(() => ui.value.root, () => withFallthroughClass(props.description ? 'items-start' : undefined, props.ui?.root))
const trackProps = computed(() => resolveSlot(ui.value.track, withFallthroughClass(props.description ? 'mt-0.5' : undefined, props.ui?.track)))
const thumbProps = computed(() => resolveSlot(ui.value.thumb, props.ui?.thumb))
const iconProps = computed(() => resolveSlot(ui.value.icon, props.ui?.icon))
const labelGroupProps = computed(() => resolveSlot(ui.value.labelGroup, props.ui?.labelGroup))
const labelProps = computed(() => resolveSlot(ui.value.label, props.ui?.label))
const descriptionProps = computed(() => resolveSlot(ui.value.description, props.ui?.description))

const icons = useIcons()
</script>

<template>
  <label v-bind="rootProps">
    <SwitchRoot
      :id="switchId"
      :model-value="modelValue"
      :name="name ?? field?.name"
      :disabled="disabled"
      :required="required"
      :aria-invalid="switchInvalid || undefined"
      :aria-describedby="describedBy"
      v-bind="trackProps"
      @update:model-value="(value) => emit('update:modelValue', value)"
    >
      <SwitchThumb v-bind="thumbProps">
        <Icon v-if="loading" :name="icons.loading" :class="applyClassPrefix('animate-spin')" v-bind="iconProps" />
        <Icon v-else-if="modelValue && checkedIcon" :name="checkedIcon" v-bind="iconProps" />
        <Icon v-else-if="!modelValue && uncheckedIcon" :name="uncheckedIcon" v-bind="iconProps" />
      </SwitchThumb>
    </SwitchRoot>
    <span v-if="description" v-bind="labelGroupProps">
      <span v-if="label || $slots.default" v-bind="labelProps"><slot>{{ label }}</slot></span>
      <span v-bind="descriptionProps">
        <slot name="description">{{ description }}</slot>
      </span>
    </span>
    <span v-else-if="label || $slots.default" v-bind="labelProps">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
