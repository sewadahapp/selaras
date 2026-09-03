<script setup lang="ts">
import type { ReadMoreThemeSlots } from '../theme/read-more'
import type { UiProp } from '../utils/ui'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { readMoreTheme } from '../theme/read-more'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Icon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ReadMoreProps>(), {
  previewHeight: 200,
})

export interface ReadMoreProps {
  /** Collapsed height in pixels - content shorter than this renders with no truncation UI at all. @default 200 */
  previewHeight?: number
  ui?: UiProp<ReadMoreThemeSlots>
}

const icons = useIcons()
const messages = useMessages()

const contentEl = ref<HTMLElement>()
const contentHeight = ref(0)
const open = ref(false)

// CSS can't transition to/from `height: auto` (no computable intermediate
// value to animate through) - transitioning `max-height` to the content's
// own real scrollHeight instead gives it an exact target to interpolate
// toward, so the reveal grows smoothly rather than snapping open.
let resizeObserver: ResizeObserver | undefined
onMounted(() => {
  if (!contentEl.value)
    return
  contentHeight.value = contentEl.value.scrollHeight
  resizeObserver = new ResizeObserver(() => {
    if (contentEl.value)
      contentHeight.value = contentEl.value.scrollHeight
  })
  resizeObserver.observe(contentEl.value)
})
onUnmounted(() => resizeObserver?.disconnect())

// Nothing to truncate once the real content already fits - before the
// first client-side measurement (contentHeight starts at 0), this
// defaults to true, so SSR/no-JS output stays truncated (the safer
// default - a real visitor's first paint matches what most read-more
// implementations settle on) rather than silently dumping everything.
const truncated = computed(() => contentHeight.value === 0 || contentHeight.value > props.previewHeight)

const maxHeight = computed(() => {
  if (!truncated.value)
    return undefined
  return `${open.value ? contentHeight.value : props.previewHeight}px`
})

function toggle() {
  open.value = !open.value
}

const theme = useComponentTheme('readMore', readMoreTheme)
const ui = computed(() => theme.value({ open: open.value }))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const contentProps = computed(() => resolveSlot(ui.value.content, props.ui?.content))
const fadeProps = computed(() => resolveSlot(ui.value.fade, props.ui?.fade))
const triggerProps = computed(() => resolveSlot(ui.value.trigger, props.ui?.trigger))
const triggerIconProps = computed(() => resolveSlot(ui.value.triggerIcon, props.ui?.triggerIcon))
</script>

<template>
  <div v-bind="rootProps">
    <div ref="contentEl" :style="{ maxHeight }" v-bind="contentProps">
      <slot />
    </div>
    <div v-if="truncated && !open" v-bind="fadeProps" />
    <button v-if="truncated" type="button" v-bind="triggerProps" @click="toggle">
      {{ open ? messages.showLess : messages.showMore }}
      <Icon :name="icons.chevronDown" v-bind="triggerIconProps" />
    </button>
  </div>
</template>
