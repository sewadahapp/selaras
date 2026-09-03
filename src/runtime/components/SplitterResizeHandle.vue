<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { SplitterResizeHandleThemeSlots } from '../theme/splitter-resize-handle'
import type { UiProp } from '../utils/ui'
import { SplitterResizeHandle as RekaSplitterResizeHandle } from 'reka-ui'
import { computed } from 'vue'
import { splitterResizeHandleTheme } from '../theme/splitter-resize-handle'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

type SplitterResizeHandleVariants = VariantProps<typeof splitterResizeHandleTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SplitterResizeHandleProps>(), {
  direction: 'horizontal',
})

export interface SplitterResizeHandleProps {
  /** Match the parent Splitter's own `direction` - this isn't read from it automatically. @default 'horizontal' */
  direction?: SplitterResizeHandleVariants['direction']
  disabled?: boolean
  ui?: UiProp<SplitterResizeHandleThemeSlots>
}

const theme = useComponentTheme('splitterResizeHandle', splitterResizeHandleTheme)
const ui = computed(() => theme.value({ direction: props.direction }))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const lineProps = computed(() => resolveSlot(ui.value.line, props.ui?.line))
</script>

<template>
  <RekaSplitterResizeHandle :disabled="disabled" v-bind="rootProps">
    <div v-bind="lineProps" />
  </RekaSplitterResizeHandle>
</template>
