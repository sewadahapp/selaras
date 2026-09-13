import type { ComputedRef } from 'vue'
import { computed } from 'vue'

export type SelectValue = string | number

function optionValue(value: unknown): SelectValue {
  if (typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value)))
    return value
  throw new TypeError('[selaras] Select option values must be strings or finite numbers.')
}

export interface SelectOption<Value extends SelectValue = SelectValue> {
  [key: string]: unknown
  /** The default option key. Custom `valueKey` fields use the same primitive contract. */
  value?: Value
  disabled?: boolean
}

export interface SelectOptionGroup<Value extends SelectValue = SelectValue> {
  label: string
  items: readonly SelectOption<Value>[]
}

export type SelectItems<Value extends SelectValue = SelectValue> = readonly (SelectOption<Value> | SelectOptionGroup<Value>)[]

export function isOptionGroup<Value extends SelectValue = SelectValue>(entry: SelectOption<Value> | SelectOptionGroup<Value>): entry is SelectOptionGroup<Value> {
  return typeof entry.label === 'string' && 'items' in entry && Array.isArray((entry as SelectOptionGroup).items)
}

/** Flattens groups into a plain option list - groups lose their header when virtualized. */
export function flattenItems<Value extends SelectValue = SelectValue>(items: SelectItems<Value>): SelectOption<Value>[] {
  return items.flatMap(entry => isOptionGroup(entry) ? entry.items : [entry])
}

interface SelectLikeProps {
  items: SelectItems
  valueKey?: string
  labelKey?: string
  modelValue?: SelectValue | SelectValue[]
  multiple?: boolean
  displayMode?: 'comma' | 'chip'
  maxChips?: number
}

export interface ResolvedOption {
  value: SelectValue
  label: string
  disabled: boolean
  raw: SelectOption | undefined
}

export interface ResolvedItemOption extends ResolvedOption {
  raw: SelectOption
}

export function useComboboxSelect(
  props: SelectLikeProps,
  emit: (event: 'update:modelValue', value: SelectValue | SelectValue[] | undefined) => void,
  { creatable = false }: { creatable?: boolean } = {},
) {
  const valueKey = computed(() => props.valueKey ?? 'value')
  const labelKey = computed(() => props.labelKey ?? 'label')

  const flatOptions: ComputedRef<ResolvedItemOption[]> = computed(() => flattenItems(props.items).map(raw => ({
    value: optionValue(raw[valueKey.value]),
    label: String(raw[labelKey.value] ?? raw[valueKey.value] ?? ''),
    disabled: !!raw.disabled,
    raw,
  })))

  const selectedValues = computed<SelectValue[]>(() => {
    const v = props.modelValue
    if (v === undefined)
      return []
    return Array.isArray(v) ? v : [v]
  })

  function resolveOption(value: SelectValue): ResolvedOption {
    return flatOptions.value.find(o => o.value === value) ?? { value, label: String(value), disabled: false, raw: undefined }
  }

  function toOption(raw: SelectOption): ResolvedItemOption {
    return {
      value: optionValue(raw[valueKey.value]),
      label: String(raw[labelKey.value] ?? raw[valueKey.value] ?? ''),
      disabled: !!raw.disabled,
      raw,
    }
  }

  const selectedOptions = computed(() => selectedValues.value.map(resolveOption))

  const maxChips = computed(() => props.maxChips ?? 3)

  // Both display modes truncate at the same point - comma mode just joins the
  // visible slice as text instead of rendering it as chips. Single-select
  // never has enough items to overflow, so this is a no-op there.
  const visibleOptions = computed(() => selectedOptions.value.slice(0, maxChips.value))
  const overflowOptions = computed(() => selectedOptions.value.slice(maxChips.value))
  const commaText = computed(() => visibleOptions.value.map(o => o.label).join(', '))

  function setValue(value: SelectValue | SelectValue[] | undefined) {
    emit('update:modelValue', value)
  }

  function removeValue(value: SelectValue) {
    if (!props.multiple) {
      setValue(undefined)
      return
    }
    setValue(selectedValues.value.filter(v => v !== value))
  }

  /**
   * Substring match, mirroring Reka UI's own `contains`-based filter - not
   * just an exact match. Enter's default keydown handling both selects the
   * currently-highlighted (filtered) option AND runs this: if a typed
   * prefix like "app" only checked for an exact "apple" match, it would
   * "know" nothing matches and clobber that same-keystroke selection by
   * committing the raw "app" text right after Reka set "apple".
   */
  function hasMatchingOption(text: string) {
    const lower = text.toLowerCase()
    return flatOptions.value.some(o => String(o.value).toLowerCase().includes(lower) || o.label.toLowerCase().includes(lower))
  }

  /** Commits raw typed text as a new value when it doesn't match an existing option. Only used by creatable (autocomplete) mode. Returns true if it committed. */
  function commitCreatableText(rawText: string): boolean {
    const text = rawText.trim()
    if (!creatable || !text || hasMatchingOption(text))
      return false

    if (props.multiple) {
      if (selectedValues.value.some(v => typeof v === 'string' && v.toLowerCase() === text.toLowerCase()))
        return false
      setValue([...selectedValues.value, text])
    }
    else {
      setValue(text)
    }
    return true
  }

  return {
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
  }
}
