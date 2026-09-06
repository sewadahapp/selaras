<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { FileUploadThemeSlots } from '../theme/file-upload'
import type { UiProp } from '../utils/ui'
import { computed, ref, watch } from 'vue'
import { useFormField } from '../composables/use-form-field'
import { useIcons } from '../composables/use-icons'
import { useLocale } from '../composables/use-locale'
import { useMessages } from '../composables/use-messages'
import { fileUploadTheme } from '../theme/file-upload'
import { formatBytes } from '../utils/format-bytes'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Button from './Button.vue'
import Icon from './Icon.vue'

type FileUploadVariants = VariantProps<typeof fileUploadTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FileUploadProps>(), {
  preview: true,
})

const emit = defineEmits<FileUploadEmits>()

defineSlots<FileUploadSlots>()

export interface FileUploadProps {
  id?: string
  modelValue?: File[]
  /** Comma-separated MIME types/wildcards (`image/*`) or extensions (`.pdf`) - applied to both the native file dialog and dropped files (drops bypass the dialog's own filtering entirely). */
  accept?: string
  /** @default false */
  multiple?: boolean
  /** Only meaningful with `multiple` - excess files beyond this count are rejected, not silently dropped. */
  maxFiles?: number
  /** Bytes. */
  maxSize?: number
  /** Shows an image thumbnail (an object URL) for image files. @default true */
  preview?: boolean
  disabled?: boolean
  invalid?: boolean
  size?: FileUploadVariants['size']
  color?: FileUploadVariants['color']
  name?: string
  required?: boolean
  ui?: UiProp<FileUploadThemeSlots>
}

export interface FileUploadEmits {
  'update:modelValue': [value: File[]]
  /** Fires whenever one or more files are rejected (wrong type, too large, or the count limit was hit) - one reason per rejected file. */
  'error': [errors: { file: File, reason: string }[]]
}

export interface FileUploadSlots {
  /** Replaces the dropzone's own default icon/label/description content. */
  default?: (props: { isDragging: boolean }) => any
  /** Replaces one file row's content. */
  file?: (props: { file: File, index: number, remove: () => void }) => any
}

const field = useFormField()

const fileUploadId = computed(() => props.id ?? field?.id)
const fileUploadInvalid = computed(() => props.invalid || (field?.invalid.value ?? false))
const effectiveSize = computed(() => props.size ?? field?.size ?? 'md')
const describedBy = computed(() => field?.describedBy.value)

const icons = useIcons()
const messages = useMessages()
const effectiveLocale = useLocale()

// Unlike every other component this session (all built on a Reka
// primitive with its own internal uncontrolled-mode fallback), a plain
// `computed(() => props.modelValue ?? [])` has no such fallback - used
// with no v-model at all, dropping/selecting a file would emit
// update:modelValue into the void and the list would never visibly
// change. This mirrors Slider/Modal/Drawer's own internalValue pattern
// instead: an always-concrete local ref, synced from the prop when
// it's actually bound, mutated locally (then emitted) either way - so
// FileUpload works uncontrolled too, matching every other component
// here.
const internalFiles = ref<File[]>(props.modelValue ?? [])
watch(() => props.modelValue, (value) => {
  if (value !== undefined)
    internalFiles.value = value
})

const isDragging = ref(false)
const dropzoneEl = ref<HTMLElement>()
const inputEl = ref<HTMLInputElement>()

// object URL per file (by identity), revoked once that file leaves the
// list (removed, or the whole model replaced) so the browser doesn't
// keep every ever-selected image alive for the page's own lifetime.
const previewUrls = new WeakMap<File, string>()
function previewUrlFor(file: File): string | undefined {
  if (!props.preview || !file.type.startsWith('image/'))
    return undefined
  let url = previewUrls.get(file)
  if (!url) {
    url = URL.createObjectURL(file)
    previewUrls.set(file, url)
  }
  return url
}
function revokePreview(file: File) {
  const url = previewUrls.get(file)
  if (url) {
    URL.revokeObjectURL(url)
    previewUrls.delete(file)
  }
}

function matchesAccept(file: File, accept: string): boolean {
  return accept.split(',').map(p => p.trim()).filter(Boolean).some((pattern) => {
    if (pattern.startsWith('.'))
      return file.name.toLowerCase().endsWith(pattern.toLowerCase())
    if (pattern.endsWith('/*'))
      return file.type.startsWith(pattern.slice(0, -1))
    return file.type === pattern
  })
}

function validate(file: File, acceptedSoFar: number): string | undefined {
  if (props.accept && !matchesAccept(file, props.accept))
    return messages.value.invalidFileType(file.name)
  if (props.maxSize && file.size > props.maxSize)
    return messages.value.invalidFileSize(file.name, formatBytes(props.maxSize, effectiveLocale.value))
  if (props.multiple && props.maxFiles && internalFiles.value.length + acceptedSoFar >= props.maxFiles)
    return messages.value.tooManyFiles(props.maxFiles)
  return undefined
}

function processFiles(fileList: FileList | File[]) {
  if (props.disabled)
    return
  const incoming = Array.from(fileList)
  const accepted: File[] = []
  const errors: { file: File, reason: string }[] = []

  for (const file of incoming) {
    const reason = validate(file, accepted.length)
    if (reason)
      errors.push({ file, reason })
    else
      accepted.push(file)
  }

  if (accepted.length) {
    const next = props.multiple ? [...internalFiles.value, ...accepted] : accepted.slice(0, 1)
    internalFiles.value = next
    emit('update:modelValue', next)
  }
  if (errors.length)
    emit('error', errors)
}

function openDialog() {
  if (!props.disabled)
    inputEl.value?.click()
}

function onInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files?.length)
    processFiles(target.files)
  target.value = ''
}

function onDragEnter(event: DragEvent) {
  event.preventDefault()
  if (!props.disabled)
    isDragging.value = true
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
}

function onDragLeave(event: DragEvent) {
  // dragleave fires when the pointer crosses onto any child element too,
  // not just when it truly leaves the dropzone - checking the related
  // target against the dropzone's own subtree is what avoids the
  // flicker that a naive "clear on every dragleave" would cause.
  const related = event.relatedTarget as Node | null
  if (!related || !dropzoneEl.value?.contains(related))
    isDragging.value = false
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
  if (event.dataTransfer?.files.length)
    processFiles(event.dataTransfer.files)
}

function removeFile(index: number) {
  const file = internalFiles.value[index]
  if (file)
    revokePreview(file)
  const next = internalFiles.value.filter((_, i) => i !== index)
  internalFiles.value = next
  emit('update:modelValue', next)
}

const theme = useComponentTheme('fileUpload', fileUploadTheme)
const ui = computed(() => theme.value({
  size: effectiveSize.value,
  color: props.color,
  invalid: fileUploadInvalid.value,
}))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const dropzoneProps = computed(() => resolveSlot(ui.value.dropzone, props.ui?.dropzone))
const iconProps = computed(() => resolveSlot(ui.value.icon, props.ui?.icon))
const labelProps = computed(() => resolveSlot(ui.value.label, props.ui?.label))
const descriptionProps = computed(() => resolveSlot(ui.value.description, props.ui?.description))
const inputProps = computed(() => resolveSlot(ui.value.input, props.ui?.input))
const fileListProps = computed(() => resolveSlot(ui.value.fileList, props.ui?.fileList))
const fileProps = computed(() => resolveSlot(ui.value.file, props.ui?.file))
const fileThumbnailProps = computed(() => resolveSlot(ui.value.fileThumbnail, props.ui?.fileThumbnail))
const fileIconProps = computed(() => resolveSlot(ui.value.fileIcon, props.ui?.fileIcon))
const fileInfoProps = computed(() => resolveSlot(ui.value.fileInfo, props.ui?.fileInfo))
const fileNameProps = computed(() => resolveSlot(ui.value.fileName, props.ui?.fileName))
const fileSizeProps = computed(() => resolveSlot(ui.value.fileSize, props.ui?.fileSize))
const fileRemoveProps = computed(() => resolveSlot(ui.value.fileRemove, props.ui?.fileRemove))

const removeButtonSize = computed(() => ({ sm: 'sm', md: 'sm', lg: 'md' } as const)[effectiveSize.value])
</script>

<template>
  <div v-bind="rootProps">
    <button
      ref="dropzoneEl"
      type="button"
      :disabled="disabled"
      :data-dragging="isDragging ? '' : undefined"
      v-bind="dropzoneProps"
      @click="openDialog"
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <slot :is-dragging="isDragging">
        <Icon :name="icons.upload" v-bind="iconProps" />
        <span v-bind="labelProps">{{ messages.dropFiles }}</span>
        <span v-if="accept || maxSize" v-bind="descriptionProps">
          <template v-if="accept">{{ accept }}</template>
          <template v-if="accept && maxSize"> · </template>
          <template v-if="maxSize">{{ messages.upToSize(formatBytes(maxSize, effectiveLocale)) }}</template>
        </span>
      </slot>
      <input
        :id="fileUploadId"
        ref="inputEl"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        :name="name ?? field?.name"
        :required="required"
        :aria-invalid="fileUploadInvalid || undefined"
        :aria-describedby="describedBy"
        tabindex="-1"
        v-bind="inputProps"
        @click.stop
        @change="onInputChange"
      >
    </button>
    <ul v-if="internalFiles.length" v-bind="fileListProps">
      <li v-for="(file, index) in internalFiles" :key="index" v-bind="fileProps">
        <slot name="file" :file="file" :index="index" :remove="() => removeFile(index)">
          <img v-if="previewUrlFor(file)" :src="previewUrlFor(file)" :alt="file.name" v-bind="fileThumbnailProps">
          <Icon v-else :name="icons.file" v-bind="fileIconProps" />
          <span v-bind="fileInfoProps">
            <span v-bind="fileNameProps">{{ file.name }}</span>
            <span v-bind="fileSizeProps">{{ formatBytes(file.size, effectiveLocale) }}</span>
          </span>
          <Button
            :size="removeButtonSize"
            variant="text"
            color="neutral"
            :icon="icons.close"
            :aria-label="messages.removeItem(file.name)"
            v-bind="fileRemoveProps"
            @click="removeFile(index)"
          />
        </slot>
      </li>
    </ul>
  </div>
</template>
