<script setup lang="ts">
import type { CodeTreeThemeSlots } from '../theme/code-tree'
import type { UiProp } from '../utils/ui'
import type { FileTreeNode } from './FileTree.vue'
import { computed, ref, watch } from 'vue'
import { useMessages } from '../composables/use-messages'
import { codeTreeTheme } from '../theme/code-tree'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import FileTree from './FileTree.vue'

export interface CodeTreeFile extends FileTreeNode {
  /** The file's content - read for a leaf node once selected, ignored for a directory. */
  code?: string
  /** Overrides the language inferred from the filename. */
  language?: string
  children?: CodeTreeFile[]
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<CodeTreeProps>(), {
  defaultExpanded: true,
})

export interface CodeTreeProps {
  items: CodeTreeFile[]
  /** Whether a directory starts expanded. @default true */
  defaultExpanded?: boolean
  ui?: UiProp<CodeTreeThemeSlots>
}

function findFirstFile(nodes: CodeTreeFile[]): CodeTreeFile | undefined {
  for (const node of nodes) {
    if (!node.children)
      return node
    const found = findFirstFile(node.children)
    if (found)
      return found
  }
  return undefined
}

const selected = ref<CodeTreeFile | undefined>(findFirstFile(props.items))
const highlightedCode = ref('')

const languageByExtension: Record<string, string> = {
  bash: 'bash',
  cjs: 'javascript',
  css: 'css',
  htm: 'html',
  html: 'html',
  js: 'javascript',
  jsx: 'jsx',
  json: 'json',
  jsonc: 'jsonc',
  md: 'markdown',
  mjs: 'javascript',
  mts: 'typescript',
  sh: 'bash',
  ts: 'typescript',
  tsx: 'tsx',
  vue: 'vue',
  yaml: 'yaml',
  yml: 'yaml',
}

function languageFor(file: CodeTreeFile) {
  if (file.language)
    return file.language
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  return languageByExtension[extension] ?? 'text'
}

watch(selected, async (file, _previous, onCleanup) => {
  // A newer selection makes this run stale, so a slow highlight for an
  // earlier file can't overwrite the one now shown.
  let stale = false
  onCleanup(() => {
    stale = true
  })
  highlightedCode.value = ''
  if (!file?.code)
    return

  try {
    const { codeToHtml } = await import('shiki')
    const html = await codeToHtml(file.code, {
      lang: languageFor(file),
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    })
    if (stale)
      return
    highlightedCode.value = html.match(/<code(?:\s[^>]*)?>([\s\S]*?)<\/code>/)?.[1] ?? ''
  }
  catch {
    // Preserve readable plain text if a language is unsupported or the
    // highlighter fails to load in a constrained environment.
    if (!stale)
      highlightedCode.value = ''
  }
}, { immediate: true })

// Re-picks a default whenever the tree itself changes (a consumer swapping
// in a whole new file set) - not on every render, so a selection made by
// clicking around the existing tree is left alone.
watch(() => props.items, () => {
  selected.value = findFirstFile(props.items)
})

const messages = useMessages()

const theme = useComponentTheme('codeTree', codeTreeTheme)
const ui = computed(() => theme.value())

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const treeProps = computed(() => resolveSlot(ui.value.tree, props.ui?.tree))
const contentProps = computed(() => resolveSlot(ui.value.content, props.ui?.content))
const preProps = computed(() => resolveSlot(ui.value.pre, props.ui?.pre))
const emptyProps = computed(() => resolveSlot(ui.value.empty, props.ui?.empty))

// FileTree's own outer box (border/bg/padding, see its `root` slot) would
// otherwise double up with this component's own `tree` panel styling -
// stripped here so the two compose into one split view instead of a box
// nested inside another.
const fileTreeUi = { root: 'rounded-none border-0 bg-transparent p-0' }
</script>

<template>
  <div v-bind="rootProps">
    <div v-bind="treeProps">
      <FileTree
        :items="items"
        :selected="selected"
        :default-expanded="defaultExpanded"
        :ui="fileTreeUi"
        @update:selected="selected = $event as CodeTreeFile"
      />
    </div>
    <div v-if="selected" v-bind="contentProps">
      <pre v-bind="preProps"><code v-if="highlightedCode" class="selaras-code-tree-code" v-html="highlightedCode" /><code v-else>{{ selected.code }}</code></pre>
    </div>
    <div v-else v-bind="emptyProps">
      {{ messages.selectFile }}
    </div>
  </div>
</template>
