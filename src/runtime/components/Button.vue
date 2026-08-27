<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { Component } from 'vue'
import type { ButtonSlots } from '../theme/button'
import type { UiProp } from '../utils/ui'
import { Primitive } from 'reka-ui'
import { computed, useSlots } from 'vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { useRippleEnabled } from '../composables/use-ripple'
import { vRipple } from '../directives/ripple'
import { buttonTheme } from '../theme/button'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Icon from './Icon.vue'

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

const slots = useSlots()

// No default slot content at all (just an icon, or just a loading spinner)
// - shape it as a square instead of a text button's asymmetric horizontal
// padding, matching a comparable reference's own icon-button behavior rather than
// requiring a separate opt-in flag (a comparable reference's own iconOnly) a consumer could
// forget to set.
const iconOnly = computed(() => !slots.default)

const icons = useIcons()
const messages = useMessages()
const rippleEnabled = useRippleEnabled()
const theme = useComponentTheme('button', buttonTheme)

const ui = computed(() => theme.value({
  color: props.color,
  variant: props.variant,
  size: props.size,
  block: props.block,
  raised: props.raised,
  square: iconOnly.value,
}))

const rootProps = useRootProps(() => ui.value.base, () => props.ui?.base)
</script>

<template>
  <Primitive v-ripple="rippleEnabled" :as="as" :disabled="disabled" :aria-busy="loading || undefined" v-bind="rootProps">
    <Icon v-if="loading" :name="icons.loading" class="animate-spin" v-bind="resolveSlot(ui.leadingIcon, props.ui?.leadingIcon)" />
    <!--
      A named slot (not just the `icon` prop) so a consumer building a
      custom control on top of Button (Select's clear button, for one) can
      swap the glyph entirely while still reusing Button's own size-driven
      class via the scoped `class` - most callers never touch this and just
      use `icon`, which the fallback below still handles unchanged.
    -->
    <slot v-else name="icon" :class="resolveSlot(ui.leadingIcon, props.ui?.leadingIcon).class">
      <Icon v-if="icon" :name="icon" v-bind="resolveSlot(ui.leadingIcon, props.ui?.leadingIcon)" />
    </slot>
    <span v-if="loading" class="sr-only">{{ messages.loading }}</span>
    <slot />
    <Icon v-if="trailingIcon" :name="trailingIcon" v-bind="resolveSlot(ui.trailingIcon, props.ui?.trailingIcon)" />
  </Primitive>
</template>
