<script setup lang="ts">
import type { TooltipThemeSlots } from '../theme/tooltip'
import type { ArrowConfig } from '../utils/arrow'
import type { UiProp } from '../utils/ui'
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipRoot, TooltipTrigger } from 'reka-ui'
import { computed } from 'vue'
import { tooltipTheme } from '../theme/tooltip'
import { arrowContentProps, arrowElementProps } from '../utils/arrow'
import { resolveSlot, useComponentTheme, useThemeBindings } from '../utils/ui'

export interface TooltipProps {
  text?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  delayDuration?: number
  /** Keyboard shortcut hint shown alongside the text, e.g. `['⌘', 'K']` - each entry renders as its own small key badge. Takes the literal display strings, not semantic key names - there's no platform-specific symbol mapping. */
  kbds?: string[]
  /** Set `false` to hide the pointer; an object configures its size and edge clearance. */
  arrow?: boolean | ArrowConfig
  disabled?: boolean
  ui?: UiProp<TooltipThemeSlots>
}

const props = withDefaults(defineProps<TooltipProps>(), {
  side: 'top',
  delayDuration: 200,
  arrow: true,
})

const theme = useComponentTheme('tooltip', tooltipTheme)
const themeBindings = useThemeBindings()
const ui = computed(() => theme.value())

const contentProps = computed(() => ({ ...resolveSlot(ui.value.content, props.ui?.content), ...arrowContentProps(props.arrow) }))
const arrowProps = computed(() => ({ ...resolveSlot(ui.value.arrow, props.ui?.arrow), ...arrowElementProps(props.arrow) }))
const kbdsProps = computed(() => resolveSlot(ui.value.kbds, props.ui?.kbds))
const kbdProps = computed(() => resolveSlot(ui.value.kbd, props.ui?.kbd))
</script>

<template>
  <TooltipRoot :delay-duration="delayDuration" :disabled="disabled">
    <TooltipTrigger as-child>
      <slot />
    </TooltipTrigger>
    <TooltipPortal>
      <TooltipContent :side="side" :side-offset="6" :data-selaras-theme="themeBindings['data-selaras-theme']" :data-selaras-mode="themeBindings['data-selaras-mode']" :style="themeBindings.style" v-bind="contentProps">
        <slot name="content">
          {{ text }}
        </slot>
        <span v-if="kbds?.length" v-bind="kbdsProps">
          <kbd v-for="key in kbds" :key="key" v-bind="kbdProps">{{ key }}</kbd>
        </span>
        <TooltipArrow v-if="arrow" v-bind="arrowProps" />
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
</template>
