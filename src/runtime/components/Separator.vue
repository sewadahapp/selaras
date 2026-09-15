<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { SeparatorThemeSlots } from '../theme/separator'
import type { ColorRole } from '../utils/color-registry'
import type { UiProp } from '../utils/ui'
import { Separator } from 'reka-ui'
import { computed } from 'vue'
import { separatorTheme } from '../theme/separator'
import { resolveRegisteredColorRole } from '../utils/registered-colors'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

type SeparatorVariants = VariantProps<typeof separatorTheme>

defineOptions({ inheritAttrs: false })

const props = defineProps<SeparatorProps>()

defineSlots<SeparatorSlots>()

export interface SeparatorProps {
  orientation?: SeparatorVariants['orientation']
  variant?: SeparatorVariants['variant']
  color?: ColorRole
  /** Purely visual, not announced to assistive tech (role="none" instead of role="separator"). */
  decorative?: boolean
  ui?: UiProp<SeparatorThemeSlots>
}

export interface SeparatorSlots {
  /** A label centered in the line (e.g. "Or continue with") - renders a second line segment after it, splitting the available space evenly on both sides. */
  default?: () => any
}

const theme = useComponentTheme('separator', separatorTheme)
const effectiveColor = computed(() => resolveRegisteredColorRole(props.color ?? 'neutral', 'neutral'))
const ui = computed(() => theme.value({
  orientation: props.orientation,
  variant: props.variant,
  color: effectiveColor.value as SeparatorVariants['color'],
}))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const lineProps = computed(() => resolveSlot(ui.value.line, props.ui?.line))
const labelProps = computed(() => resolveSlot(ui.value.label, props.ui?.label))
</script>

<template>
  <Separator :orientation="orientation" :decorative="decorative" :data-selaras-color="effectiveColor" v-bind="rootProps">
    <span v-bind="lineProps" />
    <template v-if="$slots.default">
      <span v-bind="labelProps">
        <slot />
      </span>
      <span v-bind="lineProps" />
    </template>
  </Separator>
</template>
