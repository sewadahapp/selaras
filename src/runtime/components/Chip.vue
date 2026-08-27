<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { ChipSlots } from '../theme/chip'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { chipTheme } from '../theme/chip'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Icon from './Icon.vue'

type ChipVariants = VariantProps<typeof chipTheme>

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  label?: string
  icon?: string
  removable?: boolean
  /** Overrides the remove button's aria-label - it's icon-only, so it needs a name from somewhere. Defaults to "Remove {label}", or plain "Remove" without one. */
  removeLabel?: string
  disabled?: boolean
  /** Fully-rounded pill shape instead of the default (Badge's own) small radius. */
  rounded?: boolean
  color?: ChipVariants['color']
  variant?: ChipVariants['variant']
  size?: ChipVariants['size']
  ui?: UiProp<ChipSlots>
}>()

const emit = defineEmits<{
  remove: []
}>()

const icons = useIcons()
const messages = useMessages()
const theme = useComponentTheme('chip', chipTheme)

const ui = computed(() => theme.value({
  color: props.color,
  variant: props.variant,
  size: props.size,
  disabled: props.disabled,
  rounded: props.rounded,
  removable: props.removable,
}))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)

const effectiveRemoveLabel = computed(() => props.removeLabel ?? messages.value.removeItem(props.label))
</script>

<template>
  <span v-bind="rootProps">
    <Icon v-if="icon" :name="icon" v-bind="resolveSlot(ui.leadingIcon, props.ui?.leadingIcon)" />
    <span v-bind="resolveSlot(ui.label, props.ui?.label)">
      <slot>{{ label }}</slot>
    </span>
    <!--
      Unlike remove-icon (swaps just the glyph), this replaces the whole
      control - needed when a host context has its own interactive element
      that must BE the remove control (e.g. Reka TagsInput's
      TagsInputItemDelete, which renders its own <button> and can't be
      nested inside ours without recreating the button-in-button
      corruption already fixed once for Select's clear button). The
      scoped `class` still carries this slot's resolved/overridden
      classes so a replacement can opt into matching Chip's own look.
    -->
    <slot
      v-if="removable"
      name="remove"
      :class="resolveSlot(ui.remove, props.ui?.remove).class"
      :remove="() => emit('remove')"
    >
      <button
        type="button"
        :disabled="disabled"
        :aria-label="effectiveRemoveLabel"
        v-bind="resolveSlot(ui.remove, props.ui?.remove)"
        @click.stop="emit('remove')"
      >
        <slot name="remove-icon">
          <Icon :name="icons.close" v-bind="resolveSlot(ui.removeIcon, props.ui?.removeIcon)" />
        </slot>
      </button>
    </slot>
  </span>
</template>
