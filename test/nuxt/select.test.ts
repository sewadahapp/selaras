import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import Select from '../../src/runtime/components/Select.vue'

const fruitItems = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
]

describe('select', () => {
  // the trigger itself is a <button> (clicking anywhere on it opens the
  // popover), so the clear button is a second, nested <button> - present
  // only when clearable is on and there's something to clear.
  it('does not render a clear button when clearable is unset', async () => {
    const wrapper = await mountSuspended(Select, {
      props: { items: fruitItems, modelValue: 'apple' },
    })
    expect(wrapper.findAll('button')).toHaveLength(1)
  })

  it('does not render a clear button when clearable but nothing is selected', async () => {
    const wrapper = await mountSuspended(Select, {
      props: { items: fruitItems, clearable: true },
    })
    expect(wrapper.findAll('button')).toHaveLength(1)
  })

  it('clears a single selection and emits undefined, without opening the popover', async () => {
    const wrapper = await mountSuspended(Select, {
      props: { items: fruitItems, modelValue: 'apple', clearable: true },
    })

    const [trigger, clearButton] = wrapper.findAll('button')
    await clearButton!.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])
    expect(trigger!.attributes('aria-expanded')).toBe('false')
  })

  it('clears a multiple selection down to an empty array', async () => {
    const wrapper = await mountSuspended(Select, {
      props: { items: fruitItems, modelValue: ['apple', 'banana'], multiple: true, clearable: true },
    })

    const [, clearButton] = wrapper.findAll('button')
    await clearButton!.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
  })

  it('hides the clear button while disabled even with a selection', async () => {
    const wrapper = await mountSuspended(Select, {
      props: { items: fruitItems, modelValue: 'apple', clearable: true, disabled: true },
    })
    expect(wrapper.findAll('button')).toHaveLength(1)
  })

  it('renders custom group header content from the group slot, receiving the group entry', async () => {
    const items = [{ label: 'Fruits', items: fruitItems }]
    const wrapper = await mountSuspended(Select, {
      props: { items },
      slots: { group: ({ group }: { group: { label: string } }) => `Category: ${group.label}` },
    })

    await wrapper.find('[aria-haspopup="listbox"]').trigger('click')
    await nextTick()

    expect(document.body.textContent).toContain('Category: Fruits')
  })
})
