import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'
import ColorModeSwitch from '../../src/runtime/components/ColorModeSwitch.vue'

const state = vi.hoisted(() => ({ mode: { value: 'light', preference: 'system', forced: false } }))
mockNuxtImport('useColorMode', () => () => state.mode)

describe('color mode switch', () => {
  beforeEach(() => {
    state.mode = reactive({ value: 'light', preference: 'system', forced: false })
  })

  it('reflects resolved system appearance and sets an explicit dark preference', async () => {
    const wrapper = await mountSuspended(ColorModeSwitch)
    const control = wrapper.find('[role="switch"]')
    expect(control.attributes('aria-checked')).toBe('false')
    expect(control.attributes('aria-label')).toBeTruthy()
    await control.trigger('click')
    expect(state.mode.preference).toBe('dark')
    wrapper.unmount()
  })

  it('reflects dark mode and switches to light', async () => {
    state.mode.value = 'dark'
    const wrapper = await mountSuspended(ColorModeSwitch, { attrs: { 'aria-label': 'Dark appearance' } })
    const control = wrapper.find('[role="switch"]')
    expect(control.attributes('aria-checked')).toBe('true')
    expect(control.attributes('aria-label')).toBe('Dark appearance')
    await control.trigger('click')
    expect(state.mode.preference).toBe('light')
    wrapper.unmount()
  })

  it('disables changes for a forced page appearance', async () => {
    state.mode.forced = true
    const wrapper = await mountSuspended(ColorModeSwitch, { props: { label: 'Dark mode' } })
    expect(wrapper.text()).toContain('Dark mode')
    const control = wrapper.find('[role="switch"]')
    expect(control.attributes('disabled')).toBeDefined()
    await control.trigger('click')
    expect(state.mode.preference).toBe('system')
    wrapper.unmount()
  })
})
