import { mountSuspended } from '@nuxt/test-utils/runtime'
import { SliderRoot, TooltipProvider } from 'reka-ui'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import Slider from '../../src/runtime/components/Slider.vue'
import Tooltip from '../../src/runtime/components/Tooltip.vue'

// TooltipRoot (used inside Tooltip.vue) requires a shared TooltipProvider
// ancestor - normally supplied once by SApp. Mirrors tooltip.test.ts's own
// withProvider helper.
function withProvider(children: any) {
  return defineComponent({
    render: () => h(TooltipProvider, null, { default: () => children }),
  })
}

describe('slider', () => {
  it('renders a single thumb reflecting a plain number modelValue', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: 30 } })

    const thumbs = wrapper.findAll('[role="slider"]')
    expect(thumbs).toHaveLength(1)
    expect(thumbs[0]!.attributes('aria-valuenow')).toBe('30')
  })

  it('renders one thumb per array entry for a range modelValue', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: [20, 60] } })

    const thumbs = wrapper.findAll('[role="slider"]')
    expect(thumbs).toHaveLength(2)
    expect(thumbs.map(t => t.attributes('aria-valuenow'))).toEqual(['20', '60'])
  })

  it('emits update:modelValue as a plain number when it was given a plain number', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: 30 } })

    // A real drag isn't simulated here - emitting from the SliderRoot
    // child (which the component's own @update:model-value template
    // binding listens on) exercises the real shape-conversion logic,
    // unlike emitting from the wrapper itself, which would bypass it.
    wrapper.findComponent(SliderRoot).vm.$emit('update:modelValue', [45])
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([45])
  })

  it('emits update:modelValue as an array when it was given an array', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: [20, 60] } })

    wrapper.findComponent(SliderRoot).vm.$emit('update:modelValue', [25, 60])
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[25, 60]])
  })

  it('emits valueCommit separately from update:modelValue, with the same shape conversion', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: 30 } })

    wrapper.findComponent(SliderRoot).vm.$emit('valueCommit', [45])
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('valueCommit')?.at(-1)).toEqual([45])
  })

  it('treats a value as a range for the lifetime of the component even once both thumbs share a value', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: [20, 60] } })

    wrapper.findComponent(SliderRoot).vm.$emit('update:modelValue', [40, 40])
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[40, 40]])
  })

  it('defaults to a single thumb at min when neither modelValue nor defaultValue is given', async () => {
    const wrapper = await mountSuspended(Slider, { props: { min: 10 } })

    const thumbs = wrapper.findAll('[role="slider"]')
    expect(thumbs).toHaveLength(1)
    expect(thumbs[0]!.attributes('aria-valuenow')).toBe('10')
  })

  it('renders no tick marks by default', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: 50 } })

    expect(wrapper.findAll('.bg-\\[var\\(--ui-border-hover\\)\\]')).toHaveLength(0)
  })

  it('renders a tick per step when showTicks is set', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: 50, showTicks: true, step: 25 } })

    // 0, 25, 50, 75, 100 - five ticks for a 0-100 range stepped by 25.
    expect(wrapper.findAll('.bg-\\[var\\(--ui-border-hover\\)\\]')).toHaveLength(5)
  })

  it('forwards a single ariaLabel to every thumb', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: 30, ariaLabel: 'Volume' } })

    expect(wrapper.find('[role="slider"]').attributes('aria-label')).toBe('Volume')
  })

  it('maps an ariaLabel array one per thumb by index', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: [20, 60], ariaLabel: ['Low', 'High'] } })

    const thumbs = wrapper.findAll('[role="slider"]')
    expect(thumbs.map(t => t.attributes('aria-label'))).toEqual(['Low', 'High'])
  })

  it('applies the size variant\'s classes', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: 30, size: 'lg' } })

    expect(wrapper.find('[role="slider"]').classes()).toContain('size-5')
  })

  it('applies the color variant\'s classes to the range and thumb', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: 30, color: 'danger' } })

    expect(wrapper.find('[role="slider"]').classes()).toContain('ring-[var(--ui-danger)]')
  })

  it('merges a string :ui.thumb override with the theme classes', async () => {
    const wrapper = await mountSuspended(Slider, {
      props: { modelValue: 30, ui: { thumb: 'custom-class' } },
    })

    expect(wrapper.find('[role="slider"]').classes()).toContain('custom-class')
  })

  it('disables the whole slider via the disabled prop', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: 30, disabled: true } })

    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('defaults to the circle thumb shape', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: 30 } })

    expect(wrapper.find('[role="slider"]').classes()).toContain('rounded-full')
  })

  it('applies the bar thumb variant\'s classes instead of the circle\'s', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: 30, thumbVariant: 'bar' } })

    const thumb = wrapper.find('[role="slider"]')
    expect(thumb.classes()).toContain('rounded-[var(--ui-radius-sm)]')
    expect(thumb.classes()).not.toContain('rounded-full')
  })

  it('renders no start/end content by default', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: 30 } })

    expect(wrapper.text()).toBe('')
  })

  it('renders the start and end slots flanking the track', async () => {
    const wrapper = await mountSuspended(Slider, {
      props: { modelValue: 30 },
      slots: { start: () => '🐢', end: () => '🐇' },
    })

    expect(wrapper.text()).toBe('🐢🐇')
  })

  it('renders no tooltip by default', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: 30 } })

    expect(wrapper.findComponent(Tooltip).exists()).toBe(false)
  })

  it('wraps each thumb in a Tooltip showing its current value when tooltip is set', async () => {
    const wrapper = await mountSuspended(withProvider(
      h(Slider, { modelValue: [20, 60], tooltip: true }),
    ))

    const tooltips = wrapper.findAllComponents(Tooltip)
    expect(tooltips).toHaveLength(2)
    expect(tooltips.map(t => t.props('text'))).toEqual(['20', '60'])
  })

  it('renders no controls by default', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: 30 } })

    expect(wrapper.findAll('button')).toHaveLength(0)
  })

  it('renders no controls for a range slider even when controls is set', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: [20, 60], controls: true } })

    expect(wrapper.findAll('button')).toHaveLength(0)
  })

  it('renders -/+ controls for a single-value slider when controls is set', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: 30, controls: true } })

    expect(wrapper.findAll('button')).toHaveLength(2)
  })

  it('clicking + steps the value up by step and emits both update:modelValue and valueCommit', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: 30, step: 5, controls: true } })

    await wrapper.findAll('button')[1]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([35])
    expect(wrapper.emitted('valueCommit')?.at(-1)).toEqual([35])
  })

  it('clicking - steps the value down by step', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: 30, step: 5, controls: true } })

    await wrapper.findAll('button')[0]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([25])
  })

  it('clamps stepping at max and disables the + button there', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: 100, max: 100, step: 5, controls: true } })

    const plusButton = wrapper.findAll('button')[1]!
    expect(plusButton.attributes('disabled')).toBeDefined()

    await plusButton.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('clamps stepping at min and disables the - button there', async () => {
    const wrapper = await mountSuspended(Slider, { props: { modelValue: 0, min: 0, step: 5, controls: true } })

    const minusButton = wrapper.findAll('button')[0]!
    expect(minusButton.attributes('disabled')).toBeDefined()

    await minusButton.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
