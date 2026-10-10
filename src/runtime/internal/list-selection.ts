import type { SelectModelValue } from '../utils/select-contracts'
import { computed, getCurrentInstance, ref, watch } from 'vue'

export type ListSelection = SelectModelValue | SelectModelValue[] | undefined

export function selectionForMode(value: ListSelection, multiple: boolean): ListSelection {
  return multiple ? value === undefined ? [] : Array.isArray(value) ? [...value] : [value] : Array.isArray(value) ? value[0] : value
}

export function assertUniqueSelection(value: ListSelection) {
  if (Array.isArray(value) && new Set(value).size !== value.length)
    throw new TypeError('[selaras] List selection values must be unique.')
}

export function useListSelection(
  props: { modelValue?: ListSelection, defaultValue?: ListSelection, multiple?: boolean, disabled?: boolean },
  emit: (value: ListSelection) => void,
) {
  const instance = getCurrentInstance()!
  const controlled = () => Object.hasOwn(instance.vnode.props ?? {}, 'modelValue') || Object.hasOwn(instance.vnode.props ?? {}, 'model-value')
  const initial = Array.isArray(props.defaultValue) ? [...props.defaultValue] : props.defaultValue
  assertUniqueSelection(initial)
  const local = ref<ListSelection>(selectionForMode(initial, !!props.multiple))
  const selection = computed(() => {
    const value = controlled() ? props.modelValue : local.value
    if (controlled() && value !== undefined && Array.isArray(value) !== !!props.multiple)
      throw new TypeError('[selaras] List modelValue must be an array in multiple mode and a scalar in single mode.')
    assertUniqueSelection(value)
    return value
  })
  // Validate before passing a value into the underlying selection primitive.
  void selection.value
  function update(value: ListSelection) {
    if (props.disabled)
      return
    assertUniqueSelection(value)
    if (!controlled())
      local.value = value
    emit(value)
  }
  watch(() => props.multiple, (multiple) => {
    if (!controlled())
      update(selectionForMode(local.value, !!multiple))
  })
  function reset() {
    const value = selectionForMode(initial, !!props.multiple)
    if (!controlled())
      local.value = value
    emit(value)
  }
  const values = computed<SelectModelValue[]>(() => selection.value === undefined ? [] : Array.isArray(selection.value) ? selection.value : [selection.value])
  return { selection, values, update, reset }
}
