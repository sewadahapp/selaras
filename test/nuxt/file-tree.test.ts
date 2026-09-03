import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FileTree from '../../src/runtime/components/FileTree.vue'

const items = [
  {
    name: 'src',
    children: [
      { name: 'index.ts' },
      { name: 'components', children: [{ name: 'Button.vue' }] },
    ],
  },
  { name: 'package.json' },
]

describe('fileTree', () => {
  it('renders a row per top-level node', async () => {
    const wrapper = await mountSuspended(FileTree, { props: { items } })

    const labels = wrapper.findAll('button').map(b => b.text())
    expect(labels).toContain('src')
    expect(labels).toContain('package.json')
  })

  it('directories start expanded by default, showing their children', async () => {
    const wrapper = await mountSuspended(FileTree, { props: { items } })

    expect(wrapper.text()).toContain('index.ts')
    expect(wrapper.text()).toContain('components')
  })

  it('defaultExpanded={false} starts every directory collapsed', async () => {
    const wrapper = await mountSuspended(FileTree, { props: { items, defaultExpanded: false } })

    expect(wrapper.text()).not.toContain('index.ts')
  })

  it('clicking a directory row toggles its children', async () => {
    const wrapper = await mountSuspended(FileTree, { props: { items, defaultExpanded: false } })

    // Toggling mounts a brand-new recursive FileTree instance (the v-if
    // that was false has nothing to patch, so Vue creates one from
    // scratch) - mountSuspended wraps each instance in its own Suspense
    // boundary, which needs a real flush beyond trigger()'s own implicit
    // nextTick to finish resolving before its content appears in the DOM.
    await wrapper.findAll('button').find(b => b.text() === 'src')!.trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('index.ts')

    // Re-queried, not reused - the first click mounted a brand-new
    // recursive instance, which can leave the original wrapper pointing at
    // a now-detached button.
    await wrapper.findAll('button').find(b => b.text() === 'src')!.trigger('click')
    await flushPromises()
    expect(wrapper.text()).not.toContain('index.ts')
  })

  it('clicking a file row emits update:selected with that node, not toggling anything', async () => {
    const wrapper = await mountSuspended(FileTree, { props: { items } })

    const fileRow = wrapper.findAll('button').find(b => b.text() === 'package.json')!
    await fileRow.trigger('click')

    expect(wrapper.emitted('update:selected')?.[0]).toEqual([items[1]])
  })

  it('a nested file click bubbles update:selected up through the recursive parent', async () => {
    const wrapper = await mountSuspended(FileTree, { props: { items } })

    const nestedFile = wrapper.findAll('button').find(b => b.text() === 'Button.vue')!
    await nestedFile.trigger('click')

    expect(wrapper.emitted('update:selected')?.[0]).toEqual([items[0]!.children![1]!.children![0]])
  })

  it('the selected node\'s row gets the selected styling, others don\'t', async () => {
    const wrapper = await mountSuspended(FileTree, { props: { items, selected: items[1] } })

    const selectedRow = wrapper.findAll('button').find(b => b.text() === 'package.json')!
    const otherRow = wrapper.findAll('button').find(b => b.text() === 'src')!
    expect(selectedRow.classes().join(' ')).toContain('text-[var(--ui-primary)]')
    expect(otherRow.classes().join(' ')).not.toContain('text-[var(--ui-primary)]')
  })
})
