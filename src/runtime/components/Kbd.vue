<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { KbdThemeSlots } from '../theme/kbd'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { kbdTheme } from '../theme/kbd'
import { useComponentTheme, useRootProps } from '../utils/ui'

type KbdVariants = VariantProps<typeof kbdTheme>

defineOptions({ inheritAttrs: false })

const props = defineProps<KbdProps>()

// A small, fixed set of universally-recognized keyboard symbols - resolved
// only for the `value` prop (a plain string this component can transform);
// the default slot stays a raw escape hatch for anything more custom (a
// pre-assembled "Ctrl+K", an icon, whatever).
const KEY_SYMBOLS: Record<string, string> = {
  meta: '⌘',
  command: '⌘',
  cmd: '⌘',
  ctrl: '⌃',
  control: '⌃',
  alt: '⌥',
  option: '⌥',
  shift: '⇧',
  enter: '↵',
  return: '↵',
  backspace: '⌫',
  delete: '⌦',
  tab: '⇥',
  capslock: '⇪',
  escape: 'Esc',
  esc: 'Esc',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
  space: 'Space',
}

export interface KbdProps {
  /** A key name resolved via a small built-in symbol map (`meta` -> ⌘, `up` -> ↑, ...) - falls back to the raw string itself when there's no match. Omit in favor of the default slot for anything more custom. */
  value?: string
  size?: KbdVariants['size']
  ui?: UiProp<KbdThemeSlots>
}

const resolvedValue = computed(() => props.value ? (KEY_SYMBOLS[props.value.toLowerCase()] ?? props.value) : undefined)

const theme = useComponentTheme('kbd', kbdTheme)
const ui = computed(() => theme.value({ size: props.size }))

const rootProps = useRootProps(() => ui.value.base, () => props.ui?.base)
</script>

<template>
  <kbd v-bind="rootProps"><slot>{{ resolvedValue }}</slot></kbd>
</template>
