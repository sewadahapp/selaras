<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { BadgeSlots } from '../theme/badge'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { badgeTheme } from '../theme/badge'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

type BadgeVariants = VariantProps<typeof badgeTheme>

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  label?: string
  icon?: string
  trailingIcon?: string
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
    <Icon v-if="icon" :name="icon" v-bind="resolveSlot(ui.leadingIcon, props.ui?.leadingIcon)" />
    <span v-bind="resolveSlot(ui.label, props.ui?.label)">
      <slot>{{ label }}</slot>
    </span>
    <Icon v-if="trailingIcon" :name="trailingIcon" v-bind="resolveSlot(ui.trailingIcon, props.ui?.trailingIcon)" />
  </span>
</template>
