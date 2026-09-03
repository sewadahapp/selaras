import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CodeTree from '../../src/runtime/components/CodeTree.vue'

const items = [
  {
    name: 'src',
    children: [
      { name: 'index.ts', code: 'export default 1' },
    ],
  },
  { name: 'package.json', code: '{}' },
]

describe('codeTree', () => {
  it('selects the first file found (depth-first) by default', async () => {
    const wrapper = await mountSuspended(CodeTree, { props: { items } })

    expect(wrapper.find('pre').text()).toBe('export default 1')
  })

  it('clicking a different file swaps the shown content', async () => {
    const wrapper = await mountSuspended(CodeTree, { props: { items } })

    await wrapper.findAll('button').find(b => b.text() === 'package.json')!.trigger('click')

    expect(wrapper.find('pre').text()).toBe('{}')
  })

  it('shows the empty-state message when there are no files at all', async () => {
    const wrapper = await mountSuspended(CodeTree, { props: { items: [{ name: 'src', children: [] }] } })

    expect(wrapper.find('pre').exists()).toBe(false)
    expect(wrapper.text()).toContain('Select a file to view its content')
  })

  it('swapping in a new items array re-picks the default selection', async () => {
    const wrapper = await mountSuspended(CodeTree, { props: { items } })

    await wrapper.findAll('button').find(b => b.text() === 'package.json')!.trigger('click')
    expect(wrapper.find('pre').text()).toBe('{}')

    await wrapper.setProps({ items: [{ name: 'other.ts', code: 'export default 2' }] })
    await flushPromises()
    expect(wrapper.find('pre').text()).toBe('export default 2')
  })

  it('merges a string :ui.root override with the theme classes', async () => {
    const wrapper = await mountSuspended(CodeTree, { props: { items, ui: { root: 'custom-class' } } })

    expect(wrapper.classes()).toContain('custom-class')
  })
})
