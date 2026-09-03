<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { SplitterThemeSlots } from '../theme/splitter'
import type { UiProp } from '../utils/ui'
import { SplitterGroup } from 'reka-ui'
import { computed } from 'vue'
import { splitterTheme } from '../theme/splitter'
import { useComponentTheme, useRootProps } from '../utils/ui'

type SplitterVariants = VariantProps<typeof splitterTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SplitterProps>(), {
  direction: 'horizontal',
})

const emit = defineEmits<SplitterEmits>()

export interface SplitterStorage {
  getItem: (name: string) => string | null
  setItem: (name: string, value: string) => void
}

export interface SplitterProps {
  /** @default 'horizontal' */
  direction?: SplitterVariants['direction']
  /** Persists each panel's size under this key once set - via `storage` below, or Reka's own `localStorage`-backed default when that's left unset. */
  autoSaveId?: string
  /** How many pixels an arrow-key press resizes the focused handle by. @default 10 */
  keyboardResizeBy?: number
  /** Overrides where `autoSaveId` persists to - `localStorage` by default. */
  storage?: SplitterStorage
  ui?: UiProp<SplitterThemeSlots>
}

export interface SplitterEmits {
  /** Fires on every layout change (drag, keyboard resize, collapse/expand) with each panel's own current size. */
  layout: [sizes: number[]]
}

const theme = useComponentTheme('splitter', splitterTheme)
const ui = computed(() => theme.value({ direction: props.direction }))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
</script>

<template>
  <SplitterGroup
    :direction="direction"
    :auto-save-id="autoSaveId"
    :keyboard-resize-by="keyboardResizeBy"
    :storage="storage"
    v-bind="rootProps"
    @layout="(sizes) => emit('layout', sizes)"
  >
    <slot />
  </SplitterGroup>
</template>
