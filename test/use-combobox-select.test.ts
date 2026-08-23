import { describe, expect, it, vi } from 'vitest'
import { useComboboxSelect } from '../src/runtime/composables/use-combobox-select'

const fruitItems = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
]

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

  it('does not commit a partial prefix match either - this was the bug: typing "app" and pressing Enter used to clobber Reka UI\'s own selection of the highlighted "Apple" option by committing the literal "app" text right after', () => {
    const emit = vi.fn()
    const { commitCreatableText } = useComboboxSelect({ items: fruitItems }, emit, { creatable: true })

    expect(commitCreatableText('app')).toBe(false)
    expect(emit).not.toHaveBeenCalled()
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
