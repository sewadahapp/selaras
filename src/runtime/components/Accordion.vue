<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { AccordionThemeSlots } from '../theme/accordion'
import type { UiProp } from '../utils/ui'
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from 'reka-ui'
import { computed } from 'vue'
import { useIcons } from '../composables/use-icons'
import { accordionTheme } from '../theme/accordion'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Icon from './Icon.vue'

type AccordionVariants = VariantProps<typeof accordionTheme>

export interface AccordionItemDef {
  value: string
  label: string
  disabled?: boolean
  /** Not read by Accordion's own default label rendering - carried purely so a custom #label slot override can display one. */
  icon?: string
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<AccordionProps>(), {
  type: 'multiple',
  collapsible: true,
})

defineEmits<AccordionEmits>()

export interface AccordionProps {
  items: AccordionItemDef[]
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  modelValue?: string | string[]
  collapsible?: boolean
  /** Disables every item at once - Reka's own AccordionRoot already blocks all interaction when this is set, so this is a straight pass-through. */
  disabled?: boolean
  size?: AccordionVariants['size']
  /** @default 'list' */
  variant?: AccordionVariants['variant']
  /** @default 'end' */
  chevronPosition?: AccordionVariants['chevronPosition']
  ui?: UiProp<AccordionThemeSlots>
}

export interface AccordionEmits {
  'update:modelValue': [value: string | string[]]
}

const icons = useIcons()
const theme = useComponentTheme('accordion', accordionTheme)
const ui = computed(() => theme.value({ size: props.size, variant: props.variant, chevronPosition: props.chevronPosition }))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
</script>

<template>
  <AccordionRoot
    :type="(type as any)"
    :default-value="(defaultValue as any)"
    :model-value="(modelValue as any)"
    :collapsible="type === 'single' ? collapsible : undefined"
    :disabled="disabled"
    v-bind="rootProps"
    @update:model-value="(value) => $emit('update:modelValue', value as string | string[])"
  >
    <AccordionItem
      v-for="item in items"
      :key="item.value"
      :value="item.value"
      :disabled="item.disabled"
      v-bind="resolveSlot(ui.item, props.ui?.item)"
    >
      <AccordionHeader as="div" v-bind="resolveSlot(ui.header, props.ui?.header)">
        <AccordionTrigger v-bind="resolveSlot(ui.trigger, props.ui?.trigger)">
          <slot v-if="chevronPosition === 'start'" name="chevron-icon" :class="resolveSlot(ui.chevron, props.ui?.chevron).class">
            <Icon :name="icons.chevronDown" v-bind="resolveSlot(ui.chevron, props.ui?.chevron)" />
          </slot>
          <span v-bind="resolveSlot(ui.label, props.ui?.label)">
            <slot name="label" :item="item">{{ item.label }}</slot>
          </span>
          <slot v-if="chevronPosition !== 'start'" name="chevron-icon" :class="resolveSlot(ui.chevron, props.ui?.chevron).class">
            <Icon :name="icons.chevronDown" v-bind="resolveSlot(ui.chevron, props.ui?.chevron)" />
          </slot>
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent v-bind="resolveSlot(ui.content, props.ui?.content)">
        <div v-bind="resolveSlot(ui.contentInner, props.ui?.contentInner)">
          <slot :name="item.value" />
        </div>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
