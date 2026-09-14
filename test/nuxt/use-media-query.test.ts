import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { useIsMobile } from '../../src/runtime/composables/use-media-query'

const TestComponent = defineComponent({
  setup() {
    const isMobile = useIsMobile()
    return () => h('span', { class: 'is-mobile' }, String(isMobile.value))
  },
})

describe('useIsMobile', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.documentElement.style.removeProperty('--selaras-adaptive-breakpoint')
  })

  it.each(['60rem', '900.5px', '55em'])('uses the resolved %s condition and releases its live listener', async (length) => {
    document.documentElement.style.setProperty('--selaras-adaptive-breakpoint', length)
    let listener: (() => void) | undefined
    const media = {
      matches: true,
      addEventListener: vi.fn((_event, callback) => { listener = callback }),
      removeEventListener: vi.fn(),
    }
    const matchMedia = vi.spyOn(window, 'matchMedia').mockReturnValue(media as unknown as MediaQueryList)
    const wrapper = await mountSuspended(TestComponent)
    expect(matchMedia).toHaveBeenCalledWith(`(width < ${length})`)
    expect(wrapper.text()).toBe('true')
    media.matches = false
    listener?.()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('false')
    wrapper.unmount()
    expect(media.removeEventListener).toHaveBeenCalledWith('change', listener)
  })

  it.each(['', 'initial', 'calc(60rem + 1px)'])('diagnoses an unsupported bridge %j without assuming 768px', async (length) => {
    document.documentElement.style.setProperty('--selaras-adaptive-breakpoint', length)
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const matchMedia = vi.spyOn(window, 'matchMedia')
    const wrapper = await mountSuspended(TestComponent)
    expect(wrapper.text()).toBe('false')
    expect(matchMedia).not.toHaveBeenCalled()
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('#selaras/tailwind.css'))
    wrapper.unmount()
  })
})
