<script setup lang="ts">
import type { ScrollAreaSlots } from '../theme/scroll-area'
import type { UiProp } from '../utils/ui'
import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'reka-ui'
import { computed } from 'vue'
import { scrollAreaTheme } from '../theme/scroll-area'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  orientation?: 'vertical' | 'horizontal' | 'both'
  ui?: UiProp<ScrollAreaSlots>
}>(), {
  orientation: 'vertical',
})

const theme = useComponentTheme('scrollArea', scrollAreaTheme)
const ui = computed(() => theme.value())

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
</script>

<template>
  <ClientOnly>
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

    <!--
      Reka UI compound components (provide/inject based) crash production SSR
      builds in this project with `null is not an object (evaluating
      'currentRenderingInstance.ce')` - a pre-existing, documented issue (see
      ComponentExample.vue), confirmed here via `nuxt build` + serving the
      built output (dev mode SSR does not reproduce it, so always verify
      Reka-wrapping components against a real production build, not just dev).
      ClientOnly is the established workaround. The fallback is a plain
      native-scrollbar div so SSR/no-JS content is still fully scrollable.
    -->
    <template #fallback>
      <div v-bind="rootProps" :class="orientation === 'horizontal' ? 'overflow-x-auto' : 'overflow-y-auto'">
        <slot />
      </div>
    </template>
  </ClientOnly>
</template>
