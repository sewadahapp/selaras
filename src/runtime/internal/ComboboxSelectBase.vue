<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { SelectItems, SelectOption } from '../composables/use-combobox-select'
import type { SelectSlots } from '../theme/select'
import type { UiProp } from '../utils/ui'
import {
  ComboboxAnchor,
  ComboboxCancel,
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
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
  TagsInputRoot,
} from 'reka-ui'
import { computed, ref } from 'vue'
import Button from '../components/Button.vue'
import Tooltip from '../components/Tooltip.vue'
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
  clearable?: boolean
  dropdown?: boolean
  creatable?: boolean
  forceSelection?: boolean
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
  setValue,
  removeValue,
  hasMatchingOption,
  commitCreatableText,
} = useComboboxSelect(props, emit, { creatable: props.creatable })

function clear() {
  setValue(props.multiple ? [] : undefined)
}

// Chip removal, for the plain (non-creatable) trigger only - the creatable
// branch has a real <ComboboxInput>, so it can nest TagsInputRoot/
// TagsInputInput directly and get this behavior from Reka for free (see the
// template below). This branch's trigger is a real <button> with no input
// inside it at all (nesting one would be invalid HTML), so there's no
// TagsInputInput to attach to - this hand-rolls the same shape of state
// machine TagsInputRoot's own onInputKeydown implements: a "virtually
// selected" chip (never real DOM focus - that stays on the trigger button)
// that ArrowLeft/Right moves between, and Backspace/Delete removes,
// selecting the last chip on a first Backspace rather than removing
// immediately (matching Reka's own two-step convention).
const selectedChipValue = ref<string>()

function onTriggerKeydown(event: KeyboardEvent) {
  if (!props.multiple || props.displayMode !== 'chip')
    return
  const chips = visibleOptions.value
  if (!chips.length)
    return
  const lastValue = chips.at(-1)!.value
  switch (event.key) {
    case 'Delete':
    case 'Backspace': {
      if (selectedChipValue.value !== undefined) {
        const index = chips.findIndex(o => o.value === selectedChipValue.value)
        const removedValue = selectedChipValue.value
        const remaining = chips.filter(o => o.value !== removedValue)
        selectedChipValue.value = remaining[Math.min(index, remaining.length - 1)]?.value
        removeValue(removedValue)
        event.preventDefault()
      }
      else if (event.key === 'Backspace') {
        selectedChipValue.value = lastValue
        event.preventDefault()
      }
      break
    }
    case 'Home':
    case 'End':
    case 'ArrowRight':
    case 'ArrowLeft': {
      const isNext = event.key === 'ArrowRight' || event.key === 'End'
      if (event.key === 'Home') {
        selectedChipValue.value = chips[0]!.value
      }
      else if (event.key === 'End') {
        selectedChipValue.value = lastValue
      }
      else if (!selectedChipValue.value) {
        // Only ArrowLeft (not ArrowRight) starts a selection from nothing -
        // moving "back into" the chips, same as TagsInputRoot's own rule.
        if (!isNext)
          selectedChipValue.value = lastValue
      }
      else {
        const index = chips.findIndex(o => o.value === selectedChipValue.value)
        const nextIndex = index + (isNext ? 1 : -1)
        // Moving right past the last chip deselects (focus "returns" to the
        // trigger as a whole); there's nothing before the first chip to move
        // left into, so it just stays put.
        selectedChipValue.value = nextIndex >= chips.length ? undefined : chips[Math.max(0, nextIndex)]?.value
      }
      event.preventDefault()
      break
    }
    case 'ArrowUp':
    case 'ArrowDown': {
      // Don't let the popover's own open/highlight-first-item behavior fire
      // while a chip is selected - but let it through untouched otherwise.
      if (selectedChipValue.value !== undefined)
        event.preventDefault()
      break
    }
    default: {
      selectedChipValue.value = undefined
    }
  }
}

const internalSearchText = ref(props.searchTerm ?? '')
const searchText = computed({
  get: () => props.searchTerm ?? internalSearchText.value,
  set: (value: string) => {
    internalSearchText.value = value
    emit('update:searchTerm', value)
  },
})

// forceSelection wins over creatable's own free-text commit: if what's typed
// doesn't match any option, revert instead of accepting it as a new value.
function revertUnmatchedText(): boolean {
  if (!props.forceSelection || !searchText.value || hasMatchingOption(searchText.value))
    return false
  searchText.value = ''
  return true
}

function onSearchKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter')
    return
  if (revertUnmatchedText())
    return
  if (commitCreatableText(searchText.value))
    searchText.value = ''
}

function onSearchBlur() {
  if (revertUnmatchedText())
    return
  if (commitCreatableText(searchText.value))
    searchText.value = ''
}

// The dropdown button is a plain ComboboxTrigger (its own click already
// toggles open/closed) - this only needs to also blank out whatever's typed,
// so opening it always browses the full list rather than staying scoped to
// the current filter.
function onDropdownClick() {
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

const effectiveSize = computed(() => props.size ?? field?.size ?? 'md')

const theme = useComponentTheme('select', selectTheme)
const ui = computed(() => theme.value({ size: effectiveSize.value, invalid: selectInvalid.value }))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const triggerProps = computed(() => resolveSlot(ui.value.trigger, props.ui?.trigger))
const valueProps = computed(() => resolveSlot(ui.value.value, props.ui?.value))
// The value slot's own flex-1 is right for the single-select case (it's
// the only thing in the row besides the chevron), but wrong once it needs
// to sit next to the +N more tooltip in comma mode: flex-1 would make the
// span itself consume all the remaining row width, pushing the tooltip
// after it instead of right next to the truncated text. flex-initial (not
// flex-none) still allows it to shrink for its own text-overflow ellipsis;
// min-w-0 is what actually lets that shrinking happen below content size.
const commaValueProps = computed(() => {
  const override = props.ui?.value
  const overrideClass = typeof override === 'string' ? override : override?.class
  return resolveSlot(ui.value.value, {
    ...(typeof override === 'object' && override !== null ? override : {}),
    class: [overrideClass, 'flex-initial min-w-0'].filter(Boolean).join(' '),
  })
})
const chipProps = computed(() => resolveSlot(ui.value.chip, props.ui?.chip))
const chipRemoveProps = computed(() => resolveSlot(ui.value.chipRemove, props.ui?.chipRemove))
const chipOverflowProps = computed(() => resolveSlot(ui.value.chipOverflow, props.ui?.chipOverflow))
const iconProps = computed(() => resolveSlot(ui.value.icon, props.ui?.icon))
const clearProps = computed(() => resolveSlot(ui.value.clear, props.ui?.clear))
const dropdownProps = computed(() => resolveSlot(ui.value.dropdown, props.ui?.dropdown))
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
        :aria-busy="loading || undefined"
        v-bind="triggerProps"
      >
        <!--
          TagsInputRoot doesn't own selection truth here - it only reads
          visibleOptions to render chips and provides real per-chip keyboard
          navigation (ArrowLeft/Right moves a virtual "selected" tag without
          ever moving real DOM focus off the input; Backspace/Delete removes
          it) via TagsInputInput's keydown handling. @remove-tag is the only
          way its state flows back to us - removeValue is what actually
          mutates the real modelValue.
        -->
        <TagsInputRoot
          v-if="multiple && displayMode === 'chip'"
          :model-value="visibleOptions.map((o) => o.value)"
          delimiter=""
          as-child
          @remove-tag="removeValue"
        >
          <TagsInputItem
            v-for="option in visibleOptions"
            :key="option.value"
            :value="option.value"
            as="span"
            v-bind="chipProps"
          >
            <TagsInputItemText as="span">
              <slot name="item" :item="option.raw">
                {{ option.label }}
              </slot>
            </TagsInputItemText>
            <TagsInputItemDelete :aria-label="`Remove ${option.label}`" v-bind="chipRemoveProps">
              <Icon name="lucide:x" class="size-3" />
            </TagsInputItemDelete>
          </TagsInputItem>
          <ComboboxInput v-model="searchText" as-child>
            <TagsInputInput
              :display-value="displayValue"
              :placeholder="placeholder"
              v-bind="searchInputProps"
              @keydown="onSearchKeydown"
              @blur="onSearchBlur"
            />
          </ComboboxInput>
        </TagsInputRoot>
        <ComboboxInput
          v-else
          v-model="searchText"
          :display-value="displayValue"
          :placeholder="placeholder"
          v-bind="searchInputProps"
          @keydown="onSearchKeydown"
          @blur="onSearchBlur"
        />
        <Tooltip v-if="overflowOptions.length" :text="overflowOptions.map((o) => o.label).join(', ')">
          <span v-bind="chipOverflowProps">+{{ overflowOptions.length }} more</span>
        </Tooltip>
        <ComboboxCancel v-if="clearable && !disabled && selectedOptions.length" as-child>
          <Button
            :size="effectiveSize"
            variant="ghost"
            color="neutral"
            icon="lucide:x"
            aria-label="Clear"
            v-bind="clearProps"
            @click.stop="clear"
          />
        </ComboboxCancel>
        <Icon v-if="loading" name="lucide:loader-2" class="size-4 animate-spin" v-bind="iconProps" />
        <span v-if="loading" class="sr-only">Loading</span>
        <ComboboxTrigger v-if="dropdown" v-bind="dropdownProps" @click="onDropdownClick">
          <Icon name="lucide:chevron-down" class="size-4" />
        </ComboboxTrigger>
      </div>

      <ComboboxTrigger
        v-else
        :id="selectId"
        :aria-invalid="selectInvalid || undefined"
        :aria-describedby="describedBy"
        :aria-busy="loading || undefined"
        v-bind="triggerProps"
        tabindex="0"
        @keydown="onTriggerKeydown"
        @blur="selectedChipValue = undefined"
      >
        <template v-if="multiple">
          <!--
            Both branches wrap their content (chips, or the comma-joined
            text) together with the +N more tooltip in one flex-1 container -
            that's what pushes the chevron to the trigger's far right edge,
            while the tooltip itself stays immediately next to the visible
            content rather than getting shoved all the way to the end too.
          -->
          <div v-if="displayMode === 'chip'" class="flex flex-1 flex-wrap items-center gap-1.5">
            <span
              v-for="option in visibleOptions"
              :key="option.value"
              :data-state="option.value === selectedChipValue ? 'active' : 'inactive'"
              :aria-current="option.value === selectedChipValue || undefined"
              v-bind="chipProps"
            >
              <slot name="item" :item="option.raw">{{ option.label }}</slot>
              <button type="button" tabindex="-1" :aria-label="`Remove ${option.label}`" v-bind="chipRemoveProps" @click.stop="removeValue(option.value)">
                <Icon name="lucide:x" class="size-3" />
              </button>
            </span>
            <span v-if="!selectedOptions.length" v-bind="valueProps" data-placeholder="">
              {{ placeholder }}
            </span>
            <Tooltip v-if="overflowOptions.length" :text="overflowOptions.map((o) => o.label).join(', ')">
              <span v-bind="chipOverflowProps">+{{ overflowOptions.length }} more</span>
            </Tooltip>
          </div>
          <div v-else class="flex flex-1 items-center gap-1.5">
            <span v-bind="commaValueProps" :data-placeholder="!selectedOptions.length || undefined">
              {{ commaText || placeholder }}
            </span>
            <Tooltip v-if="overflowOptions.length" :text="overflowOptions.map((o) => o.label).join(', ')">
              <span v-bind="chipOverflowProps">+{{ overflowOptions.length }} more</span>
            </Tooltip>
          </div>
        </template>
        <span v-else v-bind="valueProps" :data-placeholder="!selectedOptions.length || undefined">
          <slot name="value" :selected="selectedOptions[0]">{{ selectedOptions[0]?.label || placeholder }}</slot>
        </span>

        <ComboboxCancel v-if="clearable && !disabled && selectedOptions.length" as-child>
          <Button
            :size="effectiveSize"
            variant="ghost"
            color="neutral"
            icon="lucide:x"
            aria-label="Clear"
            v-bind="clearProps"
            @click.stop="clear"
          />
        </ComboboxCancel>
        <Icon v-if="loading" name="lucide:loader-2" class="size-4 animate-spin" v-bind="iconProps" />
        <Icon v-else name="lucide:chevron-down" class="size-4" v-bind="iconProps" />
        <span v-if="loading" class="sr-only">Loading</span>
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
                :key="String(virtualItem.key)"
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
                  <slot name="group" :group="entry">
                    {{ entry.label }}
                  </slot>
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
