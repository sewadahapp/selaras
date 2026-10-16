<script setup lang="ts">
import type { ToolbarSeparatorThemeSlots } from '../theme/toolbar-separator'
import type { UiProp } from '../utils/ui'
import { Separator } from 'reka-ui'
import { computed, inject } from 'vue'
import { toolbarSeparatorTheme } from '../theme/toolbar-separator'
import { TOOLBAR_CONTEXT } from '../utils/toolbar'
import { useComponentTheme, useRootProps } from '../utils/ui'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<ToolbarSeparatorProps>(), { decorative: true })
export interface ToolbarSeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
  ui?: UiProp<ToolbarSeparatorThemeSlots>
}
const toolbar = inject(TOOLBAR_CONTEXT, undefined)
const orientation = computed(() => props.orientation ?? (toolbar?.value.orientation === 'vertical' ? 'horizontal' : 'vertical'))
const theme = useComponentTheme('toolbarSeparator', toolbarSeparatorTheme)
const ui = computed(() => theme.value({ orientation: orientation.value }))
const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
</script>

<template>
  <Separator :orientation="orientation" :decorative="decorative" v-bind="rootProps" />
</template>
