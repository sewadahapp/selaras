import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'
import Button from '../../src/runtime/components/Button.vue'
import ColorModeToggle from '../../src/runtime/components/ColorModeToggle.vue'

const state = vi.hoisted(() => ({ mode: { value: 'light', preference: 'system', forced: false, unknown: false } }))
mockNuxtImport('useColorMode', () => () => state.mode)

describe('color mode toggle', () => {
  beforeEach(() => {
    state.mode = reactive({ value: 'light', preference: 'system', forced: false, unknown: false })
  })

  it.each(['light', 'dark'])('reflects %s appearance after mounting and changes the preference', async (mode) => {
    state.mode.value = mode
    const wrapper = await mountSuspended(ColorModeToggle)
    const button = wrapper.findComponent(Button)
    expect(button.props('icon')).toBe(mode === 'dark' ? 'hugeicons:moon' : 'hugeicons:sun-01')
    expect(button.props('disabled')).toBe(false)
    expect(wrapper.attributes('aria-label')).toBeTruthy()
    await wrapper.trigger('click')
    expect(state.mode.preference).toBe(mode === 'dark' ? 'light' : 'dark')
    wrapper.unmount()
  })

  it.each(['unknown', 'forced'] as const)('disables changes when the appearance is %s', async (flag) => {
    state.mode[flag] = true
    const wrapper = await mountSuspended(ColorModeToggle)
    expect(wrapper.findComponent(Button).props('disabled')).toBe(true)
    await wrapper.trigger('click')
    expect(state.mode.preference).toBe('system')
    wrapper.unmount()
  })
})
