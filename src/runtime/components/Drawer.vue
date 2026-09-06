<script setup lang="ts">
import type { DrawerOpenChangeDetails } from 'reka-ui'
import type { DrawerThemeSlots } from '../theme/drawer'
import type { UiProp } from '../utils/ui'
import { DrawerClose, DrawerContent, DrawerDescription, DrawerHandle, DrawerOverlay, DrawerPortal, DrawerRoot, DrawerTitle, DrawerTrigger } from 'reka-ui'
import { computed, ref, useSlots, watch, watchEffect } from 'vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { drawerTheme } from '../theme/drawer'
import { resolveSlot, useComponentTheme } from '../utils/ui'
import Button from './Button.vue'
import Icon from './Icon.vue'

export interface DrawerProps {
  open?: boolean
  title?: string
  description?: string
  /** Which edge the panel slides in from - also the direction it's swiped toward to dismiss it. */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Shows a small grip bar at the top of the panel, signaling it's draggable. */
  handle?: boolean
  /** Resting heights/widths the panel snaps to while dragging, before fully open - fractions (0-1), pixels (>1), or CSS length strings ('30rem'). */
  snapPoints?: (number | string)[]
  /** v-model:snapPoint - the currently active snap point. */
  snapPoint?: number | string | null
  /** Snap to the next sequential point one step at a time, instead of whichever is nearest by drag distance. */
  snapToSequentialPoints?: boolean
  /** When `false`, Escape, an outside click, and a drag-to-dismiss swipe no longer close the drawer - the `escapeKeyDown`/`pointerDownOutside`/`focusOutside` events still fire (a swipe gesture has no separate event of its own to intercept ahead of the close), so a consumer can still react, but none of them close it on their own anymore. */
  dismissible?: boolean
  /** Set `false` to render no close button at all - usually paired with `dismissible={false}` for a drawer that only closes via an explicit footer action. */
  close?: boolean
  /** Forwarded to Reka UI's own DrawerRoot `modal` prop - `'trap-focus'` traps focus but allows outside pointer events (non-modal side panels). `overlay` below is independent of this. */
  modal?: boolean | 'trap-focus'
  /** Set `false` to render no backdrop behind the drawer at all. */
  overlay?: boolean
  /** Set `false` to skip the open/close animation entirely - this library's animation is CSS-only, so this just omits those classes rather than toggling a JS transition system. */
  transition?: boolean
  ui?: UiProp<DrawerThemeSlots>
}

export interface DrawerEmits {
  'update:open': [value: boolean]
  'update:snapPoint': [value: number | string | null]
  'escapeKeyDown': [event: KeyboardEvent]
  'pointerDownOutside': [event: Event]
  'focusOutside': [event: Event]
  /** Fires once the close transition has actually finished (or immediately, if `transition` is off) - the signal a programmatic caller needs before it's safe to unmount this instance without cutting its exit animation short. */
  'afterLeave': []
}

const props = withDefaults(defineProps<DrawerProps>(), {
  side: 'bottom',
  handle: true,
  dismissible: true,
  close: true,
  modal: true,
  overlay: true,
  transition: true,
})

const emit = defineEmits<DrawerEmits>()

// The edge a drawer sits on is the direction you'd naturally swipe it back
// to - top/bottom need translating to Reka's up/down vocabulary, left/right
// already match.
const swipeDirection = computed(() => ({ top: 'up', bottom: 'down', left: 'left', right: 'right' } as const)[props.side])

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
// non-modal drawer (a modal one traps focus entirely).
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

// Mirrors Modal.vue/Slideover.vue's own internalOpen pattern - see
// Slideover.vue for why this needs to stay an always-concrete local ref
// rather than binding `:open="open"` straight through.
const internalOpen = ref(props.open ?? false)
watch(() => props.open, (value) => {
  if (value !== undefined)
    internalOpen.value = value
})

// A swipe gesture has no separate event of its own (unlike Escape/
// outside-press) to preventDefault ahead of the close - Reka only
// reports it after the fact, via this second argument on update:open.
// Blocking it here (never letting internalOpen/the emit see the `false`)
// is the only interception point available for it.
function onUpdateOpen(value: boolean, details?: DrawerOpenChangeDetails) {
  if (!props.dismissible && details?.reason === 'swipe')
    return
  internalOpen.value = value
  emit('update:open', value)
}

// transition=false means no animate-out class ever runs, so animationend
// never fires on its own - emit afterLeave directly in that case. Keys
// off internalOpen (the real open state) rather than props.open, which
// stays undefined forever for a genuinely uncontrolled Drawer.
watch(internalOpen, (value) => {
  if (!value && !props.transition)
    emit('afterLeave')
})

const slots = useSlots()

if (import.meta.dev) {
  watchEffect(() => {
    if (!props.title && !slots.header && !slots.content)
      console.warn('[SDrawer] no accessible name - pass a `title` prop, or a `header`/`content` slot containing a heading, so screen readers can announce this drawer.')
  })
}

const icons = useIcons()
const messages = useMessages()
const theme = useComponentTheme('drawer', drawerTheme)
const ui = computed(() => theme.value({ side: props.side, transition: props.transition }))

const overlayProps = computed(() => resolveSlot(ui.value.overlay, props.ui?.overlay))
const contentProps = computed(() => resolveSlot(ui.value.content, props.ui?.content))
const handleProps = computed(() => resolveSlot(ui.value.handle, props.ui?.handle))
const headerProps = computed(() => resolveSlot(ui.value.header, props.ui?.header))
const titleProps = computed(() => resolveSlot(ui.value.title, props.ui?.title))
const descriptionProps = computed(() => resolveSlot(ui.value.description, props.ui?.description))
const closeProps = computed(() => resolveSlot(ui.value.close, props.ui?.close))
const bodyProps = computed(() => resolveSlot(ui.value.body, props.ui?.body))
const footerProps = computed(() => resolveSlot(ui.value.footer, props.ui?.footer))
</script>

<template>
  <DrawerRoot
    :open="internalOpen"
    :modal="modal"
    :swipe-direction="swipeDirection"
    :snap-points="snapPoints"
    :snap-point="snapPoint"
    :snap-to-sequential-points="snapToSequentialPoints"
    @update:open="onUpdateOpen"
    @update:snap-point="(value) => $emit('update:snapPoint', value)"
  >
    <DrawerTrigger v-if="$slots.default" as-child>
      <slot />
    </DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay v-if="overlay" v-bind="overlayProps" />
      <DrawerContent
        v-bind="contentProps"
        @escape-key-down="onEscapeKeyDown"
        @pointer-down-outside="onPointerDownOutside"
        @focus-outside="onFocusOutside"
        @animationend="onContentAnimationEnd"
      >
        <slot v-if="$slots.content" name="content" />
        <template v-else>
          <DrawerHandle v-if="handle" v-bind="handleProps" />
          <div v-if="title || description || $slots.header || close" v-bind="headerProps">
            <div>
              <slot name="header">
                <DrawerTitle v-if="title" v-bind="titleProps">
                  {{ title }}
                </DrawerTitle>
                <DrawerDescription v-if="description" v-bind="descriptionProps">
                  {{ description }}
                </DrawerDescription>
              </slot>
            </div>
            <DrawerClose v-if="close" as-child>
              <Button size="sm" variant="ghost" color="neutral" :aria-label="messages.close" v-bind="closeProps">
                <template #icon="{ class: iconClass }">
                  <slot name="close-icon">
                    <Icon :name="icons.close" :class="iconClass" />
                  </slot>
                </template>
              </Button>
            </DrawerClose>
          </div>
          <div v-bind="bodyProps">
            <slot name="body" />
          </div>
          <div v-if="$slots.footer" v-bind="footerProps">
            <slot name="footer" />
          </div>
        </template>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>
