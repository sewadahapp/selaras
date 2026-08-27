import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import RadioGroup from '../../src/runtime/components/RadioGroup.vue'

describe('radioGroup', () => {
  it('normalizes a plain string item into { label: value, value }', async () => {
    const wrapper = await mountSuspended(RadioGroup, { props: { items: ['Yes', 'No'] } })
    const labels = wrapper.findAll('label')
    expect(labels.map(l => l.text())).toEqual(['Yes', 'No'])
  })

  it('emits update:modelValue with the clicked item\'s value', async () => {
    const wrapper = await mountSuspended(RadioGroup, {
      props: { items: [{ label: 'Small', value: 'sm' }, { label: 'Large', value: 'lg' }] },
    })
    await wrapper.findAll('button')[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['lg'])
  })

  it('top-aligns the item and pushes items-start onto the wrapper when the item has a description', async () => {
    const wrapper = await mountSuspended(RadioGroup, {
      props: {
        items: [
          { label: 'Plain', value: 'plain' },
          { label: 'With note', value: 'note', description: 'Extra detail' },
        ],
      },
    })
    const wrappers = wrapper.findAll('label')
    expect(wrappers[0]!.classes()).toContain('items-center')
    expect(wrappers[0]!.classes()).not.toContain('items-start')
    expect(wrappers[1]!.classes()).toContain('items-start')
  })

  it('renders the description text alongside the label when set', async () => {
    const wrapper = await mountSuspended(RadioGroup, {
      props: { items: [{ label: 'With note', value: 'note', description: 'Extra detail' }] },
    })
    expect(wrapper.text()).toContain('With note')
    expect(wrapper.text()).toContain('Extra detail')
  })

  it('lets the label slot override the default label/description markup', async () => {
    const wrapper = await mountSuspended(RadioGroup, {
      props: { items: [{ label: 'Plain', value: 'plain' }], modelValue: 'plain' },
      slots: {
        label: (props: { item: { label: string }, checked: boolean }) => `${props.item.label}-${props.checked}`,
      },
    })
    expect(wrapper.text()).toBe('Plain-true')
  })

  it('disables an individual item independently of the group', async () => {
    const wrapper = await mountSuspended(RadioGroup, {
      props: { items: [{ label: 'Enabled', value: 'a' }, { label: 'Disabled', value: 'b', disabled: true }] },
    })
    const buttons = wrapper.findAll('button')
    expect(buttons[0]!.attributes('disabled')).toBeUndefined()
    expect(buttons[1]!.attributes('disabled')).toBeDefined()
  })
})
