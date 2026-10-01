import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { Fragment, h, nextTick } from 'vue'
import CodeGroup from '../../src/runtime/components/CodeGroup.vue'
import ProsePre from '../../src/runtime/components/ProsePre.vue'

describe('codeGroup', () => {
  it('labels a tab from the filename prop when present', async () => {
    const wrapper = await mountSuspended(CodeGroup, {
      slots: { default: () => [h('pre', { filename: 'index.ts' }, 'const a = 1')] },
    })
    await nextTick()
    expect(wrapper.find('[role="tab"]').text()).toBe('index.ts')
  })

  it('falls back to the language prop when there is no filename', async () => {
    const wrapper = await mountSuspended(CodeGroup, {
      slots: { default: () => [h('pre', { language: 'ts' }, 'const a = 1')] },
    })
    await nextTick()
    expect(wrapper.find('[role="tab"]').text()).toBe('ts')
  })

  it('falls back to "Tab N" when neither filename nor language is given', async () => {
    const wrapper = await mountSuspended(CodeGroup, {
      slots: { default: () => [h('pre', {}, 'const a = 1')] },
    })
    await nextTick()
    expect(wrapper.find('[role="tab"]').text()).toBe('Tab 1')
  })

  it('moves ProsePre file metadata into the tab and hides its duplicate header', async () => {
    const wrapper = await mountSuspended(CodeGroup, {
      slots: {
        default: () => [
          h(ProsePre, { filename: 'npm', language: 'bash', code: 'npm install package' }, () => 'npm install package'),
          h(ProsePre, { filename: 'pnpm', language: 'bash', code: 'pnpm add package' }, () => 'pnpm add package'),
          h(ProsePre, { filename: 'yarn', language: 'bash', code: 'yarn add package' }, () => 'yarn add package'),
          h(ProsePre, { filename: 'bun', language: 'bash', code: 'bun add package' }, () => 'bun add package'),
        ],
      },
    })
    await nextTick()

    const tabs = wrapper.findAll('[role="tab"]')
    expect(tabs.map(tab => tab.text())).toEqual(['npm', 'pnpm', 'yarn', 'bun'])
    expect(tabs[0]!.find('.iconify.i-vscode-icons\\:file-type-npm').exists()).toBe(true)
    expect(tabs[1]!.find('.iconify.i-vscode-icons\\:file-type-pnpm').exists()).toBe(true)
    expect(tabs[2]!.find('.iconify.i-vscode-icons\\:file-type-yarn').exists()).toBe(true)
    expect(tabs[3]!.find('.iconify.i-vscode-icons\\:file-type-bun').exists()).toBe(true)
    expect(wrapper.find('[role="tabpanel"] .border-b').exists()).toBe(false)
    expect(wrapper.find('[role="tabpanel"] button').exists()).toBe(false)
  })

  it('flattens a v-for-produced Fragment child into individual tabs, skipping Comment/Text siblings', async () => {
    const wrapper = await mountSuspended(CodeGroup, {
      slots: {
        default: () => [
          h(Fragment, [
            h('pre', { filename: 'a.ts' }, 'a'),
            h('pre', { filename: 'b.ts' }, 'b'),
          ]),
        ],
      },
    })
    await nextTick()
    const labels = wrapper.findAll('[role="tab"]').map(t => t.text())
    expect(labels).toEqual(['a.ts', 'b.ts'])
  })

  it('switches the visible panel when a different tab is clicked, re-cloning the captured vnode', async () => {
    const wrapper = await mountSuspended(CodeGroup, {
      slots: {
        default: () => [
          h('pre', { filename: 'a.ts' }, 'content A'),
          h('pre', { filename: 'b.ts' }, 'content B'),
        ],
      },
    })
    await nextTick()

    expect(wrapper.text()).toContain('content A')
    expect(wrapper.text()).not.toContain('content B')

    const triggers = wrapper.findAll('[role="tab"]')
    // reka-ui's TabsTrigger selects on mousedown, not click
    await triggers[1]!.trigger('mousedown')
    await nextTick()

    expect(wrapper.text()).toContain('content B')
  })
})
