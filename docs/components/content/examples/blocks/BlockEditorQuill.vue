<script setup lang="ts">
import type Quill from 'quill'
import type { Range } from 'quill'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import 'quill/dist/quill.core.css'

const props = defineProps<{ readonly?: boolean, disabled?: boolean, placeholder?: string }>()
const content = defineModel<string>({ default: '<h2>A shared place for ideas</h2><p>Write a project note, highlight a decision, or leave a useful link for your team.</p><ul><li>Keep the next step clear.</li><li>Make room for another perspective.</li></ul>' })
const initialContent = '<h2>A shared place for ideas</h2><p>Write a project note, highlight a decision, or leave a useful link for your team.</p><ul><li>Keep the next step clear.</li><li>Make room for another perspective.</li></ul>'
const previewReadonly = ref(false)
const readOnly = computed(() => !!(props.readonly || props.disabled || previewReadonly.value))
const activeFormats = ref<string[]>([])
const heading = ref(false)
const bulletList = ref(false)
const linkActive = ref(false)
const canUndo = ref(false)
const canRedo = ref(false)
const ready = ref(false)
const empty = ref(false)
const linkOpen = ref(false)
const linkUrl = ref('')
const linkError = ref('')
const formats = [
  { value: 'bold', label: 'Bold', icon: 'hugeicons:text-bold' },
  { value: 'italic', label: 'Italic', icon: 'hugeicons:text-italic' },
  { value: 'underline', label: 'Underline', icon: 'hugeicons:text-underline' },
]
function changeFormats(value: string | string[]) {
  if (readOnly.value || !Array.isArray(value))
    return
  const format = ['bold', 'italic', 'underline'].find(format => value.includes(format) !== activeFormats.value.includes(format))
  if (format)
    formatText(format as 'bold' | 'italic' | 'underline')
}
function saveLink() {
  const href = linkUrl.value.trim()
  if (href && !/^(?:https?:\/\/|mailto:)/i.test(href)) {
    linkError.value = 'Use an https://, http://, or mailto: address.'
    return
  }
  applyLink(href)
  linkOpen.value = false
}
function reset() {
  if (!readOnly.value)
    content.value = initialContent
}

const surface = ref<HTMLElement>()
let editor: Quill | undefined
let selection: Range | null = null
let disposed = false
let lastHtml = ''
function sync() {
  if (!editor)
    return
  const format = editor.getFormat(selection ?? { index: 0, length: 0 })
  activeFormats.value = ['bold', 'italic', 'underline'].filter(name => !!format[name])
  heading.value = format.header === 2
  bulletList.value = format.list === 'bullet'
  linkActive.value = !!format.link
  canUndo.value = editor.history.stack.undo.length > 0
  canRedo.value = editor.history.stack.redo.length > 0
  empty.value = editor.getLength() <= 1
}
function writeHtml(value: string) {
  if (!editor)
    return
  editor.setContents(editor.clipboard.convert({ html: value }), 'silent')
  lastHtml = content.value = editor.getLength() <= 1 ? '' : editor.getSemanticHTML()
  editor.history.clear()
  sync()
}
function focusSelection() {
  if (!editor || readOnly.value)
    return false
  if (selection)
    editor.setSelection(selection.index, selection.length, 'silent')
  editor.focus({ preventScroll: true })
  return true
}
function formatText(format: 'bold' | 'italic' | 'underline') {
  if (!focusSelection())
    return
  editor!.format(format, !activeFormats.value.includes(format), 'user')
  sync()
}
function toggleHeading() {
  if (!focusSelection())
    return
  editor!.format('header', heading.value ? false : 2, 'user')
  sync()
}
function toggleList() {
  if (!focusSelection())
    return
  editor!.format('list', bulletList.value ? false : 'bullet', 'user')
  sync()
}
function undo() {
  if (focusSelection()) {
    editor!.history.undo()
    sync()
  }
}
function redo() {
  if (focusSelection()) {
    editor!.history.redo()
    sync()
  }
}
function openLink() {
  if (!editor || readOnly.value)
    return
  selection = editor.getSelection() ?? selection
  linkUrl.value = String(editor.getFormat(selection ?? { index: 0, length: 0 }).link ?? '')
  linkError.value = ''
  linkOpen.value = true
}
function applyLink(href: string) {
  if (!focusSelection())
    return
  editor!.format('link', href || false, 'user')
  sync()
}
function onTextChange() {
  if (!editor)
    return
  lastHtml = content.value = editor.getLength() <= 1 ? '' : editor.getSemanticHTML()
  sync()
}
function onSelectionChange(range: Range | null) {
  if (range)
    selection = range
  sync()
}
onMounted(async () => {
  const { default: Quill } = await import('quill')
  if (disposed || !surface.value)
    return
  editor = new Quill(surface.value, {
    theme: undefined,
    readOnly: readOnly.value,
    placeholder: props.placeholder ?? 'Write a project note…',
    modules: { toolbar: false, history: { userOnly: true } },
    formats: ['bold', 'italic', 'underline', 'header', 'list', 'link'],
  })
  editor.root.classList.add('editor-document')
  editor.root.setAttribute('role', 'textbox')
  editor.root.setAttribute('aria-label', 'Project note')
  editor.root.setAttribute('aria-multiline', 'true')
  writeHtml(content.value)
  editor.on('text-change', onTextChange)
  editor.on('selection-change', onSelectionChange)
  ready.value = true
})
watch(content, (value) => {
  if (value !== lastHtml)
    writeHtml(value)
})
watch(readOnly, value => editor?.enable(!value))
onBeforeUnmount(() => {
  disposed = true
  editor?.off('text-change', onTextChange)
  editor?.off('selection-change', onSelectionChange)
  editor?.disable()
  editor = undefined
})
</script>

<template>
  <main class="min-h-screen bg-[var(--selaras-resolved-surface-default)] px-4 py-8 text-[var(--selaras-resolved-text-default)] sm:px-8 sm:py-12">
    <section class="mx-auto max-w-3xl" aria-label="Project notes editor" data-editor-engine="quill">
      <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight">
            Project notes
          </h1>
          <p class="mt-2 text-sm leading-6 text-[var(--selaras-resolved-text-muted)]">
            Sample content. Try formatting a note for your team.
          </p>
        </div>
        <SButton variant="outline" color="neutral" size="sm" :disabled="readOnly || !ready" @click="reset">
          Reset content
        </SButton>
      </div>
      <div class="mb-4 flex items-center justify-end gap-2">
        <SSwitch :model-value="readOnly" :disabled="props.readonly || props.disabled" aria-label="Read only" @update:model-value="previewReadonly = $event" />
        <span class="text-sm text-[var(--selaras-resolved-text-muted)]">Read only</span>
      </div>
      <div class="editor-frame overflow-hidden rounded-[var(--selaras-resolved-radius-lg)] border border-[var(--selaras-resolved-border-default)] focus-within:outline-2 focus-within:outline-[var(--selaras-resolved-color-primary-focus)]" :aria-busy="!ready" :data-disabled="props.disabled || undefined">
        <SToolbar aria-label="Text formatting" :disabled="readOnly || !ready" :ui="{ root: 'rounded-none border-0 border-b p-2' }">
          <SToolbarToggleGroup :items="formats" type="multiple" icon-only :model-value="activeFormats" aria-label="Text style" @update:model-value="changeFormats" @mousedown.prevent />
          <SToolbarSeparator />
          <SToolbarButton icon="hugeicons:heading-02" aria-label="Heading" title="Heading" :pressed="heading" @mousedown.prevent @click="toggleHeading" />
          <SToolbarButton icon="hugeicons:list-view" aria-label="Bullet list" title="Bullet list" :pressed="bulletList" @mousedown.prevent @click="toggleList" />
          <SToolbarButton icon="hugeicons:link-01" aria-label="Edit link" title="Edit link" :pressed="linkActive" @mousedown.prevent @click="openLink" />
          <SToolbarSeparator />
          <SToolbarButton icon="hugeicons:undo" aria-label="Undo" title="Undo" :disabled="!canUndo" @mousedown.prevent @click="undo" />
          <SToolbarButton icon="hugeicons:redo" aria-label="Redo" title="Redo" :disabled="!canRedo" @mousedown.prevent @click="redo" />
        </SToolbar>
        <div class="relative min-h-72">
          <div ref="surface" />
          <p v-if="!ready" class="absolute inset-x-6 top-5 text-sm text-[var(--selaras-resolved-text-muted)]" role="status">
            Loading editor…
          </p>
        </div>
        <div class="flex items-center justify-between border-t border-[var(--selaras-resolved-border-default)] px-5 py-3 text-xs text-[var(--selaras-resolved-text-muted)]">
          <span>{{ readOnly ? 'Read-only document' : 'Changes stay in this tab' }}</span>
          <span>HTML content</span>
        </div>
      </div>
      <details class="mt-5 text-sm">
        <summary class="cursor-pointer py-2 text-[var(--selaras-resolved-text-muted)]">
          View HTML output
        </summary>
        <pre class="mt-2 max-h-48 overflow-auto rounded-[var(--selaras-resolved-radius-md)] bg-[var(--selaras-resolved-surface-elevated)] p-4 text-xs leading-6 whitespace-pre-wrap break-words">{{ content }}</pre>
      </details>
      <SModal v-model:open="linkOpen" title="Edit link" description="Add a destination for the selected text.">
        <template #body>
          <form class="space-y-5" @submit.prevent="saveLink">
            <SFormField label="Link address" :error="linkError || undefined">
              <SInput v-model="linkUrl" placeholder="https://example.com" class="w-full" autofocus aria-label="Link address" />
            </SFormField>
            <div class="flex flex-wrap justify-end gap-2">
              <SButton variant="ghost" color="neutral" @click="applyLink(''); linkOpen = false">
                Remove link
              </SButton>
              <SButton type="submit" :disabled="readOnly">
                Apply link
              </SButton>
            </div>
          </form>
        </template>
      </SModal>
    </section>
  </main>
</template>

<style scoped>
.editor-frame[data-disabled] { opacity: 0.5; }
:deep(.editor-document) {
  position: relative;
  min-height: 18rem;
  padding: 1.25rem 1.5rem;
  outline: none;
  line-height: 1.8;
  overflow-wrap: anywhere;
  caret-color: var(--selaras-resolved-color-primary-text);
}
:deep(.editor-document > * + *) { margin-top: 0.85em; }
:deep(.editor-document h2) { font-size: 1.5rem; font-weight: 650; line-height: 1.35; }
:deep(.editor-document p) { margin-bottom: 0; }
:deep(.editor-document ul) { list-style: disc; padding-inline-start: 1.5rem; }
:deep(.editor-document ol) { list-style: decimal; padding-inline-start: 1.5rem; }
:deep(.editor-document a) { color: var(--selaras-resolved-color-primary-text); text-decoration: underline; text-underline-offset: 3px; }
:deep(.editor-document blockquote) { border-inline-start: 1px solid var(--selaras-resolved-border-default); padding-inline-start: 1rem; }
:deep(.editor-document ::selection) { background: var(--selaras-resolved-color-primary-subtle); color: var(--selaras-resolved-color-primary-on-subtle); }
:deep(.ql-container) { height: auto; border: 0; font: inherit; }
:deep(.ql-editor.ql-blank::before) { inset-inline: 1.5rem; color: var(--selaras-resolved-text-muted); font-style: normal; }
:deep(.ql-editor li[data-list="bullet"] > .ql-ui::before) { content: "•"; }
</style>
