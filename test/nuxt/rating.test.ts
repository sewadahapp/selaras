import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import Rating from '../../src/runtime/components/Rating.vue'

describe('rating', () => {
  it('renders 5 stars by default, none active, when no value is given', async () => {
    const wrapper = await mountSuspended(Rating)
    await nextTick()

    const stars = wrapper.findAll('[role="radio"]')
    expect(stars).toHaveLength(5)
    expect(stars.every(s => s.attributes('data-state') === undefined)).toBe(true)
  })

  it('renders `length` stars', async () => {
    const wrapper = await mountSuspended(Rating, { props: { length: 3 } })
    await nextTick()

    expect(wrapper.findAll('[role="radio"]')).toHaveLength(3)
  })

  it('marks every star up to and including defaultValue as active, the rest not', async () => {
    const wrapper = await mountSuspended(Rating, { props: { defaultValue: 3 } })
    await nextTick()

    const stars = wrapper.findAll('[role="radio"]')
    expect(stars.slice(0, 3).every(s => s.attributes('data-state') === 'active')).toBe(true)
    expect(stars.slice(3).every(s => s.attributes('data-state') !== 'active')).toBe(true)
  })

  it('clicking a star updates the value uncontrolled and emits update:modelValue', async () => {
    const wrapper = await mountSuspended(Rating, { props: { defaultValue: 1 } })
    await nextTick()

    // Reka's own Radio renders a real button whose real trigger is a
    // plain click (confirmed in reka-ui's compiled Radio.js), unlike
    // Slider/Stepper/Tabs' own pointer/mousedown handling.
    await wrapper.findAll('[role="radio"]')[3]!.trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
    expect(wrapper.findAll('[role="radio"]')[3]!.attributes('data-state')).toBe('active')
  })

  it('does not self-advance on click when modelValue is controlled and the parent ignores the emit', async () => {
    const wrapper = await mountSuspended(Rating, { props: { modelValue: 1 } })
    await nextTick()

    await wrapper.findAll('[role="radio"]')[3]!.trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
    expect(wrapper.findAll('[role="radio"]')[0]!.attributes('data-state')).toBe('active')
  })

  it('clicking the current value again is a no-op without clearable', async () => {
    const wrapper = await mountSuspended(Rating, { props: { defaultValue: 3 } })
    await nextTick()

    await wrapper.findAll('[role="radio"]')[2]!.trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('clicking the current value again resets to 0 with clearable', async () => {
    const wrapper = await mountSuspended(Rating, { props: { defaultValue: 3, clearable: true } })
    await nextTick()

    await wrapper.findAll('[role="radio"]')[2]!.trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0])
  })

  it('renders two step indicators per star when step is 0.5', async () => {
    const wrapper = await mountSuspended(Rating, { props: { length: 1, step: 0.5 } })
    await nextTick()

    expect(wrapper.findAll('[role="radio"]')).toHaveLength(2)
  })

  it('selects the half-step value when its own indicator is clicked', async () => {
    const wrapper = await mountSuspended(Rating, { props: { length: 1, step: 0.5 } })
    await nextTick()

    await wrapper.findAll('[role="radio"]')[0]!.trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0.5])
  })

  it('does not activate a star when disabled', async () => {
    const wrapper = await mountSuspended(Rating, { props: { defaultValue: 1, disabled: true } })
    await nextTick()

    await wrapper.findAll('[role="radio"]')[3]!.trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('merges a string :ui.item override with the theme classes', async () => {
    const wrapper = await mountSuspended(Rating, { props: { ui: { item: 'custom-class' } } })
    await nextTick()

    expect(wrapper.find('.custom-class').exists()).toBe(true)
  })
})
