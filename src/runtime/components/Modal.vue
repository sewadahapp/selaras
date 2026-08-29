<script setup lang="ts">
import type { ModalSlots } from '../theme/modal'
import type { UiProp } from '../utils/ui'
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger } from 'reka-ui'
import { computed, useSlots, watchEffect } from 'vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { modalTheme } from '../theme/modal'
import { resolveSlot, useComponentTheme } from '../utils/ui'
import Button from './Button.vue'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  title?: string
  description?: string
  /** Full-viewport layout instead of the default centered card. */
  fullscreen?: boolean
  /** When `false`, Escape and an outside click no longer close the dialog - the `escapeKeyDown`/`pointerDownOutside` events still fire, so a consumer can still react (e.g. a shake animation), but neither closes it on their own anymore. */
  dismissible?: boolean
  /** Set `false` to render no close button at all - usually paired with `dismissible={false}` for a dialog that only closes via an explicit footer action. */
  close?: boolean
  ui?: UiProp<ModalSlots>
}>(), {
  dismissible: true,
  close: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'escapeKeyDown': [event: KeyboardEvent]
  'pointerDownOutside': [event: Event]
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

const slots = useSlots()

if (import.meta.dev) {
  watchEffect(() => {
    if (!props.title && !slots.header)
      console.warn('[SModal] no accessible name - pass a `title` prop, or a `header` slot containing a heading, so screen readers can announce this dialog.')
  })
}

const icons = useIcons()
const messages = useMessages()
const theme = useComponentTheme('modal', modalTheme)
const ui = computed(() => theme.value({ fullscreen: props.fullscreen }))

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
  <DialogRoot :open="modelValue" @update:open="(value) => emit('update:modelValue', value)">
    <DialogTrigger v-if="$slots.default" as-child>
      <slot />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay v-bind="overlayProps" />
      <DialogContent
        v-bind="contentProps"
        @escape-key-down="onEscapeKeyDown"
        @pointer-down-outside="onPointerDownOutside"
      >
        <div v-if="title || description || $slots.header" v-bind="headerProps">
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
            <Button size="sm" variant="ghost" color="neutral" :icon="icons.close" :aria-label="messages.close" v-bind="closeProps" />
          </DialogClose>
        </div>
        <div v-bind="bodyProps">
          <slot name="body" />
        </div>
        <div v-if="$slots.footer" v-bind="footerProps">
          <slot name="footer" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
