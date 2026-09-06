<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { Component } from 'vue'
import type { ButtonThemeSlots } from '../theme/button'
import type { UiProp } from '../utils/ui'
import { Primitive } from 'reka-ui'
import { computed, useSlots } from 'vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { useRippleEnabled } from '../composables/use-ripple'
import { vRipple } from '../directives/ripple'
import { buttonTheme } from '../theme/button'
import { applyClassPrefix, resolveSlot, useComponentTheme, useRootProps, useThemeProps } from '../utils/ui'
import Icon from './Icon.vue'

type ButtonVariants = VariantProps<typeof buttonTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ButtonProps>(), {
  as: 'button',
  // A bare `square?: boolean` prop with no default here resolves an absent
  // prop to `false` (Vue's own Boolean-prop casting), not `undefined` - that
  // would make `props.square ?? iconOnly.value` below always see `false`
  // and never fall through to the auto-detected default. An explicit
  // `undefined` default disables that casting, so omitting the prop stays
  // genuinely undefined.
  square: undefined,
})

export interface ButtonProps {
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
  /** Forces (or blocks) the equal-width/height "icon button" shape - overrides the auto-detected default below either direction. Needed for a button whose content is short *text* rather than an icon (a calendar day, a page number) - `iconOnly` below only looks at whether there's a default slot at all, not how wide its content happens to be, so a grid of these would otherwise size to each cell's own digit count instead of forming a uniform grid. */
  square?: boolean
  ui?: UiProp<ButtonThemeSlots>
}

const slots = useSlots()

// No default slot content at all (just an icon, or just a loading spinner)
// - shape it as a square instead of a text button's asymmetric horizontal
// padding, so a consumer doesn't have to remember to opt into that shape
// for the common "icon-only" case. The `square` prop above overrides this
// auto-detection when the content isn't an icon but is still short/fixed-
// width enough to want the same equal-width/height treatment.
const iconOnly = computed(() => !slots.default)

const icons = useIcons()
const messages = useMessages()
const rippleEnabledSetting = useRippleEnabled()
// `text` never paints a background at any state (see theme/button.ts) -
// a ripple is itself a transient background fill, so it would reintroduce
// the exact "fill competing with an adjacent border" look that variant
// exists to avoid.
const rippleEnabled = computed(() => rippleEnabledSetting.value && props.variant !== 'text')
const theme = useComponentTheme('button', buttonTheme)
const themeProps = useThemeProps('button')

const ui = computed(() => theme.value({
  color: props.color ?? themeProps.value.color as ButtonVariants['color'],
  variant: props.variant,
  size: props.size ?? themeProps.value.size as ButtonVariants['size'],
  block: props.block,
  raised: props.raised,
  square: props.square ?? iconOnly.value,
}))

const rootProps = useRootProps(() => ui.value.base, () => props.ui?.base)
</script>

<template>
  <Primitive v-ripple="rippleEnabled" :as="as" :disabled="disabled" :aria-busy="loading || undefined" v-bind="rootProps">
    <Icon v-if="loading" :name="icons.loading" :class="applyClassPrefix('animate-spin')" v-bind="resolveSlot(ui.leadingIcon, props.ui?.leadingIcon)" />
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
    <span v-if="loading" :class="applyClassPrefix('sr-only')">{{ messages.loading }}</span>
    <slot />
    <!-- Same reasoning as the leading `icon` slot above - a named slot so a
      consumer can swap the trailing glyph entirely (DatePicker's button-mode
      trigger, for one), while `trailingIcon` alone still covers the common case. -->
    <slot name="trailing-icon" :class="resolveSlot(ui.trailingIcon, props.ui?.trailingIcon).class">
      <Icon v-if="trailingIcon" :name="trailingIcon" v-bind="resolveSlot(ui.trailingIcon, props.ui?.trailingIcon)" />
    </slot>
  </Primitive>
</template>
