<script setup lang="ts">
import type { AlertDialogThemeSlots } from '../theme/alert-dialog'
import type { UiProp } from '../utils/ui'
import type { ButtonProps } from './Button.vue'
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogOverlay, AlertDialogPortal, AlertDialogRoot, AlertDialogTitle, AlertDialogTrigger } from 'reka-ui'
import { computed, ref, useSlots, watch, watchEffect } from 'vue'
import { useMessages } from '../composables/use-messages'
import { alertDialogTheme } from '../theme/alert-dialog'
import { resolveSlot, useComponentTheme } from '../utils/ui'
import Button from './Button.vue'

export interface AlertDialogProps {
  open?: boolean
  title?: string
  description?: string
  /** Label for the default Cancel button - only rendered when no `footer` slot is given. @default 'Cancel' */
  cancelLabel?: string
  /** Label for the default action button - only rendered when no `footer` slot is given. @default 'Continue' */
  actionLabel?: string
  /** Color for the default action button - e.g. `'danger'` for a destructive confirmation. */
  actionColor?: ButtonProps['color']
  /** When `false`, Escape no longer closes the dialog - the `escapeKeyDown` event still fires either way. An outside click never closes it regardless of this: Reka's AlertDialogContent blocks that unconditionally, matching the "must make an explicit choice" semantic this component exists for (unlike Modal, which allows both by default). */
  dismissible?: boolean
  /** Set `false` to render no backdrop behind the dialog at all. */
  overlay?: boolean
  /** Set `false` to skip the open/close animation entirely - this library's animation is CSS-only, so this just omits those classes rather than toggling a JS transition system. */
  transition?: boolean
  ui?: UiProp<AlertDialogThemeSlots>
}

export interface AlertDialogEmits {
  'update:open': [value: boolean]
  /** Fired when the default Cancel button is clicked - not fired for a custom `footer` slot, which owns its own buttons/handlers entirely. */
  'cancel': []
  /** Fired when the default action button is clicked. */
  'confirm': []
  'escapeKeyDown': [event: KeyboardEvent]
  /** A pointer went down outside the dialog - this can never actually close it (Reka blocks that unconditionally), but still useful for something like a shake animation to signal it won't. */
  'pointerDownOutside': [event: Event]
  /** Fires once the close transition has actually finished (or immediately, if `transition` is off) - the signal a programmatic caller needs before it's safe to unmount this instance without cutting its exit animation short. */
  'afterLeave': []
}

const props = withDefaults(defineProps<AlertDialogProps>(), {
  dismissible: true,
  overlay: true,
  transition: true,
})

const emit = defineEmits<AlertDialogEmits>()

function onEscapeKeyDown(event: KeyboardEvent) {
  if (!props.dismissible)
    event.preventDefault()
  emit('escapeKeyDown', event)
}

// Always fires (Reka's AlertDialogContent already calls preventDefault on
// the underlying pointerDownOutside/interactOutside internally, so this
// can never actually close the dialog) - forwarded anyway so a consumer
// can still react, e.g. a shake animation.
function onPointerDownOutside(event: Event) {
  emit('pointerDownOutside', event)
}

// See Modal.vue for the same pattern. Guarded by target===currentTarget
// so a child's own animation can't be mistaken for the dialog's; guarded
// by data-state==='closed' so the *opening* animation's own animationend
// doesn't also fire this.
function onContentAnimationEnd(event: AnimationEvent) {
  if (event.target !== event.currentTarget)
    return
  if ((event.target as HTMLElement).getAttribute('data-state') === 'closed')
    emit('afterLeave')
}

// Mirrors Modal.vue's own internalOpen pattern - see there for why this
// needs to stay an always-concrete local ref rather than binding
// `:open="open"` straight through.
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
// stays undefined forever for a genuinely uncontrolled AlertDialog.
watch(internalOpen, (value) => {
  if (!value && !props.transition)
    emit('afterLeave')
})

// AlertDialogCancel/AlertDialogAction already trigger the actual close
// themselves (both wrap Reka's own DialogClose, which calls the root's
// onOpenChange(false) directly - already caught by onUpdateOpen above via
// AlertDialogRoot's own @update:open) - these only add the semantic
// cancel/confirm signal on top, not a second close.
function onCancel() {
  emit('cancel')
}

function onConfirm() {
  emit('confirm')
}

const slots = useSlots()

if (import.meta.dev) {
  watchEffect(() => {
    if (!props.title && !slots.header)
      console.warn('[SAlertDialog] no accessible name - pass a `title` prop, or a `header` slot containing a heading, so screen readers can announce this dialog.')
  })
}

const messages = useMessages()
const theme = useComponentTheme('alertDialog', alertDialogTheme)
const ui = computed(() => theme.value({ transition: props.transition }))

const overlayProps = computed(() => resolveSlot(ui.value.overlay, props.ui?.overlay))
const contentProps = computed(() => resolveSlot(ui.value.content, props.ui?.content))
const headerProps = computed(() => resolveSlot(ui.value.header, props.ui?.header))
const titleProps = computed(() => resolveSlot(ui.value.title, props.ui?.title))
const descriptionProps = computed(() => resolveSlot(ui.value.description, props.ui?.description))
const bodyProps = computed(() => resolveSlot(ui.value.body, props.ui?.body))
const footerProps = computed(() => resolveSlot(ui.value.footer, props.ui?.footer))
</script>

<template>
  <AlertDialogRoot :open="internalOpen" @update:open="onUpdateOpen">
    <AlertDialogTrigger v-if="$slots.default" as-child>
      <slot />
    </AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay v-if="overlay" v-bind="overlayProps" />
      <AlertDialogContent
        v-bind="contentProps"
        @escape-key-down="onEscapeKeyDown"
        @pointer-down-outside="onPointerDownOutside"
        @animationend="onContentAnimationEnd"
      >
        <div v-if="title || description || $slots.header" v-bind="headerProps">
          <slot name="header">
            <AlertDialogTitle v-if="title" v-bind="titleProps">
              {{ title }}
            </AlertDialogTitle>
            <AlertDialogDescription v-if="description" v-bind="descriptionProps">
              {{ description }}
            </AlertDialogDescription>
          </slot>
        </div>
        <div v-if="$slots.body" v-bind="bodyProps">
          <slot name="body" />
        </div>
        <div v-bind="footerProps">
          <slot name="footer">
            <AlertDialogCancel as-child>
              <Button variant="ghost" color="neutral" @click="onCancel">
                {{ cancelLabel ?? messages.cancel }}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction as-child>
              <Button :color="actionColor" @click="onConfirm">
                {{ actionLabel ?? messages.continue }}
              </Button>
            </AlertDialogAction>
          </slot>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
