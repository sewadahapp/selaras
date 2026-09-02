import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import Stepper from '../../src/runtime/components/Stepper.vue'

describe('stepper', () => {
  it('marks step 1 active by default when neither modelValue nor defaultValue is given', async () => {
    const wrapper = await mountSuspended(Stepper, {
      props: { items: [{ title: 'One' }, { title: 'Two' }] },
    })
    await nextTick()

    const buttons = wrapper.findAll('button')
    expect(buttons[0]!.attributes('data-state')).toBe('active')
    expect(buttons[1]!.attributes('data-state')).toBe('inactive')
  })

  it('starts on defaultValue and lets clicking another step switch it uncontrolled', async () => {
    const wrapper = await mountSuspended(Stepper, {
      props: { items: [{ title: 'One' }, { title: 'Two' }], defaultValue: 1 },
    })
    await nextTick()

    // reka-ui's StepperTrigger selects on mousedown, not click.
    await wrapper.findAll('button')[1]!.trigger('mousedown')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
    expect(wrapper.findAll('button')[1]!.attributes('data-state')).toBe('active')
  })

  it('reflects a controlled modelValue as inactive/active/completed across all three items', async () => {
    const wrapper = await mountSuspended(Stepper, {
      props: {
        items: [{ title: 'One' }, { title: 'Two' }, { title: 'Three' }],
        modelValue: 2,
      },
    })
    await nextTick()

    const buttons = wrapper.findAll('button')
    expect(buttons[0]!.attributes('data-state')).toBe('completed')
    expect(buttons[1]!.attributes('data-state')).toBe('active')
    expect(buttons[2]!.attributes('data-state')).toBe('inactive')
  })

  it('does not advance on click when modelValue is controlled and the parent ignores the emit', async () => {
    const wrapper = await mountSuspended(Stepper, {
      props: { items: [{ title: 'One' }, { title: 'Two' }], modelValue: 1 },
    })
    await nextTick()

    await wrapper.findAll('button')[1]!.trigger('mousedown')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
    // the emit fired, but this wrapper never feeds modelValue back in, so
    // the displayed active step must not have changed on its own.
    expect(wrapper.findAll('button')[0]!.attributes('data-state')).toBe('active')
  })

  it('blocks clicking a step more than one ahead when linear (the default)', async () => {
    const wrapper = await mountSuspended(Stepper, {
      props: { items: [{ title: 'One' }, { title: 'Two' }, { title: 'Three' }], defaultValue: 1 },
    })
    await nextTick()

    await wrapper.findAll('button')[2]!.trigger('mousedown')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('allows jumping to any step when linear is false', async () => {
    const wrapper = await mountSuspended(Stepper, {
      props: { items: [{ title: 'One' }, { title: 'Two' }, { title: 'Three' }], defaultValue: 1, linear: false },
    })
    await nextTick()

    await wrapper.findAll('button')[2]!.trigger('mousedown')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
  })

  it('does not activate a disabled step on click', async () => {
    const wrapper = await mountSuspended(Stepper, {
      props: {
        items: [{ title: 'One' }, { title: 'Two', disabled: true }],
        defaultValue: 1,
        linear: false,
      },
    })
    await nextTick()

    await wrapper.findAll('button')[1]!.trigger('mousedown')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('shows a checkmark icon for a completed step and the plain number for others', async () => {
    const wrapper = await mountSuspended(Stepper, {
      props: { items: [{ title: 'One' }, { title: 'Two' }], modelValue: 2 },
    })
    await nextTick()

    const buttons = wrapper.findAll('button')
    expect(buttons[0]!.find('.iconify').exists()).toBe(true)
    expect(buttons[1]!.find('.iconify').exists()).toBe(false)
    expect(buttons[1]!.text()).toContain('2')
  })

  it('renders title and description from the item', async () => {
    const wrapper = await mountSuspended(Stepper, {
      props: { items: [{ title: 'Shipping', description: 'Where it goes' }] },
    })
    await nextTick()

    expect(wrapper.text()).toContain('Shipping')
    expect(wrapper.text()).toContain('Where it goes')
  })

  it('the title slot replaces an item\'s title content, scoped with item, index, and state', async () => {
    const wrapper = await mountSuspended(Stepper, {
      props: { items: [{ title: 'One' }, { title: 'Two' }], modelValue: 1 },
      slots: {
        title: '<template #title="{ item, index, state }">[{{ index }}:{{ item.title }}:{{ state }}]</template>',
      },
    })
    await nextTick()

    expect(wrapper.text()).toContain('[0:One:active]')
    expect(wrapper.text()).toContain('[1:Two:inactive]')
  })

  it('merges a string :ui.indicator override with the theme classes', async () => {
    const wrapper = await mountSuspended(Stepper, {
      props: { items: [{ title: 'One' }], ui: { indicator: 'custom-class' } },
    })
    await nextTick()

    expect(wrapper.find('.custom-class').exists()).toBe(true)
  })
})
