import type { ComputedRef } from 'vue'
import { computed } from 'vue'

export interface SelectOption {
  [key: string]: unknown
  disabled?: boolean
}

export interface SelectOptionGroup {
  label: string
  items: SelectOption[]
}

export type SelectItems = (SelectOption | SelectOptionGroup)[]

export function isOptionGroup(entry: SelectOption | SelectOptionGroup): entry is SelectOptionGroup {
  return 'items' in entry && Array.isArray((entry as SelectOptionGroup).items)
}

/** Flattens groups into a plain option list - groups lose their header when virtualized. */
export function flattenItems(items: SelectItems): SelectOption[] {
  return items.flatMap(entry => isOptionGroup(entry) ? entry.items : [entry])
}

interface SelectLikeProps {
  items: SelectItems
  valueKey?: string
  labelKey?: string
  modelValue?: string | string[]
  multiple?: boolean
  displayMode?: 'comma' | 'chip'
  maxChips?: number
}

export interface ResolvedOption {
  value: string
  label: string
  disabled: boolean
  raw: SelectOption
}

export function useComboboxSelect(
  props: SelectLikeProps,
  emit: (event: 'update:modelValue', value: string | string[] | undefined) => void,
  { creatable = false }: { creatable?: boolean } = {},
) {
  const valueKey = computed(() => props.valueKey ?? 'value')
  const labelKey = computed(() => props.labelKey ?? 'label')

  const flatOptions: ComputedRef<ResolvedOption[]> = computed(() => flattenItems(props.items).map(raw => ({
    value: String(raw[valueKey.value] ?? ''),
    label: String(raw[labelKey.value] ?? raw[valueKey.value] ?? ''),
    disabled: !!raw.disabled,
    raw,
  })))

  const selectedValues = computed<string[]>(() => {
    const v = props.modelValue
    if (v === undefined)
      return []
    return Array.isArray(v) ? v : [v]
  })

  function resolveOption(value: string): ResolvedOption {
    return flatOptions.value.find(o => o.value === value) ?? { value, label: value, disabled: false, raw: { [valueKey.value]: value, [labelKey.value]: value } }
  }

  function toOption(raw: SelectOption): ResolvedOption {
    return {
      value: String(raw[valueKey.value] ?? ''),
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

  function setValue(value: string | string[] | undefined) {
    emit('update:modelValue', value)
  }

  function removeValue(value: string) {
    if (!props.multiple) {
      setValue(undefined)
      return
    }
    setValue(selectedValues.value.filter(v => v !== value))
  }

  function isKnownValue(text: string) {
    const lower = text.toLowerCase()
    return flatOptions.value.some(o => o.value.toLowerCase() === lower || o.label.toLowerCase() === lower)
  }

  /** Commits raw typed text as a new value when it doesn't match an existing option. Only used by creatable (autocomplete) mode. Returns true if it committed. */
  function commitCreatableText(rawText: string): boolean {
    const text = rawText.trim()
    if (!creatable || !text || isKnownValue(text))
      return false

    if (props.multiple) {
      if (selectedValues.value.some(v => v.toLowerCase() === text.toLowerCase()))
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
    commitCreatableText,
  }
}
