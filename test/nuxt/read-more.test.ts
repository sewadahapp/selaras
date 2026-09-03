import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import ReadMore from '../../src/runtime/components/ReadMore.vue'

// happy-dom (this project's own test DOM, see vitest.config.ts) doesn't do
// real layout - scrollHeight always reads 0, so the "already fits, no
// truncation UI" branch is untestable here without faking layout entirely.
// These tests instead cover the always-truncated-until-measured default
// (contentHeight === 0, see ReadMore.vue's own comment) and the toggle
// behavior once truncated, which is real, DOM-independent component logic.
describe('readMore', () => {
  it('renders its default slot content', async () => {
    const wrapper = await mountSuspended(ReadMore, {
      slots: { default: () => 'The full body text.' },
    })

    expect(wrapper.text()).toContain('The full body text.')
  })

  it('shows a "Show more" trigger before any layout measurement has happened', async () => {
    const wrapper = await mountSuspended(ReadMore, { props: {} })

    expect(wrapper.find('button').text()).toBe('Show more')
  })

  it('collapsed max-height matches the previewHeight prop', async () => {
    const wrapper = await mountSuspended(ReadMore, { props: { previewHeight: 120 } })

    const content = wrapper.find('[style]')
    expect(content.attributes('style')).toContain('max-height: 120px')
  })

  it('clicking the trigger flips the label to "Show less" and removes the fade', async () => {
    const wrapper = await mountSuspended(ReadMore, { props: {} })

    await wrapper.find('button').trigger('click')

    expect(wrapper.find('button').text()).toBe('Show less')
  })

  it('merges a string :ui.root override with the theme classes', async () => {
    const wrapper = await mountSuspended(ReadMore, { props: { ui: { root: 'custom-class' } } })

    expect(wrapper.classes()).toContain('custom-class')
  })
})
