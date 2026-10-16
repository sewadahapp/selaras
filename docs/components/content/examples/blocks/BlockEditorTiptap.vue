<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { computed, ref, watch } from 'vue'

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

const editor = useEditor({
  content: content.value,
  editable: !readOnly.value,
  extensions: [StarterKit, Placeholder.configure({ placeholder: props.placeholder ?? 'Write a project note…' })],
  editorProps: { attributes: { 'class': 'editor-document', 'role': 'textbox', 'aria-label': 'Project note', 'aria-multiline': 'true' } },
  onCreate: ({ editor }) => {
    ready.value = true
    sync(editor)
  },
  onTransaction: ({ editor }) => sync(editor),
  onUpdate: ({ editor }) => { content.value = editor.isEmpty ? '' : editor.getHTML() },
})
function sync(current: Pick<Editor, 'isActive' | 'can' | 'isEmpty'>) {
  activeFormats.value = ['bold', 'italic', 'underline'].filter(format => current.isActive(format))
  heading.value = current.isActive('heading', { level: 2 })
  bulletList.value = current.isActive('bulletList')
  linkActive.value = current.isActive('link')
  canUndo.value = current.can().undo()
  canRedo.value = current.can().redo()
  empty.value = current.isEmpty
}
function formatText(format: 'bold' | 'italic' | 'underline') {
  if (readOnly.value)
    return
  const chain = editor.value?.chain().focus()
  if (format === 'bold')
    chain?.toggleBold().run()
  if (format === 'italic')
    chain?.toggleItalic().run()
  if (format === 'underline')
    chain?.toggleUnderline().run()
}
function toggleHeading() {
  if (!readOnly.value)
    editor.value?.chain().focus().toggleHeading({ level: 2 }).run()
}
function toggleList() {
  if (!readOnly.value)
    editor.value?.chain().focus().toggleBulletList().run()
}
function undo() {
  if (!readOnly.value)
    editor.value?.chain().focus().undo().run()
}
function redo() {
  if (!readOnly.value)
    editor.value?.chain().focus().redo().run()
}
function openLink() {
  if (readOnly.value)
    return
  linkUrl.value = editor.value?.getAttributes('link').href ?? ''
  linkError.value = ''
  linkOpen.value = true
}
function applyLink(href: string) {
  if (readOnly.value)
    return
  const chain = editor.value?.chain().focus().extendMarkRange('link')
  if (href)
    chain?.setLink({ href }).run()
  else chain?.unsetLink().run()
}
watch(content, (value) => {
  if (editor.value && value !== (editor.value.isEmpty ? '' : editor.value.getHTML()))
    editor.value.commands.setContent(value, { emitUpdate: false })
})
watch(readOnly, value => editor.value?.setEditable(!value))
</script>

<template>
  <main class="min-h-screen bg-[var(--selaras-resolved-surface-default)] px-4 py-8 text-[var(--selaras-resolved-text-default)] sm:px-8 sm:py-12">
    <section class="mx-auto max-w-3xl" aria-label="Project notes editor" data-editor-engine="tiptap">
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
        <SSwitch :model-value="readOnly" :disabled="props.readonly || props.disabled" label="Read only" :ui="{ label: 'text-[var(--selaras-resolved-text-muted)]' }" @update:model-value="previewReadonly = $event" />
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
          <EditorContent :editor="editor" />
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
:deep(.tiptap p.is-editor-empty:first-child::before) { content: attr(data-placeholder); float: left; height: 0; color: var(--selaras-resolved-text-muted); pointer-events: none; }
</style>
