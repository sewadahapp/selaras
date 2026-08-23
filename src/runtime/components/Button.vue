<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { Component } from 'vue'
import type { ButtonSlots } from '../theme/button'
import type { UiProp } from '../utils/ui'
import { Primitive } from 'reka-ui'
import { computed } from 'vue'
import { buttonTheme } from '../theme/button'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

type ButtonVariants = VariantProps<typeof buttonTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  /** A tag name ('a', 'span', ...) or a component reference (e.g. NuxtLink, via resolveComponent) - Primitive renders whichever is given. */
  as?: string | Component
  color?: ButtonVariants['color']
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  block?: boolean
  disabled?: boolean
  /** Shows a spinner in the leading icon's place. Doesn't imply `disabled` - combine `:loading="x" :disabled="x"` if a busy button shouldn't be clickable. */
  loading?: boolean
  /** Adds `--ui-shadow-md` - independent of `variant`, so it composes with any of them. */
  raised?: boolean
  icon?: string
  trailingIcon?: string
  ui?: UiProp<ButtonSlots>
}>(), {
  as: 'button',
})

const theme = useComponentTheme('button', buttonTheme)

const ui = computed(() => theme.value({
  color: props.color,
  variant: props.variant,
  size: props.size,
  block: props.block,
  disabled: props.disabled,
  raised: props.raised,
}))

const rootProps = useRootProps(() => ui.value.base, () => props.ui?.base)
</script>

<template>
  <Primitive :as="as" :disabled="disabled" v-bind="rootProps">
    <Icon v-if="loading" name="lucide:loader-2" class="animate-spin" v-bind="resolveSlot(ui.leadingIcon, props.ui?.leadingIcon)" />
    <Icon v-else-if="icon" :name="icon" v-bind="resolveSlot(ui.leadingIcon, props.ui?.leadingIcon)" />
    <slot />
    <Icon v-if="trailingIcon" :name="trailingIcon" v-bind="resolveSlot(ui.trailingIcon, props.ui?.trailingIcon)" />
  </Primitive>
</template>
