import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import CodeTree from '../../src/runtime/components/CodeTree.vue'
import Theme from '../../src/runtime/components/Theme.vue'

const items = [
  {
    name: 'src',
    children: [
      { name: 'index.ts', code: 'export default 1' },
      { name: 'App.vue', code: '<template>\n  <p>Hello</p>\n</template>' },
    ],
  },
  { name: 'package.json', code: '{}' },
]

describe('codeTree', () => {
  it('selects the first file found (depth-first) by default', async () => {
    const wrapper = await mountSuspended(CodeTree, { props: { items } })

    expect(wrapper.find('pre').text()).toBe('export default 1')
    expect(wrapper.findAll('button').find(button => button.text().includes('index.ts'))!.attributes('aria-current')).toBe('true')
  })

  it('uses VS Code file icons inferred from each filename', async () => {
    const wrapper = await mountSuspended(CodeTree, { props: { items } })

    expect(wrapper.findAll('button').find(button => button.text().includes('index.ts'))!.html()).toContain('vscode-icons:file-type-typescript')
    expect(wrapper.findAll('button').find(button => button.text().includes('App.vue'))!.html()).toContain('vscode-icons:file-type-vue')
  })

  it('highlights each line in the open file', async () => {
    const wrapper = await mountSuspended(CodeTree, { props: { items } })

    await wrapper.findAll('button').find(button => button.text().includes('App.vue'))!.trigger('click')
    await flushPromises()

    expect(wrapper.findAll('pre code .line')).toHaveLength(3)
  })

  it('clicking a different file swaps the shown content', async () => {
    const wrapper = await mountSuspended(CodeTree, { props: { items } })

    await wrapper.findAll('button').find(b => b.text() === 'package.json')!.trigger('click')

    expect(wrapper.find('pre').text()).toBe('{}')
    expect(wrapper.findAll('button').find(button => button.text() === 'package.json')!.attributes('aria-current')).toBe('true')
    expect(wrapper.findAll('button').find(button => button.text().includes('index.ts'))!.attributes('aria-current')).toBeUndefined()
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

  it.each([
    ['follows the page by default', undefined, 'root'],
    ['follows a scoped dark theme', 'dark', 'dark'],
    ['follows a scoped light theme', 'light', 'light'],
  ] as const)('highlighted code %s', async (_, mode, expected) => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => mode ? h(Theme, { as: 'section', mode }, () => h(CodeTree, { items })) : h(CodeTree, { items }),
    }))
    await flushPromises()

    expect(wrapper.find('code.selaras-code-tree-code').attributes('data-selaras-code-mode')).toBe(expected)
  })
})
