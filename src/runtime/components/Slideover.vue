<script setup lang="ts">
import type { SlideoverSlots } from '../theme/slideover'
import type { UiProp } from '../utils/ui'
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger } from 'reka-ui'
import { computed, useSlots, watch, watchEffect } from 'vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { slideoverTheme } from '../theme/slideover'
import { resolveSlot, useComponentTheme } from '../utils/ui'
import Button from './Button.vue'
import Icon from './Icon.vue'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  title?: string
  description?: string
  /** Which edge the panel slides in from. */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Floats the panel with a margin and rounded corners instead of sitting flush against the edge. */
  inset?: boolean
  /** When `false`, Escape and an outside click (or, for a non-modal dialog, an outside element merely receiving focus) no longer close the dialog - the `escapeKeyDown`/`pointerDownOutside`/`focusOutside` events still fire, so a consumer can still react (e.g. a shake animation), but none of them close it on their own anymore. */
  dismissible?: boolean
  /** Set `false` to render no close button at all - usually paired with `dismissible={false}` for a dialog that only closes via an explicit footer action. */
  close?: boolean
  /** Forwarded to Reka UI's own DialogRoot `modal` prop - set `false` for a non-modal dialog that doesn't block interaction with the rest of the page (no focus trap, outside elements stay reachable). `overlay` below is independent of this - a non-modal dialog can still show a backdrop, and a modal one can hide it. */
  modal?: boolean
  /** Set `false` to render no backdrop behind the dialog at all. */
  overlay?: boolean
  /** Set `false` to skip the open/close animation entirely - this library's animation is CSS-only, so this just omits those classes rather than toggling a JS transition system. */
  transition?: boolean
  ui?: UiProp<SlideoverSlots>
}>(), {
  side: 'right',
  inset: false,
  dismissible: true,
  close: true,
  modal: true,
  overlay: true,
  transition: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'escapeKeyDown': [event: KeyboardEvent]
  'pointerDownOutside': [event: Event]
  'focusOutside': [event: Event]
  /** Fires once the close transition has actually finished (or immediately, if `transition` is off) - the signal a programmatic caller needs before it's safe to unmount this instance without cutting its exit animation short. */
  'afterLeave': []
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
// non-modal dialog (a modal one traps focus entirely).
function onFocusOutside(event: Event) {
  if (!props.dismissible)
    event.preventDefault()
  emit('focusOutside', event)
}

// See Modal.vue for the same pattern. Guarded by target===currentTarget
// so a child's own animation can't be mistaken for the panel's; guarded
// by data-state==='closed' so the *opening* animation's own animationend
// doesn't also fire this.
function onContentAnimationEnd(event: AnimationEvent) {
  if (event.target !== event.currentTarget)
    return
  if ((event.target as HTMLElement).getAttribute('data-state') === 'closed')
    emit('afterLeave')
}

// transition=false means no animate-out class ever runs, so animationend
// never fires on its own - emit afterLeave directly in that case.
watch(() => props.modelValue, (value) => {
  if (!value && !props.transition)
    emit('afterLeave')
})

const slots = useSlots()

if (import.meta.dev) {
  watchEffect(() => {
    if (!props.title && !slots.header && !slots.content)
      console.warn('[SSlideover] no accessible name - pass a `title` prop, or a `header`/`content` slot containing a heading, so screen readers can announce this dialog.')
  })
}

const icons = useIcons()
const messages = useMessages()
const theme = useComponentTheme('slideover', slideoverTheme)
const ui = computed(() => theme.value({ side: props.side, inset: props.inset, transition: props.transition }))

const overlayProps = computed(() => resolveSlot(ui.value.overlay, props.ui?.overlay))
const contentProps = computed(() => resolveSlot(ui.value.content, props.ui?.content))
const headerProps = computed(() => resolveSlot(ui.value.header, props.ui?.header))
const titleProps = computed(() => resolveSlot(ui.value.title, props.ui?.title))
const descriptionProps = computed(() => resolveSlot(ui.value.description, props.ui?.description))
const closeProps = computed(() => resolveSlot(ui.value.close, props.ui?.close))
const bodyProps = computed(() => resolveSlot(ui.value.body, props.ui?.body))
const footerProps = computed(() => resolveSlot(ui.value.footer, props.ui?.footer))
</script>

<template>
  <DialogRoot :open="modelValue" :modal="modal" @update:open="(value) => emit('update:modelValue', value)">
    <DialogTrigger v-if="$slots.default" as-child>
      <slot />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay v-if="overlay" v-bind="overlayProps" />
      <DialogContent
        v-bind="contentProps"
        @escape-key-down="onEscapeKeyDown"
        @pointer-down-outside="onPointerDownOutside"
        @focus-outside="onFocusOutside"
        @animationend="onContentAnimationEnd"
      >
        <slot v-if="$slots.content" name="content" />
        <template v-else>
          <div v-if="title || description || $slots.header || close" v-bind="headerProps">
            <div>
              <slot name="header">
                <DialogTitle v-if="title" v-bind="titleProps">
                  {{ title }}
                </DialogTitle>
                <DialogDescription v-if="description" v-bind="descriptionProps">
                  {{ description }}
                </DialogDescription>
              </slot>
            </div>
            <DialogClose v-if="close" as-child>
              <Button size="sm" variant="ghost" color="neutral" :aria-label="messages.close" v-bind="closeProps">
                <template #icon="{ class: iconClass }">
                  <slot name="close-icon">
                    <Icon :name="icons.close" :class="iconClass" />
                  </slot>
                </template>
              </Button>
            </DialogClose>
          </div>
          <div v-bind="bodyProps">
            <slot name="body" />
          </div>
          <div v-if="$slots.footer" v-bind="footerProps">
            <slot name="footer" />
          </div>
        </template>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
