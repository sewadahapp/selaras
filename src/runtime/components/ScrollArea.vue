<script setup lang="ts">
import type { ScrollAreaThemeSlots } from '../theme/scroll-area'
import type { UiProp } from '../utils/ui'
import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'reka-ui'
import { computed } from 'vue'
import { scrollAreaTheme } from '../theme/scroll-area'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ScrollAreaProps>(), {
  orientation: 'vertical',
})

export interface ScrollAreaProps {
  orientation?: 'vertical' | 'horizontal' | 'both'
  ui?: UiProp<ScrollAreaThemeSlots>
}

const theme = useComponentTheme('scrollArea', scrollAreaTheme)
const ui = computed(() => theme.value())

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
</script>

<template>
  <ScrollAreaRoot v-bind="rootProps">
    <ScrollAreaViewport v-bind="resolveSlot(ui.viewport, props.ui?.viewport)">
      <slot />
    </ScrollAreaViewport>
    <ScrollAreaScrollbar
      v-if="orientation !== 'horizontal'"
      orientation="vertical"
      v-bind="resolveSlot(ui.scrollbar, props.ui?.scrollbar)"
    >
      <ScrollAreaThumb v-bind="resolveSlot(ui.thumb, props.ui?.thumb)" />
    </ScrollAreaScrollbar>
    <ScrollAreaScrollbar
      v-if="orientation !== 'vertical'"
      orientation="horizontal"
      v-bind="resolveSlot(ui.scrollbar, props.ui?.scrollbar)"
    >
      <ScrollAreaThumb v-bind="resolveSlot(ui.thumb, props.ui?.thumb)" />
    </ScrollAreaScrollbar>
    <ScrollAreaCorner v-if="orientation === 'both'" v-bind="resolveSlot(ui.corner, props.ui?.corner)" />
  </ScrollAreaRoot>
</template>
