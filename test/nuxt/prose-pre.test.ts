import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { updateAppConfig } from '#app'
import ProsePre from '../../src/runtime/components/ProsePre.vue'

describe('prosePre file-type icon', () => {
  it.each(['vue', 'vue-html'])('shows the Vue icon for the %s fence language', async (language) => {
    const wrapper = await mountSuspended(ProsePre, { props: { language, code: '<template />' } })

    expect(wrapper.find('.iconify.i-vscode-icons\\:file-type-vue').exists()).toBe(true)
  })

  it('prefers the filename extension over the language', async () => {
    const wrapper = await mountSuspended(ProsePre, { props: { filename: 'App.vue', language: 'html', code: '<template />' } })

    expect(wrapper.find('.iconify.i-vscode-icons\\:file-type-vue').exists()).toBe(true)
    expect(wrapper.find('.iconify.i-vscode-icons\\:file-type-html').exists()).toBe(false)
  })

  it('renders no file-type icon for an unknown language', async () => {
    const wrapper = await mountSuspended(ProsePre, { props: { language: 'not-a-real-language', code: 'x' } })

    expect(wrapper.find('.iconify.i-vscode-icons\\:file-type-vue').exists()).toBe(false)
    expect(wrapper.html()).not.toContain('vscode-icons')
  })

  it('lets the icon prop override the resolved glyph', async () => {
    const wrapper = await mountSuspended(ProsePre, { props: { language: 'vue', icon: 'lucide:file', code: 'x' } })

    expect(wrapper.find('.iconify.i-lucide\\:file').exists()).toBe(true)
    expect(wrapper.find('.iconify.i-vscode-icons\\:file-type-vue').exists()).toBe(false)
  })

  it('renders the icon beside the language label and beside a filename', async () => {
    const byLanguage = await mountSuspended(ProsePre, { props: { language: 'ts', code: 'x' } })
    expect(byLanguage.find('.iconify.i-vscode-icons\\:file-type-typescript').exists()).toBe(true)
    expect(byLanguage.find('.iconify.i-vscode-icons\\:file-type-typescript').element.parentElement?.textContent).toContain('ts')

    const byFilename = await mountSuspended(ProsePre, { props: { filename: 'index.ts', code: 'x' } })
    expect(byFilename.find('.iconify.i-vscode-icons\\:file-type-typescript').exists()).toBe(true)
    expect(byFilename.find('.iconify.i-vscode-icons\\:file-type-typescript').element.parentElement?.textContent).toContain('index.ts')
  })

  it('copies the original code and resets localized feedback after the most recent click', async () => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } })
    updateAppConfig({ selaras: { messages: { copyCode: 'Salin kode', codeCopied: 'Tersalin' } } })
    const wrapper = await mountSuspended(ProsePre, {
      props: { code: 'const original = 1', language: 'ts' },
      slots: { default: 'Different displayed text' },
    })
    vi.useFakeTimers()
    try {
      const button = wrapper.find('button')
      expect(button.attributes('aria-label')).toBe('Salin kode')
      await button.trigger('click')
      await nextTick()
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('const original = 1')
      expect(button.attributes('aria-label')).toBe('Tersalin')
      expect(button.attributes('data-selaras-color')).toBe('success')
      await vi.advanceTimersByTimeAsync(1000)
      await button.trigger('click')
      await vi.advanceTimersByTimeAsync(1000)
      expect(button.attributes('aria-label')).toBe('Tersalin')
      await vi.advanceTimersByTimeAsync(500)
      expect(button.attributes('aria-label')).toBe('Salin kode')
      expect(button.attributes('data-selaras-color')).toBe('neutral')
    }
    finally {
      wrapper.unmount()
      vi.useRealTimers()
      vi.unstubAllGlobals()
      updateAppConfig({ selaras: { messages: { copyCode: 'Copy code', codeCopied: 'Copied!' } } })
    }
  })
})
