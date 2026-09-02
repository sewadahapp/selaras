<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { StepperThemeSlots } from '../theme/stepper'
import type { UiProp } from '../utils/ui'
import { StepperDescription, StepperIndicator, StepperItem, StepperRoot, StepperSeparator, StepperTitle, StepperTrigger } from 'reka-ui'
import { computed } from 'vue'
import { useIcons } from '../composables/use-icons'
import { stepperTheme } from '../theme/stepper'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Icon from './Icon.vue'

type StepperVariants = VariantProps<typeof stepperTheme>
type StepState = 'inactive' | 'active' | 'completed'

export interface Step {
  title?: string
  description?: string
  icon?: string
  disabled?: boolean
}

defineOptions({ inheritAttrs: false })

// An unpassed `boolean` prop with no explicit default casts to `false`
// (Vue's own Boolean-prop casting), not `undefined` - see Button.vue's
// `square` prop for the same caveat. Without this, `linear` would always
// reach StepperRoot as `false`, silently disabling it regardless of this
// prop's own documented `true` default.
const props = withDefaults(defineProps<StepperProps>(), {
  linear: true,
})

const emit = defineEmits<StepperEmits>()

defineSlots<StepperSlots>()

export interface StepperProps {
  items: Step[]
  modelValue?: number
  defaultValue?: number
  /** Restricts clicking a step to at most one ahead of the current one - going back to any earlier/completed step is always allowed regardless. @default true */
  linear?: boolean
  orientation?: StepperVariants['orientation']
  size?: StepperVariants['size']
  color?: StepperVariants['color']
  ui?: UiProp<StepperThemeSlots>
}

export interface StepperEmits {
  'update:modelValue': [value: number]
}

export interface StepperSlots {
  indicator?: (props: { item: Step, index: number, state: StepState }) => any
  title?: (props: { item: Step, index: number, state: StepState }) => any
  description?: (props: { item: Step, index: number, state: StepState }) => any
}

const icons = useIcons()

const theme = useComponentTheme('stepper', stepperTheme)
const ui = computed(() => theme.value({
  orientation: props.orientation,
  size: props.size,
  color: props.color,
}))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const itemProps = computed(() => resolveSlot(ui.value.item, props.ui?.item))
const connectorProps = computed(() => resolveSlot(ui.value.connector, props.ui?.connector))
const triggerProps = computed(() => resolveSlot(ui.value.trigger, props.ui?.trigger))
const indicatorProps = computed(() => resolveSlot(ui.value.indicator, props.ui?.indicator))
const iconProps = computed(() => resolveSlot(ui.value.icon, props.ui?.icon))
const labelsProps = computed(() => resolveSlot(ui.value.labels, props.ui?.labels))
const titleProps = computed(() => resolveSlot(ui.value.title, props.ui?.title))
const descriptionProps = computed(() => resolveSlot(ui.value.description, props.ui?.description))
const separatorProps = computed(() => resolveSlot(ui.value.separator, props.ui?.separator))
</script>

<template>
  <StepperRoot
    :model-value="modelValue"
    :default-value="defaultValue"
    :linear="linear"
    :orientation="orientation"
    v-bind="rootProps"
    @update:model-value="(value) => emit('update:modelValue', value as number)"
  >
    <StepperItem
      v-for="(item, index) in items"
      :key="index"
      v-slot="{ state }"
      :step="index + 1"
      :disabled="item.disabled"
      v-bind="itemProps"
    >
      <!--
        The separator lives inside its *preceding* item (not as a
        root-level sibling between items) - Reka's own StepperSeparator
        injects that item's context internally, so it can only be
        rendered as a descendant of the StepperItem it belongs to.
        Pairing it with the indicator here (rather than the labels below)
        is what lets a thin line center against the indicator's own
        height for free, via this row's own `items-center`.
      -->
      <div v-bind="connectorProps">
        <StepperTrigger v-bind="triggerProps">
          <!--
            StepperIndicator, unlike StepperItem/StepperTrigger/
            StepperSeparator, never sets data-state on itself (confirmed
            by reading Reka's compiled source) - passed through manually
            here so the theme's own data-[state=completed] fill actually
            has something to match against.
          -->
          <StepperIndicator :data-state="state" v-bind="indicatorProps">
            <slot name="indicator" :item="item" :index="index" :state="(state as StepState)">
              <Icon v-if="state === 'completed'" :name="icons.check" v-bind="iconProps" />
              <Icon v-else-if="item.icon" :name="item.icon" v-bind="iconProps" />
              <template v-else>
                {{ index + 1 }}
              </template>
            </slot>
          </StepperIndicator>
        </StepperTrigger>
        <StepperSeparator v-if="index < items.length - 1" v-bind="separatorProps" />
      </div>
      <div v-if="item.title || item.description || $slots.title || $slots.description" v-bind="labelsProps">
        <StepperTitle v-if="item.title || $slots.title" v-bind="titleProps">
          <slot name="title" :item="item" :index="index" :state="(state as StepState)">
            {{ item.title }}
          </slot>
        </StepperTitle>
        <StepperDescription v-if="item.description || $slots.description" v-bind="descriptionProps">
          <slot name="description" :item="item" :index="index" :state="(state as StepState)">
            {{ item.description }}
          </slot>
        </StepperDescription>
      </div>
    </StepperItem>
  </StepperRoot>
</template>
