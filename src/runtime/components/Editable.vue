<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { EditableThemeSlots } from '../theme/editable'
import type { ColorRole } from '../utils/color-registry'
import type { UiProp } from '../utils/ui'
import { Primitive } from 'reka-ui'
import { computed, mergeProps, nextTick, onMounted, ref, useAttrs, useId, watch } from 'vue'
import { useFormField } from '../composables/use-form-field'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { editableTheme } from '../theme/editable'
import { isNativeInputA11yAttr, isNativeInputAttr } from '../utils/native-input'
import { resolveRegisteredColorRole } from '../utils/registered-colors'
import { applyClassPrefix, resolveSlot, useComponentTheme, useFallthroughAttrs, useRootProps, useThemeProps } from '../utils/ui'
import Button from './Button.vue'

type EditableVariants = VariantProps<typeof editableTheme>
export type EditableActivationMode = 'focus' | 'dblclick' | 'none'
export type EditableSubmitMode = 'enter' | 'blur' | 'both' | 'none'

export interface EditableProps {
  modelValue?: string
  defaultValue?: string
  editing?: boolean
  defaultEditing?: boolean
  activationMode?: EditableActivationMode
  submitMode?: EditableSubmitMode
  controls?: boolean
  multiline?: boolean
  rows?: number
  placeholder?: string | { preview: string, edit: string }
  selectOnFocus?: boolean
  disabled?: boolean
  readonly?: boolean
  loading?: boolean
  invalid?: boolean
  required?: boolean
  maxLength?: number
  id?: string
  name?: string
  size?: EditableVariants['size']
  color?: ColorRole
  editIcon?: string
  submitIcon?: string
  cancelIcon?: string
  editLabel?: string
  submitLabel?: string
  cancelLabel?: string
  ui?: UiProp<EditableThemeSlots>
}

export interface EditableEmits {
  'update:modelValue': [value: string]
  'update:editing': [editing: boolean]
  'edit': []
  'submit': [value: string]
  'cancel': [value: string]
}

export interface EditableSlotProps {
  value: string
  draft: string
  editing: boolean
  disabled: boolean
  edit: () => void
  submit: () => boolean
  cancel: () => void
}

export interface EditableSlots {
  default?: (props: EditableSlotProps) => any
  preview?: (props: EditableSlotProps) => any
  controls?: (props: EditableSlotProps) => any
}

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<EditableProps>(), {
  editing: undefined,
  controls: true,
  activationMode: 'focus',
  submitMode: 'both',
  selectOnFocus: true,
})
const emit = defineEmits<EditableEmits>()
defineSlots<EditableSlots>()

const field = useFormField()
const attrs = useAttrs()
const icons = useIcons()
const messages = useMessages()
const defaults = useThemeProps('editable')
const innerValue = ref(props.defaultValue ?? '')
const value = computed(() => props.modelValue ?? innerValue.value)
const draft = ref(value.value)
const innerEditing = ref(!!props.defaultEditing)
const isEditing = computed(() => (props.editing ?? innerEditing.value) && !props.disabled && !props.readonly)
const blocked = computed(() => !!(props.disabled || props.readonly || props.loading))
const root = ref<HTMLElement>()
const input = ref<HTMLInputElement | HTMLTextAreaElement>()
const preview = ref<InstanceType<typeof Primitive>>()
const inputId = props.id ?? field?.id ?? useId()
const fieldName = computed(() => props.name ?? field?.name)
const formId = computed(() => attrs.form as string | undefined)
const invalid = computed(() => !!props.invalid || !!field?.invalid.value)
const size = computed(() => props.size ?? field?.size ?? defaults.value.size as EditableVariants['size'] ?? 'md')
const color = computed(() => resolveRegisteredColorRole(props.color ?? defaults.value.color ?? 'primary', 'primary'))
const buttonSize = computed(() => size.value === 'lg' ? 'md' : 'sm')
const theme = useComponentTheme('editable', editableTheme)
const ui = computed(() => theme.value({ size: size.value, color: color.value as EditableVariants['color'], invalid: invalid.value, multiline: props.multiline, empty: !value.value }))
const placeholder = computed(() => typeof props.placeholder === 'string'
  ? { preview: props.placeholder, edit: props.placeholder }
  : props.placeholder ?? { preview: messages.value.editablePlaceholder, edit: '' })

const isInputAttr = (key: string) => isNativeInputAttr(key) || isNativeInputA11yAttr(key)
const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root, { exclude: isInputAttr })
const nativeAttrs = useFallthroughAttrs(isInputAttr)
const labelledBy = computed(() => attrs['aria-labelledby'] ?? field?.labelId)
const describedBy = computed(() => [attrs['aria-describedby'], field?.describedBy.value].filter(Boolean).join(' ') || undefined)
const label = computed(() => attrs['aria-label'] ?? (labelledBy.value ? undefined : messages.value.editableInput))
const inputProps = computed(() => mergeProps(resolveSlot(ui.value.input, props.ui?.input), nativeAttrs.value))
const scope = computed<EditableSlotProps>(() => ({ value: value.value, draft: draft.value, editing: isEditing.value, disabled: blocked.value, edit, submit, cancel }))
let restoreTarget: HTMLElement | undefined
let restoringFocus = false
let restoreOnClose = true
let closeReason: 'submit' | undefined
const composing = ref(false)

function setEditing(editing: boolean) {
  innerEditing.value = editing
  emit('update:editing', editing)
}

async function focusInput() {
  await nextTick()
  if (!isEditing.value)
    return
  input.value?.focus({ preventScroll: true })
  if (props.selectOnFocus)
    input.value?.select()
}

function edit() {
  if (!blocked.value && !isEditing.value)
    setEditing(true)
}

function cancel(restore = true) {
  if (!isEditing.value)
    return
  restoreOnClose = restore
  setEditing(false)
}

function submit(restore = true): boolean {
  if (!isEditing.value || blocked.value || closeReason)
    return false
  if (input.value && !input.value.checkValidity()) {
    input.value.reportValidity()
    return false
  }
  closeReason = 'submit'
  restoreOnClose = restore
  innerValue.value = draft.value
  emit('update:modelValue', draft.value)
  setEditing(false)
  emit('submit', draft.value)
  return true
}

watch(value, next => draft.value = next)
watch(isEditing, async (editing, previous) => {
  if (editing) {
    restoreTarget = document.activeElement instanceof HTMLElement ? document.activeElement : undefined
    draft.value = value.value
    closeReason = undefined
    restoreOnClose = true
    emit('edit')
    await focusInput()
  }
  else if (previous) {
    if (closeReason !== 'submit')
      emit('cancel', value.value)
    draft.value = value.value
    closeReason = undefined
    await nextTick()
    if (restoreOnClose) {
      restoringFocus = true
      const target = restoreTarget?.isConnected ? restoreTarget : preview.value?.$el
      target?.focus({ preventScroll: true })
      restoringFocus = false
    }
  }
})
watch(() => props.disabled || props.readonly, (blocked) => {
  if (blocked) {
    innerEditing.value = false
    if (props.editing)
      emit('update:editing', false)
  }
})
onMounted(() => {
  if (isEditing.value)
    focusInput()
})

async function onFocusOut(event: FocusEvent) {
  // Focusout runs before the browser updates activeElement. Internal controls
  // must keep the draft intact until their own action runs.
  if (event.relatedTarget instanceof Node && root.value?.contains(event.relatedTarget))
    return
  await nextTick()
  if (!isEditing.value || props.loading || root.value?.contains(document.activeElement))
    return
  if (props.submitMode === 'blur' || props.submitMode === 'both')
    submit(false)
  else if (props.submitMode === 'enter')
    cancel(false)
}

function onKeydown(event: KeyboardEvent) {
  if (event.defaultPrevented || event.isComposing || composing.value || event.keyCode === 229)
    return
  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    cancel()
  }
  else if (event.key === 'Enter' && (!props.multiline || event.ctrlKey || event.metaKey)) {
    event.preventDefault()
    event.stopPropagation()
    if (props.submitMode === 'enter' || props.submitMode === 'both')
      submit()
  }
}

function onPreviewFocus() {
  if (!restoringFocus && props.activationMode === 'focus')
    edit()
}

function onPreviewKeydown(event: KeyboardEvent) {
  if (props.activationMode !== 'none' && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault()
    edit()
  }
}

async function onInvalid(event: Event) {
  event.preventDefault()
  edit()
  await nextTick()
  input.value?.reportValidity()
}

defineExpose({ edit, submit, cancel })
</script>

<template>
  <div ref="root" :data-selaras-color="invalid ? 'danger' : color" :data-editing="isEditing ? '' : undefined" :aria-busy="loading || undefined" :data-selaras-field-filled="value ? '' : undefined" :data-selaras-field-active="isEditing ? '' : undefined" v-bind="rootProps" @focusout="onFocusOut">
    <div v-bind="resolveSlot(ui.area, props.ui?.area)">
      <component
        :is="multiline ? 'textarea' : 'input'"
        v-if="isEditing"
        :id="inputId"
        ref="input"
        :value="draft"
        :rows="multiline ? rows ?? 3 : undefined"
        :placeholder="placeholder.edit"
        :disabled="disabled || loading"
        :required="required"
        :maxlength="maxLength"
        :aria-invalid="invalid || undefined"
        v-bind="inputProps"
        :aria-label="label"
        :aria-labelledby="labelledBy"
        :aria-describedby="describedBy"
        @input="draft = ($event.target as HTMLInputElement).value"
        @keydown="onKeydown"
        @compositionstart="composing = true"
        @compositionend="composing = false"
      />
      <Primitive
        v-else
        :id="inputId"
        ref="preview"
        :as="activationMode === 'none' || readonly ? 'span' : 'button'"
        :type="activationMode !== 'none' && !readonly ? 'button' : undefined"
        :tabindex="activationMode === 'none' || readonly ? -1 : undefined"
        :disabled="disabled || loading || undefined"
        :aria-disabled="disabled || loading || undefined"
        :aria-label="attrs['aria-label']"
        :aria-labelledby="labelledBy"
        :aria-describedby="describedBy"
        v-bind="resolveSlot(ui.preview, props.ui?.preview)"
        @focus="onPreviewFocus"
        @click="activationMode === 'focus' && edit()"
        @dblclick="activationMode === 'dblclick' && edit()"
        @keydown="onPreviewKeydown"
      >
        <slot name="preview" v-bind="scope">
          <slot v-bind="scope">
            {{ value || placeholder.preview }}
          </slot>
        </slot>
      </Primitive>
    </div>
    <div v-if="controls || $slots.controls" v-bind="resolveSlot(ui.controls, props.ui?.controls)">
      <slot name="controls" v-bind="scope">
        <template v-if="isEditing">
          <Button type="button" :size="buttonSize" :color="color" variant="soft" square :disabled="blocked" :loading="loading" :icon="submitIcon ?? icons.check" :aria-label="submitLabel ?? messages.save" :title="submitLabel ?? messages.save" v-bind="resolveSlot(ui.submit, props.ui?.submit)" @click="submit()" />
          <Button type="button" :size="buttonSize" color="neutral" variant="ghost" square :disabled="blocked" :icon="cancelIcon ?? icons.close" :aria-label="cancelLabel ?? messages.cancel" :title="cancelLabel ?? messages.cancel" v-bind="resolveSlot(ui.cancel, props.ui?.cancel)" @click="cancel()" />
        </template>
        <Button v-else type="button" :size="buttonSize" color="neutral" variant="ghost" square :disabled="blocked" :loading="loading" :icon="editIcon ?? icons.edit" :aria-label="editLabel ?? messages.edit" :title="editLabel ?? messages.edit" v-bind="resolveSlot(ui.edit, props.ui?.edit)" @click="edit" />
      </slot>
    </div>
    <component :is="multiline ? 'textarea' : 'input'" v-if="fieldName" :class="applyClassPrefix('sr-only')" :type="multiline ? undefined : 'text'" tabindex="-1" aria-hidden="true" :name="fieldName" :form="formId" :value="value" :required="required" :disabled="disabled" :readonly="readonly" @invalid="onInvalid" />
  </div>
</template>
