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

  it('gives the clear button an accessible label - an icon-only button otherwise has no name', async () => {
    const wrapper = await mountSuspended(Select, {
      props: { items: fruitItems, modelValue: 'apple', clearable: true },
    })
    const [, clearButton] = wrapper.findAll('button')
    expect(clearButton!.attributes('aria-label')).toBe('Clear')
  })

  it('keeps the trigger as the only Tab stop - the clear button opts out via tabindex=-1', async () => {
    // Regression: ComboboxTrigger ships tabindex=-1 by design (Reka expects
    // the consumer to override it - a comparable reference's own select component does the same).
    // Without that override, the trigger was never reachable by Tab at all -
    // this only became visible once the clear button became a real,
    // naturally-tabbable button competing for the one stop that existed.
    const wrapper = await mountSuspended(Select, {
      props: { items: fruitItems, modelValue: 'apple', clearable: true },
    })
    const [trigger, clearButton] = wrapper.findAll('button')
    expect(trigger!.attributes('tabindex')).toBe('0')
    expect(clearButton!.attributes('tabindex')).toBe('-1')
  })

  it('gives each chip\'s remove button an accessible label naming that chip', async () => {
    const wrapper = await mountSuspended(Select, {
      props: { items: fruitItems, modelValue: ['apple', 'banana'], multiple: true, displayMode: 'chip' },
    })
    const removeButtons = wrapper.findAll('button').filter(b => b.attributes('aria-label')?.startsWith('Remove'))
    expect(removeButtons.map(b => b.attributes('aria-label'))).toEqual(['Remove Apple', 'Remove Banana'])
    // Same tab-stop-competition issue as the clear button - each chip's
    // remove button also opts out of Tab so the trigger stays reachable.
    expect(removeButtons.every(b => b.attributes('tabindex') === '-1')).toBe(true)
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

  it('sets aria-busy on the trigger while loading, with an sr-only announcement', async () => {
    const idle = await mountSuspended(Select, { props: { items: fruitItems } })
    expect(idle.find('button').attributes('aria-busy')).toBeUndefined()
    expect(idle.find('.sr-only').exists()).toBe(false)

    const busy = await mountSuspended(Select, { props: { items: fruitItems, loading: true } })
    expect(busy.find('button').attributes('aria-busy')).toBe('true')
    expect(busy.find('.sr-only').text()).toBe('Loading')
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
