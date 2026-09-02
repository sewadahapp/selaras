<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { TextareaThemeSlots } from '../theme/textarea'
import type { UiProp } from '../utils/ui'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useFormField } from '../composables/use-form-field'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { textareaTheme } from '../theme/textarea'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Button from './Button.vue'
import Icon from './Icon.vue'

type TextareaVariants = VariantProps<typeof textareaTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TextareaProps>(), {
  rows: 3,
  color: 'primary',
})

const emit = defineEmits<TextareaEmits>()

export interface TextareaProps {
  id?: string
  name?: string
  modelValue?: string
  placeholder?: string
  rows?: number
  size?: TextareaVariants['size']
  disabled?: boolean
  invalid?: boolean
  /** The focus-ring color - the resting (unfocused) ring stays neutral regardless. */
  color?: TextareaVariants['color']
  clearable?: boolean
  icon?: string
  trailingIcon?: string
  /** Grows the box to fit its content instead of a fixed height + scrollbar/drag-handle. */
  autoresize?: boolean
  /** autoresize only - caps how many rows it can grow to before switching to a scrollbar (0/unset grows indefinitely). */
  maxrows?: number
  ui?: UiProp<TextareaThemeSlots>
}

export interface TextareaEmits {
  'update:modelValue': [value: string]
}

const field = useFormField()

const textareaId = computed(() => props.id ?? field?.id)
const textareaInvalid = computed(() => props.invalid || (field?.invalid.value ?? false))
const describedBy = computed(() => field?.describedBy.value)

const hasValue = computed(() => props.modelValue !== undefined && props.modelValue !== '')
const showClear = computed(() => !!props.clearable && !props.disabled && hasValue.value)

function clear() {
  emit('update:modelValue', '')
}

const effectiveSize = computed(() => props.size ?? field?.size ?? 'md')
// One size step down from the textarea itself - matches Input's own
// clear-button sizing (see Input.vue's clearSize).
const clearSize = computed(() => ({ sm: 'sm', md: 'sm', lg: 'md' } as const)[effectiveSize.value])

const icons = useIcons()
const messages = useMessages()
const theme = useComponentTheme('textarea', textareaTheme)

const ui = computed(() => theme.value({
  size: effectiveSize.value,
  color: props.color,
  invalid: textareaInvalid.value,
  hasLeadingIcon: !!props.icon,
  hasTrailingIcon: !!props.trailingIcon || showClear.value,
  autoresize: props.autoresize,
}))

// Plain resolveSlot (no $attrs merge) - unlike Input.vue's own root, which
// merges fallthrough attrs onto its wrapper div. Textarea had no wrapper
// at all before this, so an attr like `maxlength`/`spellcheck` already
// landed on the real <textarea>; keeping that (not copying Input's own
// wrapper-catches-fallthrough shape) avoids silently regressing it once
// this wrapper exists purely for icon/clear positioning.
const rootProps = computed(() => resolveSlot(ui.value.root, props.ui?.root))
const baseProps = useRootProps(() => ui.value.base, () => props.ui?.base)

const textareaRef = ref<HTMLTextAreaElement>()

async function resize() {
  if (!props.autoresize || !textareaRef.value)
    return
  await nextTick()
  const el = textareaRef.value
  el.style.height = 'auto'
  if (props.maxrows) {
    const cs = getComputedStyle(el)
    const lineHeight = Number.parseFloat(cs.lineHeight)
    const padding = Number.parseFloat(cs.paddingTop) + Number.parseFloat(cs.paddingBottom)
    const maxHeight = lineHeight * props.maxrows + padding
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden'
    return
  }
  el.style.height = `${el.scrollHeight}px`
}

onMounted(resize)
// Covers a programmatic value change (not just typing, which already
// triggers the @input handler below).
watch(() => props.modelValue, resize)
</script>

<template>
  <div v-bind="rootProps">
    <Icon v-if="icon" :name="icon" v-bind="resolveSlot(ui.leadingIcon, props.ui?.leadingIcon)" />
    <textarea
      :id="textareaId"
      ref="textareaRef"
      data-ui-group-item
      :value="modelValue"
      :name="name ?? field?.name"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      :aria-invalid="textareaInvalid || undefined"
      :aria-describedby="describedBy"
      v-bind="baseProps"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value); resize()"
    />
    <Button
      v-if="showClear"
      :size="clearSize"
      variant="text"
      color="neutral"
      :aria-label="messages.clear"
      v-bind="resolveSlot(ui.clear, props.ui?.clear)"
      @click="clear"
    >
      <template #icon="{ class: iconClass }">
        <slot name="clear-icon">
          <Icon :name="icons.close" :class="iconClass" />
        </slot>
      </template>
    </Button>
    <Icon v-else-if="trailingIcon" :name="trailingIcon" v-bind="resolveSlot(ui.trailingIcon, props.ui?.trailingIcon)" />
  </div>
</template>
