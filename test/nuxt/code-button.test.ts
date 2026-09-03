import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CodeButton from '../../src/runtime/components/CodeButton.vue'

describe('codeButton', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('displays the code prop by default', async () => {
    const wrapper = await mountSuspended(CodeButton, { props: { code: 'npm install selaras' } })

    expect(wrapper.text()).toContain('npm install selaras')
  })

  it('the default slot overrides the displayed text', async () => {
    const wrapper = await mountSuspended(CodeButton, {
      props: { code: 'npm install selaras' },
      slots: { default: () => 'Copy install command' },
    })

    expect(wrapper.text()).toContain('Copy install command')
    expect(wrapper.text()).not.toContain('npm install selaras')
  })

  it('clicking copies the code prop (not the displayed slot text) to the clipboard', async () => {
    const wrapper = await mountSuspended(CodeButton, {
      props: { code: 'npm install selaras' },
      slots: { default: () => 'Copy install command' },
    })

    await wrapper.find('button').trigger('click')

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('npm install selaras')
  })

  it('swaps to the check icon after copying', async () => {
    const wrapper = await mountSuspended(CodeButton, { props: { code: 'npm install selaras' } })

    expect(wrapper.find('.iconify').classes()).toContain('i-hugeicons:copy')

    await wrapper.find('button').trigger('click')
    await vi.waitFor(() => expect(wrapper.find('.iconify').classes()).toContain('i-hugeicons:tick-02'))
  })
})
