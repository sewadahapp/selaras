<script setup lang="ts">
import type { ModalThemeSlots } from '../theme/modal'
import type { UiProp } from '../utils/ui'
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger } from 'reka-ui'
import { computed, ref, useSlots, watch, watchEffect } from 'vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { modalTheme } from '../theme/modal'
import { resolveSlot, useComponentTheme } from '../utils/ui'
import Button from './Button.vue'
import Icon from './Icon.vue'

export interface ModalProps {
  open?: boolean
  title?: string
  description?: string
  /** Full-viewport layout instead of the default centered card. Still the initial state when `maximizable` is set - the toggle button takes over from there, optionally controllable via `v-model:fullscreen`. */
  fullscreen?: boolean
  /** Shows a header button that toggles `fullscreen` at runtime, matching a comparable reference's own dialog maximize toggle - distinct from `fullscreen` alone, which only sets the initial/fixed layout with no way for the user to change it. */
  maximizable?: boolean
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
  ui?: UiProp<ModalThemeSlots>
}

export interface ModalEmits {
  'update:open': [value: boolean]
  'update:fullscreen': [value: boolean]
  'escapeKeyDown': [event: KeyboardEvent]
  'pointerDownOutside': [event: Event]
  'focusOutside': [event: Event]
  /** Fires once the close transition has actually finished (or immediately, if `transition` is off) - the signal a programmatic caller needs before it's safe to unmount this instance without cutting its exit animation short. */
  'afterLeave': []
}

const props = withDefaults(defineProps<ModalProps>(), {
  dismissible: true,
  close: true,
  modal: true,
  overlay: true,
  transition: true,
})

const emit = defineEmits<ModalEmits>()

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

// Only reachable for a non-modal dialog (modal traps focus entirely, so
// nothing outside can ever receive it) - Reka's DismissableLayer treats
// an outside element merely receiving focus as its own separate dismiss
// trigger from a plain pointerdown, so `dismissible` needs to guard this
// one too, not just pointerDownOutside/escapeKeyDown. Found by testing
// the modal="false" + dismissible="false" combination directly (clicking
// an outside button silently closed the dialog despite dismissible being
// false) - unreachable before `modal` existed as a prop, since a modal
// dialog's own focus trap made this a non-issue.
function onFocusOutside(event: Event) {
  if (!props.dismissible)
    event.preventDefault()
  emit('focusOutside', event)
}

// Guarded by target===currentTarget so a child's own animation can't be
// mistaken for the dialog's; guarded by data-state==='closed' so the
// *opening* animation's own animationend doesn't also fire this.
function onContentAnimationEnd(event: AnimationEvent) {
  if (event.target !== event.currentTarget)
    return
  if ((event.target as HTMLElement).getAttribute('data-state') === 'closed')
    emit('afterLeave')
}

// Mirrors DatePicker's own view/internalView/update:view pattern - an
// always-concrete local ref synced with an *optional* external v-model,
// rather than binding `:open="open"` straight through. A compiled SFC
// binding Reka's `DialogRoot` `:open` directly to an optional prop
// that's currently `undefined` (genuinely uncontrolled, no v-model)
// breaks Reka's own passive/uncontrolled useVModel mode in a real
// browser once a second instance of the same SFC exists on the page -
// keeping `open` always a real boolean sidesteps that mode entirely
// instead of relying on it.
const internalOpen = ref(props.open ?? false)
watch(() => props.open, (value) => {
  if (value !== undefined)
    internalOpen.value = value
})
function onUpdateOpen(value: boolean) {
  internalOpen.value = value
  emit('update:open', value)
}

// transition=false means no animate-out class ever runs, so animationend
// never fires on its own - emit afterLeave directly in that case. Keys
// off internalOpen (the real open state) rather than props.open, which
// stays undefined forever for a genuinely uncontrolled Modal.
watch(internalOpen, (value) => {
  if (!value && !props.transition)
    emit('afterLeave')
})

// `fullscreen` alone keeps working exactly as before (just the initial
// value here); `maximizable`'s toggle button flips this local copy and
// emits `update:fullscreen`, so a consumer only needs `v-model:fullscreen`
// if they actually want to observe/control it.
const internalFullscreen = ref(props.fullscreen ?? false)
watch(() => props.fullscreen, (value) => {
  if (value !== undefined)
    internalFullscreen.value = value
})
function toggleFullscreen() {
  internalFullscreen.value = !internalFullscreen.value
  emit('update:fullscreen', internalFullscreen.value)
}

const slots = useSlots()

if (import.meta.dev) {
  watchEffect(() => {
    if (!props.title && !slots.header && !slots.content)
      console.warn('[SModal] no accessible name - pass a `title` prop, or a `header`/`content` slot containing a heading, so screen readers can announce this dialog.')
  })
}

const icons = useIcons()
const messages = useMessages()
const theme = useComponentTheme('modal', modalTheme)
const ui = computed(() => theme.value({ fullscreen: internalFullscreen.value, transition: props.transition }))

const overlayProps = computed(() => resolveSlot(ui.value.overlay, props.ui?.overlay))
const contentProps = computed(() => resolveSlot(ui.value.content, props.ui?.content))
const headerProps = computed(() => resolveSlot(ui.value.header, props.ui?.header))
const headerActionsProps = computed(() => resolveSlot(ui.value.headerActions, props.ui?.headerActions))
const titleProps = computed(() => resolveSlot(ui.value.title, props.ui?.title))
const descriptionProps = computed(() => resolveSlot(ui.value.description, props.ui?.description))
const closeProps = computed(() => resolveSlot(ui.value.close, props.ui?.close))
const maximizeProps = computed(() => resolveSlot(ui.value.maximize, props.ui?.maximize))
const bodyProps = computed(() => resolveSlot(ui.value.body, props.ui?.body))
const footerProps = computed(() => resolveSlot(ui.value.footer, props.ui?.footer))
</script>

<template>
  <DialogRoot :open="internalOpen" :modal="modal" @update:open="onUpdateOpen">
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
          <div v-if="title || description || $slots.header || close || maximizable" v-bind="headerProps">
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
            <div v-bind="headerActionsProps">
              <Button
                v-if="maximizable"
                size="sm"
                variant="ghost"
                color="neutral"
                :aria-label="internalFullscreen ? messages.minimize : messages.maximize"
                v-bind="maximizeProps"
                @click="toggleFullscreen"
              >
                <template #icon="{ class: iconClass }">
                  <slot :name="internalFullscreen ? 'minimize-icon' : 'maximize-icon'">
                    <Icon :name="internalFullscreen ? icons.minimize : icons.maximize" :class="iconClass" />
                  </slot>
                </template>
              </Button>
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
