import { describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'
import { useComboboxSelect } from '../src/runtime/internal/combobox-select'

const fruitItems = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
]

describe('useComboboxSelect - option records', () => {
  it('keeps an option with nested items when it has no group label', () => {
    const row = { id: 1, title: 'Parent option', items: [{ id: 2 }] }
    const { selectedOptions } = useComboboxSelect({ items: [row], valueKey: 'id', labelKey: 'title', modelValue: 1 }, vi.fn())
    expect(selectedOptions.value[0]?.raw).toBe(row)
    expect(selectedOptions.value[0]?.label).toBe('Parent option')
  })

  it('rejects non-finite identities even though their static type is number', () => {
    for (const value of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
      const { flatOptions } = useComboboxSelect({ items: [{ value }] }, vi.fn())
      expect(() => flatOptions.value).toThrow('strings or finite numbers')
    }
  })

  it('rejects duplicate identities within and across groups, including disabled options', () => {
    const first = { id: 1, title: 'First' }
    const duplicate = { id: 1, title: 'Other label', disabled: true }
    for (const items of [
      [first, duplicate],
      [{ label: 'Group', items: [first, duplicate] }],
      [{ label: 'First group', items: [first] }, { label: 'Second group', items: [duplicate] }],
      [first, { label: 'Group', items: [duplicate] }],
    ]) {
      const { flatOptions } = useComboboxSelect({ items, valueKey: 'id', labelKey: 'title' }, vi.fn())
      expect(() => flatOptions.value).toThrow('Duplicate id: number 1')
    }
  })

  it('retains distinct numeric and string identities without mutating readonly input', () => {
    const numeric = Object.freeze({ value: 1, label: 'Number' })
    const text = Object.freeze({ value: '1', label: 'String' })
    const items = Object.freeze([numeric, Object.freeze({ label: 'Group', items: Object.freeze([text]) })])
    const { flatOptions, selectedOptions } = useComboboxSelect({ items, modelValue: [1, '1'] }, vi.fn())
    expect(flatOptions.value.map(option => option.value)).toEqual([1, '1'])
    expect(selectedOptions.value.map(option => option.raw)).toEqual([numeric, text])
  })

  it('validates duplicate identities again after async option replacement', () => {
    const props = reactive({ items: [{ value: 'one' }] })
    const { flatOptions } = useComboboxSelect(props, vi.fn())
    expect(flatOptions.value).toHaveLength(1)
    props.items = [{ value: 'one' }, { value: 'one' }]
    expect(() => flatOptions.value).toThrow('Duplicate value: string "one"')
    props.items = [{ value: 'two' }]
    expect(flatOptions.value[0]?.value).toBe('two')
  })
})

describe('useComboboxSelect - commitCreatableText', () => {
  it('does nothing when not creatable', () => {
    const emit = vi.fn()
    const { commitCreatableText } = useComboboxSelect({ items: fruitItems }, emit, { creatable: false })

    expect(commitCreatableText('kiwi')).toBe(false)
    expect(emit).not.toHaveBeenCalled()
  })

  it('commits raw text that matches nothing in the list', () => {
    const emit = vi.fn()
    const { commitCreatableText } = useComboboxSelect({ items: fruitItems }, emit, { creatable: true })

    expect(commitCreatableText('kiwi')).toBe(true)
    expect(emit).toHaveBeenCalledWith('update:modelValue', 'kiwi')
  })

  it('does not commit an exact match - lets Reka UI select the real option instead', () => {
    const emit = vi.fn()
    const { commitCreatableText } = useComboboxSelect({ items: fruitItems }, emit, { creatable: true })

    expect(commitCreatableText('apple')).toBe(false)
    expect(emit).not.toHaveBeenCalled()
  })

  it('commits a partial match as free text when no suggestion was chosen', () => {
    const emit = vi.fn()
    const { commitCreatableText } = useComboboxSelect({ items: fruitItems }, emit, { creatable: true })

    expect(commitCreatableText('app')).toBe(true)
    expect(emit).toHaveBeenCalledWith('update:modelValue', 'app')
  })

  it('is case-insensitive when matching', () => {
    const emit = vi.fn()
    const { commitCreatableText } = useComboboxSelect({ items: fruitItems }, emit, { creatable: true })

    expect(commitCreatableText('APPLE')).toBe(false)
    expect(emit).not.toHaveBeenCalled()
  })

  it('appends new text to the selection in multiple mode, skipping an already-selected duplicate', () => {
    const emit = vi.fn()
    const { commitCreatableText } = useComboboxSelect(
      { items: fruitItems, multiple: true, modelValue: ['kiwi'] },
      emit,
      { creatable: true },
    )

    expect(commitCreatableText('kiwi')).toBe(false)
    expect(emit).not.toHaveBeenCalled()

    expect(commitCreatableText('mango')).toBe(true)
    expect(emit).toHaveBeenCalledWith('update:modelValue', ['kiwi', 'mango'])
  })
})
