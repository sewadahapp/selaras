<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { CardGroupThemeSlots } from '../theme/card-group'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { cardGroupTheme } from '../theme/card-group'
import { useComponentTheme, useRootProps } from '../utils/ui'

type CardGroupVariants = VariantProps<typeof cardGroupTheme>

defineOptions({ inheritAttrs: false })

const props = defineProps<CardGroupProps>()

export interface CardGroupProps {
  /** Column count at the `sm` breakpoint and up - single column below it regardless. @default 2 */
  cols?: CardGroupVariants['cols']
  ui?: UiProp<CardGroupThemeSlots>
}

const theme = useComponentTheme('cardGroup', cardGroupTheme)
const ui = computed(() => theme.value({ cols: props.cols }))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
</script>

<template>
  <div v-bind="rootProps">
    <slot />
  </div>
</template>
