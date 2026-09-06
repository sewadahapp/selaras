<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { SelectItems, SelectOption } from '../composables/use-combobox-select'
import type { SelectThemeSlots } from '../theme/select'
import type { UiProp } from '../utils/ui'
import {
  ComboboxAnchor,
  ComboboxArrow,
  ComboboxContent,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
  TagsInputRoot,
  useDirection,
} from 'reka-ui'
import { computed, ref } from 'vue'
import Button from '../components/Button.vue'
import Chip from '../components/Chip.vue'
import Icon from '../components/Icon.vue'
import Modal from '../components/Modal.vue'
import Tooltip from '../components/Tooltip.vue'
import { useComboboxSelect } from '../composables/use-combobox-select'
import { useFormField } from '../composables/use-form-field'
import { useIcons } from '../composables/use-icons'
import { useIsMobile } from '../composables/use-media-query'
import { useMessages } from '../composables/use-messages'
import { selectTheme } from '../theme/select'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import ComboboxSelectBody from './ComboboxSelectBody.vue'

type SelectVariants = VariantProps<typeof selectTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ComboboxSelectBaseProps>(), {
  displayMode: 'comma',
  maxChips: 3,
  resetSearchTermOnBlur: true,
  resetSearchTermOnSelect: true,
  color: 'primary',
  arrow: false,
})

const emit = defineEmits<ComboboxSelectBaseEmits>()

export interface ComboboxSelectBaseProps {
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
  /** The focus-ring color - the resting (unfocused) ring stays neutral regardless. */
  color?: SelectVariants['color']
  clearable?: boolean
  dropdown?: boolean
  creatable?: boolean
  forceSelection?: boolean
  searchTerm?: string
  resetSearchTermOnBlur?: boolean
  resetSearchTermOnSelect?: boolean
  /** Shows a small pointer triangle connecting the panel to its trigger. */
  arrow?: boolean
  /** Below 768px viewport width, presents the popover as a centered Modal instead of a small anchored panel - easier to tap with a finger. Opt-in (defaults `false`) rather than automatic, so an existing usage's look never changes without asking for it. */
  mobileModal?: boolean
  ui?: UiProp<SelectThemeSlots>
}

export interface ComboboxSelectBaseEmits {
  'update:modelValue': [value: string | string[] | undefined]
  'update:searchTerm': [value: string]
}

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
const dir = useDirection()

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
      // The "forward" arrow key is ArrowRight under LTR and ArrowLeft under
      // RTL - it should move toward the end of the chip list either way,
      // matching TagsInputRoot's own direction-aware convention.
      const isForwardKey = dir.value === 'rtl' ? event.key === 'ArrowLeft' : event.key === 'ArrowRight'
      const isNext = isForwardKey || event.key === 'End'
      if (event.key === 'Home') {
        selectedChipValue.value = chips[0]!.value
      }
      else if (event.key === 'End') {
        selectedChipValue.value = lastValue
      }
      else if (!selectedChipValue.value) {
        // Only the "backward" arrow key starts a selection from nothing -
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

// One size step down from the trigger itself - see Input.vue's identical
// clearSize for the reasoning (a full-size dismiss icon reads too heavy,
// especially at lg; sm has no smaller step so it stays sm).
const clearSize = computed(() => ({ sm: 'sm', md: 'sm', lg: 'md' } as const)[effectiveSize.value])

const icons = useIcons()
const messages = useMessages()
const theme = useComponentTheme('select', selectTheme)
const ui = computed(() => theme.value({ size: effectiveSize.value, color: props.color, invalid: selectInvalid.value }))

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
const chipOverflowProps = computed(() => resolveSlot(ui.value.chipOverflow, props.ui?.chipOverflow))
const iconProps = computed(() => resolveSlot(ui.value.icon, props.ui?.icon))
const clearProps = computed(() => resolveSlot(ui.value.clear, props.ui?.clear))
const dropdownProps = computed(() => resolveSlot(ui.value.dropdown, props.ui?.dropdown))
const searchWrapperProps = computed(() => resolveSlot(ui.value.searchWrapper, props.ui?.searchWrapper))
const searchInputProps = computed(() => resolveSlot(ui.value.searchInput, props.ui?.searchInput))
const contentProps = computed(() => resolveSlot(ui.value.content, props.ui?.content))
const arrowProps = computed(() => resolveSlot(ui.value.arrow, props.ui?.arrow))
const viewportProps = computed(() => resolveSlot(ui.value.viewport, props.ui?.viewport))
const groupProps = computed(() => resolveSlot(ui.value.group, props.ui?.group))
const itemProps = computed(() => resolveSlot(ui.value.item, props.ui?.item))
const itemIndicatorProps = computed(() => resolveSlot(ui.value.itemIndicator, props.ui?.itemIndicator))
const emptyProps = computed(() => resolveSlot(ui.value.empty, props.ui?.empty))
const mobileContentProps = computed(() => resolveSlot(ui.value.mobileContent, props.ui?.mobileContent))

// ComboboxRoot's own open state used to be fully uncontrolled - now always
// bound to this local ref instead, so the exact same state can also drive
// the mobileModal branch's own Modal below. Behavior-invisible when
// mobileModal is false; not gated behind it, since passing a real ref
// sometimes and leaving `open` unbound other times is exactly the
// uncontrolled-mode bug Popover.vue's own identical `internalOpen`
// pattern exists to avoid (see that file's own comment on it).
const internalOpen = ref(false)

const isMobile = useIsMobile()
const showMobileModal = computed(() => props.mobileModal && isMobile.value)

// Single source of truth for ComboboxSelectBody's own (large) prop
// surface, so the desktop and mobileModal template branches below each
// just `v-bind` this instead of repeating every prop twice.
const bodyProps = computed(() => ({
  searchable: props.searchable,
  creatable: props.creatable,
  searchText: searchText.value,
  displayValue,
  items: props.items,
  flatOptions: flatOptions.value,
  virtualizeConfig: virtualizeConfig.value,
  virtualizedOptions: virtualizedOptions.value,
  toOption,
  groupOptions,
  onSearchKeydown,
  onSearchBlur,
  searchWrapperProps: searchWrapperProps.value,
  searchInputProps: searchInputProps.value,
  viewportProps: viewportProps.value,
  emptyProps: emptyProps.value,
  groupProps: groupProps.value,
  itemProps: itemProps.value,
  itemIndicatorProps: itemIndicatorProps.value,
}))
</script>

<template>
  <ComboboxRoot
    :open="internalOpen"
    :model-value="modelValue"
    :multiple="multiple"
    :disabled="disabled"
    :name="name ?? field?.name"
    :ignore-filter="!searchable"
    :reset-search-term-on-blur="resetSearchTermOnBlur"
    :reset-search-term-on-select="resetSearchTermOnSelect"
    v-bind="rootProps"
    @update:open="internalOpen = $event"
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
        data-ui-group-item
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
          <!--
            as-child projects Chip itself as the tag element - TagsInputItem
            still owns collection registration/arrow-key nav via whatever
            it clones its props onto. TagsInputItemDelete keeps its own
            <button> (safe here - this branch's own wrapper is a <div>,
            not a button) by filling Chip's #remove slot instead of its
            remove-icon slot, so Chip never renders a second, nested
            interactive control for it to conflict with.
          -->
          <TagsInputItem
            v-for="option in visibleOptions"
            :key="option.value"
            :value="option.value"
            as-child
          >
            <Chip
              size="sm"
              color="primary"
              variant="soft"
              removable
              :ui="{ root: 'data-[state=active]:ring-2 data-[state=active]:ring-[var(--ui-primary)]' }"
            >
              <TagsInputItemText as="span">
                <slot name="item" :item="option.raw">
                  {{ option.label }}
                </slot>
              </TagsInputItemText>
              <template #remove="{ class: removeClass }">
                <TagsInputItemDelete :class="removeClass" :aria-label="messages.removeItem(option.label)">
                  <Icon :name="icons.close" class="size-3" />
                </TagsInputItemDelete>
              </template>
            </Chip>
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
          <span v-bind="chipOverflowProps">{{ messages.moreItems(overflowOptions.length) }}</span>
        </Tooltip>
        <!--
          A plain Button, not ComboboxCancel as-child - this trigger is a
          <div>, so unlike the non-creatable branch below there's no real
          HTML-nesting reason to avoid a real <button> here. Dropped anyway
          to keep both branches' clear button identical; ComboboxCancel's
          own click-driven modelValue/search reset isn't needed since our
          own clear() (via setValue) already covers it, and ComboboxInput's
          display-value re-syncs the visible text once modelValue changes.
          tabindex="-1" replicates the one bit of its behavior this used.
        -->
        <Button
          v-if="clearable && !disabled && selectedOptions.length"
          :size="clearSize"
          variant="text"
          color="neutral"
          tabindex="-1"
          :aria-label="messages.clear"
          v-bind="clearProps"
          @click.stop="clear"
        >
          <template #icon="{ class: iconClass }">
            <slot name="clear-icon">
              <Icon :name="icons.close" :class="iconClass" />
            </slot>
          </template>
        </Button>
        <slot v-if="loading" name="loading-icon">
          <Icon :name="icons.loading" class="size-4 animate-spin" v-bind="iconProps" />
        </slot>
        <span v-if="loading" class="sr-only">{{ messages.loading }}</span>
        <ComboboxTrigger v-if="dropdown" v-bind="dropdownProps" @click="onDropdownClick">
          <slot name="dropdown-icon">
            <Icon :name="icons.chevronDown" class="size-4" />
          </slot>
        </ComboboxTrigger>
      </div>

      <ComboboxTrigger
        v-else
        :id="selectId"
        data-ui-group-item
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
            <Chip
              v-for="option in visibleOptions"
              :key="option.value"
              size="sm"
              color="primary"
              variant="soft"
              removable
              :data-state="option.value === selectedChipValue ? 'active' : 'inactive'"
              :aria-current="option.value === selectedChipValue || undefined"
              :ui="{ root: 'data-[state=active]:ring-2 data-[state=active]:ring-[var(--ui-primary)]' }"
            >
              <slot name="item" :item="option.raw">
                {{ option.label }}
              </slot>
              <!-- role="button", not a real <button> - this trigger already IS a <button> (ComboboxTrigger), see the clear button below for why. -->
              <template #remove="{ class: removeClass }">
                <span role="button" tabindex="-1" :class="removeClass" :aria-label="messages.removeItem(option.label)" @click.stop="removeValue(option.value)">
                  <Icon :name="icons.close" class="size-3" />
                </span>
              </template>
            </Chip>
            <span v-if="!selectedOptions.length" v-bind="valueProps" data-placeholder="">
              {{ placeholder }}
            </span>
            <Tooltip v-if="overflowOptions.length" :text="overflowOptions.map((o) => o.label).join(', ')">
              <span v-bind="chipOverflowProps">{{ messages.moreItems(overflowOptions.length) }}</span>
            </Tooltip>
          </div>
          <div v-else class="flex flex-1 items-center gap-1.5">
            <span v-bind="commaValueProps" :data-placeholder="!selectedOptions.length || undefined">
              {{ commaText || placeholder }}
            </span>
            <Tooltip v-if="overflowOptions.length" :text="overflowOptions.map((o) => o.label).join(', ')">
              <span v-bind="chipOverflowProps">{{ messages.moreItems(overflowOptions.length) }}</span>
            </Tooltip>
          </div>
        </template>
        <span v-else v-bind="valueProps" :data-placeholder="!selectedOptions.length || undefined">
          <slot name="value" :selected="selectedOptions[0]">{{ selectedOptions[0]?.label || placeholder }}</slot>
        </span>

        <!--
          as="span", not a real <button> - this trigger already IS a
          <button> (ComboboxTrigger defaults as="button"), and HTML doesn't
          allow nesting one inside another: the browser's own HTML parser
          silently closes the outer button as soon as it hits the inner
          one, which during SSR corrupts the whole trigger - everything
          from this point on ends up as a sibling *outside* it once
          hydration parses the server markup. role="button" replaces the
          semantics a real <button> would have carried; tabindex="-1" was
          already set here regardless, so nothing about keyboard
          reachability changes.
        -->
        <Button
          v-if="clearable && !disabled && selectedOptions.length"
          as="span"
          role="button"
          :size="clearSize"
          variant="text"
          color="neutral"
          tabindex="-1"
          :aria-label="messages.clear"
          v-bind="clearProps"
          @click.stop="clear"
        >
          <template #icon="{ class: iconClass }">
            <slot name="clear-icon">
              <Icon :name="icons.close" :class="iconClass" />
            </slot>
          </template>
        </Button>
        <template v-if="loading">
          <slot name="loading-icon">
            <Icon :name="icons.loading" class="size-4 animate-spin" v-bind="iconProps" />
          </slot>
        </template>
        <template v-else>
          <slot name="dropdown-icon">
            <Icon :name="icons.chevronDown" class="size-4" v-bind="iconProps" />
          </slot>
        </template>
        <span v-if="loading" class="sr-only">{{ messages.loading }}</span>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal v-if="!showMobileModal">
      <ComboboxContent position="popper" :side-offset="4" v-bind="contentProps">
        <ComboboxSelectBody v-bind="bodyProps" @update:search-text="searchText = $event">
          <template #header>
            <slot name="header" />
          </template>
          <template #filter-icon>
            <slot name="filter-icon" />
          </template>
          <template #empty>
            <slot name="empty" />
          </template>
          <template #empty-filter>
            <slot name="empty-filter" />
          </template>
          <template #item="scope">
            <slot name="item" v-bind="scope" />
          </template>
          <template #group="scope">
            <slot name="group" v-bind="scope" />
          </template>
          <template #footer>
            <slot name="footer" />
          </template>
        </ComboboxSelectBody>
        <ComboboxArrow v-if="arrow" v-bind="arrowProps" />
      </ComboboxContent>
    </ComboboxPortal>
    <!--
      Below 768px, presents the exact same ComboboxSelectBody - the same
      Root-injected filtering/selection/keyboard behavior, unchanged -
      inside a centered Modal instead of the small anchored popover above.
      No ComboboxPortal here: Modal's own DialogPortal already teleports
      #content as a whole, nesting a second teleport inside it would be
      redundant. ComboboxContent still wraps it (no `position` prop, so
      Reka renders it as a plain unstyled box rather than applying its own
      Floating-UI positioning - confirmed by reading ComboboxContentImpl
      directly) since ComboboxViewport/ComboboxItem's own context still
      expects a ComboboxContent ancestor. `title`/`description` are
      passed explicitly here - Modal's own dev-mode a11y warning is
      satisfied merely by the content slot existing, so it won't catch a
      name-less dialog on its own; Modal registers both with Reka
      (visually hidden) even though the content slot replaces its own
      visible header.
    -->
    <!--
      auto-focus="!creatable" - Select's own trigger is a one-off tap (a
      button; once the modal opens, the next interaction is tapping an
      item, or typing into a *different* search box that lives inside the
      modal itself), so Reka's default open-autofocus is fine, even
      helpful for a keyboard user. Autocomplete's trigger *is* the search
      input itself, typed into continuously while the modal stays open -
      Reka's default there stole focus away on the very first keystroke
      (confirmed live: opening via typing immediately re-focused the
      modal's own content, silently dropping every character typed
      afterward) - the same class of bug DatePicker's own range-mode
      autofocus interference was, just triggered by every keystroke
      instead of a single click.
      :ui content - overrides Modal's own default rounded-lg down to
      rounded-md, matching every other floating panel in this library
      (Select/Autocomplete/DatePicker's own desktop popovers all use
      rounded-md) - rounded-lg reads noticeably heavier/rounder than the
      desktop equivalent for what's otherwise the same surface.
    -->
    <Modal
      v-else :open="internalOpen" :title="placeholder || messages.search" :description="messages.searchDescription"
      :auto-focus="!creatable" :ui="{ content: 'rounded-[var(--ui-radius-md)]' }"
      @update:open="internalOpen = $event"
    >
      <template #content>
        <ComboboxContent v-bind="mobileContentProps">
          <ComboboxSelectBody v-bind="bodyProps" @update:search-text="searchText = $event">
            <template #header>
              <slot name="header" />
            </template>
            <template #filter-icon>
              <slot name="filter-icon" />
            </template>
            <template #empty>
              <slot name="empty" />
            </template>
            <template #empty-filter>
              <slot name="empty-filter" />
            </template>
            <template #item="scope">
              <slot name="item" v-bind="scope" />
            </template>
            <template #group="scope">
              <slot name="group" v-bind="scope" />
            </template>
            <template #footer>
              <slot name="footer" />
            </template>
          </ComboboxSelectBody>
        </ComboboxContent>
      </template>
    </Modal>
  </ComboboxRoot>
</template>
