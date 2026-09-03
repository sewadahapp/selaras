<script setup lang="ts">
import type { CommandPaletteThemeSlots } from '../theme/command-palette'
import type { UiProp } from '../utils/ui'
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useCommandPalette } from '../composables/use-command-palette'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { commandPaletteTheme } from '../theme/command-palette'
import { fuzzyScore } from '../utils/fuzzy-match'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Icon from './Icon.vue'
import Kbd from './Kbd.vue'

export interface CommandPaletteItem {
  label: string
  icon?: string
  /** Rendered via Kbd - a display hint only, this component doesn't bind the key itself. */
  shortcut?: string
  disabled?: boolean
  onSelect?: () => void
}

export interface CommandPaletteGroup {
  label?: string
  items: CommandPaletteItem[]
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<CommandPaletteProps>(), {
  shortcut: true,
})

export interface CommandPaletteProps {
  groups: CommandPaletteGroup[]
  /** Binds Cmd/Ctrl+K to open this instance. @default true */
  shortcut?: boolean
  ui?: UiProp<CommandPaletteThemeSlots>
}

const { isOpen, close, toggle } = useCommandPalette()
const icons = useIcons()
const messages = useMessages()

const query = ref('')
const highlightedIndex = ref(0)
const inputRef = ref<HTMLInputElement>()

watch(isOpen, (open) => {
  if (!open) {
    query.value = ''
    highlightedIndex.value = 0
  }
})

// Reka's own Dialog focus management would otherwise land focus on the
// content wrapper itself - redirect it to the search input so typing
// works immediately with no extra click. Handled on this event (not a
// nextTick after isOpen flips) since it's the exact point Reka's own
// default auto-focus is about to happen, not a guess at its timing.
function onOpenAutoFocus(event: Event) {
  event.preventDefault()
  inputRef.value?.focus()
}

// Dropped (`null` score) items are the actual filter; the score only
// orders the survivors, and only once there's a real query - an empty
// query keeps each group's own authoring order instead of reshuffling
// the default (pre-search) view.
const filteredGroups = computed(() => {
  return props.groups
    .map(group => ({
      label: group.label,
      items: group.items
        .map(item => ({ item, score: fuzzyScore(query.value, item.label) }))
        .filter((entry): entry is { item: CommandPaletteItem, score: number } => entry.score !== null)
        .sort((a, b) => query.value ? b.score - a.score : 0)
        .map(entry => entry.item),
    }))
    .filter(group => group.items.length > 0)
})

// Every rendered item, disabled ones included - each gets a stable, unique
// DOM id from its position in *this* list, regardless of whether it's
// currently selectable.
const allItems = computed(() => filteredGroups.value.flatMap(group => group.items))
// The selectable subset - what Arrow/Enter actually navigate and act on.
const flatItems = computed(() => allItems.value.filter(item => !item.disabled))

watch(flatItems, () => {
  highlightedIndex.value = 0
})

const highlightedItemId = computed(() => {
  const item = flatItems.value[highlightedIndex.value]
  return item ? itemId(allItems.value.indexOf(item)) : undefined
})

function isHighlighted(item: CommandPaletteItem) {
  return flatItems.value[highlightedIndex.value] === item
}

function highlight(item: CommandPaletteItem) {
  if (item.disabled)
    return
  const index = flatItems.value.indexOf(item)
  if (index !== -1)
    highlightedIndex.value = index
}

function selectHighlighted() {
  const item = flatItems.value[highlightedIndex.value]
  if (!item)
    return
  item.onSelect?.()
  close()
}

function selectItem(item: CommandPaletteItem) {
  if (item.disabled)
    return
  item.onSelect?.()
  close()
}

function onInputKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (flatItems.value.length)
      highlightedIndex.value = (highlightedIndex.value + 1) % flatItems.value.length
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (flatItems.value.length)
      highlightedIndex.value = (highlightedIndex.value - 1 + flatItems.value.length) % flatItems.value.length
  }
  else if (event.key === 'Enter') {
    event.preventDefault()
    selectHighlighted()
  }
}

function onGlobalKeydown(event: KeyboardEvent) {
  if (!props.shortcut)
    return
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    toggle()
  }
}

onMounted(() => window.addEventListener('keydown', onGlobalKeydown))
onUnmounted(() => window.removeEventListener('keydown', onGlobalKeydown))

const theme = useComponentTheme('commandPalette', commandPaletteTheme)
const ui = computed(() => theme.value())

const overlayProps = useRootProps(() => ui.value.overlay, () => props.ui?.overlay)
const contentProps = computed(() => resolveSlot(ui.value.content, props.ui?.content))
const headerProps = computed(() => resolveSlot(ui.value.header, props.ui?.header))
const searchIconProps = computed(() => resolveSlot(ui.value.searchIcon, props.ui?.searchIcon))
const inputProps = computed(() => resolveSlot(ui.value.input, props.ui?.input))
const listProps = computed(() => resolveSlot(ui.value.list, props.ui?.list))
const groupProps = computed(() => resolveSlot(ui.value.group, props.ui?.group))
const groupLabelProps = computed(() => resolveSlot(ui.value.groupLabel, props.ui?.groupLabel))
const itemProps = computed(() => resolveSlot(ui.value.item, props.ui?.item))
const itemIconProps = computed(() => resolveSlot(ui.value.itemIcon, props.ui?.itemIcon))
const itemLabelProps = computed(() => resolveSlot(ui.value.itemLabel, props.ui?.itemLabel))
const itemShortcutProps = computed(() => resolveSlot(ui.value.itemShortcut, props.ui?.itemShortcut))
const emptyProps = computed(() => resolveSlot(ui.value.empty, props.ui?.empty))
const footerProps = computed(() => resolveSlot(ui.value.footer, props.ui?.footer))
const footerKeyProps = computed(() => resolveSlot(ui.value.footerKey, props.ui?.footerKey))

function itemId(index: number) {
  return `command-palette-item-${index}`
}
</script>

<template>
  <DialogRoot :open="isOpen" @update:open="(value) => value ? undefined : close()">
    <DialogPortal>
      <DialogOverlay v-bind="overlayProps" />
      <DialogContent v-bind="contentProps" @open-auto-focus="onOpenAutoFocus">
        <DialogTitle class="sr-only">
          Command palette
        </DialogTitle>
        <div v-bind="headerProps">
          <Icon :name="icons.search" v-bind="searchIconProps" />
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-list"
            :aria-activedescendant="highlightedItemId"
            :placeholder="messages.search"
            v-bind="inputProps"
            @keydown="onInputKeydown"
          >
        </div>
        <div id="command-palette-list" v-bind="listProps" role="listbox">
          <template v-if="filteredGroups.length">
            <div v-for="(group, groupIndex) in filteredGroups" :key="group.label ?? groupIndex" v-bind="groupProps">
              <p v-if="group.label" v-bind="groupLabelProps">
                {{ group.label }}
              </p>
              <div
                v-for="item in group.items"
                :id="itemId(allItems.indexOf(item))"
                :key="item.label"
                role="option"
                :aria-selected="isHighlighted(item)"
                :aria-disabled="item.disabled"
                :data-highlighted="isHighlighted(item) ? '' : undefined"
                :data-disabled="item.disabled ? '' : undefined"
                v-bind="itemProps"
                @mousemove="highlight(item)"
                @click="selectItem(item)"
              >
                <Icon v-if="item.icon" :name="item.icon" v-bind="itemIconProps" />
                <span v-bind="itemLabelProps">{{ item.label }}</span>
                <span v-if="item.shortcut" v-bind="itemShortcutProps">
                  <Kbd v-for="key in item.shortcut.split('+')" :key="key" :value="key" size="sm" />
                </span>
              </div>
            </div>
          </template>
          <p v-else v-bind="emptyProps">
            {{ messages.noResultsFound }}
          </p>
        </div>
        <div v-bind="footerProps">
          <span v-bind="footerKeyProps"><Kbd value="up" size="sm" /><Kbd value="down" size="sm" /> Navigate</span>
          <span v-bind="footerKeyProps"><Kbd value="enter" size="sm" /> Select</span>
          <span v-bind="footerKeyProps"><Kbd value="escape" size="sm" /> Close</span>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
