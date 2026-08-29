<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { BadgeSlots } from '../theme/badge'
import type { UiProp } from '../utils/ui'
import { computed, useSlots } from 'vue'
import { badgeTheme } from '../theme/badge'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Icon from './Icon.vue'

type BadgeVariants = VariantProps<typeof badgeTheme>

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  label?: string
  icon?: string
  trailingIcon?: string
  /** A small solid-colored circle - a status indicator (online/offline, etc), shown alongside the label or alone without one. Always uses the color's solid shade, regardless of `variant`. */
  dot?: boolean
  color?: BadgeVariants['color']
  variant?: BadgeVariants['variant']
  size?: BadgeVariants['size']
  ui?: UiProp<BadgeSlots>
}>()

const slots = useSlots()

const hasLabel = computed(() => !!(props.label || slots.default))
// dot with nothing else - just the bare circle, no padded pill around it.
// A bare dot conveys nothing to screen readers on its own; pass a plain
// aria-label (it flows through via the fallthrough attrs below) when
// there's no visible label to describe what it means.
const dotOnly = computed(() => !!props.dot && !hasLabel.value)
// icon with nothing else - see the theme's iconOnly comment for why.
const iconOnly = computed(() => !hasLabel.value && !!props.icon && !props.dot)

const theme = useComponentTheme('badge', badgeTheme)

const ui = computed(() => theme.value({
  color: props.color,
  variant: props.variant,
  size: props.size,
  iconOnly: iconOnly.value,
}))

const rootProps = useRootProps(() => ui.value.base, () => props.ui?.base)
const dotOnlyProps = useRootProps(() => ui.value.dot, () => props.ui?.dot)
</script>

<template>
  <span v-if="dotOnly" v-bind="dotOnlyProps" />
  <span v-else v-bind="rootProps">
    <span v-if="dot" v-bind="resolveSlot(ui.dot, props.ui?.dot)" />
    <slot name="icon" :class="resolveSlot(ui.leadingIcon, props.ui?.leadingIcon).class">
      <Icon v-if="icon" :name="icon" v-bind="resolveSlot(ui.leadingIcon, props.ui?.leadingIcon)" />
    </slot>
    <span v-if="hasLabel" v-bind="resolveSlot(ui.label, props.ui?.label)">
      <slot>{{ label }}</slot>
    </span>
    <slot name="trailing-icon" :class="resolveSlot(ui.trailingIcon, props.ui?.trailingIcon).class">
      <Icon v-if="trailingIcon" :name="trailingIcon" v-bind="resolveSlot(ui.trailingIcon, props.ui?.trailingIcon)" />
    </slot>
  </span>
</template>
