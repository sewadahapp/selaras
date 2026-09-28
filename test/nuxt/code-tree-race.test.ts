import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import CodeTree from '../../src/runtime/components/CodeTree.vue'

// Each highlight waits until the test resolves it, so completion order is controlled.
const pending = new Map<string, (html: string) => void>()
vi.mock('shiki', () => ({
  codeToHtml: (code: string) => new Promise<string>((resolve) => {
    pending.set(code, resolve)
  }),
}))

const items = [
  { name: 'a.ts', code: 'const a = 1' },
  { name: 'b.json', code: '{"b":2}' },
]

describe('codeTree highlighting', () => {
  it('keeps the selected file\'s code when an earlier highlight finishes last', async () => {
    const wrapper = await mountSuspended(CodeTree, { props: { items } })
    await flushPromises()
    await wrapper.findAll('button').find(button => button.text().includes('b.json'))!.trigger('click')
    await flushPromises()

    // b.json finishes first, then the stale a.ts highlight resolves.
    pending.get('{"b":2}')!('<pre><code>highlighted b</code></pre>')
    await flushPromises()
    pending.get('const a = 1')!('<pre><code>highlighted a</code></pre>')
    await flushPromises()

    expect(wrapper.find('pre').text()).toBe('highlighted b')
  })
})
