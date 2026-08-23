import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import Tabs from '../../src/runtime/components/Tabs.vue'

describe('tabs', () => {
  it('marks no trigger active when modelValue is unset - a fully controlled component has no default tab', async () => {
    const wrapper = await mountSuspended(Tabs, {
      props: { items: [{ label: 'One' }, { label: 'Two' }] },
    })
    await nextTick()

    const triggers = wrapper.findAll('[role="tab"]')
    expect(triggers[0]!.attributes('data-state')).toBe('inactive')
    expect(triggers[1]!.attributes('data-state')).toBe('inactive')
  })

  it('falls back to the item\'s index as its value when no value is given', async () => {
    const wrapper = await mountSuspended(Tabs, {
      props: { items: [{ label: 'One' }, { label: 'Two' }] },
      slots: { 1: () => 'Second panel content' },
    })
    await nextTick()

    const triggers = wrapper.findAll('[role="tab"]')
    // reka-ui's TabsTrigger selects on mousedown, not click
    await triggers[1]!.trigger('mousedown')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1'])
  })

  it('shows the panel matching the controlled modelValue prop', async () => {
    const wrapper = await mountSuspended(Tabs, {
      props: {
        items: [{ label: 'One', value: 'a' }, { label: 'Two', value: 'b' }],
        modelValue: 'b',
      },
      slots: { a: () => 'First panel content', b: () => 'Second panel content' },
    })
    await nextTick()

    expect(wrapper.text()).toContain('Second panel content')
    expect(wrapper.text()).not.toContain('First panel content')
  })

  it('emits update:modelValue with the clicked item\'s explicit value', async () => {
    const wrapper = await mountSuspended(Tabs, {
      props: {
        items: [{ label: 'One', value: 'a' }, { label: 'Two', value: 'b' }],
        modelValue: 'a',
      },
    })
    await nextTick()

    const triggers = wrapper.findAll('[role="tab"]')
    await triggers[1]!.trigger('mousedown')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
  })

  it('does not switch the active panel on click when modelValue is controlled and the parent ignores the emit', async () => {
    const wrapper = await mountSuspended(Tabs, {
      props: {
        items: [{ label: 'One', value: 'a' }, { label: 'Two', value: 'b' }],
        modelValue: 'a',
      },
      slots: { a: () => 'First panel content', b: () => 'Second panel content' },
    })
    await nextTick()

    const triggers = wrapper.findAll('[role="tab"]')
    await triggers[1]!.trigger('mousedown')
    await nextTick()

    // the emit fired (asserted above in the previous test), but since this
    // wrapper never feeds modelValue back in, the displayed panel must not
    // have changed on its own - a real controlled component doesn't drive
    // its own state.
    expect(wrapper.text()).toContain('First panel content')
  })
})
