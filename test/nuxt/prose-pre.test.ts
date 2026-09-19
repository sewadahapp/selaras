import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import ProsePre from '../../src/runtime/components/ProsePre.vue'

describe('prosePre file-type icon', () => {
  it('shows the icon for a known fence language', async () => {
    const wrapper = await mountSuspended(ProsePre, { props: { language: 'vue', code: '<template />' } })

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

  it('renders the icon beside the language badge and beside a filename', async () => {
    const byLanguage = await mountSuspended(ProsePre, { props: { language: 'ts', code: 'x' } })
    expect(byLanguage.find('.iconify.i-vscode-icons\\:file-type-typescript').exists()).toBe(true)
    expect(byLanguage.find('.iconify.i-vscode-icons\\:file-type-typescript').element.parentElement?.textContent).toContain('ts')

    const byFilename = await mountSuspended(ProsePre, { props: { filename: 'index.ts', code: 'x' } })
    expect(byFilename.find('.iconify.i-vscode-icons\\:file-type-typescript').exists()).toBe(true)
    expect(byFilename.find('.iconify.i-vscode-icons\\:file-type-typescript').element.parentElement?.textContent).toContain('index.ts')
  })
})
