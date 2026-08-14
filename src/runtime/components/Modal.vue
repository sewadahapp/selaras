<script setup lang="ts">
import type { ModalSlots } from '../theme/modal'
import type { UiProp } from '../utils/ui'
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger } from 'reka-ui'
import { computed, useSlots } from 'vue'
import { modalTheme } from '../theme/modal'
import { resolveSlot, useComponentTheme } from '../utils/ui'

const props = defineProps<{
  modelValue?: boolean
  title?: string
  description?: string
  ui?: UiProp<ModalSlots>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const slots = useSlots()

const theme = useComponentTheme('modal', modalTheme)
const ui = computed(() => theme.value())

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
    <DialogTrigger v-if="slots.default" as-child>
      <slot />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay v-bind="overlayProps" />
      <DialogContent v-bind="contentProps">
        <div v-if="title || description || slots.header" v-bind="headerProps">
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
          <DialogClose as-child>
            <button type="button" v-bind="closeProps">
              <Icon name="lucide:x" class="size-4" />
            </button>
          </DialogClose>
        </div>
        <div v-bind="bodyProps">
          <slot name="body" />
        </div>
        <div v-if="slots.footer" v-bind="footerProps">
          <slot name="footer" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
