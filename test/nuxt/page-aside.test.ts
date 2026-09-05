import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import PageAside from '../../src/runtime/components/PageAside.vue'

describe('pageAside', () => {
  // A fixed-width rail alongside the main content column has nowhere to
  // go on a narrow viewport - this is used for both a docs site's own
  // left nav and its right ToC rail, and neither fits there.
  it('is hidden below the lg breakpoint by default', async () => {
    const wrapper = await mountSuspended(PageAside)

    expect(wrapper.classes()).toContain('hidden')
    expect(wrapper.classes()).toContain('lg:flex')
  })

  it('renders header, default, and footer slot content', async () => {
    const wrapper = await mountSuspended(PageAside, {
      slots: {
        header: () => 'Header content',
        default: () => 'Body content',
      },
    })

    expect(wrapper.text()).toContain('Header content')
    expect(wrapper.text()).toContain('Body content')
  })
})
