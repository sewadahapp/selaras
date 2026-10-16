<script setup lang="ts">
import type { ToolbarThemeSlots } from '../theme/toolbar'
import type { ColorRole } from '../utils/color-registry'
import type { UiProp } from '../utils/ui'
import { ToolbarRoot } from 'reka-ui'
import { computed, provide } from 'vue'
import { toolbarTheme } from '../theme/toolbar'
import { TOOLBAR_CONTEXT } from '../utils/toolbar'
import { useComponentTheme, useRootProps, useThemeProps } from '../utils/ui'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<ToolbarProps>(), { orientation: 'horizontal', loop: true })
defineSlots<ToolbarSlots>()

export interface ToolbarProps {
  orientation?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
  color?: ColorRole
  disabled?: boolean
  loop?: boolean
  dir?: 'ltr' | 'rtl'
  ui?: UiProp<ToolbarThemeSlots>
}
export interface ToolbarSlots { default?: () => any }

const defaults = useThemeProps('toolbar')
const context = computed(() => ({
  size: props.size ?? defaults.value.size as ToolbarProps['size'] ?? 'sm',
  color: props.color ?? defaults.value.color as ColorRole ?? 'primary',
  disabled: !!props.disabled,
  orientation: props.orientation,
}))
provide(TOOLBAR_CONTEXT, context)
const theme = useComponentTheme('toolbar', toolbarTheme)
const ui = computed(() => theme.value({ orientation: props.orientation }))
const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
</script>

<template>
  <ToolbarRoot :orientation="orientation" :dir="dir" :loop="loop" :aria-disabled="disabled || undefined" v-bind="rootProps">
    <slot />
  </ToolbarRoot>
</template>
