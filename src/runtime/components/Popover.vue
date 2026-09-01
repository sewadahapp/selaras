<script setup lang="ts">
import type { PopoverSlots } from '../theme/popover'
import type { UiProp } from '../utils/ui'
import { PopoverArrow, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { computed, ref, watch } from 'vue'
import { popoverTheme } from '../theme/popover'
import { resolveSlot, useComponentTheme } from '../utils/ui'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  /** Forwarded to Reka UI's own PopoverRoot `modal` prop - `true` traps focus and blocks interaction with the rest of the page, like a lightweight modal dialog. */
  modal?: boolean
  /** When `false`, Escape and an outside click (or, since a popover is non-modal by default, an outside element merely receiving focus) no longer close the popover - the `escapeKeyDown`/`pointerDownOutside`/`focusOutside` events still fire, so a consumer can still react, but none of them close it on their own anymore. */
  dismissible?: boolean
  /** Shows the little pointer triangle connecting the popover to its trigger. */
  arrow?: boolean
  ui?: UiProp<PopoverSlots>
}>(), {
  side: 'bottom',
  align: 'center',
  modal: false,
  dismissible: true,
  arrow: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'escapeKeyDown': [event: KeyboardEvent]
  'pointerDownOutside': [event: Event]
  'focusOutside': [event: Event]
}>()

function onEscapeKeyDown(event: KeyboardEvent) {
  if (!props.dismissible)
    event.preventDefault()
  emit('escapeKeyDown', event)
}

function onPointerDownOutside(event: Event) {
  if (!props.dismissible)
    event.preventDefault()
  emit('pointerDownOutside', event)
}

// See Modal.vue for why this needs its own guard, separate from
// pointerDownOutside - Reka's DismissableLayer treats an outside element
// merely receiving focus as its own dismiss trigger, only reachable for a
// non-modal surface (a modal one traps focus entirely). Popover defaults
// to non-modal, so this is reachable out of the box here, not just
// behind an opt-in `modal="false"` like it was for Modal/Slideover.
function onFocusOutside(event: Event) {
  if (!props.dismissible)
    event.preventDefault()
  emit('focusOutside', event)
}

const theme = useComponentTheme('popover', popoverTheme)
const ui = computed(() => theme.value())

const contentProps = computed(() => resolveSlot(ui.value.content, props.ui?.content))
const arrowProps = computed(() => resolveSlot(ui.value.arrow, props.ui?.arrow))

// Mirrors Modal.vue's own fullscreen/internalFullscreen pattern - an
// always-concrete local ref synced with an *optional* external v-model,
// rather than binding `:open="modelValue"` straight through. A compiled
// SFC binding Reka's `PopoverRoot`/`DialogRoot` `:open` directly to an
// optional prop that's currently `undefined` (genuinely uncontrolled, no
// v-model) breaks Reka's own passive/uncontrolled useVModel mode in a
// real browser once a second instance of the same SFC exists on the
// page - keeping `open` always a real boolean sidesteps that mode
// entirely instead of relying on it.
const internalOpen = ref(props.modelValue ?? false)
watch(() => props.modelValue, (value) => {
  if (value !== undefined)
    internalOpen.value = value
})
function onUpdateOpen(value: boolean) {
  internalOpen.value = value
  emit('update:modelValue', value)
}
</script>

<template>
  <PopoverRoot :open="internalOpen" :modal="modal" @update:open="onUpdateOpen">
    <PopoverTrigger v-if="$slots.default" as-child>
      <slot />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        :side="side"
        :align="align"
        :side-offset="8"
        v-bind="contentProps"
        @escape-key-down="onEscapeKeyDown"
        @pointer-down-outside="onPointerDownOutside"
        @focus-outside="onFocusOutside"
      >
        <slot name="content" />
        <PopoverArrow v-if="arrow" v-bind="arrowProps" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
