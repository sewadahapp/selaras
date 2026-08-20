<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { BadgeSlots } from '../theme/badge'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { badgeTheme } from '../theme/badge'
import { useComponentTheme, useRootProps } from '../utils/ui'

type BadgeVariants = VariantProps<typeof badgeTheme>

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  label?: string
  color?: BadgeVariants['color']
  variant?: BadgeVariants['variant']
  size?: BadgeVariants['size']
  ui?: UiProp<BadgeSlots>
}>()

const theme = useComponentTheme('badge', badgeTheme)

const ui = computed(() => theme.value({
  color: props.color,
  variant: props.variant,
  size: props.size,
}))

const rootProps = useRootProps(() => ui.value.base, () => props.ui?.base)
</script>

<template>
  <span v-bind="rootProps">
    <slot>{{ label }}</slot>
  </span>
</template>
