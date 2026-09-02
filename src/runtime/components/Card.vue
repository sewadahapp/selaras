<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { CardThemeSlots } from '../theme/card'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { cardTheme } from '../theme/card'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

type CardVariants = VariantProps<typeof cardTheme>

defineOptions({ inheritAttrs: false })

const props = defineProps<CardProps>()

defineSlots<CardSlots>()

export interface CardProps {
  /** @default 'outline' */
  variant?: CardVariants['variant']
  ui?: UiProp<CardThemeSlots>
}

export interface CardSlots {
  header?: () => any
  default?: () => any
  footer?: () => any
}

const theme = useComponentTheme('card', cardTheme)

const ui = computed(() => theme.value({
  variant: props.variant,
}))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
</script>

<template>
  <div v-bind="rootProps">
    <div v-if="$slots.header" v-bind="resolveSlot(ui.header, props.ui?.header)">
      <slot name="header" />
    </div>
    <div v-bind="resolveSlot(ui.body, props.ui?.body)">
      <slot />
    </div>
    <div v-if="$slots.footer" v-bind="resolveSlot(ui.footer, props.ui?.footer)">
      <slot name="footer" />
    </div>
  </div>
</template>
