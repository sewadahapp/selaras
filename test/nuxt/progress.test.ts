import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import Progress from '../../src/runtime/components/Progress.vue'

describe('progress', () => {
  it('linear: sets the indicator width from modelValue/max', async () => {
    const wrapper = await mountSuspended(Progress, { props: { modelValue: 25, max: 50 } })

    const indicator = wrapper.find('[role="progressbar"] > *')
    expect(indicator.attributes('style')).toContain('width: 50%')
  })

  it('linear: exposes the real value via aria-valuenow', async () => {
    const wrapper = await mountSuspended(Progress, { props: { modelValue: 40 } })

    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('40')
  })

  it('linear: indeterminate (no modelValue) sets no inline width and omits aria-valuenow', async () => {
    const wrapper = await mountSuspended(Progress)

    const root = wrapper.find('[role="progressbar"]')
    expect(root.attributes('aria-valuenow')).toBeUndefined()
    const indicator = wrapper.find('[role="progressbar"] > *')
    expect(indicator.attributes('style')).toBeUndefined()
    expect(indicator.classes().join(' ')).toContain('animate-[selaras-progress-indeterminate')
  })

  it('modelValue at max renders a full 100% bar', async () => {
    const wrapper = await mountSuspended(Progress, { props: { modelValue: 100, max: 100 } })

    const indicator = wrapper.find('[role="progressbar"] > *')
    expect(indicator.attributes('style')).toContain('width: 100%')
  })

  it('color and size variants apply to the linear indicator/track', async () => {
    const wrapper = await mountSuspended(Progress, { props: { modelValue: 50, color: 'danger', size: 'lg' } })

    const root = wrapper.find('[role="progressbar"]')
    expect(root.classes()).toContain('h-3')
    expect(wrapper.find('[role="progressbar"] > *').classes()).toContain('bg-[var(--ui-danger)]')
  })

  it('circular: renders an svg with a track and an indicator circle', async () => {
    const wrapper = await mountSuspended(Progress, { props: { type: 'circular', modelValue: 50 } })

    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.findAll('circle')).toHaveLength(2)
  })

  it('circular: computes stroke-dashoffset from percent', async () => {
    const wrapper = await mountSuspended(Progress, { props: { type: 'circular', modelValue: 50, max: 100, size: 'md' } })

    const radius = (48 - 4) / 2
    const circumference = 2 * Math.PI * radius
    const expectedOffset = circumference * 0.5

    const indicator = wrapper.findAll('circle')[1]!
    expect(Number(indicator.attributes('stroke-dashoffset'))).toBeCloseTo(expectedOffset, 5)
  })

  it('circular: indeterminate spins the wrapper', async () => {
    const wrapper = await mountSuspended(Progress, { props: { type: 'circular' } })

    expect(wrapper.find('svg').classes()).toContain('animate-spin')
  })

  it('circular: the default slot renders a centered label scoped with percent', async () => {
    const wrapper = await mountSuspended(Progress, {
      props: { type: 'circular', modelValue: 75 },
      slots: { default: '<template #default="{ percent }">{{ percent }}%</template>' },
    })

    expect(wrapper.text()).toContain('75%')
  })

  it('merges a string :ui.root override with the theme classes (linear)', async () => {
    const wrapper = await mountSuspended(Progress, { props: { modelValue: 50, ui: { root: 'custom-class' } } })

    expect(wrapper.find('[role="progressbar"]').classes()).toContain('custom-class')
  })
})
