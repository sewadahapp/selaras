<script setup lang="ts">
import type { FileTreeThemeSlots } from '../theme/file-tree'
import type { UiProp } from '../utils/ui'
import { computed, ref } from 'vue'
import { useIcons } from '../composables/use-icons'
import { fileTreeTheme } from '../theme/file-tree'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Icon from './Icon.vue'

export interface FileTreeNode {
  name: string
  /** A node with children renders as a directory, one without as a file - the same convention ContentNavigation's own tree uses. */
  children?: FileTreeNode[]
  icon?: string
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FileTreeProps>(), {
  defaultExpanded: true,
  isNested: false,
})

const emit = defineEmits<FileTreeEmits>()

export interface FileTreeProps {
  items: FileTreeNode[]
  /** The currently selected file, by reference - highlights its row. */
  selected?: FileTreeNode
  /** Whether a directory starts expanded. @default true */
  defaultExpanded?: boolean
  /** Internal - true for a recursive call rendering a directory's children, skipping the outer box. */
  isNested?: boolean
  ui?: UiProp<FileTreeThemeSlots>
}

export interface FileTreeEmits {
  'update:selected': [node: FileTreeNode]
}

const icons = useIcons()

// Keyed by each node's own index within *this* level's `items` array, not
// by node reference - `items` crosses a prop boundary (and, one level down,
// a recursive component boundary too), and comparing a value read back out
// of a reactive Set against a value read fresh off a v-for on every render
// isn't reliable there (confirmed: reference equality intermittently failed
// across that exact boundary, even in a plain non-HMR test run - toggling a
// directory closed silently re-added it instead). An index is a plain
// number, and every node in a single `items` array already has a unique
// one, so there's no such comparison to get wrong.
const expanded = ref(new Set<number>(props.defaultExpanded ? props.items.flatMap((node, index) => node.children ? [index] : []) : []))

function isExpanded(index: number) {
  return expanded.value.has(index)
}

function toggle(index: number) {
  const next = new Set(expanded.value)
  if (next.has(index))
    next.delete(index)
  else
    next.add(index)
  expanded.value = next
}

function selectFile(node: FileTreeNode) {
  emit('update:selected', node)
}

function iconFor(node: FileTreeNode, index: number) {
  if (node.icon)
    return node.icon
  if (!node.children)
    return icons.value.file
  return isExpanded(index) ? icons.value.folderOpen : icons.value.folder
}

const theme = useComponentTheme('fileTree', fileTreeTheme)
const ui = computed(() => theme.value())

// A nested call renders `list`, not `root` (see the comment above), so its
// own override has to come from `ui.list` too - passing `ui.root`
// unconditionally here meant any override touching padding (CodeTree's own
// `root: '... p-0'`, stripping FileTree's outer box for its split view)
// leaked into every nested level's `ps-4` indentation as well, via
// tailwind-merge treating `p-0`/`ps-4` as the same conflict group and
// collapsing every level flat.
const rootProps = useRootProps(() => props.isNested ? ui.value.list : ui.value.root, () => props.isNested ? props.ui?.list : props.ui?.root)
const itemProps = computed(() => resolveSlot(ui.value.item, props.ui?.item))
const iconProps = computed(() => resolveSlot(ui.value.icon, props.ui?.icon))
const labelProps = computed(() => resolveSlot(ui.value.label, props.ui?.label))

function rowProps(node: FileTreeNode) {
  return resolveSlot(theme.value({ selected: props.selected === node }).row, props.ui?.row)
}
</script>

<template>
  <ul v-bind="rootProps">
    <li v-for="(node, index) in items" :key="node.name" v-bind="itemProps">
      <button type="button" v-bind="rowProps(node)" @click="node.children ? toggle(index) : selectFile(node)">
        <Icon :name="iconFor(node, index)" v-bind="iconProps" />
        <span v-bind="labelProps">{{ node.name }}</span>
      </button>
      <FileTree
        v-if="node.children && isExpanded(index)"
        :items="node.children"
        is-nested
        :selected="selected"
        :default-expanded="defaultExpanded"
        :ui="props.ui"
        @update:selected="emit('update:selected', $event)"
      />
    </li>
  </ul>
</template>
