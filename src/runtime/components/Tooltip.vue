<script setup lang="ts">
import type { TooltipSlots } from '../theme/tooltip'
import type { UiProp } from '../utils/ui'
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipRoot, TooltipTrigger } from 'reka-ui'
import { computed } from 'vue'
import { tooltipTheme } from '../theme/tooltip'
import { resolveSlot, useComponentTheme } from '../utils/ui'

const props = withDefaults(defineProps<{
  text?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  delayDuration?: number
  ui?: UiProp<TooltipSlots>
}>(), {
  side: 'top',
  delayDuration: 200,
})

const theme = useComponentTheme('tooltip', tooltipTheme)
const ui = computed(() => theme.value())

const contentProps = computed(() => resolveSlot(ui.value.content, props.ui?.content))
const arrowProps = computed(() => resolveSlot(ui.value.arrow, props.ui?.arrow))
</script>

<template>
  <TooltipRoot :delay-duration="delayDuration">
    <TooltipTrigger as-child>
      <slot />
    </TooltipTrigger>
    <TooltipPortal>
      <TooltipContent :side="side" :side-offset="6" v-bind="contentProps">
        <slot name="content">
          {{ text }}
        </slot>
        <TooltipArrow v-bind="arrowProps" />
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
</template>
