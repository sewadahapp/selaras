import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { Fragment, h, nextTick } from 'vue'
import CodeGroup from '../../src/runtime/components/CodeGroup.vue'

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
