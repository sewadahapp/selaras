<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { SelectItems, SelectOption } from '../composables/use-combobox-select'
import type { SelectSlots } from '../theme/select'
import type { UiProp } from '../utils/ui'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
  ComboboxVirtualizer,
} from 'reka-ui'
import { computed, ref } from 'vue'
import { isOptionGroup, useComboboxSelect } from '../composables/use-combobox-select'
import { useFormField } from '../composables/use-form-field'
import { selectTheme } from '../theme/select'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

type SelectVariants = VariantProps<typeof selectTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  id?: string
  name?: string
  items: SelectItems
  valueKey?: string
  labelKey?: string
  modelValue?: string | string[]
  multiple?: boolean
  searchable?: boolean
  virtualize?: boolean | { estimateSize?: number, overscan?: number }
  displayMode?: 'comma' | 'chip'
  maxChips?: number
  loading?: boolean
  placeholder?: string
  disabled?: boolean
  size?: SelectVariants['size']
  invalid?: boolean
  creatable?: boolean
  searchTerm?: string
  resetSearchTermOnBlur?: boolean
  resetSearchTermOnSelect?: boolean
  ui?: UiProp<SelectSlots>
}>(), {
  displayMode: 'comma',
  maxChips: 3,
  resetSearchTermOnBlur: true,
  resetSearchTermOnSelect: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | undefined]
  'update:searchTerm': [value: string]
}>()

const {
  flatOptions,
  selectedOptions,
  visibleOptions,
  overflowOptions,
  commaText,
  resolveOption,
  toOption,
  removeValue,
  commitCreatableText,
} = useComboboxSelect(props, emit, { creatable: props.creatable })

const internalSearchText = ref(props.searchTerm ?? '')
const searchText = computed({
  get: () => props.searchTerm ?? internalSearchText.value,
  set: (value: string) => {
    internalSearchText.value = value
    emit('update:searchTerm', value)
  },
})

function onSearchKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter')
    return
  if (commitCreatableText(searchText.value))
    searchText.value = ''
}

function onSearchBlur() {
  if (commitCreatableText(searchText.value))
    searchText.value = ''
}

// Reka resets the search input's text whenever an item is selected or the
// popover closes (resetSearchTermOnSelect/resetSearchTermOnBlur) - but
// without a displayValue, it falls back to echoing the raw selected VALUE
// into the input, which is wrong for a plain filter field. Select's popover
// search is pure filtering (the trigger shows the selection separately), so
// it always resets to empty. Autocomplete's input IS the trigger, so
// single-select should echo the selected label; multi-select clears after
// each commit and shows chips separately instead.
function displayValue(value: unknown) {
  if (!props.creatable || props.multiple || !value || Array.isArray(value))
    return ''
  return resolveOption(value as string).label
}

const virtualizeConfig = computed(() => {
  if (!props.virtualize)
    return null
  const opts = props.virtualize === true ? {} : props.virtualize
  return { estimateSize: opts.estimateSize ?? 32, overscan: opts.overscan ?? 8 }
})

// Virtualized items are rendered from this plain array, not from registered
// <ComboboxItem> collection state, so Reka's own built-in search filtering
// (which works by hiding already-rendered items) never touches them - filter
// it ourselves here instead.
const virtualizedOptions = computed(() => {
  if (!props.searchable || !searchText.value)
    return flatOptions.value
  const needle = searchText.value.toLowerCase()
  return flatOptions.value.filter(option => option.label.toLowerCase().includes(needle))
})

function groupOptions(group: { items: SelectOption[] }) {
  return group.items.map(toOption)
}

const field = useFormField()

const selectId = computed(() => props.id ?? field?.id)
const selectInvalid = computed(() => props.invalid || (field?.invalid.value ?? false))
const describedBy = computed(() => field?.describedBy.value)

const theme = useComponentTheme('select', selectTheme)
const ui = computed(() => theme.value({ size: props.size ?? field?.size, invalid: selectInvalid.value }))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const triggerProps = computed(() => resolveSlot(ui.value.trigger, props.ui?.trigger))
const valueProps = computed(() => resolveSlot(ui.value.value, props.ui?.value))
const chipProps = computed(() => resolveSlot(ui.value.chip, props.ui?.chip))
const chipRemoveProps = computed(() => resolveSlot(ui.value.chipRemove, props.ui?.chipRemove))
const chipOverflowProps = computed(() => resolveSlot(ui.value.chipOverflow, props.ui?.chipOverflow))
const iconProps = computed(() => resolveSlot(ui.value.icon, props.ui?.icon))
const searchWrapperProps = computed(() => resolveSlot(ui.value.searchWrapper, props.ui?.searchWrapper))
const searchInputProps = computed(() => resolveSlot(ui.value.searchInput, props.ui?.searchInput))
const contentProps = computed(() => resolveSlot(ui.value.content, props.ui?.content))
const viewportProps = computed(() => resolveSlot(ui.value.viewport, props.ui?.viewport))
const groupProps = computed(() => resolveSlot(ui.value.group, props.ui?.group))
const itemProps = computed(() => resolveSlot(ui.value.item, props.ui?.item))
const itemIndicatorProps = computed(() => resolveSlot(ui.value.itemIndicator, props.ui?.itemIndicator))
const emptyProps = computed(() => resolveSlot(ui.value.empty, props.ui?.empty))
</script>

<template>
  <ComboboxRoot
    :model-value="modelValue"
    :multiple="multiple"
    :disabled="disabled"
    :name="name ?? field?.name"
    :ignore-filter="!searchable"
    :reset-search-term-on-blur="resetSearchTermOnBlur"
    :reset-search-term-on-select="resetSearchTermOnSelect"
    v-bind="rootProps"
    @update:model-value="(value) => emit('update:modelValue', value as string | string[] | undefined)"
  >
    <ComboboxAnchor>
      <!--
        Select (creatable=false): a button trigger, opened by clicking anywhere
        on it - the search input (if any) lives inside the popover instead.
        Autocomplete (creatable=true): the input itself IS the trigger, so
        typing is always available without opening anything first.
      -->
      <div
        v-if="creatable"
        :id="selectId"
        :aria-invalid="selectInvalid || undefined"
        :aria-describedby="describedBy"
        v-bind="triggerProps"
      >
        <template v-if="multiple && displayMode === 'chip'">
          <span
            v-for="option in visibleOptions"
            :key="option.value"
            v-bind="chipProps"
          >
            <slot name="item" :item="option.raw">{{ option.label }}</slot>
            <button type="button" v-bind="chipRemoveProps" @click.stop="removeValue(option.value)">
              <Icon name="lucide:x" class="size-3" />
            </button>
          </span>
        </template>
        <ComboboxInput
          v-model="searchText"
          :display-value="displayValue"
          :placeholder="placeholder"
          v-bind="searchInputProps"
          @keydown="onSearchKeydown"
          @blur="onSearchBlur"
        />
        <STooltip v-if="overflowOptions.length" :text="overflowOptions.map((o) => o.label).join(', ')">
          <span v-bind="chipOverflowProps">+{{ overflowOptions.length }} more</span>
        </STooltip>
        <Icon v-if="loading" name="lucide:loader-2" class="size-4 animate-spin" v-bind="iconProps" />
      </div>

      <ComboboxTrigger
        v-else
        :id="selectId"
        :aria-invalid="selectInvalid || undefined"
        :aria-describedby="describedBy"
        v-bind="triggerProps"
      >
        <template v-if="multiple">
          <template v-if="displayMode === 'chip'">
            <span
              v-for="option in visibleOptions"
              :key="option.value"
              v-bind="chipProps"
            >
              <slot name="item" :item="option.raw">{{ option.label }}</slot>
              <button type="button" v-bind="chipRemoveProps" @click.stop="removeValue(option.value)">
                <Icon name="lucide:x" class="size-3" />
              </button>
            </span>
          </template>
          <span v-else v-bind="valueProps" :data-placeholder="!selectedOptions.length || undefined">
            {{ commaText || placeholder }}
          </span>
          <STooltip v-if="overflowOptions.length" :text="overflowOptions.map((o) => o.label).join(', ')">
            <span v-bind="chipOverflowProps">+{{ overflowOptions.length }} more</span>
          </STooltip>
          <span v-if="!selectedOptions.length && displayMode === 'chip'" v-bind="valueProps" data-placeholder="">
            {{ placeholder }}
          </span>
        </template>
        <span v-else v-bind="valueProps" :data-placeholder="!selectedOptions.length || undefined">
          <slot name="value" :selected="selectedOptions[0]">{{ selectedOptions[0]?.label || placeholder }}</slot>
        </span>

        <Icon v-if="loading" name="lucide:loader-2" class="size-4 animate-spin" v-bind="iconProps" />
        <Icon v-else name="lucide:chevron-down" class="size-4" v-bind="iconProps" />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal>
      <ComboboxContent position="popper" :side-offset="4" v-bind="contentProps">
        <slot name="header" />

        <div v-if="searchable && !creatable" v-bind="searchWrapperProps">
          <Icon name="lucide:search" class="size-4 text-[var(--ui-text-muted)]" />
          <ComboboxInput
            v-model="searchText"
            :display-value="displayValue"
            placeholder="Search..."
            v-bind="searchInputProps"
            @keydown="onSearchKeydown"
            @blur="onSearchBlur"
          />
        </div>

        <div v-if="flatOptions.length === 0" v-bind="emptyProps">
          <slot name="empty">
            No options
          </slot>
        </div>
        <ComboboxViewport v-else v-bind="viewportProps">
          <ComboboxEmpty v-bind="emptyProps">
            <slot name="empty-filter">
              No results found
            </slot>
          </ComboboxEmpty>

          <!--
            @tanstack/vue-virtual measures real DOM/scroll state, so it can't
            render identically during SSR - forcing it through anyway causes a
            hydration mismatch that (confirmed empirically) breaks click
            interactivity page-wide, not just on this component. Client-only
            sidesteps it; the popover is closed at SSR time anyway, so there's
            nothing meaningful to show real users in the fallback.
          -->
          <ClientOnly v-if="virtualizeConfig">
            <ComboboxVirtualizer
              v-slot="{ option, virtualItem }"
              :options="virtualizedOptions"
              :estimate-size="virtualizeConfig.estimateSize"
              :overscan="virtualizeConfig.overscan"
            >
              <ComboboxItem
                :key="virtualItem.key"
                :value="option.value"
                :disabled="option.disabled"
                :style="{ position: 'absolute', top: 0, left: 0, right: 0, transform: `translateY(${virtualItem.start}px)`, height: `${virtualItem.size}px` }"
                v-bind="itemProps"
              >
                <slot name="item" :item="option.raw">
                  {{ option.label }}
                </slot>
                <ComboboxItemIndicator v-bind="itemIndicatorProps">
                  <Icon name="lucide:check" class="size-4" />
                </ComboboxItemIndicator>
              </ComboboxItem>
            </ComboboxVirtualizer>
          </ClientOnly>

          <template v-else>
            <template v-for="(entry, index) in items" :key="index">
              <ComboboxGroup v-if="isOptionGroup(entry)">
                <ComboboxLabel v-bind="groupProps">
                  {{ entry.label }}
                </ComboboxLabel>
                <ComboboxItem
                  v-for="option in groupOptions(entry)"
                  :key="option.value"
                  :value="option.value"
                  :disabled="option.disabled"
                  v-bind="itemProps"
                >
                  <slot name="item" :item="option.raw">
                    {{ option.label }}
                  </slot>
                  <ComboboxItemIndicator v-bind="itemIndicatorProps">
                    <Icon name="lucide:check" class="size-4" />
                  </ComboboxItemIndicator>
                </ComboboxItem>
              </ComboboxGroup>
              <ComboboxItem
                v-else
                :value="toOption(entry).value"
                :disabled="toOption(entry).disabled"
                v-bind="itemProps"
              >
                <slot name="item" :item="entry">
                  {{ toOption(entry).label }}
                </slot>
                <ComboboxItemIndicator v-bind="itemIndicatorProps">
                  <Icon name="lucide:check" class="size-4" />
                </ComboboxItemIndicator>
              </ComboboxItem>
            </template>
          </template>
        </ComboboxViewport>

        <slot name="footer" />
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
