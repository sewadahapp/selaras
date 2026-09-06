<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { TreeThemeSlots } from '../theme/tree'
import type { UiProp } from '../utils/ui'
import { TreeItem, TreeRoot } from 'reka-ui'
import { computed, mergeProps, ref, watch } from 'vue'
import { useIcons } from '../composables/use-icons'
import { treeTheme } from '../theme/tree'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Checkbox from './Checkbox.vue'
import Icon from './Icon.vue'

type TreeVariants = VariantProps<typeof treeTheme>

export interface TreeItemType {
  label: string
  value?: string
  icon?: string
  disabled?: boolean
  children?: TreeItemType[]
  [key: string]: unknown
}

defineOptions({ inheritAttrs: false })

const props = defineProps<TreeProps>()
const emit = defineEmits<TreeEmits>()
defineSlots<TreeSlots>()

export interface TreeProps {
  items: TreeItemType[]
  modelValue?: TreeItemType | TreeItemType[]
  defaultValue?: TreeItemType | TreeItemType[]
  expanded?: string[]
  defaultExpanded?: string[]
  multiple?: boolean
  /** Shows a tri-state checkbox per row (reusing Checkbox.vue's own boolean|'indeterminate' model) - also turns on `multiple`/`propagateSelect`/`bubbleSelect` together, since checkbox mode's whole point is parent<->children selection propagation. */
  checkbox?: boolean
  /** Selecting a parent also selects/deselects every one of its descendants. */
  propagateSelect?: boolean
  /** Selecting all of a parent's children also selects the parent (and marks it indeterminate for a partial selection). */
  bubbleSelect?: boolean
  disabled?: boolean
  /** @default item => item.value ?? item.label */
  getKey?: (item: TreeItemType) => string
  /** @default item => item.children */
  getChildren?: (item: TreeItemType) => TreeItemType[] | undefined
  size?: TreeVariants['size']
  ui?: UiProp<TreeThemeSlots>
}

export interface TreeEmits {
  'update:modelValue': [value: TreeItemType | TreeItemType[]]
  'update:expanded': [value: string[]]
}

export interface TreeSlots {
  /** Replaces a row's default icon+label content - scoped with the node itself plus its live expanded/selected/indeterminate state. */
  item?: (props: { item: TreeItemType, level: number, expanded: boolean, selected: boolean, indeterminate: boolean }) => any
}

const icons = useIcons()

const getKey = props.getKey ?? (item => (item.value ?? item.label) as string)
const getChildren = props.getChildren ?? (item => item.children)

// checkbox mode implies multi-select-with-propagation (that's the whole
// point of a tri-state checkbox - a lone checkbox with no set to
// propagate through isn't a sensible combination anyway). Plain `||`,
// not a `??` "explicit override wins" chain: an unset `type: Boolean`
// prop resolves to `false` in Vue, never `undefined` (confirmed - logged
// the actual runtime value), so `props.multiple ?? props.checkbox` could
// never fall through to `checkbox` at all - there is no way to tell
// "explicitly false" apart from "not passed" for a plain boolean prop.
const isMultiple = computed(() => props.multiple || props.checkbox || false)
const propagateSelect = computed(() => props.propagateSelect || props.checkbox || false)
const bubbleSelect = computed(() => props.bubbleSelect || props.checkbox || false)

// Mirrors Slider.vue's own internalValue / Popover.vue's own internalOpen
// pattern - an always-concrete local ref synced with an optional external
// prop, rather than binding TreeRoot's own `:model-value`/`:expanded`
// directly to a prop that's currently undefined (genuinely uncontrolled,
// no v-model). See those components' own comments for why: a compiled
// SFC doing that breaks Reka's own passive/uncontrolled useVModel mode
// in a real browser once a second Tree instance exists on the page.
// `undefined` (no selection) is a valid resting value in single-select
// mode, but TreeRoot's own selectedKeys computation only takes its
// multi-select branch when modelValue is *already* an array
// (`Array.isArray(modelValue.value)`) - starting multi/checkbox mode at
// `undefined` instead of `[]` made it fall through to the single-select
// branch and select() throw trying to spread a non-array. Seed an empty
// array whenever multiple is on and neither modelValue nor defaultValue
// was given.
const internalModelValue = ref(props.modelValue ?? props.defaultValue ?? (isMultiple.value ? [] : undefined))
watch(() => props.modelValue, (value) => {
  if (value !== undefined)
    internalModelValue.value = value
})

const internalExpanded = ref(props.expanded ?? props.defaultExpanded ?? [])
watch(() => props.expanded, (value) => {
  if (value !== undefined)
    internalExpanded.value = value
})

function onUpdateModelValue(value: unknown) {
  internalModelValue.value = value as TreeItemType | TreeItemType[] | undefined
  emit('update:modelValue', value as TreeItemType | TreeItemType[])
}

function onUpdateExpanded(value: unknown) {
  internalExpanded.value = value as string[]
  emit('update:expanded', value as string[])
}

const theme = useComponentTheme('tree', treeTheme)
const ui = computed(() => theme.value({ size: props.size }))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const itemProps = computed(() => resolveSlot(ui.value.item, props.ui?.item))
const toggleProps = computed(() => resolveSlot(ui.value.toggle, props.ui?.toggle))
const spacerProps = computed(() => resolveSlot(ui.value.spacer, props.ui?.spacer))
const checkboxProps = computed(() => resolveSlot(ui.value.checkbox, props.ui?.checkbox))
const iconProps = computed(() => resolveSlot(ui.value.icon, props.ui?.icon))
const labelProps = computed(() => resolveSlot(ui.value.label, props.ui?.label))

function indentStyle(level: number) {
  return { paddingInlineStart: `${(level - 1) * 1.25}rem` }
}

// Vue's compiler rejects two bare v-bind spreads on one element (see
// utils/ui.ts's own doc comment on this) - entry.bind (Reka's own
// value/level/aria-* for this row) and itemProps (this component's
// theme classes) both need to land on the same <TreeItem>, so they're
// merged into one object here instead of two separate v-bind attrs.
function treeItemProps(entry: { bind: Record<string, unknown> }, level: number) {
  return mergeProps(entry.bind, itemProps.value, { style: indentStyle(level) })
}
</script>

<template>
  <TreeRoot
    :items="items"
    :get-key="getKey"
    :get-children="getChildren"
    :model-value="(internalModelValue as any)"
    :expanded="internalExpanded"
    :multiple="isMultiple"
    :propagate-select="propagateSelect"
    :bubble-select="bubbleSelect"
    :disabled="disabled"
    v-bind="rootProps"
    @update:model-value="onUpdateModelValue"
    @update:expanded="onUpdateExpanded"
  >
    <template #default="{ flattenItems }">
      <TreeItem
        v-for="entry in flattenItems"
        :key="entry._id"
        v-slot="{ isExpanded, isSelected, isIndeterminate }"
        :disabled="(entry.value as TreeItemType).disabled"
        v-bind="treeItemProps(entry, entry.level)"
      >
        <Icon
          v-if="entry.hasChildren"
          :name="icons.chevronRight"
          :data-expanded="isExpanded ? '' : undefined"
          v-bind="toggleProps"
        />
        <span v-else v-bind="spacerProps" />

        <!--
            A read-only echo of TreeItem's own isSelected/isIndeterminate,
            not a second control of its own - the row itself (TreeItem's
            own rendered root, already the roving-tabindex/click target
            via Reka) is the one real way to select. pointer-events-none
            makes a real mouse click pass through to that row instead of
            toggling the checkbox in place; Checkbox.vue has no prop of
            its own to also pull its inner CheckboxRoot out of tab order
            (a real, if minor, gap - out of scope to add here), so it
            stays independently focusable via keyboard. Harmless if
            reached that way: modelValue is always a concrete value
            (never left undefined), so Reka's own controlled-mode getter
            keeps reading it straight from this prop regardless of what
            the inner control tries to toggle locally - nothing to
            observably desync.
          -->
        <Checkbox
          v-if="checkbox"
          :model-value="isIndeterminate ? 'indeterminate' : isSelected"
          v-bind="checkboxProps"
        />

        <Icon v-if="(entry.value as TreeItemType).icon" :name="(entry.value as TreeItemType).icon!" v-bind="iconProps" />

        <span v-bind="labelProps">
          <slot
            name="item"
            :item="(entry.value as TreeItemType)"
            :level="entry.level"
            :expanded="isExpanded"
            :selected="isSelected"
            :indeterminate="isIndeterminate"
          >
            {{ (entry.value as TreeItemType).label }}
          </slot>
        </span>
      </TreeItem>
    </template>
  </TreeRoot>
</template>
