import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { useIsMobile } from '../../src/runtime/composables/use-media-query'

const TestComponent = defineComponent({
  props: { breakpoint: { type: Number, default: 768 } },
  setup(props) {
    const isMobile = useIsMobile(props.breakpoint)
    return () => h('span', { class: 'is-mobile' }, String(isMobile.value))
  },
})

describe('useIsMobile', () => {
  it('defaults to false on mount - this test environment\'s matchMedia never matches, the same as dashboard-group.test.ts\'s own desktop-default case', async () => {
    const wrapper = await mountSuspended(TestComponent)

    expect(wrapper.find('.is-mobile').text()).toBe('false')

    wrapper.unmount()
  })

  it('accepts a custom breakpoint without throwing', async () => {
    const wrapper = await mountSuspended(TestComponent, { props: { breakpoint: 1024 } })

    expect(wrapper.find('.is-mobile').text()).toBe('false')

    wrapper.unmount()
  })

  it('cleans up its own matchMedia listener on unmount without throwing', async () => {
    const wrapper = await mountSuspended(TestComponent)

    expect(() => wrapper.unmount()).not.toThrow()
  })
})
