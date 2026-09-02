import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import Separator from '../../src/runtime/components/Separator.vue'

describe('separator', () => {
  it('defaults to role="separator" with no aria-orientation (horizontal)', async () => {
    const wrapper = await mountSuspended(Separator)

    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.attributes('aria-orientation')).toBeUndefined()
  })

  it('sets aria-orientation="vertical" when vertical', async () => {
    const wrapper = await mountSuspended(Separator, { props: { orientation: 'vertical' } })

    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
  })

  it('renders role="none" when decorative', async () => {
    const wrapper = await mountSuspended(Separator, { props: { decorative: true } })

    expect(wrapper.attributes('role')).toBe('none')
  })

  it('renders a single line with no default slot content', async () => {
    const wrapper = await mountSuspended(Separator)

    expect(wrapper.findAll('span')).toHaveLength(1)
    expect(wrapper.text()).toBe('')
  })

  it('renders the label between two line segments when given', async () => {
    const wrapper = await mountSuspended(Separator, {
      slots: { default: () => 'Or continue with' },
    })

    const spans = wrapper.findAll('span')
    expect(spans).toHaveLength(3)
    expect(wrapper.text()).toBe('Or continue with')
  })

  it('merges a string :ui.line override with the theme classes', async () => {
    const wrapper = await mountSuspended(Separator, { props: { ui: { line: 'custom-class' } } })

    expect(wrapper.find('span').classes()).toContain('custom-class')
  })

  it('defaults to the solid variant and neutral color', async () => {
    const wrapper = await mountSuspended(Separator)

    const line = wrapper.find('span')
    expect(line.classes()).toContain('border-solid')
    expect(line.classes()).toContain('border-[var(--ui-border)]')
  })

  it('applies the dashed and dotted variant classes', async () => {
    const dashed = await mountSuspended(Separator, { props: { variant: 'dashed' } })
    expect(dashed.find('span').classes()).toContain('border-dashed')

    const dotted = await mountSuspended(Separator, { props: { variant: 'dotted' } })
    expect(dotted.find('span').classes()).toContain('border-dotted')
  })

  it('widens the border for the double variant, per orientation', async () => {
    const horizontal = await mountSuspended(Separator, { props: { variant: 'double' } })
    expect(horizontal.find('span').classes()).toContain('border-double')
    expect(horizontal.find('span').classes()).toContain('border-t-[3px]')

    const vertical = await mountSuspended(Separator, { props: { variant: 'double', orientation: 'vertical' } })
    expect(vertical.find('span').classes()).toContain('border-l-[3px]')
  })

  it('applies the color variant\'s border token', async () => {
    const wrapper = await mountSuspended(Separator, { props: { color: 'danger' } })

    expect(wrapper.find('span').classes()).toContain('border-[var(--ui-danger)]')
  })
})
