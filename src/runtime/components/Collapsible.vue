<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { CollapsibleThemeSlots } from '../theme/collapsible'
import type { UiProp } from '../utils/ui'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui'
import { computed, ref, watch } from 'vue'
import { useIcons } from '../composables/use-icons'
import { collapsibleTheme } from '../theme/collapsible'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Icon from './Icon.vue'

type CollapsibleVariants = VariantProps<typeof collapsibleTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<CollapsibleProps>(), {
  open: undefined,
})

const emit = defineEmits<CollapsibleEmits>()

defineSlots<CollapsibleSlots>()

export interface CollapsibleProps {
  open?: boolean
  defaultOpen?: boolean
  disabled?: boolean
  size?: CollapsibleVariants['size']
  /** Which way the content reveals - `down` expands below the trigger, `up` above it. Flips the chevron's rest/open rotation to match. @default 'down' */
  direction?: CollapsibleVariants['direction']
  ui?: UiProp<CollapsibleThemeSlots>
}

export interface CollapsibleEmits {
  'update:open': [value: boolean]
}

export interface CollapsibleSlots {
  /** The trigger's own content (label, icon, whatever) - rendered inside a real button, alongside the chevron. */
  'trigger'?: (props: { open: boolean }) => any
  'default'?: (props: { open: boolean }) => any
  /** Replaces the default chevron. */
  'chevron-icon'?: (props: { open: boolean }) => any
}

const icons = useIcons()

const theme = useComponentTheme('collapsible', collapsibleTheme)
const ui = computed(() => theme.value({ size: props.size, direction: props.direction }))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const triggerProps = computed(() => resolveSlot(ui.value.trigger, props.ui?.trigger))
const chevronProps = computed(() => resolveSlot(ui.value.chevron, props.ui?.chevron))
const contentProps = computed(() => resolveSlot(ui.value.content, props.ui?.content))
const contentInnerProps = computed(() => resolveSlot(ui.value.contentInner, props.ui?.contentInner))

// Always pass a *defined* boolean into Reka's own `:open`, and manage the
// real state ourselves - sidesteps Reka's passive-vs-controlled v-model
// ambiguity entirely (same pattern as Modal.vue's own internalOpen).
const internalOpen = ref(props.open ?? props.defaultOpen ?? false)
watch(() => props.open, (value) => {
  if (value !== undefined)
    internalOpen.value = value
})
function onUpdateOpen(value: boolean) {
  internalOpen.value = value
  emit('update:open', value)
}
</script>

<template>
  <ClientOnly>
    <CollapsibleRoot :open="internalOpen" :disabled="disabled" v-bind="rootProps" @update:open="onUpdateOpen">
      <CollapsibleTrigger v-bind="triggerProps">
        <slot name="trigger" :open="internalOpen" />
        <slot name="chevron-icon" :open="internalOpen">
          <Icon :name="icons.chevronDown" v-bind="chevronProps" />
        </slot>
      </CollapsibleTrigger>
      <CollapsibleContent v-bind="contentProps">
        <div v-bind="contentInnerProps">
          <slot :open="internalOpen" />
        </div>
      </CollapsibleContent>
    </CollapsibleRoot>

    <!--
      Reka UI compound components (provide/inject based) crash production SSR
      builds in this project - see Accordion.vue's own comment for the full
      writeup. ClientOnly is the established workaround; the fallback renders
      the same content permanently expanded (no collapse behavior, but fully
      readable/navigable for SSR, no-JS, and crawlers) rather than nothing.
    -->
    <template #fallback>
      <div v-bind="rootProps">
        <div v-bind="triggerProps" :class="disabled ? 'opacity-50 pointer-events-none' : undefined">
          <slot name="trigger" :open="true" />
          <slot name="chevron-icon" :open="true">
            <Icon :name="icons.chevronDown" v-bind="chevronProps" />
          </slot>
        </div>
        <div v-bind="contentProps">
          <div v-bind="contentInnerProps">
            <slot :open="true" />
          </div>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>
