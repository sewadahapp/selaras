<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { SplitterResizeHandleThemeSlots } from '../theme/splitter-resize-handle'
import type { ColorRole } from '../utils/color-registry'
import type { UiProp } from '../utils/ui'
import { SplitterResizeHandle as RekaSplitterResizeHandle } from 'reka-ui'
import { computed } from 'vue'
import { splitterResizeHandleTheme } from '../theme/splitter-resize-handle'
import { resolveRegisteredColorRole } from '../utils/registered-colors'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

type SplitterResizeHandleVariants = VariantProps<typeof splitterResizeHandleTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SplitterResizeHandleProps>(), {
  direction: 'horizontal',
})

export interface SplitterResizeHandleProps {
  /** Match the parent Splitter's own `direction` - this isn't read from it automatically. @default 'horizontal' */
  direction?: SplitterResizeHandleVariants['direction']
  /** The hover and drag accent. @default 'primary' */
  color?: ColorRole
  disabled?: boolean
  ui?: UiProp<SplitterResizeHandleThemeSlots>
}

const theme = useComponentTheme('splitterResizeHandle', splitterResizeHandleTheme)
const effectiveColor = computed(() => resolveRegisteredColorRole(props.color ?? 'primary', 'primary'))
const ui = computed(() => theme.value({ direction: props.direction, color: effectiveColor.value as SplitterResizeHandleVariants['color'] }))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const lineProps = computed(() => resolveSlot(ui.value.line, props.ui?.line))
</script>

<template>
  <RekaSplitterResizeHandle :disabled="disabled" :data-selaras-color="effectiveColor" v-bind="rootProps">
    <div v-bind="lineProps" />
  </RekaSplitterResizeHandle>
</template>
