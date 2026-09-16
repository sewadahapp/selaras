<script setup lang="ts">
import type { ResolvedItemOption, SelectItems, SelectOption } from './combobox-select'
import {
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxViewport,
  ComboboxVirtualizer,
  ListboxContent,
  ListboxFilter,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxItem,
  ListboxItemIndicator,
  ListboxVirtualizer,
  useFilter,
} from 'reka-ui'
import { computed, mergeProps, ref, useId } from 'vue'
import Icon from '../components/Icon.vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { isOptionGroup } from './combobox-select'

defineOptions({ inheritAttrs: false })

const props = defineProps<ComboboxSelectBodyProps>()

const emit = defineEmits<ComboboxSelectBodyEmits>()

// Share option/slot rendering while letting each surface own interaction:
// ComboboxContent owns a popup; Dialog owns a modal Listbox surface.
export interface ComboboxSelectBodyProps {
  listbox?: boolean
  searchable?: boolean
  creatable?: boolean
  searchText: string
  displayValue: (value: unknown) => string
  items: SelectItems
  flatOptions: ResolvedItemOption[]
  virtualizeConfig: { estimateSize: number, overscan: number } | null
  virtualizedOptions: ResolvedItemOption[]
  toOption: (entry: SelectOption) => ResolvedItemOption
  groupOptions: (group: { items: readonly SelectOption[] }) => ResolvedItemOption[]
  onSearchKeydown: (event: KeyboardEvent) => void
  onSearchBlur: () => void
  searchWrapperProps?: Record<string, unknown>
  searchInputProps?: Record<string, unknown>
  viewportProps?: Record<string, unknown>
  emptyProps?: Record<string, unknown>
  groupProps?: Record<string, unknown>
  itemProps?: Record<string, unknown>
  itemIndicatorProps?: Record<string, unknown>
}

export interface ComboboxSelectBodyEmits {
  'update:searchText': [value: string]
}

const icons = useIcons()
const messages = useMessages()
const listboxId = `selaras-select-options-${useId()}`
const searchInput = ref<{ $el: HTMLElement }>()
const { contains } = useFilter({ sensitivity: 'base' })
const primitives = computed(() => props.listbox
  ? { input: ListboxFilter, viewport: ListboxContent, group: ListboxGroup, label: ListboxGroupLabel, item: ListboxItem, indicator: ListboxItemIndicator, virtualizer: ListboxVirtualizer }
  : { input: ComboboxInput, viewport: ComboboxViewport, group: ComboboxGroup, label: ComboboxLabel, item: ComboboxItem, indicator: ComboboxItemIndicator, virtualizer: ComboboxVirtualizer })
function matches(option: ResolvedItemOption) {
  return !props.listbox || !props.searchable || contains(option.label, props.searchText)
}
const visibleOptions = computed(() => props.flatOptions.filter(matches))
const virtualOptions = computed(() => props.listbox ? visibleOptions.value : props.virtualizedOptions)
const filterInputProps = computed(() => mergeProps(
  props.listbox
    ? { 'role': 'combobox', 'aria-autocomplete': 'list', 'aria-expanded': true, 'aria-controls': listboxId, 'aria-label': messages.value.search }
    : { displayValue: props.displayValue },
  props.searchInputProps ?? {},
))
function focusSearch() {
  const element = searchInput.value?.$el
  if (!element)
    return false
  element.focus()
  return true
}
defineExpose({ focusSearch })
</script>

<template>
  <slot name="header" />

  <div v-if="searchable && !creatable" v-bind="searchWrapperProps">
    <slot name="filter-icon">
      <Icon :name="icons.search" class="size-4 text-[var(--selaras-resolved-text-muted)]" />
    </slot>
    <component
      :is="primitives.input"
      ref="searchInput"
      :model-value="searchText"
      :placeholder="messages.search"
      v-bind="filterInputProps"
      @update:model-value="(value) => emit('update:searchText', String(value ?? ''))"
      @keydown="onSearchKeydown"
      @blur="onSearchBlur"
    />
  </div>

  <div v-if="flatOptions.length === 0" v-bind="emptyProps">
    <slot name="empty">
      {{ messages.noOptions }}
    </slot>
  </div>
  <component :is="primitives.viewport" v-else :id="listbox ? listboxId : undefined" v-bind="viewportProps">
    <div v-if="listbox && visibleOptions.length === 0" v-bind="emptyProps">
      <slot name="empty-filter">
        {{ messages.noResultsFound }}
      </slot>
    </div>
    <ComboboxEmpty v-else-if="!listbox" v-bind="emptyProps">
      <slot name="empty-filter">
        {{ messages.noResultsFound }}
      </slot>
    </ComboboxEmpty>

    <!-- Virtual row measurement needs client DOM, including default-open surfaces. -->
    <ClientOnly v-if="virtualizeConfig">
      <component
        :is="primitives.virtualizer"
        v-slot="{ option, virtualItem }"
        :options="virtualOptions"
        :estimate-size="virtualizeConfig.estimateSize"
        :overscan="virtualizeConfig.overscan"
      >
        <component
          :is="primitives.item"
          :key="String(virtualItem.key)"
          :value="option.value"
          :disabled="option.disabled"
          :style="{ position: 'absolute', top: 0, left: 0, right: 0, transform: `translateY(${virtualItem.start}px)`, height: `${virtualItem.size}px` }"
          v-bind="itemProps"
        >
          <slot name="item" :item="option.raw">
            {{ option.label }}
          </slot>
          <component :is="primitives.indicator" v-bind="itemIndicatorProps">
            <Icon :name="icons.check" class="size-4" />
          </component>
        </component>
      </component>
    </ClientOnly>

    <template v-else>
      <template v-for="(entry, index) in items" :key="index">
        <component :is="primitives.group" v-if="isOptionGroup(entry) && groupOptions(entry).some(matches)">
          <component :is="primitives.label" v-bind="groupProps">
            <slot name="group" :group="entry">
              {{ entry.label }}
            </slot>
          </component>
          <component
            :is="primitives.item"
            v-for="option in groupOptions(entry).filter(matches)"
            :key="option.value"
            :value="option.value"
            :disabled="option.disabled"
            v-bind="itemProps"
          >
            <slot name="item" :item="option.raw">
              {{ option.label }}
            </slot>
            <component :is="primitives.indicator" v-bind="itemIndicatorProps">
              <Icon :name="icons.check" class="size-4" />
            </component>
          </component>
        </component>
        <component
          :is="primitives.item"
          v-else-if="!isOptionGroup(entry) && matches(toOption(entry))"
          :value="toOption(entry).value"
          :disabled="toOption(entry).disabled"
          v-bind="itemProps"
        >
          <slot name="item" :item="entry">
            {{ toOption(entry).label }}
          </slot>
          <component :is="primitives.indicator" v-bind="itemIndicatorProps">
            <Icon :name="icons.check" class="size-4" />
          </component>
        </component>
      </template>
    </template>
  </component>

  <slot name="footer" />
</template>
