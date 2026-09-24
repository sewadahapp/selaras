<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { SelectThemeSlots } from '../theme/select'
import type { RoundedArrowConfig } from '../utils/arrow'
import type { ColorRole } from '../utils/color-registry'
import type { OverlayPortal, OverlayPositioning } from '../utils/overlay'
import type { UiProp } from '../utils/ui'
import type { SelectItems, SelectOption } from './combobox-select'
import {
  ComboboxAnchor,
  ComboboxArrow,
  ComboboxContent,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  DialogClose,
  ListboxRoot,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
  TagsInputRoot,
  useDirection,
} from 'reka-ui'
import { computed, getCurrentInstance, mergeProps, nextTick, onMounted, onUnmounted, ref, useId, watch } from 'vue'
import Button from '../components/Button.vue'
import Chip from '../components/Chip.vue'
import Icon from '../components/Icon.vue'
import Modal from '../components/Modal.vue'
import Tooltip from '../components/Tooltip.vue'
import { useFormField } from '../composables/use-form-field'
import { useIcons } from '../composables/use-icons'
import { useIsMobile } from '../composables/use-media-query'
import { useMessages } from '../composables/use-messages'
import { selectTheme } from '../theme/select'
import { arrowContentProps, arrowElementProps } from '../utils/arrow'
import { isNativeInputA11yAttr, isNativeInputAttr, isNativeInputEvent } from '../utils/native-input'
import { overlayPortalProps } from '../utils/overlay'
import { resolveRegisteredColorRole } from '../utils/registered-colors'
import { resolveSlot, useComponentTheme, useFallthroughAttrs, useRootProps, useThemeBindings } from '../utils/ui'
import { useComboboxSelect } from './combobox-select'
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
  portal: undefined,
})

const emit = defineEmits<ComboboxSelectBaseEmits>()

const instance = getCurrentInstance()!
type ComboboxSelection = string | number | (string | number)[] | undefined
const initialValue = Array.isArray(props.defaultValue) ? [...props.defaultValue] : props.defaultValue
const isControlled = () => Object.hasOwn(instance.vnode.props ?? {}, 'modelValue') || Object.hasOwn(instance.vnode.props ?? {}, 'model-value')

function selectionForMode(value: ComboboxSelection, multiple: boolean): ComboboxSelection {
  if (multiple) {
    if (value === undefined)
      return []
    return Array.isArray(value) ? [...value] : [value]
  }
  return Array.isArray(value) ? value[0] : value
}

function assertControlledSelectionShape(value: ComboboxSelection, multiple: boolean) {
  // An explicitly supplied `undefined` is the controlled empty selection in
  // either mode. Every non-empty controlled value must match the active mode:
  // Reka otherwise drops a scalar while adding in multiple mode, or silently
  // projects an array to a scalar in single mode.
  if (value === undefined)
    return
  if (multiple && !Array.isArray(value))
    throw new TypeError('[selaras] A controlled Select or Autocomplete with multiple=true requires modelValue to be an array.')
  if (!multiple && Array.isArray(value))
    throw new TypeError('[selaras] A controlled Select or Autocomplete with multiple=false requires modelValue to be a scalar or undefined.')
}

function assertUniqueMultipleSelection(value: ComboboxSelection, property: 'modelValue' | 'defaultValue') {
  if (!Array.isArray(value))
    return

  const values = new Set<string | number>()
  for (const selectedValue of value) {
    if (values.has(selectedValue))
      throw new TypeError(`[selaras] A multiple Select or Autocomplete requires unique ${property} values.`)
    values.add(selectedValue)
  }
}

const localValue = ref<ComboboxSelection>(selectionForMode(initialValue, !!props.multiple))
const selection = computed(() => {
  const value = isControlled() ? props.modelValue : localValue.value
  if (isControlled()) {
    assertControlledSelectionShape(value, !!props.multiple)
    if (props.multiple)
      assertUniqueMultipleSelection(value, 'modelValue')
  }
  return value
})
// Reka treats undefined as uncontrolled, even when the prop is supplied. Keep
// its internal selection controlled by Selaras so rejected proposals cannot
// become selected ARIA state. Null is only the internal single-empty sentinel.
const rekaSelection = computed(() => selection.value ?? (props.multiple ? [] : null))
function updateSelection(event: 'update:modelValue', value: string | number | (string | number)[] | undefined) {
  if (!isControlled())
    localValue.value = value
  emit(event, value)
}

// Capture the editable Autocomplete input itself, rather than its wrapper:
// switching multiple changes ComboboxInput into TagsInputInput and replaces
// that input node. Reka exposes the rendered element through `$el` here.
const editableInput = ref<HTMLInputElement>()
const comboboxRootKey = ref(0)
function setEditableInput(element: unknown) {
  const candidate = typeof HTMLInputElement !== 'undefined' && element instanceof HTMLInputElement
    ? element
    : (element as { $el?: unknown } | null)?.$el
  editableInput.value = typeof HTMLInputElement !== 'undefined' && candidate instanceof HTMLInputElement ? candidate : undefined
}

// A default array can become active after a dynamic mode change and native
// reset, so reject duplicate identities while capturing it rather than later.
assertUniqueMultipleSelection(initialValue, 'defaultValue')

// Fail during setup for an invalid initial controlled contract, before the
// value reaches Reka's ListboxRoot.
if (isControlled()) {
  assertControlledSelectionShape(props.modelValue, !!props.multiple)
  if (props.multiple)
    assertUniqueMultipleSelection(props.modelValue, 'modelValue')
}

const formAnchor = ref<HTMLInputElement>()
let ownerForm: HTMLFormElement | null = null
onMounted(() => {
  ownerForm = formAnchor.value?.form ?? null
  ownerForm?.addEventListener('reset', resetSelection)
})
onUnmounted(() => ownerForm?.removeEventListener('reset', resetSelection))

export interface ComboboxSelectBaseProps {
  id?: string
  name?: string
  /** ID of an associated form outside the component's ancestors. */
  form?: string
  items: SelectItems
  valueKey?: string
  labelKey?: string
  open?: boolean
  /** Initial uncontrolled open state. */
  defaultOpen?: boolean
  modelValue?: string | number | (string | number)[]
  /** Initial uncontrolled selection and native form reset target. */
  defaultValue?: string | number | (string | number)[]
  multiple?: boolean
  searchable?: boolean
  virtualize?: boolean | { estimateSize?: number, overscan?: number }
  displayMode?: 'comma' | 'chip'
  maxChips?: number
  loading?: boolean
  placeholder?: string
  disabled?: boolean
  required?: boolean
  size?: SelectVariants['size']
  invalid?: boolean
  /** The focus-ring color - the resting (unfocused) ring stays neutral regardless. */
  color?: ColorRole
  clearable?: boolean
  dropdown?: boolean
  creatable?: boolean
  forceSelection?: boolean
  searchTerm?: string
  resetSearchTermOnBlur?: boolean
  resetSearchTermOnSelect?: boolean
  /** Shows a small pointer triangle connecting the panel to its trigger. */
  arrow?: boolean | RoundedArrowConfig
  positioning?: OverlayPositioning
  portal?: OverlayPortal
  /** Opts into the component's accessible small-screen presentation. */
  adaptive?: boolean
  ui?: UiProp<SelectThemeSlots>
}

export interface ComboboxSelectBaseEmits {
  'update:open': [value: boolean]
  'update:modelValue': [value: string | number | (string | number)[] | undefined]
  'update:searchTerm': [value: string]
}

const {
  flatOptions,
  selectedValues,
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
} = useComboboxSelect(new Proxy(props, {
  get: (target, key) => key === 'modelValue' ? selection.value : Reflect.get(target, key),
}), updateSelection, { creatable: props.creatable })

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
const selectedChipValue = ref<string | number>()
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
      else if (selectedChipValue.value === undefined) {
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

// Child setup emissions cannot update props already passed during SSR. Seed
// the selected label here so the first server render agrees with hydration.
const internalSearchText = ref(props.searchTerm ?? (props.creatable && !props.multiple && props.resetSearchTermOnSelect ? selectedOptions.value[0]?.label ?? '' : ''))
// Reka synchronizes search text from its root selection. During mode changes,
// preserve the chosen query/display text through that synchronization flush.
const modeSearchLock = ref(false)
const searchText = computed({
  get: () => props.searchTerm ?? internalSearchText.value,
  set: (value: string) => {
    if (modeSearchLock.value)
      return
    internalSearchText.value = value
    emit('update:searchTerm', value)
  },
})

// Reka protects its own highlighted-item selection while composing, but this
// component also handles Enter to create or reject free text. Keep the state
// through the tick after compositionend: Safari can dispatch the IME commit
// Enter after compositionend with event.isComposing already false.
const isSearchComposing = ref(false)
function onSearchCompositionStart() {
  isSearchComposing.value = true
}
function onSearchCompositionEnd() {
  nextTick(() => {
    isSearchComposing.value = false
  })
}

// forceSelection wins over creatable's own free-text commit: if what's typed
// doesn't match any option, revert instead of accepting it as a new value.
function revertUnmatchedText(): boolean {
  if (!props.forceSelection || !searchText.value || hasMatchingOption(searchText.value))
    return false
  searchText.value = ''
  return true
}

function onSearchKeydown(event: KeyboardEvent) {
  // The final IME Enter can follow compositionend with isComposing false.
  // Limit the legacy 229 fallback to Enter so directly typed keys still work.
  if (event.key !== 'Enter' || event.isComposing || isSearchComposing.value || event.keyCode === 229)
    return
  if (revertUnmatchedText()) {
    // The rejected value was handled here, so Enter must not submit a parent
    // form as a side effect.
    event.preventDefault()
    return
  }
  if (commitCreatableText(searchText.value)) {
    searchText.value = ''
    // Creating a value is this input's Enter action, matching Reka's own
    // TagsInput behavior for values it adds from a form field.
    event.preventDefault()
  }
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
  if (!props.creatable || props.multiple || value == null || Array.isArray(value))
    return ''
  return resolveOption(value as string | number).label
}

function singleSelectionLabel(value: ComboboxSelection) {
  return value === undefined || Array.isArray(value) ? '' : resolveOption(value).label
}

// `multiple` is a mode, not a lossy display preference. For uncontrolled
// state, carry the existing selection across modes and make that one state
// transition observable. For controlled state, mode and modelValue are an
// atomic parent contract; the shape assertion above rejects an intermediate or
// stale value rather than manufacturing a value the parent did not provide.
watch(
  [() => !!props.multiple, selection],
  ([multiple, currentValue], [previousMultiple, previousValue]) => {
    if (multiple === previousMultiple)
      return

    const wasEditableFocused = props.creatable
      && typeof document !== 'undefined'
      && document.activeElement === editableInput.value
    const abortingComposition = !!props.creatable && isSearchComposing.value
    const previouslyIdle = props.creatable && props.searchTerm === undefined
      && searchText.value === (previousMultiple || !props.resetSearchTermOnSelect ? '' : singleSelectionLabel(previousValue))
    const savedSearchText = searchText.value

    let nextValue = currentValue
    if (isControlled()) {
      assertControlledSelectionShape(currentValue, multiple)
    }
    else {
      nextValue = selectionForMode(currentValue, multiple)
      updateSelection('update:modelValue', nextValue)
    }
    selectedChipValue.value = undefined
    // The replaced input might never dispatch compositionend. We do not carry
    // an in-progress native composition across mode changes, but must allow a
    // later ordinary Enter to work in the replacement input.
    if (props.creatable)
      isSearchComposing.value = false

    // Reka's root also retains IME composition state. Rebuild it only for an
    // aborted composition so the replacement input can accept ordinary keys;
    // do not claim to continue a native composition across different inputs.
    if (abortingComposition) {
      searchText.value = ''
      updateOpen(false)
      comboboxRootKey.value++
    }

    // A label is an idle single-value display, while multiple mode displays
    // its selection in chips. Keep real queries (and a parent-owned query)
    // across the input replacement instead of mistaking them for display text.
    const nextSearchText = abortingComposition
      ? ''
      : previouslyIdle
        ? (multiple || !props.resetSearchTermOnSelect ? '' : singleSelectionLabel(nextValue))
        : savedSearchText
    if (props.creatable || props.searchable) {
      modeSearchLock.value = true
      if (props.searchTerm === undefined)
        internalSearchText.value = nextSearchText
    }

    const priorInput = editableInput.value
    nextTick(() => {
      if (props.creatable || props.searchable) {
        // Win over the newly mounted Reka input's selection-display sync, then
        // reopen ordinary user input on the following interaction.
        if (props.searchTerm === undefined)
          internalSearchText.value = nextSearchText
        nextTick(() => {
          modeSearchLock.value = false
        })
      }
      if (!wasEditableFocused)
        return
      if (typeof document === 'undefined')
        return
      // Do not steal focus if another caller moved it while Vue replaced the
      // input. A detached old input normally leaves focus on document.body.
      if (document.activeElement !== document.body && document.activeElement !== priorInput)
        return
      editableInput.value?.focus()
    })
  },
  { flush: 'pre' },
)

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

function groupOptions(group: { items: readonly SelectOption[] }) {
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
const themeBindings = useThemeBindings()
const effectiveColor = computed(() => resolveRegisteredColorRole(props.color ?? 'primary', 'primary'))
const colorRoleMarker = computed(() => selectInvalid.value ? 'danger' : effectiveColor.value)
const ui = computed(() => theme.value({ size: effectiveSize.value, color: effectiveColor.value as SelectVariants['color'], invalid: selectInvalid.value }))

const nativeTriggerAttrs = useFallthroughAttrs(key => !props.creatable && (isNativeInputA11yAttr(key) || (!props.searchable && isNativeInputEvent(key))))
const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root, { exclude: key => isNativeInputA11yAttr(key) || isNativeInputEvent(key) || ((props.creatable || props.searchable) && isNativeInputAttr(key)) })
const nativeSearchInputAttrs = useFallthroughAttrs(key => isNativeInputAttr(key) || (props.creatable && isNativeInputA11yAttr(key)))
const triggerProps = computed(() => mergeProps(
  resolveSlot(ui.value.trigger, props.ui?.trigger),
  !props.creatable ? nativeTriggerAttrs.value : {},
))
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
const searchInputProps = computed(() => mergeProps(
  resolveSlot(ui.value.searchInput, props.ui?.searchInput),
  nativeSearchInputAttrs.value,
  { onCompositionstart: onSearchCompositionStart, onCompositionend: onSearchCompositionEnd },
))
const contentProps = computed(() => ({ ...resolveSlot(ui.value.content, props.ui?.content), ...arrowContentProps(props.arrow), ...props.positioning }))
const portalProps = computed(() => overlayPortalProps(props.portal))
const arrowProps = computed(() => ({ ...resolveSlot(ui.value.arrow, props.ui?.arrow), ...arrowElementProps(props.arrow) }))
const viewportProps = computed(() => resolveSlot(ui.value.viewport, props.ui?.viewport))
const groupProps = computed(() => resolveSlot(ui.value.group, props.ui?.group))
const itemProps = computed(() => resolveSlot(ui.value.item, props.ui?.item))
const itemIndicatorProps = computed(() => resolveSlot(ui.value.itemIndicator, props.ui?.itemIndicator))
const emptyProps = computed(() => resolveSlot(ui.value.empty, props.ui?.empty))
const mobileContentProps = computed(() => resolveSlot(ui.value.mobileContent, props.ui?.mobileContent))
const mobilePanelProps = computed(() => mergeProps(
  {
    style: {
      width: 'min(calc(100vw - 2rem), 36rem)',
      minWidth: '0',
      maxHeight: 'min(50vh, 28rem)',
    },
  },
  resolveSlot(ui.value.mobilePanel, props.ui?.mobilePanel),
))

// One open state drives both the desktop Popover and mobile Modal branches.
// When `open` is supplied, the parent owns the value and may veto a close by
// leaving it true after the emitted update.
const localOpen = ref(props.defaultOpen ?? false)
const isOpenControlled = () => Object.hasOwn(instance.vnode.props ?? {}, 'open')
const open = computed(() => isOpenControlled() ? props.open ?? false : localOpen.value)

// Reka refreshes displayValue when selection changes, not when async option
// metadata changes. Update an idle selected label without replacing a query.
watch(flatOptions, (options, previousOptions) => {
  const value = selection.value
  if (!props.creatable || props.multiple || open.value || props.searchTerm !== undefined || !props.resetSearchTermOnSelect || value === undefined || Array.isArray(value))
    return
  const previousLabel = previousOptions.find(option => option.value === value)?.label ?? String(value)
  const nextLabel = options.find(option => option.value === value)?.label ?? String(value)
  if (previousLabel !== nextLabel && searchText.value === previousLabel)
    searchText.value = nextLabel
})

function updateOpen(value: boolean) {
  if (!isOpenControlled())
    localOpen.value = value
  emit('update:open', value)
}

function resetSelection(event: Event) {
  // Respect canceled resets and let the browser finish resetting native controls.
  queueMicrotask(() => {
    if (event.defaultPrevented)
      return
    setValue(selectionForMode(initialValue, !!props.multiple))
    searchText.value = props.creatable && !props.multiple && props.resetSearchTermOnSelect ? singleSelectionLabel(selection.value) : ''
    selectedChipValue.value = undefined
    updateOpen(false)
  })
}

const isMobile = useIsMobile()
// Choose the presentation when opening and hold it until close. Swapping a
// live focus trap between Popover and Modal during a resize can lose focus and
// leave two interaction trees competing for the same Reka root. The next open
// samples the current breakpoint again.
const mobilePresentation = ref(false)
watch(open, (open) => {
  if (!open && mobilePresentation.value && !props.creatable && props.resetSearchTermOnBlur)
    searchText.value = ''
  mobilePresentation.value = open && !!props.adaptive && isMobile.value
})
// Keep server and first-client markup deterministic, then sample the actual
// viewport for a picker that was already open through defaultOpen or open.
// Later viewport changes remain deferred until the next opening.
onMounted(() => {
  if (!open.value)
    return
  mobilePresentation.value = !!props.adaptive && isMobile.value
  // An initially-open mobile Autocomplete has no trigger interaction to put
  // focus in its editor. Once its client-only presentation is chosen, make
  // that persistent editable combobox the active owner without issuing an
  // open request or introducing a modal focus scope around it.
  if (mobilePresentation.value && props.creatable && !props.disabled) {
    nextTick(() => {
      editableInput.value?.focus()
    })
  }
})
const showMobileSelectModal = computed(() => mobilePresentation.value && !props.creatable)
const showMobileAutocompletePanel = computed(() => mobilePresentation.value && !!props.creatable)
const modalId = `selaras-select-modal-${useId()}`
const selectTrigger = ref<{ $el: HTMLElement }>()
const modalBody = ref<InstanceType<typeof ComboboxSelectBody>>()
const modalTriggerAttrs = computed(() => !props.creatable && (open.value ? showMobileSelectModal.value : props.adaptive && isMobile.value)
  ? { 'aria-haspopup': 'dialog', 'aria-controls': modalId }
  : {})
function onModalSelection(value: unknown) {
  setValue(value == null ? (props.multiple ? [] : undefined) : value as string | number | (string | number)[])
  if (!props.multiple)
    updateOpen(false)
}
const adaptiveUi = computed(() => ({
  content: {
    class: 'rounded-[var(--selaras-resolved-radius-md)]',
    ...(!props.creatable
      ? {
          'id': modalId,
          'aria-modal': true,
          'onOpenAutoFocus': (event: Event) => {
            if (props.searchable && modalBody.value?.focusSearch())
              event.preventDefault()
          },
          'onCloseAutoFocus': (event: Event) => {
            event.preventDefault()
            if (!props.disabled && selectTrigger.value?.$el?.isConnected)
              selectTrigger.value.$el.focus()
          },
        }
      : {}),
  },
}))

// Single source of truth for ComboboxSelectBody's own (large) prop surface,
// shared by the desktop popup, the nonmodal Autocomplete panel, and Select's
// modal Listbox adapter.
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
    :key="comboboxRootKey"
    :open="open"
    :model-value="rekaSelection"
    :multiple="multiple"
    :disabled="disabled"
    :ignore-filter="!searchable"
    :reset-search-term-on-blur="resetSearchTermOnBlur"
    :reset-search-term-on-select="resetSearchTermOnSelect"
    :data-selaras-color="colorRoleMarker"
    v-bind="rootProps"
    @update:open="updateOpen($event)"
    @update:model-value="(value) => setValue(value == null ? (multiple ? [] : undefined) : value as string | number | (string | number)[])"
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
        data-ui-group-item
        :data-selaras-field-filled="selectedValues.length ? '' : undefined"
        :data-selaras-field-active="open ? '' : undefined"
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
              :ui="{ root: 'data-[state=active]:ring-2 data-[state=active]:ring-[var(--_selaras-color-fill)]' }"
            >
              <TagsInputItemText as="span">
                <slot v-if="option.raw" name="item" :item="option.raw">
                  {{ option.label }}
                </slot>
                <template v-else>
                  {{ option.label }}
                </template>
              </TagsInputItemText>
              <template #remove="{ class: removeClass }">
                <TagsInputItemDelete :class="removeClass" :aria-labelledby="undefined" :aria-label="messages.removeItem(option.label)">
                  <Icon :name="icons.close" class="size-3" />
                </TagsInputItemDelete>
              </template>
            </Chip>
          </TagsInputItem>
          <ComboboxInput v-model="searchText" as-child>
            <TagsInputInput
              :id="selectId"
              :ref="setEditableInput"
              :display-value="displayValue"
              :placeholder="placeholder"
              :aria-invalid="selectInvalid || undefined"
              :aria-describedby="describedBy"
              :aria-busy="loading || undefined"
              v-bind="searchInputProps"
              @keydown="onSearchKeydown"
              @blur="onSearchBlur"
            />
          </ComboboxInput>
        </TagsInputRoot>
        <ComboboxInput
          v-else
          :id="selectId"
          :ref="setEditableInput"
          v-model="searchText"
          :display-value="displayValue"
          :placeholder="placeholder"
          :aria-invalid="selectInvalid || undefined"
          :aria-describedby="describedBy"
          :aria-busy="loading || undefined"
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
        ref="selectTrigger"
        data-ui-group-item
        :data-selaras-field-filled="selectedValues.length ? '' : undefined"
        :data-selaras-field-active="open ? '' : undefined"
        :aria-invalid="selectInvalid || undefined"
        :aria-describedby="describedBy"
        :aria-busy="loading || undefined"
        v-bind="mergeProps(triggerProps, modalTriggerAttrs)"
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
              :ui="{ root: 'data-[state=active]:ring-2 data-[state=active]:ring-[var(--_selaras-color-fill)]' }"
            >
              <slot v-if="option.raw" name="item" :item="option.raw">
                {{ option.label }}
              </slot>
              <template v-else>
                {{ option.label }}
              </template>
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

    <ComboboxPortal v-if="!showMobileSelectModal" v-bind="portalProps">
      <ComboboxContent
        position="popper" :side-offset="4"
        :data-selaras-theme="themeBindings['data-selaras-theme']" :data-selaras-mode="themeBindings['data-selaras-mode']" :style="themeBindings.style" :data-selaras-color="colorRoleMarker"
        v-bind="showMobileAutocompletePanel ? mergeProps(contentProps, mobilePanelProps) : contentProps"
      >
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
      Modal owns Select's focus/dismissal; Listbox only supplies selection.
      The content slot retains Modal's registered title/description.
      Autocomplete stays in the nonmodal ComboboxContent branch above: its
      editable input is the one focus and dismissal owner for that surface.
    -->
    <Modal
      v-else :open="open" :title="placeholder || messages.search" :description="messages.searchDescription"
      :auto-focus="true" :ui="adaptiveUi"
      @update:open="updateOpen($event)"
    >
      <template #content>
        <ListboxRoot
          v-if="!creatable"
          :model-value="rekaSelection" :multiple="multiple" :disabled="disabled"
          :data-selaras-theme="themeBindings['data-selaras-theme']" :data-selaras-mode="themeBindings['data-selaras-mode']" :style="themeBindings.style" :data-selaras-color="colorRoleMarker" v-bind="mobileContentProps"
          @update:model-value="onModalSelection"
        >
          <ComboboxSelectBody ref="modalBody" v-bind="bodyProps" listbox @update:search-text="searchText = $event">
            <template v-for="slotName in ['header', 'filter-icon', 'empty', 'empty-filter', 'footer'].filter(slotName => $slots[slotName])" #[slotName]>
              <slot :name="slotName" />
            </template>
            <template v-if="$slots.item" #item="scope">
              <slot name="item" v-bind="scope" />
            </template>
            <template v-if="$slots.group" #group="scope">
              <slot name="group" v-bind="scope" />
            </template>
          </ComboboxSelectBody>
        </ListboxRoot>
        <div v-if="!creatable" class="flex justify-end p-2">
          <DialogClose as-child>
            <Button variant="ghost" color="neutral">
              {{ multiple ? messages.done : messages.cancel }}
            </Button>
          </DialogClose>
        </div>
      </template>
    </Modal>
    <input
      ref="formAnchor"
      :type="required ? 'text' : 'hidden'"
      :class="required ? 'sr-only' : undefined"
      :name="required && !selectedValues.length ? name ?? field?.name : undefined"
      :form="form"
      :required="required && !disabled && !selectedValues.length"
      :disabled="disabled || !!selectedValues.length"
      aria-hidden="true"
      tabindex="-1"
      autocomplete="off"
    >
    <input
      v-for="(value, index) in selectedValues"
      :key="index"
      type="hidden"
      :name="name ?? field?.name"
      :form="form"
      :value="String(value)"
      :disabled="disabled"
      :required="required && !disabled && index === 0"
    >
  </ComboboxRoot>
</template>
