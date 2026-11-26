<script setup lang="ts">
import type { ScrollAreaRootProps } from 'reka-ui'
import type { ScrollAreaThemeSlots } from '../theme/scroll-area'
import type { UiProp } from '../utils/ui'
import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'reka-ui'
import { computed, useTemplateRef } from 'vue'
import { scrollAreaTheme } from '../theme/scroll-area'
import { resolveSlot, useComponentTheme, useRootProps, useThemeProps } from '../utils/ui'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ScrollAreaProps>(), {
  orientation: 'vertical',
})

export interface ScrollAreaProps {
  /** Controls when scrollbars are visible. */
  type?: ScrollAreaRootProps['type']
  /** Milliseconds before scrollbars hide after interaction. */
  scrollHideDelay?: ScrollAreaRootProps['scrollHideDelay']
  /** Reading direction. Inherits from the surrounding app when omitted. */
  dir?: ScrollAreaRootProps['dir']
  orientation?: 'vertical' | 'horizontal' | 'both'
  ui?: UiProp<ScrollAreaThemeSlots>
}

const root = useTemplateRef<InstanceType<typeof ScrollAreaRoot>>('root')
const viewport = computed(() => root.value?.viewport)
defineExpose({ viewport })

const defaults = useThemeProps('scrollArea')
const visibility = computed(() => props.type ?? defaults.value.type as ScrollAreaProps['type'])
const hideDelay = computed(() => props.scrollHideDelay ?? defaults.value.scrollHideDelay as ScrollAreaProps['scrollHideDelay'])
const direction = computed(() => props.dir ?? defaults.value.dir as ScrollAreaProps['dir'])

const theme = useComponentTheme('scrollArea', scrollAreaTheme)
const ui = computed(() => theme.value())

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
</script>

<template>
  <ScrollAreaRoot ref="root" :type="visibility" :scroll-hide-delay="hideDelay" :dir="direction" v-bind="rootProps">
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
