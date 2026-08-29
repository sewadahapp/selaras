<script setup lang="ts">
import type { AccordionSlots } from '../theme/accordion'
import type { UiProp } from '../utils/ui'
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from 'reka-ui'
import { computed } from 'vue'
import { useIcons } from '../composables/use-icons'
import { accordionTheme } from '../theme/accordion'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Icon from './Icon.vue'

export interface AccordionItemDef {
  value: string
  label: string
  disabled?: boolean
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  items: AccordionItemDef[]
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  modelValue?: string | string[]
  collapsible?: boolean
  ui?: UiProp<AccordionSlots>
}>(), {
  type: 'multiple',
  collapsible: true,
})

defineEmits<{
  'update:modelValue': [value: string | string[]]
}>()

const icons = useIcons()
const theme = useComponentTheme('accordion', accordionTheme)
const ui = computed(() => theme.value())

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
</script>

<template>
  <ClientOnly>
    <AccordionRoot
      :type="(type as any)"
      :default-value="(defaultValue as any)"
      :model-value="(modelValue as any)"
      :collapsible="type === 'single' ? collapsible : undefined"
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
            <span v-bind="resolveSlot(ui.label, props.ui?.label)">
              <slot name="label" :item="item">{{ item.label }}</slot>
            </span>
            <slot name="chevron-icon" :class="resolveSlot(ui.chevron, props.ui?.chevron).class">
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

    <!--
      Reka UI compound components (provide/inject based) crash production SSR
      builds in this project with `null is not an object (evaluating
      'currentRenderingInstance.ce')` - a pre-existing, documented issue (see
      ComponentExample.vue), confirmed here via `nuxt build` + serving the
      built output (dev mode SSR does not reproduce it, so always verify
      Reka-wrapping components against a real production build, not just dev).
      ClientOnly is the established workaround. The fallback renders the same
      content permanently expanded (no collapse behavior, but fully
      readable/navigable for SSR, no-JS, and crawlers) rather than nothing.
    -->
    <template #fallback>
      <div v-bind="rootProps">
        <div v-for="item in items" :key="item.value">
          <div v-bind="resolveSlot(ui.header, props.ui?.header)">
            <div v-bind="resolveSlot(ui.trigger, props.ui?.trigger)">
              <span v-bind="resolveSlot(ui.label, props.ui?.label)">
                <slot name="label" :item="item">{{ item.label }}</slot>
              </span>
            </div>
          </div>
          <div v-bind="resolveSlot(ui.content, props.ui?.content)">
            <div v-bind="resolveSlot(ui.contentInner, props.ui?.contentInner)">
              <slot :name="item.value" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>
