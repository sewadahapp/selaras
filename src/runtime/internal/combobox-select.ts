import type { ComputedRef } from 'vue'
import type { SelectModelValue } from '../utils/select-contracts'
import { computed } from 'vue'

function optionValue(value: unknown): SelectModelValue {
  if (typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value)))
    return value
  if (typeof value === 'object' && value !== null && !Array.isArray(value))
    return value as Record<string, unknown>
  throw new TypeError('[selaras] Select option values must be strings, finite numbers, or objects.')
}

/** Erased runtime records for the shared implementation, not authoring types. */
export interface SelectOption<Value extends SelectModelValue = SelectModelValue> {
  [key: string]: unknown
  /** The default option key. Custom `valueKey` fields use the same identity contract. */
  value?: Value
  disabled?: boolean
}

export interface SelectOptionGroup<Value extends SelectModelValue = SelectModelValue> {
  label: string
  items: readonly (Value | SelectOption<Value>)[]
}

export type SelectItems<Value extends SelectModelValue = SelectModelValue> = readonly (Value | SelectOption<Value> | SelectOptionGroup<Value>)[]

export function isOptionGroup(entry: unknown): entry is SelectOptionGroup {
  return typeof entry === 'object' && entry !== null && !Array.isArray(entry) && 'label' in entry && typeof entry.label === 'string' && 'items' in entry && Array.isArray(entry.items)
}

/** Flattens groups into a plain option list - groups lose their header when virtualized. */
export function flattenItems(items: SelectItems): (SelectModelValue | SelectOption)[] {
  return items.flatMap(entry => isOptionGroup(entry) ? entry.items as (SelectModelValue | SelectOption)[] : [entry as SelectModelValue | SelectOption])
}

interface SelectLikeProps {
  items: SelectItems
  valueKey?: string
  labelKey?: string
  modelValue?: SelectModelValue | SelectModelValue[]
  multiple?: boolean
  displayMode?: 'comma' | 'chip'
  maxChips?: number
}

export interface ResolvedOption {
  value: SelectModelValue
  key: string | number
  label: string
  disabled: boolean
  raw: SelectOption | SelectModelValue | undefined
}

export interface ResolvedItemOption extends ResolvedOption {
  raw: SelectOption | SelectModelValue
}

export function useComboboxSelect(
  props: SelectLikeProps,
  emit: (event: 'update:modelValue', value: SelectModelValue | SelectModelValue[] | undefined) => void,
  { creatable = false }: { creatable?: boolean } = {},
) {
  const valueKey = computed(() => props.valueKey)
  const labelKey = computed(() => props.labelKey ?? 'label')

  const flatOptions: ComputedRef<ResolvedItemOption[]> = computed(() => {
    const identities = new Set<SelectModelValue>()
    return flattenItems(props.items).map((raw, index) => {
      if (typeof raw === 'string' || typeof raw === 'number') {
        const value = optionValue(raw)
        if (identities.has(value))
          throw new TypeError(`[selaras] Select option identities must be unique across all groups. Duplicate value: ${typeof value} ${JSON.stringify(value)}.`)
        identities.add(value)
        return { value, key: `${typeof value}:${String(value)}`, label: String(value), disabled: false, raw }
      }
      const option = raw as SelectOption
      const key = valueKey.value ?? (option.value !== undefined ? 'value' : undefined)
      const value = optionValue(key === undefined ? option : option[key])
      if (identities.has(value)) {
        throw new TypeError(`[selaras] Select option identities must be unique across all groups. Duplicate ${key ?? 'object identity'}: ${typeof value} ${JSON.stringify(value)}.`)
      }
      identities.add(value)
      return {
        value,
        key: typeof value === 'object' ? `object:${index}` : `${typeof value}:${String(value)}`,
        label: String(option[labelKey.value] ?? (typeof value === 'object' ? '' : value)),
        disabled: !!option.disabled,
        raw: option,
      }
    })
  })

  const selectedValues = computed<SelectModelValue[]>(() => {
    const v = props.modelValue
    if (v === undefined)
      return []
    return Array.isArray(v) ? v : [v]
  })

  function resolveOption(value: SelectModelValue): ResolvedOption {
    const option = flatOptions.value.find(o => o.value === value)
    if (option)
      return option
    const label = typeof value === 'object' ? (value as Record<string, unknown>)[labelKey.value] : value
    return { value, key: typeof value === 'object' ? 'missing-object' : `${typeof value}:${String(value)}`, label: String(label ?? ''), disabled: false, raw: undefined }
  }

  function toOption(raw: SelectOption | SelectModelValue): ResolvedItemOption {
    if (typeof raw === 'string' || typeof raw === 'number')
      return { value: optionValue(raw), key: `${typeof raw}:${String(raw)}`, label: String(raw), disabled: false, raw }
    const option = raw as SelectOption
    const key = valueKey.value ?? (option.value !== undefined ? 'value' : undefined)
    const value = optionValue(key === undefined ? option : option[key])
    return {
      value,
      key: typeof value === 'object' ? 'object:unknown' : `${typeof value}:${String(value)}`,
      label: String(option[labelKey.value] ?? (typeof value === 'object' ? '' : value)),
      disabled: !!option.disabled,
      raw: option,
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

  function setValue(value: SelectModelValue | SelectModelValue[] | undefined) {
    emit('update:modelValue', value)
  }

  function removeValue(value: SelectModelValue) {
    if (!props.multiple) {
      setValue(undefined)
      return
    }
    setValue(selectedValues.value.filter(v => v !== value))
  }

  /** Substring match for forceSelection's incomplete-query handling. */
  function hasMatchingOption(text: string) {
    const lower = text.toLowerCase()
    return flatOptions.value.some(o => String(o.value).toLowerCase().includes(lower) || o.label.toLowerCase().includes(lower))
  }

  /** Commits free text unless it is already an option or a selected value. */
  function commitCreatableText(rawText: string): boolean {
    const text = rawText.trim()
    const lower = text.toLowerCase()
    if (!creatable || !text || flatOptions.value.some(o => String(o.value).toLowerCase() === lower || o.label.toLowerCase() === lower))
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
